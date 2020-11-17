import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
import VFileInput from "./components/VFileInput/VFileInput.vue";

const AppConfig = require("../dist/appconfig.json");

import { ButtplugClientDevice, ButtplugDeviceMessage, ButtplugMessage } from "buttplug";
import { HapticCommand, KiirooCommand, HapticFileHandler, LoadFile, LoadString,
         FunscriptCommand } from "haptic-movie-file-reader";

import HapticCommandToButtplugMessage from "./utils/HapticsToButtplug";
import VideoPlayerComponent from "./components/VideoPlayer/VideoPlayer.vue";
import VideoEncoderComponent from "./components/VideoEncoder/VideoEncoder.vue";
import PatreonButtonComponent from "./components/PatreonButton/PatreonButton.vue";

import * as Mousetrap from "mousetrap";
import { ButtplugPanelComponent } from "vue-buttplug-material-component";

@Component({
  components: {
    VFileInput,
    VideoPlayerComponent,
    VideoEncoderComponent,
    "patreon-button": PatreonButtonComponent,
  },
})
export default class App extends Vue {

  // Application configuration
  private config: object = AppConfig;

  // Sidenav/UI properties
  private leftSideNavOpened: boolean = false;
  private isDragging: boolean = false;
  private menuOpened: boolean = false;

  // Video selection properties
  private loopVideo: boolean = true;
  private vrMode: boolean = false;
  private videoFile: File | string | null = null;
  private currentPlayTime: number = 0;

  // Haptic selection properties
  private showHapticsTimeline: boolean = false;
  private showSimulator: boolean = false;
  private hapticsCommands: FunscriptCommand[] = [];
  private commands: Map<number, ButtplugDeviceMessage[]> = new Map();
  private commandTimes: number[] = [];
  private hapticsFile: File | null = null;
  private hapticCommandsSize: number = 0;
  private hapticCommandsType: string = "";
  private paused: boolean = true;
  private lastIndexRetrieved: number = -1;
  private lastTimeChecked: number = 0;
  private desiredPlayTime: number = 0;
  private currentMessages: ButtplugMessage[] = [];

  // Buttplug properties
  private devices: ButtplugClientDevice[] = [];

  /////////////////////////////////////
  // Component and UI methods
  /////////////////////////////////////

  public mounted() {
    // Horrible hack since buggyfill doesn't work for android chrome. Just lose
    // like 16 units from viewport height. Remove this once the android fix
    // lands in the buggyfill.
    if (/Android/i.test(navigator.userAgent)) {
      document.getElementById("gesture-wrapper")!.style.height = "84vh";
    }
    Mousetrap.bind("esc", () => this.ToggleLeftSideNav());
    const $app = document.querySelector("#app");
    $app.ondragover = this.OnDragOver;
    $app.ondrop = this.OnFileDropped;
    // this.loadHapticsTestData();
  }

  private SideNavOpen() {
    if (this.isDragging) {
      return;
    }
    this.menuOpened = true;
  }

  private SideNavClose() {
    if (this.isDragging) {
      return;
    }
    this.menuOpened = false;
  }

  private ToggleLeftSideNav() {
    this.menuOpened = !this.menuOpened;
  }

  private onDragStart() {
    this.isDragging = true;
  }

  private onDragStop() {
    this.isDragging = false;
  }

  @Watch("showHapticsTimeline")
  private OnShowHapticsTimeline() {
    process.nextTick(() => window.dispatchEvent(new Event("resize")));
  }

  /////////////////////////////////////
  // Buttplug Event Handlers
  /////////////////////////////////////

  private OnDeviceConnected(aDevice: ButtplugClientDevice) {
    this.devices.push(aDevice);
  }

  private OnDeviceDisconnected(aDevice: ButtplugClientDevice) {
    this.devices = this.devices.filter((device) => device.Index !== aDevice.Index);
  }

  private OnDragOver(event: DragEvent) {
    event.preventDefault();
  }

  private OnFileDropped(event: DragEvent) {
    event.preventDefault();
    if (!event || !event.dataTransfer) {
      return;
    }
    const aFile = event.dataTransfer.items[0].getAsFile();
    if (!aFile) {
      return;
    }
    const isVideoFile = /video/.test(aFile.type);
    // Load as a video file when the file MIME type matches
    if (isVideoFile) {
      this.SetVideoFile(aFile);
    } else {
      this.SetHapticsFile(aFile);
    }
  }

  private SetVideoFile(aFile: File) {
    this.videoFile = aFile;
  }

  private SetVideoURL(aURL: string) {
    this.videoFile = aURL;
  }

  /////////////////////////////////////
  // Haptic Event Methods/Handlers
  /////////////////////////////////////

  private SetHapticsFile(aFile: File) {
    this.hapticsFile = aFile;
    LoadFile(this.hapticsFile).then((h: HapticFileHandler) => {
      this.hapticsCommands = h.Commands as FunscriptCommand[];
      this.commands = HapticCommandToButtplugMessage.HapticCommandToButtplugMessage(h.Commands);
      this.commandTimes = Array.from(this.commands.keys());
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
            if (device.AllowedMessages.indexOf(aMsg.Type.name) === -1) {
              continue;
            }
            (this.$refs.buttplugPanel as any).SendDeviceMessage(device, aMsg);
          }
        }
      }
      if (!this.paused) {
        this.runHapticsLoop();
      }
    });
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
