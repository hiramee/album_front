<template>
  <div>
    <nav class="navbar">
      <ul class="nav mr-1 my-2">
        <li class="nav-item">
          <button class="btn" @click="onClickHome">Home</button>
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
        height="20"
        class="ml-6"
      ></v-autocomplete>
      <ul class="nav my-2">
        <li class="nav-item">
          <v-btn icon @click="onClickSearch">
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
        </li>
      </ul>
      <ul class="nav mr-6 my-2 mt-lg-0">
        <li>
          <v-menu :offset-y="offset">
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="onClickDeleteTags">
                <v-list-item-title>Delete tags</v-list-item-title>
              </v-list-item>
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
    <ChangePasswordDialog
      :changePasswordVisibleProp.sync="changePasswordVisible"
    />
    <DeleteTagsDialog
      :deleteTagsVisibleProp.sync="deleteTagsVisible"
      :refreshTagsFromServer="refreshTagsFromServer"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import TagsAdapter from "@/adapters/tagsAdapter";
import ErrorRepository from "@/repository/errorRepository";
import { HttpError } from "@/errors/error";
import DeleteTagsDialog from "./DeleteTagsDialog.vue";
import CognitoService from "@/adapters/cognito";
import MessageRepository from "@/repository/messageRepository";
import ChangePasswordDialog from "./ChangePasswordDialog.vue";

@Component({ components: { DeleteTagsDialog, ChangePasswordDialog } })
export default class UserHeader extends Vue {
  @Prop({ type: Function, required: true })
  private onClickSearchCb!: (tags: Array<string>) => void;

  private get items(): Array<string> {
    return this.$store.state.tags;
  }

  private selected = [];

  private offset = true;

  private timerID!: number;

  private deleteTagsVisible = false;

  private changePasswordVisible = false;

  private onClickSearch() {
    this.onClickSearchCb(this.selected);
  }

  private onClickSignOut() {
    CognitoService.logout();
    this.$router.push("/");
    MessageRepository.handleSuccess(this, "Signout Success");
  }

  private onClickChangePassword() {
    this.changePasswordVisible = true;
  }

  private onClickDeleteTags() {
    this.deleteTagsVisible = true;
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

  private onClickHome() {
    this.$router.push("/");
  }

  created() {
    this.refreshTagsFromServer();
    this.timerID = setInterval(() => this.refreshTagsFromServer(), 10000);
  }

  destroyed() {
    clearInterval(this.timerID);
  }
}
</script>
<style scoped>
.v-autocomplete {
  height: 40px;
}
</style>
