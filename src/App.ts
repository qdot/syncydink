import Vue from 'vue';
import Component from 'vue-class-component';
import ButtplugConnectionManagerComponent from './components/ButtplugConnectionManager/ButtplugConnectionManager.vue';
import { ButtplugClient } from "buttplug";

@Component({
  props: {
    buttplugClient: ButtplugClient
  },
  components: {
    ButtplugConnectionManagerComponent
  }
})
export default class App extends Vue {
  buttplugClient: ButtplugClient;

  async Connect(address: string) {
    await this.buttplugClient.Connect(address);
  }
}
