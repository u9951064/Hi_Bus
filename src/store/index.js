import { createStore } from 'vuex'
import busRoute from './modules/busRoute'
import busStop from './modules/busStop'
import routeSelector from './modules/routeSelector'
import vehicleInfo from './modules/vehicleInfo'
import favoritePool from './modules/favoritePool'
import busRouteShape from './modules/busRouteShape'
import nearbyStop from './modules/nearbyStop'

export default createStore({
  modules: {
    busRoute,
    busStop,
    vehicleInfo,
    routeSelector,
    favoritePool,
    busRouteShape,
    nearbyStop,
  },
})
