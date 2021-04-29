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
          <button class="btn btn-outline-secondary" @click="onClickSignup">
            Sign up
          </button>
        </li>
      </ul>
    </nav>
    <SigninDialog :signinVisibleProp.sync="signinVisible" />
    <SignupDialog :signupVisibleProp.sync="signupVisible" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import SigninDialog from "./SigninDialog.vue";
import SignupDialog from "./SignupDialog.vue";
@Component({
  components: { SigninDialog, SignupDialog },
})
export default class Header extends Vue {
  private signinVisible = false;

  private signupVisible = false;

  private onClickSignin() {
    this.signinVisible = true;
  }

  private onClickSignup() {
    this.signupVisible = true;
  }
}
</script>
