import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/index'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/index',
      name: 'Home',
      component: index
    }
  ],
  mode: 'history'
})
