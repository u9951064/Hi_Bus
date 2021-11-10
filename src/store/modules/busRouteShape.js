import MotcApi from '../../libs/MotcApi'

/**
 * 公車路線圖形資料
 */
const busRouteShapeModule = {
  namespaced: true,

  state: () => ({
    routeGeometries: {},
    routeStoreKey: '',
    currentGeometry: [],
    currentStoreKey: '',
  }),

  actions: {
    loadShape: async ({ state, commit, dispatch }, payload) => {
      if (!payload) {
        commit('clearCurrentShape');
        commit('clearRouteGeometries');
        return;
      }

      const { routeName, subRouteName, uniqueIndex, direction } = payload;
      const storeKey = `${uniqueIndex}|${direction}`;
      if(storeKey === state.currentStoreKey) {
        return;
      }

      await dispatch('loadRouteShapeMap', payload);

      const matchedGeometry = {
        storeKey,
        geometry: [],
      };
      let pool = {};
      if(subRouteName in state.routeGeometries && state.routeGeometries[subRouteName].length !== 0) {
        pool = state.routeGeometries[subRouteName];
      } else if(routeName in state.routeGeometries && state.routeGeometries[routeName].length !== 0) {
        pool = state.routeGeometries[routeName];
      }
      if(Object.keys(pool).length === 0) {
        commit('setCurrentShape', matchedGeometry);
        return;
      }
      
      if(direction in pool) {
        matchedGeometry.geometry = pool[direction];
      } else {
        const d = Object.keys(pool).sort()[0];
        matchedGeometry.geometry = pool[d];
      }
      commit('setCurrentShape', matchedGeometry);
    },
    loadRouteShapeMap: async ({ state, commit }, payload) => {
      const { city, routeName } = payload;
      if (!city || !routeName) {
        commit('clearRouteGeometries');
        return;
      }

      const routeSaveKey = `${city}|${routeName}`;
      if (routeSaveKey === state.routeStoreKey) {
        return;
      }
      commit('clearRouteGeometries');

      // 讀取儲存的快取資料
      const storedDataString = window.localStorage.getItem(`busRouteShape/${routeSaveKey}`) || '';
      if (storedDataString) {
        const storedData = JSON.parse(storedDataString);
        if (!!storedData && storedData.saveKey == routeSaveKey && !!storedData.geometry) {
          commit('setupRouteGeometries', storedData);
          return;
        }
        window.localStorage.removeItem(`busRouteShape/${routeSaveKey}`);
      }

      const { data: shapeList } = await MotcApi.get(
        city == 'InterBus' ?
          `/v2/Bus/Shape/InterCity/${routeName}` :
          `/v2/Bus/Shape/City/${city}/${routeName}`
      );
      if (shapeList.length === 0) {
        return;
      }

      const saveRecord = {
        saveKey: routeSaveKey,
        records: {},
      };

      shapeList.forEach(p => {
        const { Zh_tw: subRouteName } = (!p.SubRouteName.Zh_tw || `${p.SubRouteName.Zh_tw}` == `${p.RouteName.Zh_tw}0`) ? p.RouteName : p.SubRouteName;
        if (!(subRouteName in saveRecord.records)) {
          saveRecord.records[subRouteName] = {};
        }

        const geometry = p.Geometry.replace(/^LINESTRING\(/, '').replace(/\)$/, '').split(',').map(pos => { return pos.split(' '); });
        saveRecord.records[subRouteName][`${p.Direction}`] = geometry;
      });

      window.localStorage.setItem(`busRouteShape/${routeSaveKey}`, JSON.stringify(saveRecord));
      commit('setupRouteGeometries', saveRecord);
    },
  },

  mutations: {
    setupRouteGeometries(state, payload) {
      const { saveKey, records } = payload;
      state.routeStoreKey = saveKey;
      state.routeGeometries = records;
    },
    clearRouteGeometries(state) {
      state.routeGeometries = {};
      state.routeStoreKey = '';
    },
    setCurrentShape(state, payload) {
      const { storeKey, geometry } = payload;
      state.currentGeometry = geometry;
      state.currentStoreKey = storeKey;
    },
    clearCurrentShape(state) {
      state.currentGeometry = [];
      state.currentStoreKey = '';
    }
  },
  getters: {
  }
};

export default busRouteShapeModule;