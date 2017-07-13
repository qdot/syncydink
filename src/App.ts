import { ButtplugClient, Device, Log } from "buttplug";
import { HapticCommand, KiirooCommand } from "haptic-movie-file-reader";
import Vue from "vue";
import "vue-awesome/icons/bars";
import { Component, Prop } from "vue-property-decorator";
import ButtplugPanelComponent from "./components/ButtplugPanel/ButtplugPanel.vue";
import SyncyDinkVideoComponent from "./components/SyncyDinkVideo/SyncyDinkVideo.vue";
const Slideout = require("vue-slideout").default;

@Component({
  components: {
    ButtplugPanelComponent,
    Slideout,
    SyncyDinkVideoComponent,
  },
})
export default class App extends Vue {
  @Prop()
  private buttplugClient: ButtplugClient;

  private hapticEvent(ev: HapticCommand) {
    switch (ev.constructor.name) {
    case "KiirooCommand":
      break;
    }
  }
}
