<template>
  <div>
    <v-img
      :src="url"
      :lazy-src="url"
      class="grey lighten-2"
      @click="clickCb(fileData)"
    >
      <template v-slot:placeholder>
        <v-row class="fill-height ma-0" align="center" justify="center">
          <v-progress-circular
            indeterminate
            color="grey lighten-5"
          ></v-progress-circular>
        </v-row>
      </template>
    </v-img>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { DisplayPictureData } from "@/dto/pictures";

@Component({})
export default class ImageItem extends Vue {
  @Prop({ type: Function, required: false, default: () => ({}) })
  private clickCb!: (fileData: DisplayPictureData) => void;

  @Prop({ type: Object, required: true })
  private fileData!: DisplayPictureData;

  @Prop({ type: String, required: true })
  private width!: string;

  private get url(): string {
    return URL.createObjectURL(this.fileData.file);
  }

  @Watch("url")
  private onChangeFile(_: string, oldValue: string): void {
    URL.revokeObjectURL(oldValue);
  }
}
</script>
