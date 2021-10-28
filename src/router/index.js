import { createRouter, createWebHashHistory } from 'vue-router'
import store from '@/store'
import Layout from '../views/Layout.vue'

const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import(/* webpackChunkName: "HomePage" */ '../views/Home.vue'),
      },
      {
        path: 'result',
        name: 'SearchResult',
        beforeEnter: (to, from, next) => {
          store.commit('routeSelector/setSelectedCity', String(to.query.city || '').trim());
          store.commit('routeSelector/setInputKeyword', String(to.query.keyword || '').trim());
          if(store.state.routeSelector.inputKeyword == '') {
            next({
              name: 'Home'
            });
          } else {
            next();
          }
          
        },
        component: () => import(/* webpackChunkName: "SearchResultPage" */ '../views/SearchResult.vue'),
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
  await store.dispatch('busRoute/init');
  next();
})

export default router
