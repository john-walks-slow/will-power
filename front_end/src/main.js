// import 'element-ui/lib/theme-chalk/index.css';
import './assets/style.scss';

import App from './App.vue';
import ElementUI from 'element-ui';
import VPie from 'v-charts/lib/pie.common.js';
import Vue from 'vue';
import VueTypedJs from 'vue-typed-js';
import locale from 'element-ui/lib/locale/lang/en';
import router from './router';
import store from './store/store';

Vue.config.productionTip = false;
Vue.use(VueTypedJs);
Vue.use(ElementUI, { locale });
Vue.component(VPie.name, VPie);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
