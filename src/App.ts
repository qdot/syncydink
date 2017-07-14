import { ButtplugClient, Device, Log, ButtplugDeviceMessage, FleshlightLaunchFW12Cmd } from "buttplug";
import { HapticCommand, KiirooCommand } from "haptic-movie-file-reader";
import Vue from "vue";
import "vue-awesome/icons/bars";
import { Component, Prop, Inject } from "vue-property-decorator";
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
  private buttplugMessage: ButtplugDeviceMessage = new FleshlightLaunchFW12Cmd(100, 0);

  private buttplugEvent(ev: ButtplugDeviceMessage) {
    this.buttplugMessage = ev;
  }
}
