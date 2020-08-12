<template>
    <div> 
        <nav class=topnav> 
            <router-link v-for="tab in navBarItems"
            v-bind:key="tab.title"
            :to="`${tab.ref}`">{{tab.title}}</router-link>
        </nav> 
    </div>
</template>

<!-- https://medium.com/@maeganwilson_/how-to-create-a-navigation-bar-in-vue-js-8a70e7f29f80 -->

<script>
export default {
  name: 'NavBar',
  data() {
    return {
      navBarItems: [
        {title: 'Home', ref: '/index'},
        {title: 'Statistics', ref: '#'},
        {title: 'About', ref: '#'},
        {title: 'Contact', ref: '/contact'}
      ]
    }
  }
}
</script>

<style src="../css/my.css"></style>

