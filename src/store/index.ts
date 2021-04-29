import Vue from "vue";
import Vuex from "vuex";;

Vue.use(Vuex);

export default new Vuex.Store<MyStoreInterface>({
  state: {
    tags: [],
  },
  mutations: {
    refreshTags: (state, tags: Array<string>) => {
      state.tags = tags ?? [];
    },
  },
  modules: {},
});

interface MyStoreInterface {
  tags: Array<string>;
}
