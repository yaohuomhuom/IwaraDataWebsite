import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);

const routes = [
  { path: '/', component: () => import('../views/echart/style/bar_norml.vue') },
]

const router = new VueRouter({
	routes
});

export default router