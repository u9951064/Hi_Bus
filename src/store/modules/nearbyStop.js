import MotcApi from '../../libs/MotcApi'
import getGeolocation from '@/utils/getGeolocation'
import { getDistance } from 'geolib';
import getSubRouteUID from '@/utils/getSubRouteUID';

/**
 * 附近站點資料
 */
const nearbyStopModule = {
  namespaced: true,

  state: () => ({
    GPSState: undefined,
    geolocation: {
      lng: 121.397454504827,
      lat: 25.0681944993822,
    },
    stations: {},
    arrivalRoutes: {},
    focusStation: '',
  }),

  actions: {
    reset: ({ commit }) => {
      commit('setupStations', {});
      commit('setupArrivalRoutes', {});
      commit('setupFocusStation', '');
    },
    loadNearby: async ({ state, dispatch }) => {
      await dispatch("loadGPS");
      if (state.GPSState) {
        await Promise.all([
          dispatch("loadStations"),
          dispatch("updateArrival"),
        ]);
      }
    },
    loadGPS: async ({ commit }) => {
      try {
        // 嘗試要求取得 GPS 位置
        const geolocationPosition = await getGeolocation();
        if (!geolocationPosition.coords) {
          commit('setupGPSState', false);
        } else {
          commit('setupGeolocation', geolocationPosition.coords);
          commit('setupGPSState', true);
        }
      } catch (e) {
        // 取得 GPS 失敗
        commit('setupGPSState', false);
      }
    },
    loadStations: async ({ state, commit }) => {
      if (!state.GPSState) {
        commit('setupStations', {});
        return;
      }

      // 從 API 取得
      const { data: stationRecords } = await MotcApi.get(
        '/v2/Bus/Station/Nearby',
        {
          params: {
            '$spatialFilter': `nearby(${state.geolocation.lat},${state.geolocation.lng}, 500)`
          }
        }
      );

      const stations = {};
      stationRecords.forEach(s => {
        const stationName = s.StationName.Zh_tw;
        const distance = getDistance(
          { latitude: s.StationPosition.PositionLat, longitude: s.StationPosition.PositionLon },
          { latitude: state.geolocation.lat, longitude: state.geolocation.lng },
        );

        if (!(stationName in stations)) {
          stations[stationName] = {
            stationName: stationName,
            position: {
              lng: s.StationPosition.PositionLon,
              lat: s.StationPosition.PositionLat,
            },
            distance: distance,
            stopUIDs: new Set(),
            routeCount: 0,
          }
        }

        stations[stationName].routeCount += s.Stops.length;
        s.Stops.forEach(d => {
          stations[stationName].stopUIDs.add(d.StopUID);
        });

        if (stations[stationName].distance < distance) {
          stations[stationName].position = {
            lng: s.StationPosition.PositionLon,
            lat: s.StationPosition.PositionLat,
          };
          stations[stationName].distance = distance;
        }
      });
      commit('setupStations', stations);
    },
    updateArrival: async ({ rootState, state, commit }) => {
      if (!state.GPSState) {
        commit('setupArrivalRoutes', {});
        return;
      }

      // 從 API 取得
      const { data: arrivalBusResponse } = await MotcApi.get(
        '/v2/Bus/EstimatedTimeOfArrival/NearBy',
        {
          params: {
            '$spatialFilter': `nearby(${state.geolocation.lat},${state.geolocation.lng}, 500)`
          }
        }
      );
      if ((arrivalBusResponse || []).length === 0) {
        commit('setupArrivalRoutes', {});
      }

      // 查詢對應路由資料，組成待查詢的表
      const routeUIDToRoutesMap = arrivalBusResponse.reduce((c, r) => {
        c[`${r.RouteUID}-${r.Direction}`] = [];
        return c;
      }, {});
      rootState.busRoute.routes.forEach(r => {
        const groupKey = `${r.routeUID}-${r.direction}`;
        if (groupKey in routeUIDToRoutesMap) {
          routeUIDToRoutesMap[groupKey].push(r);
        }
      });
      Object.keys(routeUIDToRoutesMap).forEach(groupKey => {
        routeUIDToRoutesMap[groupKey].sort((a, b) => a.subRouteName.length - b.subRouteName.length);
      });

      const stopArrivalInfos = arrivalBusResponse.reduce((c, r) => {
        const possibleRoutes = routeUIDToRoutesMap[`${r.RouteUID}-${r.Direction}`] || [];
        if (possibleRoutes.length === 0) { // 沒有可能對應的路由，跳過不處理
          return c;
        }

        let routeRecord = null;
        if (!routeRecord && 'SubRouteUID' in r && !!r.SubRouteUID) {
          const subRouteUID = getSubRouteUID(`${r.SubRouteUID}`) + `-${r.Direction}`;
          routeRecord = possibleRoutes.find(d => subRouteUID === d.subRouteUID) || routeRecord;
        }
        if (!routeRecord && 'SubRouteName' in r && !!r.SubRouteName.Zh_tw) {
          const subRouteName = `${r.SubRouteName.Zh_tw}` == `${r.RouteName.Zh_tw}0` ? `${r.RouteName.Zh_tw}` : `${r.SubRouteName.Zh_tw}`;
          
          routeRecord = possibleRoutes.find(d => subRouteName === d.subRouteName) || routeRecord;
        }
        if (!routeRecord && 'RouteName' in r && !!r.RouteName.Zh_tw) {
          routeRecord = possibleRoutes.find(d => `${r.RouteName.Zh_tw}` === d.subRouteName) || routeRecord;
        }
        if (!routeRecord) {
          routeRecord = possibleRoutes.find(d => d.routeName === d.subRouteName) || possibleRoutes[0];
        }
        if (!routeRecord) { // 查無符合的路由，跳過不處理
          return c;
        }

        const stopUID = `${r.StopUID}`;
        if (!(stopUID in c)) {
          c[stopUID] = {};
        }
        if (!(routeRecord.subRouteUID in c[stopUID])) {
          c[stopUID][routeRecord.subRouteUID] = {
            stopUID,
            estimateTime: Number.MAX_SAFE_INTEGER,
            stopStatus: parseInt(r.StopStatus || 0),
            ...routeRecord,
          };
        }
        if ('EstimateTime' in r) {
          c[stopUID][routeRecord.subRouteUID].estimateTime = Math.min(c[stopUID][routeRecord.subRouteUID].estimateTime, parseInt(r.EstimateTime));
        }

        return c;
      }, {});
      commit('setupArrivalRoutes', stopArrivalInfos);
    }
  },

  mutations: {
    setupGPSState(state, payload) {
      state.GPSState = payload;
    },
    setupGeolocation(state, payload) {
      state.geolocation.lng = payload.longitude;
      state.geolocation.lat = payload.latitude;
    },
    setupStations(state, payload) {
      state.stations = payload;
      console.log(payload);
    },
    setupArrivalRoutes(state, payload) {
      state.arrivalRoutes = payload;
      console.log(payload);
    },
    setupFocusStation(state, payload) {
      state.focusStation = payload;
    }
  },

  getters: {
    getNearbyList: (state) => {
      return Object.values(state.stations).sort((a, b) => a.distance - b.distance);
    },
    currentStation: state => state.stations[state.focusStation] || null,
    currentStationArrival: (state, getters) => {
      const result = [];
      if (!getters.currentStation) {
        return result;
      }
      getters.currentStation.stopUIDs.forEach(stopUID => {
        if (stopUID in state.arrivalRoutes) {
          result.push(...Object.values(state.arrivalRoutes[stopUID]));
        }
      });
      return result;
    }
  },
};

export default nearbyStopModule;