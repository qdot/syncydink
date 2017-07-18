import { FleshlightLaunchFW12Cmd } from "buttplug";
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

  private _hapticsHandler: HapticFileHandler;
  private _commands: Map<number, FleshlightLaunchFW12Cmd> = new Map();
  private _latestTime: number = 0;

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
      this._hapticsHandler = h;
      const commands = this._hapticsHandler.Commands;
      if (commands[0].constructor.name === "FunscriptCommand") {
        this._commands =
          HapticCommandToButtplugMessage.FunScriptToFleshlightLaunchCommands(h.Commands as FunscriptCommand[]);
        this.$emit("hapticsLoaded", commands[0].constructor.name, this._commands.size);
      }
    });
  }

  private onPlayerPlay(player: Player) {
    this.runHapticsLoop(player);
  }

  private onPlayerPause(player: Player) {
    // TODO: Stop all devices
  }

  private runHapticsLoop(player: Player) {
    window.requestAnimationFrame(() => {
      if (this._hapticsHandler === undefined) {
        if (!player.paused()) {
          this.runHapticsLoop(player);
        }
        return;
      }
      const cmd: HapticCommand | undefined  =
        this._hapticsHandler.GetValueNearestTime(Math.floor(player.currentTime() * 1000));
      if (cmd === undefined || this._latestTime === cmd.Time) {
        if (!player.paused()) {
          this.runHapticsLoop(player);
        }
        return;
      }
      this._latestTime = cmd.Time;
      this.$emit("hapticEvent", cmd);
      this.$emit("buttplugEvent", this._commands.get(cmd.Time));
      if (!player.paused()) {
        this.runHapticsLoop(player);
      }
    });
  }

  // or listen state event
  // private playerStateChanged(playerCurrentState: Player) {
  // }

  // player is ready
  // private playerReadied(player: Player) {
  // }
}
