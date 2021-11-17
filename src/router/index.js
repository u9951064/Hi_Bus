import { createRouter, createWebHashHistory } from 'vue-router'
import store from '@/store'
import Layout from '../views/Layout.vue'

const routes = [
  {
    path: '/',
    component: Layout,
    beforeEnter: (to, from, next) => {
      store.commit('routeSelector/setSelectedCity', to.query.city || '');
      store.commit('routeSelector/setInputKeyword', to.query.keyword || '');
      store.commit('routeSelector/setSearchCity', to.query.city || '');
      store.commit('routeSelector/setSearchKeyword', to.query.keyword || '');

      if (store.state.routeSelector.selectedCity !== '') {
        const o = store.state.busRoute.cityOptions.find(({ city }) => city.toLowerCase() == store.state.routeSelector.selectedCity.toLowerCase());
        if (!o) {
          store.commit('routeSelector/setSelectedCity', '');
          store.commit('routeSelector/setSearchCity', '');
        } else {
          store.commit('routeSelector/setSelectedCity', o.city);
          store.commit('routeSelector/setSearchCity', o.city);
        }
      }
      next();
    },
    children: [
      {
        path: '',
        name: 'Home',
        meta: { hideLayoutSearchBar: true, mobileFullPageMode: false },
        beforeEnter: (to, from, next) => {
          store.commit('routeSelector/setSearchCity', '');
          store.commit('routeSelector/setSearchKeyword', '');
          next();
        },
        component: () => import(/* webpackChunkName: "HomePage" */ '../views/Home.vue'),
      },
      {
        path: 'result',
        name: 'SearchResult',
        beforeEnter: (to, from, next) => {
          if (store.state.routeSelector.inputKeyword == '') {
            next({
              name: 'Home'
            });
          } else {
            next();
          }
        },
        meta: { hideLayoutSearchBar: false, mobileFullPageMode: false },
        component: () => import(/* webpackChunkName: "ResultPage" */ '../views/SearchResultPage.vue'),
      },
      {
        path: 'favorites',
        name: 'Favorite',
        meta: { hideLayoutSearchBar: false, mobileFullPageMode: false },
        component: () => import(/* webpackChunkName: "ResultPage" */ '../views/FavoritePage.vue'),
      },
      {
        path: 'tracing/:uniqueIndex',
        name: 'TracingBus',
        meta: { hideLayoutSearchBar: false, mobileFullPageMode: true },
        component: () => import(/* webpackChunkName: "TracingBus" */ '../views/TracingBus.vue'),
      },
      {
        path: 'nearby',
        meta: { hideLayoutSearchBar: false, mobileFullPageMode: false, mobileHideFooterMode: true },
        component: () => import(/* webpackChunkName: "Nearby" */ '../views/Nearby/Layout.vue'),
        children: [
          {
            path: '',
            name: 'NearbyStations',
            component: () => import(/* webpackChunkName: "Nearby" */ '../views/Nearby/StationList.vue'),
          },
          {
            path: ':stationName',
            name: 'NearbyArrivals',
            component: () => import(/* webpackChunkName: "Nearby" */ '../views/Nearby/ArrivalList.vue'),
          },
        ],
      }
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    redirect: { name: 'Home' }
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  document.getElementById('loading-cover').classList.remove('hide');

  // 判斷上次更新日期，如果超過一天則重新下載
  if (parseInt(window.localStorage.getItem('busVersion/updatedAt') || 0) < new Date().getTime()) {
    await Promise.all([
      store.dispatch('busRoute/reset'),
      store.dispatch('vehicleInfo/reset'),
      store.dispatch('busRouteShape/reset'),
      store.dispatch('busStop/reset'),
    ]);
    window.localStorage.setItem('busVersion/updatedAt', new Date().getTime() + 86400 * 1e3);
  }

  // 下載路線資料
  await Promise.all([
    store.dispatch('busRoute/init'),
    store.dispatch('vehicleInfo/init'),
    store.dispatch('favoritePool/init'),
  ]);
  next();
})

router.beforeResolve((to, from, next) => {
  document.getElementById('loading-cover').classList.add('hide');
  next();
})

export default router
