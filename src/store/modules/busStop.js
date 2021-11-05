import MotcApi from '../../libs/MotcApi'

/**
 * 公車路線站牌資料
 */
const busStopModule = {
  namespaced: true,

  state: () => ({
    busRouteStopMap: {},
    stopArrivalInfos: {},
    muteUpdateArrivals: {},
    updateArrivalGap: 15000,
  }),

  actions: {
    init: ({ commit }) => {
      // 讀取儲存的快取資料
      const storedDataString = window.localStorage.getItem('busStop/busRouteStopMap') || '';
      if (storedDataString) {
        const storedData = JSON.parse(storedDataString);
        if (Object.keys(storedData).length) {
          commit('saveBusStopMap', storedData);
          return;
        }
        window.localStorage.removeItem('busStop/busRouteStopMap');
      }
    },
    loadBusStop: async ({ state, commit }, payload) => {
      const { city, uniqueIndex, routeName } = payload;
      // 缺少資料
      if (!city || !routeName || !uniqueIndex) {
        return null;
      }
      if (uniqueIndex in state.busRouteStopMap) {
        return state.busRouteStopMap[uniqueIndex];
      }

      // 從 API 取得
      const { data: stopOfRoutes } = await MotcApi.get(
        city == "InterBus" ?
          `/v2/Bus/StopOfRoute/InterCity/${routeName}` :
          `/v2/Bus/StopOfRoute/City/${city}/${routeName}`,
      );
      if (!stopOfRoutes) {
        return null;
      }

      // 整理站位資料
      const saveData = {};
      stopOfRoutes.forEach(r => {
        const subRouteName = `${r.SubRouteName.Zh_tw}` == `${r.RouteName.Zh_tw}0` ? `${r.RouteName.Zh_tw}` : `${r.SubRouteName.Zh_tw}`;
        const uniqueIndex = `${city}|${subRouteName}`;
        const direction = `${r.Direction}`;
        if (!(uniqueIndex in saveData)) {
          saveData[uniqueIndex] = {};
        }
        if (!(direction in saveData[uniqueIndex])) {
          saveData[uniqueIndex][direction] = [];
        }
        r.Stops.forEach(s => {
          saveData[uniqueIndex][direction].push({
            city,
            subRouteName,
            direction,
            stopUID: s.StopUID,
            stopName: s.StopName.Zh_tw,
            stopNameEn: s.StopName.En,
            stopBoarding: parseInt(s.StopBoarding),//上下車站別 : [-1:'可下車',0:'可上下車',1:'可上車'] ,
            stopSequence: parseInt(s.StopSequence),
            stopPosition: {
              positionLon: s.StopPosition.PositionLon,
              positionLat: s.StopPosition.PositionLat,
            }
          });
        });
        saveData[uniqueIndex][direction].sort((a, b) => { a.stopSequence - b.stopSequence });
      });
      commit('saveBusStopMap', saveData);
      return state.busRouteStopMap[uniqueIndex] || null;
    },
    updateArrivalBus: async ({ state, commit }, payload) => {
      const { city, uniqueIndex, routeName, subRouteUID, routeUID } = payload;
      // 缺少資料
      if (!city || !routeName || !uniqueIndex || !subRouteUID) {
        return null;
      }

      // 重新撈取間隔檢查
      const currentTimestamp = new Date().getTime();
      if ((state.muteUpdateArrivals[subRouteUID] || 0) >= currentTimestamp) {
        return;
      }

      const requests = [
        // 取得站點估計時間
        MotcApi.get(
          city == "InterBus" ?
            `/v2/Bus/EstimatedTimeOfArrival/InterCity/${routeName}` :
            `/v2/Bus/EstimatedTimeOfArrival/City/${city}/${routeName}`,
          {
            params: {
              '$filter': `RouteUID eq '${routeUID}'`,
              '$orderby': 'StopSequence asc',
            }
          }
        ),
        // 取得公車車牌
        MotcApi.get(
          city == "InterBus" ?
            `/v2/Bus/RealTimeNearStop/InterCity/${routeName}` :
            `/v2/Bus/RealTimeNearStop/City/${city}/${routeName}`,
          {
            params: {
              '$filter': `RouteUID eq '${routeUID}'`,
              '$orderby': 'StopSequence asc',
            }
          }
        ),
      ];

      const [
        { data: arrivalTimeResponse },
        { data: arrivalBusResponse }
      ] = await Promise.all(requests);

      const arrivalTimeMap = (arrivalTimeResponse || []).reduce((c, r) => {
        const stopUID = `${r.StopUID}`;
        if (!(stopUID in c)) {
          c[stopUID] = {
            stopUID,
            routeUID,
            estimateTime: Number.MAX_SAFE_INTEGER,
            stopStatus: parseInt(r.StopStatus), // 車輛狀態備註 : [0:'正常',1:'尚未發車',2:'交管不停靠',3:'末班車已過',4:'今日未營運'],
          };
        }

        if ('EstimateTime' in r) {
          c[stopUID].estimateTime = Math.min(c[stopUID].estimateTime, parseInt(r.EstimateTime));
        }

        return c;
      }, {});

      const plateNumberMap = (arrivalBusResponse || []).reduce((c, r) => {
        const stopUID = `${r.StopUID}`;
        if (!(stopUID in c)) {
          c[stopUID] = [];
        }
        if (r.PlateNumb == '-1') {
          return c;
        }
        c[stopUID].push(`${r.PlateNumb}`);

        if ('EstimateTime' in r && stopUID in arrivalTimeMap) {
          arrivalTimeMap[stopUID].estimateTime = Math.min(arrivalTimeMap[stopUID].estimateTime, parseInt(r.EstimateTime));
        }
        return c;
      }, {});

      const routePaths = state.busRouteStopMap[uniqueIndex];
      const stopInfos = {};
      const existBus = {};
      Object.keys(routePaths).forEach(d => {
        stopInfos[d] = routePaths[d].reduce((c, s) => {
          c[s.stopUID] = arrivalTimeMap[s.stopUID] || {
            stopUID: s.stopUID,
            routeUID,
            estimateTime: Number.MAX_SAFE_INTEGER,
            stopStatus: 1,
          };
          c[s.stopUID].plateNumbers = (plateNumberMap[s.stopUID] || []).filter(n => {
            if (n in existBus) {
              return false;
            } else {
              existBus[n] = n;
              return true;
            }
          });

          return c;
        }, {});
      });

      commit('saveStopArrivalInfos', {
        uniqueIndex,
        stopInfos,
        muteUpdateArrivals: currentTimestamp + state.updateArrivalGap,
      });
    },
  },

  mutations: {
    saveBusStopMap(state, payload) {
      Object.keys(payload).forEach(k => {
        state.busRouteStopMap[k] = payload[k];
      });
      window.localStorage.setItem('busStop/busRouteStopMap', JSON.stringify(state.busRouteStopMap));
    },
    saveStopArrivalInfos(state, payload) {
      const { uniqueIndex, stopInfos, muteUpdateArrivals } = payload;
      state.stopArrivalInfos[uniqueIndex] = stopInfos;
      state.muteUpdateArrivals[uniqueIndex] = muteUpdateArrivals;
    }
  },
  getters: {
    getStops: state => (route) => {
      if (!route) {
        return [];
      }
      const { uniqueIndex, direction } = route;
      return (state.busRouteStopMap[uniqueIndex] || {})[direction] || [];
    },
    getStopInfos: state => (route) => {
      if (!route) {
        return {};
      }
      const { uniqueIndex, direction } = route;
      return (state.stopArrivalInfos[uniqueIndex] || {})[direction] || {};
    },
    getNextUpdateTimestamp: state => (uniqueIndex) => state.muteUpdateArrivals[uniqueIndex] || 0,
  }
};

export default busStopModule;