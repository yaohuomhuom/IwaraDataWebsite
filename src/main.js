import Vue from 'vue'
import App from './App.vue'
import router from './router'
/* import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/pie';
import 'echarts/lib/chart/radar';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/dataZoom'; */
import 'echarts';

Vue.config.productionTip = false
Vue.prototype.get_prototype = Vue.prototype;

new Vue({
   router,
  render: h => h(App)
}).$mount('#app')
