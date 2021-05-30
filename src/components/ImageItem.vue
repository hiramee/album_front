<template>
  <div>
    <img class="imageItem" :src="fileData.url" @click="clickCb(fileData)" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { DisplayPictureData } from "@/dto/pictures";

@Component({})
export default class ImageItem extends Vue {
  @Prop({ type: Function, required: false, default: () => ({}) })
  private clickCb!: (fileData: DisplayPictureData) => void;

  @Prop({ type: Object, required: true })
  private fileData!: DisplayPictureData;
}
</script>
<style scoped>
.imageItem {
  max-width: 100%;
  height: auto;
}
</style>
