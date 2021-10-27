import { createStore } from 'vuex'
import busRoute from './modules/busRoute'
import busStop from './modules/busStop'
import routeSelector from './modules/routeSelector'
import userStorage from './modules/userStorage'

export default createStore({
  modules: {
    busRoute,
    busStop,
    routeSelector,
    userStorage,
  },
})
