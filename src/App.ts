import { ButtplugClient, ButtplugMessage, Device, Log, ButtplugDeviceMessage, StopAllDevices } from "buttplug";
import { HapticCommand, KiirooCommand, HapticFileHandler, LoadFile, FunscriptCommand } from "haptic-movie-file-reader";
import HapticCommandToButtplugMessage from "./utils/HapticsToButtplug";
import Vue from "vue";
import "vue-awesome/icons/bars";
import { Component } from "vue-property-decorator";
import { Player } from "video.js";
import VideoPlayer from "./components/VideoPlayer/VideoPlayer";
import VideoPlayerComponent from "./components/VideoPlayer/VideoPlayer.vue";
import VideoEncoder from "./components/VideoEncoder/VideoEncoder";
import VideoEncoderComponent from "./components/VideoEncoder/VideoEncoder.vue";
import * as Mousetrap from "mousetrap";

@Component({
  components: {
    VideoPlayerComponent,
    VideoEncoderComponent,
  },
})
export default class App extends Vue {
  private devices: Device[] = [];
  private hasOpenedMenu: boolean = false;
  private videoFile: File | null = null;
  private videoMode: string = "2d";
  private videoHeight: number = 0;
  private loopVideo: boolean = true;
  private hapticsFile: File | null = null;
  private hapticCommandsSize: number = 0;
  private hapticCommandsType: string = "";
  private isPaused: boolean = true;
  private haveVideoFile: boolean = false;
  private lastIndexRetrieved: number = -1;
  private lastTimeChecked: number = 0;
  private currentPlayTime: number = 0;
  private desiredPlayTime: number = 0;
  private leftSideNavOpened: boolean = false;
  private isDragging: boolean = false;
  // Map with entries stored by time
  private hapticsCommands: FunscriptCommand[] = [];
  private commands: Map<number, ButtplugDeviceMessage[]> = new Map();
  private commandTimes: number[] = [];
  private showEncoder: boolean = false;

  public mounted() {
    window.addEventListener("resize", () => this.setVideoHeight());
    Mousetrap.bind("right", () => this.advanceFrame(1));
    Mousetrap.bind("left", () => this.advanceFrame(-1));
    // Horrible hack since buggyfill doesn't work for android chrome. Just lose
    // like 16 units from viewport height. Remove this once the android fix
    // lands in the buggyfill.
    if (/Android/i.test(navigator.userAgent)) {
      document.getElementById("gesture-wrapper")!.style.height = "84vh";
    }
  }

  private onTimeUpdate(time: number) {
    this.currentPlayTime = time;
  }

  private onInputTimeUpdate(time: number) {
    this.desiredPlayTime = time;
    this.currentPlayTime = this.desiredPlayTime;
  }

  private advanceFrame(direction: number) {
    this.desiredPlayTime = (this.currentPlayTime) + (((1.0 / 60.0) * direction) * 1000);
    this.currentPlayTime = this.desiredPlayTime;
  }

  private SideNavOpen() {
    // If a subcomponent is dragging something, ignore the gesture.
    if (this.isDragging) {
      return;
    }
    if (!this.hasOpenedMenu) {
      this.hasOpenedMenu = true;
    }
    (this.$refs.leftSideNav as any).open();
  }

  private SideNavClose() {
    (this.$refs.leftSideNav as any).close();
  }

  private ToggleLeftSideNav() {
    if (!this.hasOpenedMenu) {
      this.hasOpenedMenu = true;
    }
    (this.$refs.leftSideNav as any).toggle();
  }

  private OnLeftSideNavOpen() {
    this.leftSideNavOpened = true;
  }

  private OnLeftSideNavClose() {
    this.leftSideNavOpened = false;
  }

  private onVideoFileChange(videoFile: FileList) {
    this.haveVideoFile = true;
    process.nextTick(() => {
      // Set our video file after this so the prop updates
      this.videoFile = videoFile[0];
      this.setVideoHeight();
    });
  }

  private onVideoLoaded(duration: number) {
    if (this.hapticsCommands.length === 0) {
      console.log(duration);
      this.hapticsCommands.push(new FunscriptCommand(0, 0));
      this.hapticsCommands.push(new FunscriptCommand(duration, 0));
    }
  }

  private onHapticsFileChange(hapticsFile: FileList) {
    this.hapticsFile = hapticsFile[0];
    LoadFile(this.hapticsFile).then((h: HapticFileHandler) => {
      this.hapticsCommands = h.Commands as FunscriptCommand[];
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
    if (this.devices.length > 0) {
      (Vue as any).Buttplug.StopAllDevices();
    }
  }

  private runHapticsLoop() {
    window.requestAnimationFrame(() => {
      // If we paused before this fired, just return
      if (this.isPaused || this.commands.size === 0) {
        return;
      }
      // Backwards seek. Reset index retreived.
      if (this.currentPlayTime < this.lastTimeChecked) {
        this.lastIndexRetrieved = -1;
      }
      this.lastTimeChecked = this.currentPlayTime;
      if (this.lastIndexRetrieved + 1 > this.commandTimes.length) {
        // We're at the end of our haptics data
        return;
      }
      if (this.currentPlayTime <= this.commandTimes[this.lastIndexRetrieved + 1]) {
        this.runHapticsLoop();
        return;
      }
      // There are faster ways to do this.
      while (this.currentPlayTime > this.commandTimes[this.lastIndexRetrieved + 1]) {
        this.lastIndexRetrieved += 1;
      }
      const msgs = this.commands.get(this.commandTimes[this.lastIndexRetrieved]);
      if (msgs !== undefined) {
        for (const aMsg of msgs) {
          for (const device of this.devices) {
            if (device.AllowedMessages.indexOf(aMsg.getType()) === -1) {
              continue;
            }
            (Vue as any).Buttplug.SendDeviceMessage(device, aMsg);
          }
        }
      }
      if (!this.isPaused) {
        this.runHapticsLoop();
      }
    });
  }

  // Video.js needs to have height set explicitly in order to recalculate aspect
  // ratios. Fluid doesn't seem to work well for this, so we're just trying to
  // catch all resizes and send the info accordingly.
  private setVideoHeight() {
    const videoContainer = document.getElementById("video-container")!;
    const videoEncoder = document.getElementById("video-encoder")!;
    this.videoHeight = videoEncoder === null ?
      videoContainer.clientHeight :
      videoContainer.clientHeight - videoEncoder.clientHeight;
  }

  private onShowTimelineChange(aChecked: boolean) {
    // It seems like v-show is a really bad way to do this, but I can't figure
    // out how to set up props on v-if.
    this.showEncoder = aChecked;
    process.nextTick(() => {
      this.setVideoHeight();
    });
  }

  private onLoopVideoChange(aChecked: boolean) {
    this.loopVideo = aChecked;
  }

  private OnDeviceConnected(aDevice: Device) {
    this.devices.push(aDevice);
  }

  private OnDeviceDisconnected(aDevice: Device) {
    this.devices = this.devices.filter((device) => device.Index !== aDevice.Index);
  }

  private onDragStart() {
    this.isDragging = true;
  }

  private onDragStop() {
    this.isDragging = false;
  }
}
