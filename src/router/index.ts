import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";
import { SessionStorageAdapter } from "../adapters/SessionStorageAdapter";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/album",
    name: "Album",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Album.vue"),
    meta: {
      requiresAuth: true,
    },
  },
];

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (SessionStorageAdapter.isLogin()) {
      next();
    } else {
      next({
        path: "/",
        query: { redirect: to.fullPath },
      });
    }
  } else {
    next();
  }
});

export default router;
