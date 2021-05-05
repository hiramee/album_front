<template>
  <div class="album">
    <UserHeader :onClickSearchCb="onClickSearchCb" />
    <div class="d-flex ml-10">
      <v-btn icon @click="onClickUploadDialog">
        <v-icon>mdi-cloud-upload-outline</v-icon>
      </v-btn>
    </div>
    <v-card class="image-container mx-10">
      <v-card
        v-for="p in displayPictures"
        :key="p.fileName"
        class="ma-1 image-container__card"
        width="256"
      >
        <ImageItem :fileData="p" width="100%" :clickCb="onClickImage" />
      </v-card>
    </v-card>
    <UploadDialog :uploadVisibleProp.sync="uploadVisible" />
    <PictureDetailDialog
      :pictureDetailDialogVisibleProp.sync="pictureDetailDialogVisible"
      :picture="selectedPicture"
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
import ImageItem from "@/components/ImageItem.vue";
import { DisplayPictureData } from "@/dto/pictures";
import { PicturesResponseItem } from "@/adapters/messages/pictures";

@Component({
  components: {
    UserHeader,
    UploadDialog,
    PictureDetailDialog,
    ImageItem,
  },
})
export default class Album extends Vue {
  private uploadVisible = false;

  private pictureDetailDialogVisible = false;

  private displayPictures: Array<DisplayPictureData> = [];

  private onClickUploadDialog() {
    this.uploadVisible = true;
  }

  private selectedPicture: DisplayPictureData | null = null;

  private async onClickSearchCb(tags: Array<string>) {
    try {
      const res = await PicturesAdapter.getPictures(tags);
      this.displayPictures = await Promise.all(
        res.pictures.map(async (e) => {
          return this.getPictureById(e);
        })
      );
    } catch (error) {
      if (error instanceof HttpError) {
        ErrorRepository.handleHttpError(
          this,
          error.statusCode,
          JSON.stringify(error.responseData)
        );
      } else {
        const message = error.message ?? "Internal Server Error.";
        ErrorRepository.handleHttpError(this, 500, message);
      }
    }
  }

  private onClickImage(p: DisplayPictureData) {
    this.selectedPicture = p;
    this.pictureDetailDialogVisible = true;
  }

  private getPictureById(e: PicturesResponseItem): Promise<DisplayPictureData> {
    return new Promise((resolve, reject) => {
      PicturesAdapter.getPicture(e.id)
        .then((response) => {
          const data = {
            id: e.id,
            url:
              "data:image/" +
              e.fileName.substr(e.fileName.indexOf(".") + 1) +
              ";base64," +
              response.picture,
            fileName: e.fileName,
            tags: e.tags,
          };
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
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
