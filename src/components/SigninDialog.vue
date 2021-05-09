<template>
  <CommonDialog
    :dialogVisibleProp.sync="signinVisible"
    title="Sign in"
    :okCb="okCb"
    :cancelCb="cancelCb"
  >
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
      <validation-provider v-slot="{ errors }" name="Password" rules="required">
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
  </CommonDialog>
</template>

<script lang="ts">
import { Component, PropSync, Prop, Vue } from "vue-property-decorator";
import { required, email } from "vee-validate/dist/rules";
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

extend("email", {
  ...email,
  message: "E-mail must be valid",
});

interface SigninDialogType extends Vue {
  validate(): boolean;
}

@Component({
  components: {
    CommonDialog,
    ValidationProvider,
    ValidationObserver,
  },
})
export default class SigninDialog extends Vue {
  $refs!: {
    observer: SigninDialogType;
  };

  @PropSync("signinVisibleProp", { type: Boolean, required: true })
  private signinVisible!: boolean;

  private email = "";

  private password = "";

  private showPassword = false;

  private async okCb() {
    const isValid = await this.$refs.observer.validate();
    if (isValid) {
      CognitoService.login(this, this.email, this.password)
        .then(() => {
          this.signinVisible = false;
          MessageRepository.handleSuccess(this, "Signin Success");
          this.$router.push("/album");
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
    this.clear();
    this.signinVisible = false;
  }

  private clear() {
    this.email = "";
    this.password = "";
  }
}
</script>
