import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store<MyStoreInterface>({
  state: {
    tags: [],
    isLoading: false,
  },
  mutations: {
    refreshTags: (state, tags: Array<string>) => {
      state.tags = tags ?? [];
    },
    setLoading: (state, isLoading: boolean) => {
      state.isLoading = isLoading;
    },
  },
  modules: {},
});

interface MyStoreInterface {
  tags: Array<string>;
  isLoading: boolean;
}
