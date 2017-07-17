import { ButtplugClient, Device, Log, ButtplugDeviceMessage, FleshlightLaunchFW12Cmd } from "buttplug";
import { HapticCommand, KiirooCommand } from "haptic-movie-file-reader";
import Vue from "vue";
import "vue-awesome/icons/bars";
import { Component, Prop, Inject } from "vue-property-decorator";
import ButtplugPanelComponent from "./components/ButtplugPanel/ButtplugPanel.vue";
import HapticVideoPlayerComponent from "./components/HapticVideoPlayer/HapticVideoPlayer.vue";

@Component({
  components: {
    ButtplugPanelComponent,
    HapticVideoPlayerComponent,
  },
})
export default class App extends Vue {
  private videoFile: File | null = null;
  private hapticsFile: File | null = null;
  private hapticCommandsSize: number = 0;
  private hapticCommandsType: string = "";
  private buttplugMessage: ButtplugDeviceMessage | null = null;

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

  private onVideoFileChange(videoFile: FileList) {
    this.videoFile = videoFile[0];
  }

  private onHapticsFileChange(hapticsFile: FileList) {
    this.hapticsFile = hapticsFile[0];
  }

  private onHapticsLoaded(hapticCommandsType: string, hapticCommandsSize: number) {
    this.hapticCommandsType = hapticCommandsType;
    this.hapticCommandsSize = hapticCommandsSize;
  }
}
