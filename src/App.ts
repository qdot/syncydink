import { ButtplugClient, ButtplugMessage, Device, Log, ButtplugDeviceMessage, StopAllDevices } from "buttplug";
import { HapticCommand, KiirooCommand, HapticFileHandler, LoadFile, LoadString,
         FunscriptCommand } from "haptic-movie-file-reader";
import HapticCommandToButtplugMessage from "./utils/HapticsToButtplug";
import Vue from "vue";
import "vue-awesome/icons/bars";
import { Component } from "vue-property-decorator";
import { Player } from "video.js";
import VideoPlayerComponent from "./components/VideoPlayer/VideoPlayer.vue";
import VideoEncoderComponent from "./components/VideoEncoder/VideoEncoder.vue";
import ButtplugSimulatorComponent from "./components/ButtplugSimulator/ButtplugSimulator.vue";
import * as Mousetrap from "mousetrap";

@Component({
  components: {
    VideoPlayerComponent,
    VideoEncoderComponent,
    ButtplugSimulatorComponent,
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
  private paused: boolean = true;
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
  private showSimulator: boolean = false;
  private currentMessages: ButtplugMessage[] = [];

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
    // this.loadHapticsTestData();
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
    this.paused = false;
    this.runHapticsLoop();
  }

  private onPause() {
    this.paused = true;
    if (this.devices.length > 0) {
      (Vue as any).Buttplug.StopAllDevices();
    }
  }

  private runHapticsLoop() {
    window.requestAnimationFrame(() => {
      // If we paused before this fired, just return
      if (this.paused || this.commands.size === 0) {
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
        this.currentMessages = msgs!;
        for (const aMsg of msgs) {
          for (const device of this.devices) {
            if (device.AllowedMessages.indexOf(aMsg.getType()) === -1) {
              continue;
            }
            (Vue as any).Buttplug.SendDeviceMessage(device, aMsg);
          }
        }
      }
      if (!this.paused) {
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

  private onShowSimulatorChange(aChecked: boolean) {
    // It seems like v-show is a really bad way to do this, but I can't figure
    // out how to set up props on v-if.
    this.showSimulator = aChecked;
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

  private loadHapticsTestData() {
    // tslint:disable-next-line:max-line-length
    const testFile = '{"version": "1.0", "inverted": false, "actions": [{"at": 367, "pos": 20}, {"at": 667, "pos": 80}, {"at": 1101, "pos": 20}, {"at": 1535, "pos": 80}, {"at": 1902, "pos": 20}, {"at": 2269, "pos": 80}, {"at": 2569, "pos": 20}, {"at": 3036, "pos": 80}, {"at": 3403, "pos": 20}, {"at": 3670, "pos": 80}, {"at": 4137, "pos": 20}, {"at": 4505, "pos": 80}, {"at": 4838, "pos": 20}, {"at": 5472, "pos": 30}, {"at": 5706, "pos": 50}, {"at": 5873, "pos": 30}, {"at": 6206, "pos": 30}, {"at": 6840, "pos": 40}, {"at": 7307, "pos": 30}, {"at": 7674, "pos": 20}, {"at": 8175, "pos": 80}, {"at": 8575, "pos": 20}, {"at": 8876, "pos": 80}, {"at": 9276, "pos": 20}, {"at": 9576, "pos": 80}, {"at": 9943, "pos": 20}, {"at": 10277, "pos": 80}, {"at": 10644, "pos": 20}, {"at": 11144, "pos": 80}, {"at": 11512, "pos": 20}, {"at": 11945, "pos": 80}, {"at": 12279, "pos": 20}, {"at": 12713, "pos": 80}, {"at": 13113, "pos": 20}, {"at": 13447, "pos": 80}, {"at": 13947, "pos": 20}, {"at": 14281, "pos": 80}, {"at": 14581, "pos": 20}, {"at": 15048, "pos": 80}, {"at": 15382, "pos": 20}, {"at": 15749, "pos": 80}, {"at": 16116, "pos": 20}, {"at": 16517, "pos": 80}, {"at": 16917, "pos": 20}, {"at": 17217, "pos": 80}, {"at": 17551, "pos": 20}, {"at": 17918, "pos": 80}, {"at": 18318, "pos": 20}, {"at": 18685, "pos": 80}, {"at": 19019, "pos": 20}, {"at": 19386, "pos": 80}, {"at": 19686, "pos": 20}, {"at": 20020, "pos": 70}, {"at": 20354, "pos": 20}, {"at": 20687, "pos": 70}, {"at": 21021, "pos": 20}, {"at": 21455, "pos": 50}, {"at": 21889, "pos": 20}, {"at": 22189, "pos": 50}, {"at": 22723, "pos": 20}, {"at": 23223, "pos": 60}, {"at": 23557, "pos": 10}, {"at": 23957, "pos": 60}, {"at": 24358, "pos": 60}, {"at": 24925, "pos": 60}, {"at": 25225, "pos": 10}, {"at": 25626, "pos": 50}, {"at": 26026, "pos": 10}, {"at": 26493, "pos": 50}, {"at": 26660, "pos": 10}, {"at": 26927, "pos": 50}, {"at": 27261, "pos": 10}, {"at": 27528, "pos": 50}, {"at": 27861, "pos": 10}, {"at": 28195, "pos": 50}, {"at": 28629, "pos": 10}, {"at": 28996, "pos": 50}, {"at": 29296, "pos": 10}, {"at": 29596, "pos": 50}, {"at": 30163, "pos": 10}, {"at": 30230, "pos": 10}, {"at": 30664, "pos": 50}, {"at": 31064, "pos": 10}, {"at": 31532, "pos": 50}, {"at": 31798, "pos": 40}, {"at": 31999, "pos": 70}, {"at": 32299, "pos": 20}, {"at": 32733, "pos": 70}, {"at": 33100, "pos": 20}, {"at": 33367, "pos": 60}, {"at": 33901, "pos": 20}, {"at": 34301, "pos": 70}, {"at": 34601, "pos": 20}, {"at": 34968, "pos": 60}, {"at": 35369, "pos": 20}, {"at": 35736, "pos": 60}, {"at": 36103, "pos": 20}, {"at": 36470, "pos": 60}, {"at": 36803, "pos": 20}, {"at": 37137, "pos": 60}, {"at": 37504, "pos": 20}, {"at": 37938, "pos": 60}, {"at": 38338, "pos": 20}, {"at": 38672, "pos": 60}, {"at": 39072, "pos": 20}, {"at": 39506, "pos": 60}, {"at": 39840, "pos": 20}, {"at": 40207, "pos": 60}, {"at": 40507, "pos": 20}, {"at": 41208, "pos": 50}, {"at": 41508, "pos": 10}, {"at": 41842, "pos": 50}, {"at": 42175, "pos": 10}, {"at": 42476, "pos": 50}, {"at": 42910, "pos": 10}, {"at": 43176, "pos": 50}, {"at": 43443, "pos": 10}, {"at": 43677, "pos": 50}, {"at": 44011, "pos": 10}, {"at": 44244, "pos": 50}, {"at": 44344, "pos": 10}, {"at": 44511, "pos": 50}, {"at": 44745, "pos": 10}, {"at": 45112, "pos": 40}, {"at": 45779, "pos": 10}, {"at": 46847, "pos": 0}], "range": 100}';
    const h = LoadString(testFile);
    this.hapticsCommands = h!.Commands as FunscriptCommand[];
    this.commands = HapticCommandToButtplugMessage.HapticCommandToButtplugMessage(h!.Commands);
    this.commandTimes = Array.from(this.commands.keys());
  }
}
