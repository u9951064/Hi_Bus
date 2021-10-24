import { createStore } from 'vuex'
import busRoute from './modules/busRoute'

export default createStore({
  modules: {
    busRoute,
  },
})
