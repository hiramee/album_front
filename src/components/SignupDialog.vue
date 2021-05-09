<template>
  <CommonDialog
    :dialogVisibleProp.sync="signupVisible"
    title="Sign up"
    :okCb="okCb"
    :cancelCb="cancelCb"
  >
    <div v-if="!isConfirmation">
      <validation-observer ref="observer">
        <validation-provider
          v-slot="{ errors }"
          name="E-mail"
          rules="required|email"
        >
          <v-text-field
            v-model="email"
            :error-messages="errors"
            label="E-mail"
            required
          ></v-text-field>
        </validation-provider>
        <validation-provider
          v-slot="{ errors }"
          name="Password"
          rules="required"
        >
          <v-text-field
            v-model="password"
            :error-messages="errors"
            :type="showPassword ? 'text' : 'password'"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            label="Password"
            @click:append="showPassword = !showPassword"
            required
          ></v-text-field>
        </validation-provider>
      </validation-observer>
    </div>
    <div v-if="isConfirmation">
      <validation-observer ref="observer">
        <validation-provider
          v-slot="{ errors }"
          name="confirmation Code"
          rules="required|numeric"
        >
          <v-text-field
            v-model="confirmationCode"
            :error-messages="errors"
            label="Confirmation Code"
            required
          ></v-text-field>
        </validation-provider>
      </validation-observer>
    </div>
  </CommonDialog>
</template>

<script lang="ts">
import { Component, PropSync, Vue } from "vue-property-decorator";
import { required, numeric, email } from "vee-validate/dist/rules";
import { extend, ValidationObserver, ValidationProvider } from "vee-validate";
import CommonDialog from "./CommonDialog.vue";
import CognitoService from "@/adapters/cognito";
import ErrorRepository from "@/repository/errorRepository";
import MessageRepository from "@/repository/messageRepository";
import { ErrorTypes } from "@/enums/errorTypes";

extend("required", {
  ...required,
  message: "{_field_} can not be empty",
});

extend("numeric", {
  ...numeric,
  message: "{_field_} must be number",
});

extend("email", {
  ...email,
  message: "E-mail must be valid",
});

interface SignupDialogType extends Vue {
  validate(): boolean;
}

@Component({
  components: {
    CommonDialog,
    ValidationProvider,
    ValidationObserver,
  },
})
export default class SignupDialog extends Vue {
  $refs!: {
    observer: SignupDialogType;
  };

  @PropSync("signupVisibleProp", { type: Boolean, required: true })
  private signupVisible!: boolean;

  private email = "";

  private password = "";

  private confirmationCode = "";

  private showPassword = false;

  private isConfirmation = false;

  private async okCb() {
    const isValid = await this.$refs.observer.validate();
    if (isValid && !this.isConfirmation) {
      CognitoService.signUp(this, this.email, this.password)
        .then(() => {
          this.isConfirmation = true;
          MessageRepository.handleSuccess(
            this,
            "Please input confirmation code"
          );
        })
        .catch((error) => {
          // Cognitoのエラー構造に合わせる
          ErrorRepository.handleMessage(
            this,
            ErrorTypes.WARN,
            error.code,
            error.message
          );
        });
    }
    if (isValid && this.isConfirmation) {
      CognitoService.confirmation(this, this.email, this.confirmationCode)
        .then(() => {
          this.signupVisible = false;
          this.isConfirmation = false;
          MessageRepository.handleSuccess(this, "Please signin");
        })
        .catch((error) => {
          // Cognitoのエラー構造に合わせる
          ErrorRepository.handleMessage(
            this,
            ErrorTypes.WARN,
            error.code,
            error.message
          );
        });
    }
  }

  private cancelCb() {
    this.email = "";
    this.password = "";
    this.confirmationCode = "";
    this.isConfirmation = false;
    this.signupVisible = false;
  }
}
</script>
