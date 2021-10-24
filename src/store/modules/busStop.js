import MotcApi from '../../libs/MotcApi'

/**
 * 公車路線站牌資料
 */
const busStopModule = {
  namespaced: true,

  state: () => ({
    busStopMap: {},
  }),

  actions: {
    loadBusStopOfRoute: async ({ state, commit }, payload) => {
      const { city, routeName } = payload;
      if (!city || !routeName || routeName in state.busStopMap) {
        // 缺少資料或是已經讀取過，不重新撈取
        return;
      }
      // 從 API 取得
      const { data: relativeRoutes } = await MotcApi.get(
        city == "InterCity" ?
          `/v2/Bus/StopOfRoute/InterCity/${routeName}` :
          `/v2/Bus/StopOfRoute/City/${city}/${routeName}`
      );
      if(!relativeRoutes) {
        //TODO: 查無路線資料
        return;
      }
      commit('setCityOptions', cityList.map(c => {
        return {
          cityName: c.CityName,
          city: c.City,
        };
      }));
    },
  },

  mutations: {
    saveBusStops(state, payload) {
      state.cityOptions.push(...payload);
    },
  },
  getters: {
    getCityOption: state => (city) => state.cityOptions.find(i => i.city == city),

  }
};

export default busStopModule;