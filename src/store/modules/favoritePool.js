/**
 * 使用者最愛資料
 */
const favoritePoolModule = {
  namespaced: true,

  state: () => ({
    favoriteMap: {},
  }),

  actions: {
    reset: () => {
      window.localStorage.removeItem('busStop/favoritePool');
    },
    init({ commit }) {
      // 讀取儲存的快取資料
      const storedDataString = window.localStorage.getItem('busStop/favoritePool') || '';
      if (storedDataString) {
        const storedData = JSON.parse(storedDataString);
        commit('setupFavoriteMap', storedData);
      }
    }
  },

  mutations: {
    setupFavoriteMap(state, payload) {
      state.favoriteMap = payload;
    },
    toggle(state, payload) {
      const { city, uniqueIndex } = payload;
      if (!(city in state.favoriteMap)) {
        state.favoriteMap[city] = {};
      }
      if (uniqueIndex in state.favoriteMap[city]) {
        delete state.favoriteMap[city][uniqueIndex];
      } else {
        state.favoriteMap[city][uniqueIndex] = uniqueIndex;
      }
      window.localStorage.setItem('busStop/favoritePool', JSON.stringify(state.favoriteMap));
    }
  },
  getters: {
    isFavorite: state => (city, uniqueIndex) => !(!state.favoriteMap[city] || !state.favoriteMap[city][uniqueIndex]),
  }
};

export default favoritePoolModule;