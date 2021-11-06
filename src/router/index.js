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
        meta: { hideLayoutSearchBar: true },
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
        meta: { hideLayoutSearchBar: false },
        component: () => import(/* webpackChunkName: "ResultPage" */ '../views/SearchResultPage.vue'),
      },
      {
        path: 'favorites',
        name: 'Favorite',
        meta: { hideLayoutSearchBar: false },
        component: () => import(/* webpackChunkName: "ResultPage" */ '../views/FavoritePage.vue'),
      },
      {
        path: 'tracing/:uniqueIndex',
        name: 'TracingBus',
        meta: { hideLayoutSearchBar: false },
        component: () => import(/* webpackChunkName: "TracingBus" */ '../views/TracingBus.vue'),
      },
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
  await Promise.all([
    store.dispatch('busRoute/init'),
    store.dispatch('vehicleInfo/init'),
    store.dispatch('favoritePool/init'),
  ]);
  next();
})

export default router
