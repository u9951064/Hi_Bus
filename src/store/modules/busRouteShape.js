import browserStorage from '@/utils/browserStorage';
import getSubRouteUID from '@/utils/getSubRouteUID';
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
    reset: () => {
      browserStorage.removeWithRegex(/^busRouteShape\//);
    },
    loadShape: async ({ state, commit, dispatch }, payload) => {
      if (!payload) {
        commit('clearCurrentShape');
        commit('clearRouteGeometries');
        return;
      }

      const { routeUID, subRouteUID, uniqueIndex, direction } = payload;
      const storeKey = `${uniqueIndex}|${direction}`;
      if (storeKey === state.currentStoreKey) {
        return;
      }

      const querySubRouteUID = subRouteUID.replace(/-\d*$/, '');
      await dispatch('loadRouteShapeMap', payload);

      const matchedGeometry = {
        storeKey,
        geometry: [],
      };
      let pool = {};
      if (querySubRouteUID in state.routeGeometries && state.routeGeometries[querySubRouteUID].length !== 0) {
        pool = state.routeGeometries[querySubRouteUID];
      } else if (routeUID in state.routeGeometries && state.routeGeometries[routeUID].length !== 0) {
        pool = state.routeGeometries[routeUID];
      }
      if (Object.keys(pool).length === 0) {
        commit('setCurrentShape', matchedGeometry);
        return;
      }

      if (direction in pool) {
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
      const storedData = browserStorage.getItem(`busRouteShape/${routeSaveKey}`) || '';
      if (!!storedData && storedData.saveKey == routeSaveKey && !!storedData.geometry) {
        commit('setupRouteGeometries', storedData);
        return;
      }
      browserStorage.removeItem(`busRouteShape/${routeSaveKey}`);

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
        const routeUID = !p.SubRouteUID ? p.RouteUID : getSubRouteUID(p.SubRouteUID);
        if (!(routeUID in saveRecord.records)) {
          saveRecord.records[routeUID] = {};
        }
        const geometry = p.Geometry.replace(/^LINESTRING\s*\(/, '').replace(/\)$/, '').split(',').map(pos => { return pos.trim().split(' '); });
        saveRecord.records[routeUID][`${p.Direction}`] = geometry;
      });

      browserStorage.setItem(`busRouteShape/${routeSaveKey}`, saveRecord);
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