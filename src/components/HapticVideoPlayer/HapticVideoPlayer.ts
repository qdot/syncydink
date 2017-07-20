import { ButtplugDeviceMessage, FleshlightLaunchFW12Cmd, SingleMotorVibrateCmd } from "buttplug";
import Vue from "vue";
import { Component, Model, Prop, Watch } from "vue-property-decorator";
import HapticCommandToButtplugMessage from "./HapticsToButtplug";
const videoPlayer = require("vue-video-player").videoPlayer;
import { HapticCommand, HapticFileHandler, LoadFile, FunscriptCommand } from "haptic-movie-file-reader";
import { Player } from "video.js";

@Component({
  components: {
    videoPlayer,
  },
})
export default class HapticVideoPlayer extends Vue {
  @Prop()
  private videoFile: File;

  @Prop()
  private hapticsFile: File;

  private haveVideoFile: boolean = false;
  private lastIndexRetrieved: number = -1;
  private lastTimeRetrieved: number = 0;

  private playerOptions = {
    language: "en",
    muted: true,
    playbackRates: [0.7, 1.0, 1.5, 2.0],
    playsinline: true,
    sources: [{
    }],
    start: 0,
  };

  private sources = [{}];

  // Map with entries stored by time
  private commands: Map<number, ButtplugDeviceMessage[]> = new Map();
  private commandTimes: number[] = [];

  @Watch("videoFile")
  private onVideoFileChange() {
    this.haveVideoFile = true;
    this.playerOptions.sources = [{
      src: URL.createObjectURL(this.videoFile),
      type: "video/mp4",
    }];
  }

  @Watch("hapticsFile")
  private onHapticsFileChange() {
    LoadFile(this.hapticsFile).then((h: HapticFileHandler) => {
      this.commands = HapticCommandToButtplugMessage.HapticCommandToButtplugMessage(h.Commands);
      this.commandTimes = Array.from(this.commands.keys());
    });
  }

  private onPlayerPlay(player: Player) {
    this.runHapticsLoop(player);
  }

  private onPlayerPause(player: Player) {
    this.$emit("videoPaused");
  }

  private onPlayerSeek(player: Player) {
    console.log("resetting");
    // Any time we seek, reset our last known position and recalculate.
    this.lastIndexRetrieved = -1;
  }

  private runHapticsLoop(player: Player) {
    window.requestAnimationFrame(() => {
      // If we paused before this fired, just return
      if (player.paused() || this.commands.size === 0) {
        return;
      }
      const currentTimeInMs = Math.floor(player.currentTime() * 1000);
      if (this.lastIndexRetrieved + 1 > this.commandTimes.length) {
        // We're at the end of our haptics data
        return;
      }
      if (currentTimeInMs <= this.commandTimes[this.lastIndexRetrieved + 1]) {
        this.runHapticsLoop(player);
        return;
      }
      // There are faster ways to do this.
      while (currentTimeInMs > this.commandTimes[this.lastIndexRetrieved + 1]) {
        this.lastIndexRetrieved += 1;
      }
      this.$emit("hapticsEvent", this.commands.get(this.commandTimes[this.lastIndexRetrieved]));
      if (!player.paused()) {
        this.runHapticsLoop(player);
      }
    });
  }
}
