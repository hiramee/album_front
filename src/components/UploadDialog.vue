<template>
  <CommonDialog
    :dialogVisibleProp.sync="uploadVisible"
    title="Upload"
    :okCb="okCb"
    :cancelCb="cancelCb"
    :width="500"
  >
    <validation-observer ref="observer">
      <validation-provider v-slot="{ errors }" name="File" rules="required">
        <v-file-input
          accept="image/*"
          :error-messages="errors"
          label="File input"
          v-model="file"
          required
        ></v-file-input>
      </validation-provider>
      <validation-provider v-slot="{ errors }" name="Tags" rules="required">
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
  </CommonDialog>
</template>

<script lang="ts">
import { Component, PropSync, Prop, Vue } from "vue-property-decorator";
import { required } from "vee-validate/dist/rules";
import { extend, ValidationObserver, ValidationProvider } from "vee-validate";
import CommonDialog from "./CommonDialog.vue";
import PicturesAdapter from "../adapters/PicturesAdapter";
import ErrorRepository from "@/repository/errorRepository";
import MessageRepository from "@/repository/messageRepository";
import { HttpError } from "@/errors/error";

extend("required", {
  ...required,
  message: "{_field_} can not be empty",
});

interface uploadDialogType extends Vue {
  validate(): boolean;
}

@Component({
  components: {
    CommonDialog,
    ValidationProvider,
    ValidationObserver,
  },
})
export default class uploadDialog extends Vue {
  $refs!: {
    observer: uploadDialogType;
  };

  @PropSync("uploadVisibleProp", { type: Boolean, required: true })
  private uploadVisible!: boolean;

  private file: File | null = null;

  private get items(): Array<string> {
    return this.$store.state.tags;
  }

  private selected: Array<string> = [];

  private async okCb() {
    const isValid = await this.$refs.observer.validate();
    if (isValid) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          const picture = reader.result
            .toString()
            .substr(reader.result.toString().indexOf(",") + 1);
          const ext = this.file?.name.substr(this.file?.name.indexOf(".") + 1);
          this.upload(picture, ext!, this.selected);
        }
      };
      if (this.file) {
        reader.readAsDataURL(this.file);
      }
    }
  }

  private upload(picture: string, ext: string, tags: Array<string>) {
    PicturesAdapter.postPicture({ picture: picture, ext: ext, tags: tags })
      .then(() => {
        this.clear();
        this.uploadVisible = false;
        MessageRepository.handleSuccess(this, "Upload Success");
      })
      .catch((error: HttpError) => {
        ErrorRepository.handleHttpError(
          this,
          error.statusCode,
          JSON.stringify(error.responseData)
        );
      });
  }

  private cancelCb() {
    this.clear();
    this.uploadVisible = false;
  }

  private clear() {
    this.file = null;
    this.selected = [];
  }
}
</script>
