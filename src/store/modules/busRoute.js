import browserStorage from '@/utils/browserStorage'
import getSubRouteUID from '@/utils/getSubRouteUID'
import MotcApi from '../../libs/MotcApi'

/**
 * 公車路線資料
 */
const busRouteModule = {
  namespaced: true,

  state: () => ({
    cityOptions: [],
    routes: [],
    isInitialized: false,
  }),

  actions: {
    reset: () => {
      browserStorage.removeItem('busRoutes/routes');
    },
    init: async ({ state, dispatch, commit }) => {
      if (state.isInitialized) {
        return;
      }
      await dispatch('loadCityOption');
      await dispatch('loadRoutes');
      commit('setInitialized', true);
    },
    loadCityOption: async ({ commit }) => {
      const { data: cityOptions } = await import(/* webpackChunkName: "cityOptions" */ '@/assets/json/city-options.json');
      commit('setCityOptions', cityOptions);
    },
    loadRoutes: async ({ state, commit }) => {
      // 讀取儲存的快取資料
      const storedData = browserStorage.getItem('busRoutes/routes');
      if (storedData instanceof Array && storedData.length) {
        commit('addToCityRoute', storedData);
        return;
      }
      browserStorage.removeItem('busRoutes/routes');

      // 從 API 拉資料
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
        const saveItems = [];
        data.forEach(i => {
          const city = i.City || 'InterBus';
          i.SubRoutes.forEach(s => {
            const subRouteName = `${s.SubRouteName.Zh_tw}` == `${i.RouteName.Zh_tw}0` ? `${i.RouteName.Zh_tw}` : `${s.SubRouteName.Zh_tw}`;
            const subRouteNameEn = `${s.SubRouteName.En}` == `${i.RouteName.En}0` ? `${i.RouteName.En}` : `${s.SubRouteName.En}`;
            const headSign = s.Headsign || (s.Direction == 0 ? `${i.DepartureStopNameZh}→${i.DestinationStopNameZh}` : `${i.DestinationStopNameZh}→${i.DepartureStopNameZh}`);
            const headSignEn = s.HeadsignEn || (s.Direction == 0 ? `${i.DepartureStopNameEn}→${i.DestinationStopNameEn}` : `${i.DestinationStopNameEn}→${i.DepartureStopNameEn}`);
            const subRouteUID = getSubRouteUID(s.SubRouteUID);

            saveItems.push({
              routeUID: `${i.RouteUID}`,
              subRouteUID: `${subRouteUID}-${s.Direction}`,
              routeName: `${i.RouteName.Zh_tw}`,
              routeNameEn: `${i.RouteName.En}`,
              subRouteName: subRouteName,
              subRouteNameEn: subRouteNameEn,
              direction: `${s.Direction}`,
              headSign,
              headSignEn,
              city,
              uniqueIndex: `${city}|${subRouteUID}`,
              searchPatten: `${subRouteName} ${i.RouteName.Zh_tw} ${s.Headsign || ''}`,
            });
          });
        });
        commit('addToCityRoute', saveItems);
      });
    },
  },

  mutations: {
    setInitialized(state, payload) {
      state.isInitialized = payload;
    },
    setCityOptions(state, payload) {
      state.cityOptions.push(...payload);
    },
    addToCityRoute(state, payload) {
      state.routes.push(...payload);
      browserStorage.setItem('busRoutes/routes', state.routes);
    },
  },
  getters: {
    getCityOption: state => (city) => state.cityOptions.find(i => i.city == city),
    searchRoutes: state => (city, keyword) => {
      // 確認關鍵字有輸入
      keyword = (keyword || '').toLocaleLowerCase().trim();
      if (city === '' && keyword === '') {
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

      // 找出符合條件的路線，排除重複
      const skipIndex = {};
      state.routes.forEach(route => {
        // 不是符合的查詢縣市
        if (!(route.city in result)) {
          return;
        }
        // 判斷是否已經查找過
        if (route.uniqueIndex in skipIndex) {
          return;
        }
        // 記錄此資料已經檢查過
        skipIndex[route.uniqueIndex] = route.uniqueIndex;

        // 檢查是否命中關鍵字
        if (keyword !== '' && -1 === route.searchPatten.toLocaleLowerCase().indexOf(keyword)) {
          return;
        }

        // 資料命中放入輸出結果
        result[route.city].routes.push(route);
      });

      return result;
    },
    getRoutesInList: state => (city, uniqueIndexes) => {
      if (uniqueIndexes.length === 0) {
        return {};
      }
      const cityObject = state.cityOptions.find(o => o.city === city);
      if (!cityObject) {
        return {};
      }

      const result = {};
      result[cityObject.city] = {
        ...cityObject,
        routes: []
      };

      // 找出符合條件的路線，排除重複
      const skipIndex = {};
      state.routes.forEach(route => {
        // 不是符合的查詢縣市
        if (!(route.city in result)) {
          return;
        }
        // 判斷是否已經查找過
        if (route.uniqueIndex in skipIndex) {
          return;
        }
        // 記錄此資料已經檢查過
        skipIndex[route.uniqueIndex] = route.uniqueIndex;

        // 檢查是否命中
        if (-1 === uniqueIndexes.indexOf(route.uniqueIndex)) {
          return;
        }

        // 資料命中放入輸出結果
        result[route.city].routes.push(route);
      });

      return result;
    },
    getRouteGroup: state => uniqueIndex => state.routes.filter(r => r.uniqueIndex == uniqueIndex),
  },
};

export default busRouteModule;