// import getSubRouteUID from '@/utils/getSubRouteUID';
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
    geolocation: {
      lng: 121.397454504827,
      lat: 25.0681944993822,
    },
    stations: {},
    arrivalRoutes: {}
  }),

  actions: {
    reset: ({commit}) => {
      commit('setupStations', {});
      commit('setupArrivalRoutes', {});
    },
    load: async ({ commit }) => {
      const geolocationPosition = await getGeolocation();
      commit('setupGeolocation', geolocationPosition.coords);
    },
    loadStations: async ({ state, commit }) => {
      // 從 API 取得
      const { data: stationRecords } = await MotcApi.get(
        '/v2/Bus/Station/NearBy',
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

        if(!(stationName in stations)) {
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

        if(stations[stationName].distance < distance) {
          stations[stationName].position = {
            lng: s.StationPosition.PositionLon,
            lat: s.StationPosition.PositionLat,
          };
          stations[stationName].distance = distance;
        }
      });
      commit('setupStations', stations);
    },
    updateArrival: async ({rootState, state, commit}) => {
      const { data: arrivalTimeResponse } = await MotcApi.get(
        `/v2/Bus/RealTimeNearStop/NearBy`,
        {
          params: {
            '$spatialFilter': `nearby(${state.geolocation.lat},${state.geolocation.lng}, 500)`
          }
        }
      );

      if((arrivalTimeResponse || []).length === 0) {
        commit('setupArrivalRoutes', {});
      }

      // 預先建立路由查詢資料表
      const arrivalRouteMap = arrivalTimeResponse.reduce((c,r) => {
        c[getSubRouteUID(`${r.SubRouteUID}`) + `-${r.Direction}`] = null;
        return c;
      }, {});
      rootState.busRoute.routes.forEach(r => {
        if (r.subRouteUID in arrivalRouteMap) {
          arrivalRouteMap[r.subRouteUID] = r;
        }
      });

      const stopArrivalInfos = arrivalTimeResponse.reduce((c, r) => {
        const routeRecord = arrivalRouteMap[getSubRouteUID(`${r.SubRouteUID}`) + `-${r.Direction}`];
        if(!routeRecord) { // 沒有對應的路由，跳過不處理
          return c;
        }

        const stopUID = `${r.StopUID}`;
        if (!(stopUID in c)) {
          c[stopUID] = {};
        }
        if(!(routeRecord.subRouteUID in c[stopUID])) {
          c[stopUID][routeRecord.subRouteUID] = {
            stopUID,
            estimateTime: Number.MAX_SAFE_INTEGER,
            stopStatus: parseInt(r.StopStatus),
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
    }
  },

  getters: {
    getNearByList: (state) => {
      return Object.values(state.stations).sort((a, b) => a.distance - b.distance);
    },
    getStationArrival: (state) => (stopUIDs) => {
      return [...stopUIDs].reduce((c,stopUID) => {
        if(stopUID in state.arrivalRoutes) {
          c.push(...state.arrivalRoutes[stopUID]);
        }
        return c;
      }, []);
    }
  },
};

export default nearbyStopModule;