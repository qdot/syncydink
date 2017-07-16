import { Device } from "buttplug";
import Vue from "vue";
import { Component, Model, Prop } from "vue-property-decorator";

@Component
export default class ButtplugDeviceManager extends Vue {
  @Prop()
  private devices: Device[];
  private _isScanning: boolean = false;
  @Model()
  private ScanningText: string = "Start Scanning";

  private ScanningClicked(ev: Event) {
    if (!this._isScanning) {
      this.$emit("startScanning");
      this._isScanning = true;
      this.ScanningText = "Stop Scanning";
      return;
    }
    this.$emit("stopScanning");
    this._isScanning = false;
    this.ScanningText = "Start Scanning";
  }
}
