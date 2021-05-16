<template>
  <CommonDialog
    :dialogVisibleProp.sync="pictureDetailDialogVisible"
    title="Image"
    :okCb="okCb"
    :cancelCb="cancelCb"
    dialogWidth="80%"
  >
    <ImageItem :fileData="picture" width="100%" v-if="showPicture" />
    <validation-observer ref="observer">
      <validation-provider v-slot="{ errors }" name="tags" rules="required">
        <v-combobox
          v-model="selected"
          :items="items"
          :error-messages="errors"
          dense
          chips
          small-chips
          multiple
        >
        </v-combobox>
      </validation-provider>
    </validation-observer>
    <div>
      <v-btn color="error" text @click="deleteCb()" width="100%">Delete</v-btn>
    </div>
  </CommonDialog>
</template>

<script lang="ts">
import { Component, PropSync, Prop, Watch, Vue } from "vue-property-decorator";
import { required } from "vee-validate/dist/rules";
import { extend, ValidationObserver, ValidationProvider } from "vee-validate";
import CommonDialog from "./CommonDialog.vue";
import PicturesAdapter from "../adapters/PicturesAdapter";
import ErrorRepository from "@/repository/errorRepository";
import MessageRepository from "@/repository/messageRepository";
import { HttpError } from "@/errors/error";
import { PutPictureRequest } from "../adapters/messages/pictures";
import _ from "lodash";
import ImageItem from "@/components/ImageItem.vue";
import { DisplayPictureData } from "@/dto/pictures";

extend("required", {
  ...required,
  message: "{_field_} can not be empty",
});

interface PictureDetailDialogType extends Vue {
  validate(): boolean;
}

@Component({
  components: {
    CommonDialog,
    ValidationProvider,
    ValidationObserver,
    ImageItem,
  },
})
export default class PictureDetailDialog extends Vue {
  $refs!: {
    observer: PictureDetailDialogType;
  };

  @PropSync("pictureDetailDialogVisibleProp", { type: Boolean, required: true })
  private pictureDetailDialogVisible!: boolean;

  @Prop({ type: Object, required: false })
  private picture: DisplayPictureData | null = null;

  private tags(): Array<string> {
    return this.picture?.tags || [];
  }

  private get items(): Array<string> {
    return this.$store.state.tags;
  }

  private get showPicture() {
    return this.pictureDetailDialogVisible && this.picture;
  }

  private selected: Array<string> = [];

  private async okCb() {
    const isValid = await this.$refs.observer.validate();
    if (isValid && this.picture) {
      const req: PutPictureRequest = { tags: this.selected };
      PicturesAdapter.putPictures(this, this.picture.id, req)
        .then(() => {
          this.pictureDetailDialogVisible = false;
          MessageRepository.handleSuccess(this, "Update Success");
        })
        .catch((error: HttpError) => {
          ErrorRepository.handleHttpError(
            this,
            error.statusCode,
            JSON.stringify(error.responseData)
          );
        });
    }
  }

  private cancelCb() {
    this.pictureDetailDialogVisible = false;
  }

  private deleteCb() {
    if (this.picture) {
      PicturesAdapter.deletePictures(this, this.picture.id)
        .then(() => {
          this.pictureDetailDialogVisible = false;
          MessageRepository.handleSuccess(this, "Delete Success");
        })
        .catch((error: HttpError) => {
          ErrorRepository.handleHttpError(
            this,
            error.statusCode,
            JSON.stringify(error.responseData)
          );
        });
    }
  }

  private clear() {
    this.selected = _.cloneDeep(this.tags());
  }

  created(): void {
    this.clear();
  }

  @Watch("pictureDetailDialogVisible")
  changeTags(): void {
    this.clear();
  }
}
</script>
