import { ButtplugClient, ButtplugMessage, Device, Log, ButtplugDeviceMessage, StopAllDevices } from "buttplug";
import { HapticCommand, KiirooCommand } from "haptic-movie-file-reader";
import Vue from "vue";
import "vue-awesome/icons/bars";
import { Component, Watch } from "vue-property-decorator";
import ButtplugPanelComponent from "./components/ButtplugPanel/ButtplugPanel.vue";
import ButtplugPanel from "./components/ButtplugPanel/ButtplugPanel";
import HapticVideoPlayerComponent from "./components/HapticVideoPlayer/HapticVideoPlayer.vue";

@Component({
  components: {
    ButtplugPanelComponent,
    HapticVideoPlayerComponent,
  },
})
export default class App extends Vue {
  private hasOpenedMenu: boolean = false;
  private videoFile: File | null = null;
  private videoMode: string = "2d";
  private hapticsFile: File | null = null;
  private hapticCommandsSize: number = 0;
  private hapticCommandsType: string = "";
  private SideNavRightSwipe() {
    if (!this.hasOpenedMenu) {
      (this.$refs.hamburgerStartText as HTMLDivElement).remove();
      (this.$refs.swipeStartText as any).remove();
      this.hasOpenedMenu = true;
    }
    const leftSideNavElement = document.getElementById("leftSideNavElement")!;
    const rightSideNavElement = document.getElementById("rightSideNavElement")!;

    if (!leftSideNavElement.classList.contains("md-active") &&
        !rightSideNavElement.classList.contains("md-active")) {
      (this.$refs.leftSideNav as any).open();
    } else if (rightSideNavElement.classList.contains("md-active")) {
      (this.$refs.rightSideNav as any).close();
    }
  }

  private SideNavLeftSwipe() {
    if (!this.hasOpenedMenu) {
      (this.$refs.hamburgerStartText as HTMLDivElement).remove();
      (this.$refs.swipeStartText as any).remove();
      this.hasOpenedMenu = true;
    }
    const leftSideNav = document.getElementById("leftSideNavElement")!;
    const rightSideNav = document.getElementById("rightSideNavElement")!;

    if (!leftSideNav.classList.contains("md-active") &&
        !rightSideNav.classList.contains("md-active")) {
      (this.$refs.rightSideNav as any).open();
    } else if (leftSideNav.classList.contains("md-active")) {
      (this.$refs.leftSideNav as any).close();
    }
  }

  private NavIconOpen() {
    (this.$refs.navicon as any).classList.add("open");
  }

  private NavIconClose() {
    (this.$refs.navicon as any).classList.remove("open");
  }

  private onHapticsEvent(aMsgs: ButtplugDeviceMessage[]) {
    for (const aMsg of aMsgs) {
      (this.$refs.buttplugPanel as ButtplugPanel).SendDeviceMessage(aMsg);
    }
  }

  private ToggleLeftSideNav() {
    if (!this.hasOpenedMenu) {
      (this.$refs.hamburgerStartText as HTMLDivElement).remove();
      (this.$refs.swipeStartText as any).remove();
      this.hasOpenedMenu = true;
    }
    (this.$refs.leftSideNav as any).toggle();
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

  private onVideoPaused() {
    (this.$refs.buttplugPanel as ButtplugPanel).StopAllDevices();
  }
}
