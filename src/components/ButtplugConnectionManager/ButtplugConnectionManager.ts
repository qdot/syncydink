import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component
export default class ButtplugConnectionManager extends Vue {
  @Prop()
  private isConnected: boolean;
  private clientName: string = "Syncydink Video Player";
  private address: string = "ws://192.168.123.2:12345/buttplug";
  private Connect() {
    if (this.isConnected) {
      this.$emit("disconnect");
      return;
    }
    this.$emit("connect", {address: this.address,
                           clientName: this.clientName});
  }

  get ConnectText(): string {
    if (this.isConnected === true) {
      return "Disconnect";
    }
    return "Connect";
  }
}
