import { ButtplugClient, ButtplugDeviceMessage, Device, Log } from "buttplug";
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import ButtplugConnectionManagerComponent from "../ButtplugConnectionManager/ButtplugConnectionManager.vue";
import ButtplugStartConnectEvent from "../ButtplugConnectionManager/ButtplugStartConnectEvent";
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
  private isConnected: boolean = false;

  private buttplugClient: ButtplugClient | undefined;

  @Watch("buttplugMessage")
  private onMessageUpdate(val: ButtplugDeviceMessage, oldVal: ButtplugDeviceMessage) {
    if (this.buttplugClient === undefined) {
      return;
    }
    this.devices.forEach((aDevice) => {
      // Strict null checking doesn't like the earlier check not being in this
      // scope, so we have to do this twice.
      if (this.buttplugClient) {
        this.buttplugClient.SendDeviceMessage(aDevice, val);
      }
    });
  }

  private async Connect(aConnectObj: ButtplugStartConnectEvent) {
    const buttplugClient = new ButtplugClient(aConnectObj.clientName);
    await buttplugClient.Connect(aConnectObj.address);
    buttplugClient.addListener("close", () => { this.isConnected = false; });
    buttplugClient.addListener("log", this.AddLogMessage);
    buttplugClient.addListener("deviceadded", this.AddDevice);
    buttplugClient.addListener("deviceremoved", this.RemoveDevice);
    this.isConnected = true;
    const devices = await buttplugClient.RequestDeviceList();
    this.buttplugClient = buttplugClient;
  }

  private Disconnect() {
    if (this.buttplugClient === undefined) {
      return;
    }
    if (this.buttplugClient.Connected) {
      this.buttplugClient.Disconnect();
    }
    this.buttplugClient = undefined;
  }

  private async SetLogLevel(logLevel: string) {
    if (this.buttplugClient === undefined) {
      return;
    }
    await this.buttplugClient.RequestLog(logLevel);
  }

  private async StartScanning() {
    if (this.buttplugClient === undefined) {
      return;
    }
    await this.buttplugClient.StartScanning();
  }

  private async StopScanning() {
    if (this.buttplugClient === undefined) {
      return;
    }
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
