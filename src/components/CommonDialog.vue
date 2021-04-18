<template>
  <v-dialog v-model="dialogVisible" :width="dialogWidth">
    <v-card>
      <v-card-title class="headline grey lighten-2"> {{ title }} </v-card-title>

      <v-card-text>
        <slot></slot>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions :justify="'space-between'">
        <v-btn color="normal" text @click="cancelCb">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="okCb">Ok</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, PropSync, Prop, Vue } from "vue-property-decorator";

@Component
export default class CommonDialog extends Vue {
  @Prop({ type: String, required: true })
  private title!: string;

  @PropSync("dialogVisibleProp", { type: Boolean, required: true })
  private dialogVisible!: boolean;

  @Prop({ type: Function, required: true })
  private okCb!: () => void;

  @Prop({ type: Function, required: true })
  private cancelCb!: () => void;

  @Prop({ type: String, required: false, default: "500" })
  private dialogWidth!: string;
}
</script>
