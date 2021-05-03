# album_front
自作アルバムアプリのフロントエンド実装用リポジトリです
サーバ実装は[こちら](https://github.com/hiramee/album_server)

## デモ
https://album.hiramengo.com/

## 主要フレームワーク/ライブラリ
- Vue.js 2.X  
jsフレームワーク.SPA作成に向いていて記述が簡素なので採用した.
- Vuex  
状態管理用ライブラリ.タグ情報やログイン情報を共通管理するために使用した.
- vue-property-decorator  
デコレータライブラリ.Vueファイルの可読性向上のために使用した.
- Vuetify 2.X  
UIフレームワーク.使用経験のあるElementUI以外でメジャーなものを採用した.
- VeeValidate  
バリデーション用ライブラリ.Vuetifyの入力コンポーネントでサポートされているので採用した.
