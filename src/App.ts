import { ButtplugClient, ButtplugMessage, Device, Log, ButtplugDeviceMessage, StopAllDevices } from "buttplug";
import { HapticCommand, KiirooCommand, HapticFileHandler, LoadFile, FunscriptCommand } from "haptic-movie-file-reader";
import HapticCommandToButtplugMessage from "./utils/HapticsToButtplug";
import Vue from "vue";
import "vue-awesome/icons/bars";
import { Component, Watch } from "vue-property-decorator";
import ButtplugPanelComponent from "./components/ButtplugPanel/ButtplugPanel.vue";
import ButtplugPanel from "./components/ButtplugPanel/ButtplugPanel";
import { Player } from "video.js";
import VideoPlayer from "./components/VideoPlayer/VideoPlayer";
import VideoPlayerComponent from "./components/VideoPlayer/VideoPlayer.vue";
import VideoEncoderComponent from "./components/VideoEncoder/VideoEncoder.vue";

@Component({
  components: {
    ButtplugPanelComponent,
    VideoPlayerComponent,
    VideoEncoderComponent,
  },
})
export default class App extends Vue {
  private hasOpenedMenu: boolean = false;
  private videoFile: File | null = null;
  private videoMode: string = "2d";
  private hapticsFile: File | null = null;
  private hapticCommandsSize: number = 0;
  private hapticCommandsType: string = "";
  private currentPlayer: VideoPlayer = (this.$refs.videoPlayer as VideoPlayer);
  private isPaused: boolean = true;
  private haveVideoFile: boolean = false;
  private lastIndexRetrieved: number = -1;
  private lastTimeChecked: number = 0;

  // Map with entries stored by time
  private commands: Map<number, ButtplugDeviceMessage[]> = new Map();
  private commandTimes: number[] = [];
  private showEncoder: boolean = true;

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

  private ToggleLeftSideNav() {
    if (!this.hasOpenedMenu) {
      (this.$refs.hamburgerStartText as HTMLDivElement).remove();
      (this.$refs.swipeStartText as any).remove();
      this.hasOpenedMenu = true;
    }
    (this.$refs.leftSideNav as any).toggle();
  }

  private onVideoFileChange(videoFile: FileList) {
    this.haveVideoFile = true;
    process.nextTick(() => {
      // At this point we'll definitely have a video player
      this.currentPlayer = (this.$refs.videoPlayer as VideoPlayer);
      // Set our video file after this so the prop updates
      this.videoFile = videoFile[0];
    });
  }

  private onHapticsFileChange(hapticsFile: FileList) {
    this.hapticsFile = hapticsFile[0];
    LoadFile(this.hapticsFile).then((h: HapticFileHandler) => {
      this.commands = HapticCommandToButtplugMessage.HapticCommandToButtplugMessage(h.Commands);
      this.commandTimes = Array.from(this.commands.keys());
    });
  }

  private onHapticsLoaded(hapticCommandsType: string, hapticCommandsSize: number) {
    this.hapticCommandsType = hapticCommandsType;
    this.hapticCommandsSize = hapticCommandsSize;
  }

  private onPlay() {
    this.isPaused = false;
    this.runHapticsLoop();
  }

  private onPause() {
    this.isPaused = true;
    (this.$refs.buttplugPanel as ButtplugPanel).StopAllDevices();
  }

  private runHapticsLoop() {
    window.requestAnimationFrame(() => {
      // If we paused before this fired, just return
      if (this.isPaused || this.commands.size === 0) {
        return;
      }
      const currentTimeInMs = this.currentPlayer.CurrentTimeInMS();
      // Backwards seek. Reset index retreived.
      if (currentTimeInMs < this.lastTimeChecked) {
        this.lastIndexRetrieved = -1;
      }
      this.lastTimeChecked = currentTimeInMs;
      if (this.lastIndexRetrieved + 1 > this.commandTimes.length) {
        // We're at the end of our haptics data
        return;
      }
      if (currentTimeInMs <= this.commandTimes[this.lastIndexRetrieved + 1]) {
        this.runHapticsLoop();
        return;
      }
      // There are faster ways to do this.
      while (currentTimeInMs > this.commandTimes[this.lastIndexRetrieved + 1]) {
        this.lastIndexRetrieved += 1;
      }
      const msgs = this.commands.get(this.commandTimes[this.lastIndexRetrieved]);
      if (msgs !== undefined) {
        for (const aMsg of msgs) {
          (this.$refs.buttplugPanel as ButtplugPanel).SendDeviceMessage(aMsg);
        }
      }
      if (!this.isPaused) {
        this.runHapticsLoop();
      }
    });
  }
}
