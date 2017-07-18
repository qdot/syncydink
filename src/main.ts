import Vue from "vue";
import App from "./App.vue";
const Icon = require("vue-awesome/components/Icon");
const VueMaterial = require("vue-material");
const VueTouch = require("vue-touch");
require("viewport-units-buggyfill").init();

Vue.use(VueTouch);
Vue.use(VueMaterial);
Vue.component("icon", Icon);

// tslint:disable-next-line no-unused-expression
new Vue({
  el: "#app",
  render: (h) => h(App),
});
