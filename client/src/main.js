// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  data(){

    return {
      myStyle: {backgroundColor: "#05d"}  
    };  
  },
  router,
  components: { App },
  template: '<App/>',
  
})


new Vue({
  el: "#search",
  data: {
    jobTitles: [
      { name: "Product designer", id: 1 },
      { name: "Full-stack developer", id: 2 },
      { name: "Product manager", id: 3 },
      { name: "Senior front-end developer", id: 4 }
    ],
    selectedJobTitle: null
  },

  methods: {
      changeJobTitle (event) {
      this.selectedJobTitle = event.target.options[event.target.options.selectedIndex].text
    }
  }
})