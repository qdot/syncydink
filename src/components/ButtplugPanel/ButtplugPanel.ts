import { ButtplugClient, ButtplugDeviceMessage, Device, Log } from "buttplug";
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
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
  public logMessages: string[] = [];
  public devices: Device[] = [];

  @Prop()
  private buttplugMessage: ButtplugDeviceMessage;

  // TODO: Pass down a property to name the client with
  private buttplugClient: ButtplugClient = new ButtplugClient("Buttplug Panel");

  @Watch("buttplugMessage")
  private onMessageUpdate(val: ButtplugDeviceMessage, oldVal: ButtplugDeviceMessage) {
    this.devices.forEach((aDevice) => {
      this.buttplugClient.SendDeviceMessage(aDevice, val);
    });
  }

  private async Connect(address: string) {
    await this.buttplugClient.Connect(address);
    this.buttplugClient.addListener("log", this.AddLogMessage);
    this.buttplugClient.addListener("deviceadded", this.AddDevice);
    this.buttplugClient.addListener("deviceremoved", this.RemoveDevice);
    const devices = await this.buttplugClient.RequestDeviceList();
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
