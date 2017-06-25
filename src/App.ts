import Vue from 'vue';
import { Prop, Component } from 'vue-property-decorator'
import { ButtplugClient, Device, Log } from "buttplug";
import ButtplugPanelComponent from './components/ButtplugPanel/ButtplugPanel.vue';
import SyncyDinkVideoComponent from './components/SyncyDinkVideo/SyncyDinkVideo.vue';
import Slideout from './components/Slideout/slideout.vue';
import 'vue-awesome/icons/bars'

@Component({
  components: {
    Slideout,
    ButtplugPanelComponent,
    SyncyDinkVideoComponent
  }
})
export default class App extends Vue {
  @Prop()
  buttplugClient: ButtplugClient;

  open() {
    console.log("Opened!");
  }
}
