import Vue from "vue";
import { Component, Model, Prop, Watch } from "vue-property-decorator";
import { ButtplugDeviceMessage, FleshlightLaunchFW12Cmd, SingleMotorVibrateCmd } from "buttplug";
import HapticCommandToButtplugMessage from "./HapticsToButtplug";
import { HapticCommand, HapticFileHandler, LoadFile, FunscriptCommand } from "haptic-movie-file-reader";
import { Player } from "video.js";
import IVideoComponent from "./IVideoComponent";
import VideoPlayer from "../VideoPlayer/VideoPlayer";
import VideoPlayerComponent from "../VideoPlayer/VideoPlayer.vue";

@Component({
  components: {
    VideoPlayerComponent,
  },
})
export default class HapticVideoPlayer extends Vue {
  @Prop()
  private videoFile: File;

  private internalVideoFile: File | null = null;

  @Prop()
  private hapticsFile: File;

  @Prop()
  private vrMode: boolean;

  private currentPlayer: IVideoComponent = (this.$refs.videoPlayer as VideoPlayer);
  private isPaused: boolean = true;
  private haveVideoFile: boolean = false;
  private lastIndexRetrieved: number = -1;
  private lastTimeChecked: number = 0;

  // Map with entries stored by time
  private commands: Map<number, ButtplugDeviceMessage[]> = new Map();
  private commandTimes: number[] = [];

  @Watch("videoFile")
  private onVideoFileChange() {
    this.haveVideoFile = true;
    process.nextTick(() => {
      // At this point we'll definitely as a video player
      this.currentPlayer = (this.$refs.videoPlayer as VideoPlayer);
      this.internalVideoFile = this.videoFile;
    });
  }

  @Watch("hapticsFile")
  private onHapticsFileChange() {
    LoadFile(this.hapticsFile).then((h: HapticFileHandler) => {
      this.commands = HapticCommandToButtplugMessage.HapticCommandToButtplugMessage(h.Commands);
      this.commandTimes = Array.from(this.commands.keys());
    });
  }

  private onPlay() {
    this.isPaused = false;
    this.runHapticsLoop();
  }

  private onPause() {
    this.isPaused = true;
    this.$emit("videoPaused");
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
      this.$emit("hapticsEvent", this.commands.get(this.commandTimes[this.lastIndexRetrieved]));
      if (!this.isPaused) {
        this.runHapticsLoop();
      }
    });
  }
}
