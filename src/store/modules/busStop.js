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
  }),

  actions: {
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
    updateArrivalBus: async ({state, commit} , payload) => {
      const { city, uniqueIndex, routeName, subRouteUID } = payload;
      // 缺少資料
      if (!city || !routeName || !uniqueIndex || !subRouteUID) { 
        return null;
      }

      // 重新撈取間隔檢查
      const currentTimestamp = new Date().getTime();
      if((state.muteUpdateArrivals[subRouteUID] || 0) >= currentTimestamp) {
        return;
      }

      // 從 API 取得
      const { data: arrivalRecords } = await MotcApi.get(
        city == "InterBus" ?
          `/v2/Bus/EstimatedTimeOfArrival/InterCity/${routeName}` :
          `/v2/Bus/EstimatedTimeOfArrival/City/${city}/${routeName}`,
        {
          params: {
            '$filter': `SubRouteUID eq '${subRouteUID}'`,
            '$orderby': 'IsLastBus desc, StopSequence asc',
          }
        }
      );
      if(!arrivalRecords) {
        return null;
      }
      const stopInfos = {};
      const existBus = {'-1': '-1'};
      arrivalRecords.forEach(r => {
        const plateNumber = `${r.PlateNumb}`;
        const stopUID = `${r.StopUID}`;
        if(!(stopUID in stopInfos)) {
          stopInfos[stopUID] = {
            stopUID,
            plateNumbers: [],
            stopStatus: parseInt(r.StopStatus), // 車輛狀態備註 : [0:'正常',1:'尚未發車',2:'交管不停靠',3:'末班車已過',4:'今日未營運'] ,
            isLastBus: r.IsLastBus,
            estimateTime: Number.MAX_SAFE_INTEGER,
            // TODO:
            nextBusTime: !r.NextBusTime ? null : new Date(r.NextBusTime), //下一班公車到達時間
          }
        }
        if(!(plateNumber in existBus)) {
          existBus[plateNumber] = plateNumber;
          stopInfos[stopUID].plateNumbers.push(plateNumber);
          stopInfos[stopUID].isLastBus = stopInfos[stopUID].isLastBus || r.IsLastBus;
        }
        if('EstimateTime' in r) {
          stopInfos[stopUID].estimateTime = Math.min(stopInfos[stopUID].estimateTime, parseInt(r.EstimateTime));
        }
      });

      commit('saveStopArrivalInfos', {
        subRouteUID,
        stopInfos,
        muteUpdateArrivals: Object.keys(state.busRouteStopMap) !== Object.keys(stopInfos) ? currentTimestamp : (currentTimestamp + 10),
      });
    },
  },

  mutations: {
    saveBusStopMap(state, payload) {
      Object.keys(payload).forEach(k => {
        state.busRouteStopMap[k] = payload[k];
      });
    },
    saveStopArrivalInfos(state, payload) {
      const {subRouteUID, stopInfos, muteUpdateArrivals} = payload;
      if(!(subRouteUID in state.stopArrivalInfos)) {
        state.stopArrivalInfos[subRouteUID] = stopInfos;
      } else {
        Object.keys(stopInfos).forEach(stopUID => state.stopArrivalInfos[subRouteUID][stopUID] = stopInfos[stopUID]);
      }
      state.muteUpdateArrivals[subRouteUID] = muteUpdateArrivals;
    }
  },
  getters: {
    getStops: state => uniqueIndex => state.busRouteStopMap[uniqueIndex] || null,
  }
};

export default busStopModule;