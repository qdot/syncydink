import { ButtplugClient, Device, Log, ButtplugDeviceMessage, FleshlightLaunchFW12Cmd } from "buttplug";
import { HapticCommand, KiirooCommand } from "haptic-movie-file-reader";
import Vue from "vue";
import "vue-awesome/icons/bars";
import { Component, Prop, Inject } from "vue-property-decorator";
import ButtplugPanelComponent from "./components/ButtplugPanel/ButtplugPanel.vue";
import SyncyDinkVideoComponent from "./components/SyncyDinkVideo/SyncyDinkVideo.vue";

@Component({
  components: {
    ButtplugPanelComponent,
    SyncyDinkVideoComponent,
  },
})
export default class App extends Vue {
  private buttplugMessage: ButtplugDeviceMessage = new FleshlightLaunchFW12Cmd(100, 0);

  private SideNavOpen() {
    (this.$refs.leftSidenav as any).open();
  }

  private SideNavClose() {
    (this.$refs.leftSidenav as any).close();
  }

  private NavIconOpen() {
    (this.$refs.navicon as any).classList.add("open");
  }

  private NavIconClose() {
    (this.$refs.navicon as any).classList.remove("open");
  }

  private ButtplugEvent(ev: ButtplugDeviceMessage) {
    this.buttplugMessage = ev;
  }

  private ToggleLeftSidenav() {
    (this.$refs.leftSidenav as any).toggle();
  }
}
