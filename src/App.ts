import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator'
import ButtplugConnectionManagerComponent from './components/ButtplugConnectionManager/ButtplugConnectionManager.vue';
import { ButtplugClient } from "buttplug";

@Component({
  components: {
    ButtplugConnectionManagerComponent
  }
})
export default class App extends Vue {
  @Prop()
  buttplugClient: ButtplugClient;

  async Connect(address: string) {
    await this.buttplugClient.Connect(address);
  }
}
