import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import store from './store'
import * as _ from 'lodash'
import $helpers from './helpers'

Object.defineProperty(Vue.prototype, '_', { value: _ })
Object.defineProperty(Vue.prototype, '$helpers', { value: $helpers })

Vue.config.productionTip = false

new Vue({
  vuetify,
  store,
  render: (h) => h(App),
}).$mount('#app')
