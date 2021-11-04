/**
 * 使用者輸入的資料
 */
const routeSelectorModule = {
  namespaced: true,

  state: () => ({
    searchCity: '',
    searchKeyword: '',
    selectedCity: '',
    inputKeyword: '',
    selectedRoute: null,
  }),

  actions: {
  },

  mutations: {
    setSelectedCity(state, payload) {
      state.selectedCity = `${payload}`.trim();
    },
    setInputKeyword(state, payload) {
      state.inputKeyword = `${payload}`.trim();
    },
    setSearchCity(state, payload) {
      state.searchCity = `${payload}`.trim();
    },
    setSearchKeyword(state, payload) {
      state.searchKeyword = `${payload}`.trim();
    },
    setSelectedRoute(state, payload) {
      state.selectedRoute = payload;
    }
  },
  getters: {
  }
};

export default routeSelectorModule;