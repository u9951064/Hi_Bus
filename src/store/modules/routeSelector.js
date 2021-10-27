/**
 * 使用者輸入的資料
 */
const routeSelectorModule = {
  namespaced: true,

  state: () => ({
    selectedCity: '',
    inputKeyword: '',
    selectedRoute: null,
  }),

  actions: {
  },

  mutations: {
    setSelectedCity(state, payload) {
      state.selectedCity = payload;
    },
    setInputKeyword(state, payload) {
      state.inputKeyword = payload;
    },
    setSelectedRoute(state, payload) {
      state.selectedRoute = payload;
    }
  },
  getters: {
  }
};

export default routeSelectorModule;