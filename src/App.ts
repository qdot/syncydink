import Vue from 'vue';
import { Prop, Component } from 'vue-property-decorator'
import { ButtplugClient, Device, Log } from "buttplug";
import ButtplugConnectionManagerComponent from './components/ButtplugConnectionManager/ButtplugConnectionManager.vue';
import ButtplugLogManagerComponent from './components/ButtplugLogManager/ButtplugLogManager.vue';
import ButtplugDeviceManagerComponent from './components/ButtplugDeviceManager/ButtplugDeviceManager.vue';

@Component({
  components: {
    ButtplugConnectionManagerComponent,
    ButtplugLogManagerComponent,
    ButtplugDeviceManagerComponent
  }
})
export default class App extends Vue {
  @Prop()
  buttplugClient: ButtplugClient;

  logMessages: Array<string> = [];
  devices: Array<Device> = [];

  async Connect(address: string) {
    await this.buttplugClient.Connect(address);
    this.buttplugClient.addListener('log', this.AddLogMessage);
    this.buttplugClient.addListener('deviceadded', this.AddDevice);
  }

  async SetLogLevel(logLevel: string) {
    await this.buttplugClient.RequestLog(logLevel);
  }

  async StartScanning() {
    await this.buttplugClient.StartScanning();
  }

  AddLogMessage(logMessage: Log) {
    this.logMessages.push(logMessage.LogMessage);
  }

  AddDevice(device: Device) {
    this.devices.push(device);
  }
}
