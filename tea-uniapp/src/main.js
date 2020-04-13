import Vue from 'vue'
import App from './App'
import store from './store'

import Request from './plugins/request/js/index'

Vue.config.productionTip = false
global.$http = Request();
Vue.prototype.$store = store;
App.mpType = 'app'

const app = new Vue({
  ...App
})
app.$mount()
