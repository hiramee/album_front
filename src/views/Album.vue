<template>
  <div class="album">
    <UserHeader />
    <v-row>
      <v-col cols="11" />
      <v-col cols="1">
        <v-btn icon @click="onClickUploadDialog">
          <v-icon>mdi-cloud-upload-outline</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-card class="d-flex justify-start flex-wrap">
      <v-card v-for="n in 9" :key="n" class="ma-1">
        <v-img
          :src="`https://picsum.photos/500/300?image=${n * 5 + 10}`"
          :lazy-src="`https://picsum.photos/10/6?image=${n * 5 + 10}`"
          class="grey lighten-2"
          width="256"
        >
          <template v-slot:placeholder>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-progress-circular
                indeterminate
                color="grey lighten-5"
              ></v-progress-circular>
            </v-row>
          </template>
        </v-img>
      </v-card>
    </v-card>
    <UploadDialog
      :uploadVisibleProp.sync="uploadVisible"
      :okCb="uploadOkCb"
      :cancelCb="uploadCancelCb"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import UserHeader from "../components/UserHeader.vue";
import UploadDialog from "../components/UploadDialog.vue";

@Component({
  components: {
    UserHeader,
    UploadDialog,
  },
})
export default class Album extends Vue {
  private uploadVisible = false;

  private onClickUploadDialog() {
    this.uploadVisible = true;
  }

  private uploadOkCb() {
    this.uploadVisible = false;
  }

  private uploadCancelCb() {
    this.uploadVisible = false;
  }
}
</script>
