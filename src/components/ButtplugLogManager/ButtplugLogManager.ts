import Vue from "vue";
import { Component, Model, Prop } from "vue-property-decorator";

@Component
export default class ButtplugLogManager extends Vue {
  @Prop()
  private logMessages: string[];

  @Model()
  private logLevel: string = "Off";

  private LogLevelChange() {
    this.$emit("loglevel", this.logLevel);
  }
}
