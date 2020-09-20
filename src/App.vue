<template>
  <div id="app" class="div_all">
        <router-view></router-view>
    </div>  
</template>

<script>

export default {
  name: 'app',
}
</script>

<style>
#app {
 /*  background-color: #000000; */
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.div_all{
    height: 100vh!important;
    width: 100vw!important;;
}
</style>
