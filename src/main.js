import Vue from 'vue'
import App from './App.vue'
import VueWamp from 'vue-wamp'
import store from './store'

Vue.use(VueWamp, {
  debug: true,
  url: 'ws://138.197.146.172:9000/ws',
  realm: 'realm1',
  onopen: function(session, details) {
      console.log('WAMP connected', session, details);
  },
  onclose: function(reason, details) {
      console.log('WAMP closed: ' + reason, details);
  }
})

new Vue({
  el: '#app',
  store,
  render: h => h(App)
})


