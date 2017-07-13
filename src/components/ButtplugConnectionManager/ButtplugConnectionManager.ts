import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component
export default class ButtplugConnectionManager extends Vue {
  private address: string = "ws://192.168.123.2:12345/buttplug";
  private Connect() {
    this.$emit("connect", this.address);
  }

}
