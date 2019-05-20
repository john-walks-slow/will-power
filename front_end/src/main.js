// import 'element-ui/lib/theme-chalk/index.css';
import './assets/style.scss';

import App from './App.vue';
import ElementUI from 'element-ui';
import Vue from 'vue';
import locale from 'element-ui/lib/locale/lang/en';
import router from './router';
import store from './store/store';

Vue.config.productionTip = false;

Vue.use(ElementUI, { locale });

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
