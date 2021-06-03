<template>
  <div class="home">
    <Header />
    <section class="mx-10">
      <h1>Album App</h1>
      <p class="subtitle-1">
        画像にタグを付けてクラウドに保存するアプリケーションです。<br />画像はアカウント別に保管されているので安心です。
      </p>
      <h2>使い方</h2>
      <p class="subtitle-1">
        ※hirameek@gmail.com/TestTest123!でログインできます。
      </p>
      <v-expansion-panels>
        <v-expansion-panel>
          <v-expansion-panel-header>利用登録 </v-expansion-panel-header>
          <v-expansion-panel-content>
            <ol>
              <li>Sign inボタンからメールアドレスとパスワードを入力します。</li>
              <li>認証コードがメール送信されるので続けて入力してください。</li>
            </ol>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <v-expansion-panels>
        <v-expansion-panel>
          <v-expansion-panel-header>ログイン </v-expansion-panel-header>
          <v-expansion-panel-content>
            <ol>
              <li>
                Sign inボタンからメールアドレスとパスワードを入力してください。
              </li>
            </ol>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <v-expansion-panels>
        <v-expansion-panel>
          <v-expansion-panel-header>画像登録 </v-expansion-panel-header>
          <v-expansion-panel-content>
            <ol>
              <li>雲マークをクリックします。</li>
              <li>ダイアログが開くのでファイルを選択します。</li>
              <li>
                タグを選択します。新しいタグを追加した場合は直接入力してエンタ―キーを押してください。
              </li>
            </ol>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <v-expansion-panels>
        <v-expansion-panel>
          <v-expansion-panel-header>画像検索 </v-expansion-panel-header>
          <v-expansion-panel-content>
            <ol>
              <li>ナビゲーションバーの入力欄でタグを選択してください。</li>
              <li>虫眼鏡マークを押してください。</li>
            </ol>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <v-expansion-panels>
        <v-expansion-panel>
          <v-expansion-panel-header>タグの削除</v-expansion-panel-header>
          <v-expansion-panel-content>
            <ol>
              <li>右上の三つ点ボタンを押し、Delete tagsを選択してください。</li>
              <li>
                ダイアログが開くので削除するタグを選択してください。使用している画像があるタグは削除できません。
              </li>
            </ol>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <v-expansion-panels>
        <v-expansion-panel>
          <v-expansion-panel-header
            >ログアウト/パスワード変更</v-expansion-panel-header
          >
          <v-expansion-panel-content>
            <ol>
              <li>右上の三つ点ボタンを押し、メニューから選択してください。</li>
            </ol>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </section>
    <v-footer padless absolute>
      <v-card width="100%" class="grey lighten-4 text-center py-3">
        <div>
          <v-icon>mdi-github</v-icon
          ><a href="https://github.com/hiramee/album_server" class="mx-2"
            >Server</a
          >
          <a href="https://github.com/hiramee/album_front">Front</a>
        </div>
        <div>
          <v-icon>mdi-email-outline</v-icon>
          <span class="mx-2">hirameek@gmail.com</span>
        </div>
      </v-card>
    </v-footer>
    <v-overlay :value="isLoading" z-index="500">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Header from "../components/Header.vue";

@Component({
  components: {
    Header,
  },
})
export default class Home extends Vue {
  private get isLoading(): boolean {
    return this.$store.state.isLoading;
  }
}
</script>
<style scoped>
section {
  text-align: left;
}
</style>
