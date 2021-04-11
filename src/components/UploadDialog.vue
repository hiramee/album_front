<template>
  <CommonDialog
    :dialogVisibleProp.sync="uploadVisible"
    title="Upload"
    :okCb="overrideOkCb"
    :cancelCb="overrideCancelCb"
  >
    <validation-observer ref="observer">
      <validation-provider v-slot="{ errors }" name="file" rules="required">
        <v-file-input
          accept="image/*"
          :error-messages="errors"
          label="File input"
          v-model="file"
          required
        ></v-file-input>
      </validation-provider>
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

  @Prop({ type: Function, required: true })
  private okCb!: () => void;

  @Prop({ type: Function, required: true })
  private cancelCb!: () => void;

  private file: File | null = null;

  private items: Array<string> = ["foo", "bar"];

  private selected: Array<string> = [];

  private async overrideOkCb() {
    const isValid = await this.$refs.observer.validate();
    if (isValid) {
      this.okCb();
    }
    // TODO ErrorHandling
  }

  private overrideCancelCb() {
    this.clear();
    this.cancelCb();
  }

  private clear() {
    this.file = null;
    this.selected = [];
  }
}
</script>
