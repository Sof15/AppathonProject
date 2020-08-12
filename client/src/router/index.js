import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/index'
import Contact from '@/components/contact'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/index',
      name: 'Home',
      component: index
    },
    {
      path: '/contact',
      name: 'Contact',
      component: Contact
    }
  ],
  mode: 'history'
})
