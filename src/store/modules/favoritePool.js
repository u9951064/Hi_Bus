import browserStorage from "@/utils/browserStorage";

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
      browserStorage.removeItem('busStop/favoritePool');
    },
    init({ commit }) {
      // 讀取儲存的快取資料
      const storedData = browserStorage.getItem('busStop/favoritePool') || {};
      commit('setupFavoriteMap', storedData);
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
      browserStorage.setItem('busStop/favoritePool', state.favoriteMap);
    }
  },
  getters: {
    isFavorite: state => (city, uniqueIndex) => !(!state.favoriteMap[city] || !state.favoriteMap[city][uniqueIndex]),
  }
};

export default favoritePoolModule;