import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import vuetify from "./plugins/vuetify";
import { ValidationProvider } from "vee-validate";
import Notifications from "vue-notification";

Vue.config.productionTip = false;
Vue.component("ValidationProvider", ValidationProvider);
Vue.use(Notifications);

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
