import GistApi from '../../libs/GistApi'
import MotcApi from '../../libs/MotcApi'

/**
 * 公車路線資料
 */
const busRouteModule = {
  namespaced: true,

  state: () => ({
    cityOptions: [{
      'cityName': "公路客運",
      "city": "InterBus",
    }],
    routes: [],
  }),

  actions: {
    init: async ({ dispatch }) => {
      await dispatch('loadCityOption');
      await dispatch('loadRoutes');
    },
    loadCityOption: async ({ commit }) => {
      const { data: cityList } = await GistApi.get('/V3/Map/Basic/City');
      commit('setCityOptions', cityList.map(c => {
        return {
          cityName: c.CityName,
          city: c.City,
        };
      }));
    },
    loadRoutes: async ({ state, commit }) => {
      const requests = [];
      state.cityOptions.forEach(c => requests.push(
        MotcApi.get(
          c.city == 'InterBus' ?
            '/v2/Bus/Route/InterCity' :
            `/v2/Bus/Route/City/${c.city}`
        )
      ));
      if (requests.length == 0) {
        return;
      }
      const responses = await Promise.all(requests);
      responses.forEach(({ data }) => {
        const saveItems = data.map(i => {
          return {
            routeUID: `${i.RouteUID}`,
            routeID: `${i.RouteID}`,
            routeName: `${i.RouteName.Zh_tw}`,
            departureName: i.DepartureStopNameZh || '-',
            destinationName: i.DestinationStopNameZh || '-',
            direction: i.HasSubRoutes ? 2 : 1,
            city: i.City || 'InterBus',
          };
        });
        commit('addToCityRoute', saveItems);
      });
    },
  },

  mutations: {
    setCityOptions(state, payload) {
      state.cityOptions.push(...payload);
    },
    addToCityRoute(state, payload) {
      state.routes.push(...payload);
    },
  },
  getters: {
    getCityOption: state => (city) => state.cityOptions.find(i => i.city == city),
    searchRoutes: state => (city, keyword) => {
      // 確認關鍵字有輸入
      keyword = (keyword || '').toLocaleLowerCase().trim();
      if (keyword === '') {
        return {};
      }
      // 找出符合的地址
      city = (city || '').toLocaleLowerCase().trim();
      const result = state.cityOptions.reduce((c, o) => {
        if (city == '' || city == o.city.toLocaleLowerCase()) {
          c[o.city] = {
            ...o,
            routes: []
          };
        }

        return c;
      }, {});

      // 找出符合條件的路線
      state.routes.forEach(route => {
        if (!(route.city in result)) { // 不是符合的查詢縣市
          return;
        }
        switch (true) {
          case -1 !== route.routeName.toLocaleLowerCase().indexOf(keyword):
          case -1 !== route.departureName.toLocaleLowerCase().indexOf(keyword):
          case -1 !== route.destinationName.toLocaleLowerCase().indexOf(keyword):
            result[route.city].routes.push(route);
            break;
          default:
            return;
        }
      });

      return result;
    },
  }
};

export default busRouteModule;