<template>
  <div>
    <nav class="navbar">
      <ul class="nav mr-auto mt-2 mt-lg-0">
        <li class="nav-item">
          <button class="btn">Home</button>
        </li>
      </ul>
      <ul class="nav">
        <li class="nav-item mx-1">
          <button class="btn btn-light" @click="onClickSignin">Sign in</button>
        </li>

        <li class="nav-item mx-1">
          <button class="btn btn-outline-secondary">Sign up</button>
        </li>
      </ul>
    </nav>
    <SigninDialog
      :signinVisibleProp.sync="signinVisible"
      :okCb="signinOkCb"
      :cancelCb="signinCancelCb"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import SigninDialog from "./SigninDialog.vue";
import CognitoService from "@/adapters/cognito";
import { CognitoUserSession } from "amazon-cognito-identity-js";
import { AUTH_KEY } from "@/consts/consts";
import ErrorRepository from "@/repository/errorRepository";
import { HttpError } from "@/errors/error";
import { ErrorTypes } from "@/enums/errorTypes";
@Component({
  components: { SigninDialog },
})
export default class Header extends Vue {
  private signinVisible = false;

  private onClickSignin() {
    this.signinVisible = true;
  }

  private signinOkCb(userName: string, password: string): void {
    CognitoService.login(userName, password)
      .then((result: CognitoUserSession) => {
        sessionStorage.setItem(AUTH_KEY, result.getIdToken().getJwtToken());
        this.signinVisible = false;
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

  private signinCancelCb() {
    this.signinVisible = false;
  }
}
</script>
