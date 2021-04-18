<template>
  <div>
    <nav class="navbar">
      <ul class="nav mr-auto mr-1 my-2 mt-lg-0">
        <li class="nav-item">
          <button class="btn">Home</button>
        </li>
      </ul>
      <v-autocomplete
        v-model="selected"
        :items="items"
        outlined
        dense
        chips
        small-chips
        multiple
        class="mx-1 my-2"
      ></v-autocomplete>
      <v-btn icon @click="onClickSearch">
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
      <ul class="nav my-2 mt-lg-0">
        <li class="nav-item mx-1">
          <v-menu :offset-y="offset">
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="onClickChangePassword">
                <v-list-item-title>Change password</v-list-item-title>
              </v-list-item>
              <v-list-item @click="onClickSignOut">
                <v-list-item-title>Sign out</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { AUTH_KEY } from "@/consts/consts";
import TagsAdapter from "@/adapters/tagsAdapter";
import ErrorRepository from "@/repository/errorRepository";
import { HttpError } from "@/errors/error";

@Component
export default class UserHeader extends Vue {
  @Prop({ type: Function, required: true })
  private onClickSearchCb!: (tags: Array<string>) => void;

  private get items(): Array<string> {
    return this.$store.state.tags;
  }

  private selected = [];

  private offset = true;

  private timerID!: number;

  private onClickSearch() {
    this.onClickSearchCb(this.selected);
  }

  private onClickSignOut() {
    console.log("TBD");
  }

  private onClickChangePassword() {
    console.log("TBD");
  }

  private refreshTagsFromServer() {
    TagsAdapter.getTags()
      .then((data) => this.$store.commit("refreshTags", data.tags))
      .catch((error: HttpError) => {
        ErrorRepository.handleHttpError(
          this,
          error.statusCode,
          JSON.stringify(error.responseData)
        );
      });
  }

  created() {
    const idKey = sessionStorage.getItem(AUTH_KEY);
    this.refreshTagsFromServer();
    this.timerID = setInterval(() => this.refreshTagsFromServer(), 10000);
  }

  destroyed() {
    clearInterval(this.timerID);
  }
}
</script>
