import Vue from 'vue';
import App from './App.vue';
import { ButtplugClient } from "buttplug";

new Vue({
  el: '#app',
  render: h => h(App, {
    props: {
      buttplugClient: new ButtplugClient("SyncyDink Video Player")
    }
  })
});
