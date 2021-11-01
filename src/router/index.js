import { createRouter, createWebHashHistory } from 'vue-router'
import store from '@/store'
import Layout from '../views/Layout.vue'

const routes = [
  {
    path: '/',
    component: Layout,
    beforeEnter: (to, from, next) => {
      store.commit('routeSelector/setSelectedCity', String(to.query.city || '').trim());
      store.commit('routeSelector/setInputKeyword', String(to.query.keyword || '').trim());

      if (store.state.routeSelector.selectedCity !== '') {
        const o = store.state.busRoute.cityOptions.find(({ city }) => city.toLowerCase() == store.state.routeSelector.selectedCity.toLowerCase());
        if (!o) {
          store.commit('routeSelector/setSelectedCity', '');
        } else {
          store.commit('routeSelector/setSelectedCity', o.city);
        }
      }
      next();
    },
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import(/* webpackChunkName: "HomePage" */ '../views/Home.vue'),
      },
      {
        path: 'result',
        name: 'SearchResult',
        beforeRouteUpdate: (to, from, next) => {
          if (store.state.routeSelector.inputKeyword == '') {
            next({
              name: 'Home'
            });
          } else {
            next();
          }
        },
        component: () => import(/* webpackChunkName: "SearchResultPage" */ '../views/SearchResult.vue'),
      },
      {
        path: 'tracing/:uniqueIndex',
        name: 'TracingBus',
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
    store.dispatch('vehicleInfo/init')
  ]);
  next();
})

export default router
