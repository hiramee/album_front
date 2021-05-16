<template>
  <CommonDialog
    :dialogVisibleProp.sync="changePasswordVisible"
    title="Change password"
    :okCb="okCb"
    :cancelCb="cancelCb"
  >
    <validation-observer ref="observer">
      <validation-provider
        v-slot="{ errors }"
        name="oldPassword"
        rules="required"
      >
        <v-text-field
          v-model="oldPassword"
          :error-messages="errors"
          :type="showOldPassword ? 'text' : 'password'"
          :append-icon="showOldPassword ? 'mdi-eye' : 'mdi-eye-off'"
          label="OldPassword"
          @click:append="showOldPassword = !showOldPassword"
          required
        ></v-text-field>
      </validation-provider>
      <validation-provider
        v-slot="{ errors }"
        name="newPassword"
        rules="required"
      >
        <v-text-field
          v-model="newPassword"
          :error-messages="errors"
          :type="showNewPassword ? 'text' : 'password'"
          :append-icon="showNewPassword ? 'mdi-eye' : 'mdi-eye-off'"
          label="NewPassword"
          @click:append="showNewPassword = !showNewPassword"
          required
        ></v-text-field>
      </validation-provider>
    </validation-observer>
  </CommonDialog>
</template>

<script lang="ts">
import { Component, PropSync, Vue } from "vue-property-decorator";
import { required } from "vee-validate/dist/rules";
import { extend, ValidationObserver, ValidationProvider } from "vee-validate";
import CommonDialog from "./CommonDialog.vue";
import CognitoService from "@/adapters/cognito";
import MessageRepository from "@/repository/messageRepository";

extend("required", {
  ...required,
  message: "{_field_} can not be empty",
});

interface ChangePasswordDialogType extends Vue {
  validate(): boolean;
}

@Component({
  components: {
    CommonDialog,
    ValidationProvider,
    ValidationObserver,
  },
})
export default class ChangePasswordDialog extends Vue {
  $refs!: {
    observer: ChangePasswordDialogType;
  };

  @PropSync("changePasswordVisibleProp", { type: Boolean, required: true })
  private changePasswordVisible!: boolean;

  private oldPassword = "";

  private newPassword = "";

  private showOldPassword = false;

  private showNewPassword = false;

  private async okCb() {
    const isValid = await this.$refs.observer.validate();
    if (isValid) {
      CognitoService.changePassword(this, this.oldPassword, this.newPassword)
        .then(() => {
          MessageRepository.handleSuccess(this, "Change password Success");
          this.changePasswordVisible = false;
        })
        .catch((error: Error) => {
          MessageRepository.handleFailure(
            this,
            "Change password Failed" + " : " + error.message
          );
        });
    }
  }

  private cancelCb() {
    this.clear();
    this.changePasswordVisible = false;
  }

  private clear() {
    this.oldPassword = "";
    this.newPassword = "";
  }
}
</script>
