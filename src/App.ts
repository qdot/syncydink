import Vue from 'vue';
import { Prop, Component } from 'vue-property-decorator'
import { ButtplugClient, Device, Log } from 'buttplug';
import ButtplugPanelComponent from './components/ButtplugPanel/ButtplugPanel.vue';
import SyncyDinkVideoComponent from './components/SyncyDinkVideo/SyncyDinkVideo.vue';
import { HapticCommand, KiirooCommand } from 'haptic-movie-file-reader';
import 'vue-awesome/icons/bars'
const Slideout = require('vue-slideout').default;

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

  hapticEvent(ev : HapticCommand)
  {
    switch (ev.constructor.name) {
    case 'KiirooCommand':
      break;
    }
  }
}
