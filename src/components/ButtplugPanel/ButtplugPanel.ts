import { ButtplugClient, Device, Log } from "buttplug";
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import ButtplugConnectionManagerComponent from "../ButtplugConnectionManager/ButtplugConnectionManager.vue";
import ButtplugDeviceManagerComponent from "../ButtplugDeviceManager/ButtplugDeviceManager.vue";
import ButtplugLogManagerComponent from "../ButtplugLogManager/ButtplugLogManager.vue";

@Component({
  components: {
    ButtplugConnectionManagerComponent,
    ButtplugDeviceManagerComponent,
    ButtplugLogManagerComponent,
  },
})
export default class ButtplugPanel extends Vue {
  @Prop()
  private buttplugClient: ButtplugClient;

  private logMessages: string[] = [];
  private devices: Device[] = [];

  private async Connect(address: string) {
    await this.buttplugClient.Connect(address);
    this.buttplugClient.addListener("log", this.AddLogMessage);
    this.buttplugClient.addListener("deviceadded", this.AddDevice);
    this.buttplugClient.addListener("deviceremoved", this.RemoveDevice);
    await this.buttplugClient.RequestDeviceList();
  }

  private async SetLogLevel(logLevel: string) {
    await this.buttplugClient.RequestLog(logLevel);
  }

  private async StartScanning() {
    await this.buttplugClient.StartScanning();
  }

  private async StopScanning() {
    await this.buttplugClient.StopScanning();
  }

  private AddLogMessage(logMessage: Log) {
    this.logMessages.push(logMessage.LogMessage);
  }

  private DeviceAlreadyAdded(device: Device): boolean {
    return this.devices.filter((d) => device.Index === d.Index).length !== 0;
  }

  private AddDevice(device: Device) {
    if (!this.DeviceAlreadyAdded(device)) {
      this.devices.push(device);
    }
  }

  private RemoveDevice(device: Device) {
    if (this.devices.indexOf(device) !== -1) {
      this.devices.splice(this.devices.indexOf(device), 1);
    }
  }
}
