import MotcApi from '../../libs/MotcApi'

/**
 * 公車車輛資料
 */
const vehicleInfoModule = {
  namespaced: true,

  state: () => ({
    busVehicleMap: {},
  }),

  actions: {
    init: ({commit}) => {
      // 讀取儲存的快取資料
      const storedDataString = window.localStorage.getItem('vehicleInfo/busVehicleMap') || '';
      if(storedDataString) {
        const storedData = JSON.parse(storedDataString);
        if(Object.keys(storedData).length) {
          commit('setupVehicles', storedData);
          return;
        }
        window.localStorage.removeItem('vehicleInfo/busVehicleMap');
      }
    },

    loadVehicles: async ({state, commit}, payload) => {
      const {city, plateNumbers} = payload;
      if(!(plateNumbers instanceof Array) || !city) {
        return;
      }

      const missingVehicles = plateNumbers.filter(p => {
        if(p in state.busVehicleMap) {
          return false;
        } else {
          return true;
        }
      });
      if(missingVehicles.length === 0) {
        return;
      }

      // 從 API 取得
      const { data: vehicleRecords } = await MotcApi.get(
        city == "InterBus" ?
          `/v2/Bus/Vehicle/InterCity` :
          `/v2/Bus/Vehicle/City/${city}`,
        {
          '$filter': 'PlateNumb in (' + missingVehicles.map(p => `'${p}'`).join(',') + ')',
        }
      );
      if (!vehicleRecords) {
        return;
      }

      const saveRecords = vehicleRecords.map(r => {
        return {
          plateNumber: String(r.PlateNumb),
          vehicleType: parseInt(r.VehicleType),
          city,
        }
      });

      commit('addVehicles', saveRecords);
    },
  },

  mutations: {
    setupVehicles(state, payload) {
      state.busVehicleMap = payload;
    },
    addVehicles(state, payload) {
      payload.forEach(r => {
        state.busVehicleMap[r.plateNumber] = r;
      });
      window.localStorage.setItem('vehicleInfo/busVehicleMap', JSON.stringify(state.busVehicleMap));
    },
  },
};

export default vehicleInfoModule;