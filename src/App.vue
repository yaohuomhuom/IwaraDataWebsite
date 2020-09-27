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
html,body{
    padding: 0;
    margin: 0;
}
.div_all{
    height: 100vh!important;
    width: 100vw!important;;
}
</style>
