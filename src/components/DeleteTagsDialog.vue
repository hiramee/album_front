<template>
  <CommonDialog
    :dialogVisibleProp.sync="deleteTagsVisible"
    title="Delete Tags"
    :okCb="okCb"
    :cancelCb="cancelCb"
    :width="500"
  >
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
  </CommonDialog>
</template>

<script lang="ts">
import { Component, PropSync, Prop, Vue } from "vue-property-decorator";
import { required } from "vee-validate/dist/rules";
import { extend, ValidationObserver, ValidationProvider } from "vee-validate";
import CommonDialog from "./CommonDialog.vue";
import TagsAdapter from "../adapters/tagsAdapter";
import ErrorRepository from "@/repository/errorRepository";
import MessageRepository from "@/repository/messageRepository";
import { HttpError } from "@/errors/error";

extend("required", {
  ...required,
  message: "{_field_} can not be empty",
});

interface deleteDialogType extends Vue {
  validate(): boolean;
}

@Component({
  components: {
    CommonDialog,
    ValidationProvider,
    ValidationObserver,
  },
})
export default class DeleteTagsDialog extends Vue {
  $refs!: {
    observer: deleteDialogType;
  };

  @PropSync("deleteTagsVisibleProp", { type: Boolean, required: true })
  private deleteTagsVisible!: boolean;

  @Prop({ type: Function, required: true })
  private refreshTagsFromServer!: () => void;

  private get items(): Array<string> {
    return this.$store.state.tags;
  }

  private selected: Array<string> = [];

  private async okCb() {
    const isValid = await this.$refs.observer.validate();
    if (isValid) {
      TagsAdapter.deleteTags({ tags: this.selected })
        .then(() => {
          MessageRepository.handleSuccess(this, "Delete Success");
          this.clear();
          this.deleteTagsVisible = false;
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
    this.clear();
    this.deleteTagsVisible = false;
  }

  private clear() {
    this.refreshTagsFromServer();
    this.selected = [];
  }
}
</script>
