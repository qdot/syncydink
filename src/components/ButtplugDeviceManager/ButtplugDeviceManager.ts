import { Device } from "buttplug";
import Vue from "vue";
import { Component, Model, Prop } from "vue-property-decorator";

@Component
export default class ButtplugDeviceManager extends Vue {
  @Prop()
  private devices: Device[];
  private IsScanning: boolean = false;
  @Model()
  private ScanningText: string = "Start Scanning";

  private ScanningClicked(ev: Event) {
    if (!this.IsScanning) {
      this.$emit("startScanning");
      this.IsScanning = true;
      this.ScanningText = "Stop Scanning";
      return;
    }
    this.$emit("stopScanning");
    this.IsScanning = false;
    this.ScanningText = "Start Scanning";
  }
}
