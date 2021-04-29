<template>
  <div class="album">
    <UserHeader :onClickSearchCb="onClickSearchCb" />
    <v-row>
      <v-col cols="11" />
      <v-col cols="1">
        <v-btn icon @click="onClickUploadDialog">
          <v-icon>mdi-cloud-upload-outline</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-card class="image-container">
      <v-card
        v-for="p in displayPictures"
        :key="p.fileName"
        class="ma-1 image-container__card"
        width="256"
      >
        <v-img
          :src="p.url"
          :lazy-src="p.url"
          class="grey lighten-2"
          width="256"
          @click="onClickImage(p)"
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
    <UploadDialog :uploadVisibleProp.sync="uploadVisible" />
    <PictureDetailDialog
      :pictureDetailDialogVisibleProp.sync="pictureDetailDialogVisible"
      :objectKey="selectedKey"
      :picture="selectedPicture"
      :tags="selectedTags"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import UserHeader from "../components/UserHeader.vue";
import UploadDialog from "../components/UploadDialog.vue";
import PicturesAdapter from "../adapters/PicturesAdapter";
import PictureDetailDialog from "../components/PictureDetailDialog.vue";
import ErrorRepository from "@/repository/errorRepository";
import { HttpError } from "@/errors/error";

@Component({
  components: {
    UserHeader,
    UploadDialog,
    PictureDetailDialog,
  },
})
export default class Album extends Vue {
  private uploadVisible = false;

  private pictureDetailDialogVisible = false;

  private displayPictures: Array<any> = [];

  private onClickUploadDialog() {
    this.uploadVisible = true;
  }

  private selectedKey = "";

  private selectedPicture = "";

  private selectedTags: Array<string> = [];

  private onClickSearchCb(tags: Array<string>) {
    PicturesAdapter.getPictures(tags)
      .then((res) => {
        this.displayPictures = res.pictures.map((e) => {
          return {
            id: e.id,
            url:
              "data:image/" +
              e.fileName.substr(e.fileName.indexOf(".") + 1) +
              ";base64," +
              e.picture,
            fileName: e.fileName,
            tags: e.tags,
          };
        });
      })
      .catch((error: HttpError) => {
        ErrorRepository.handleHttpError(
          this,
          error.statusCode,
          JSON.stringify(error.responseData)
        );
      });
  }

  private onClickImage(p: any) {
    this.selectedKey = p.id;
    this.selectedPicture = p.url;
    this.selectedTags = p.tags;
    this.pictureDetailDialogVisible = true;
  }
}
</script>
<style lang="scss" scoped >
@media screen and (min-width: 769px) and (max-width: 2048px) {
  .image-container {
    column-count: 4;
  }
}
@media screen and (min-width: 513px) and (max-width: 768px) {
  .image-container {
    column-count: 3;
  }
}
@media screen and (min-width: 257px) and (max-width: 512px) {
  .image-container {
    column-count: 2;
  }
}
@media screen and (max-width: 256px) {
  .image-container {
    column-count: 1;
  }
}
.image-container {
  column-fill: auto;
  column-gap: 15px;
  &__card {
    display: inline-block;
  }
}
</style>
