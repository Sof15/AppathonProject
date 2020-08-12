<template >
  <div id="app" >
      <index></index>
      <router-view/>  
  </div>
</template>

<script>
import index from './components/index'

export default {
  name: 'app',
  components: {
    'index': index
  }
}
</script>

<style src="./css/my.css"></style>
