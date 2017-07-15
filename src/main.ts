import Vue from "vue";
import App from "./App.vue";
const Icon = require("vue-awesome/components/Icon");
const VueMaterial = require("vue-material");

Vue.use(VueMaterial);
Vue.component("icon", Icon);

// tslint:disable-next-line no-unused-expression
new Vue({
  el: "#app",
  render: (h) => h(App),
});
