import Vue from 'vue';
import { Prop, Component } from 'vue-property-decorator'
import { ButtplugClient, Log } from "buttplug";
import ButtplugConnectionManagerComponent from './components/ButtplugConnectionManager/ButtplugConnectionManager.vue';
import ButtplugLogManagerComponent from './components/ButtplugLogManager/ButtplugLogManager.vue';

@Component({
  components: {
    ButtplugConnectionManagerComponent,
    ButtplugLogManagerComponent
  }
})
export default class App extends Vue {
  @Prop()
  buttplugClient: ButtplugClient;

  logMessages: Array<string> = [];

  async Connect(address: string) {
    await this.buttplugClient.Connect(address);
    this.buttplugClient.addListener('log', this.AddLogMessage);
  }

  async SetLogLevel(logLevel: string) {
    console.log("Setting level " + logLevel);
    await this.buttplugClient.RequestLog(logLevel);
  }

  async StartScanning() {
    await this.buttplugClient.StartScanning();
  }

  AddLogMessage(logMessage: Log) {
    console.log(logMessage);
    this.logMessages.push(logMessage.LogMessage);
  }
}
