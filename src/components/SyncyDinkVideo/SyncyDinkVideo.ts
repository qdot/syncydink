import Vue from "vue";
import { Component, Model, Prop } from "vue-property-decorator";
const videoPlayer = require("vue-video-player").videoPlayer;
import { HapticFileHandler, LoadFile, LoadString } from "haptic-movie-file-reader";
import { Player } from "video.js";

@Component({
  components: {
    videoPlayer,
  },
})
export default class SyncyDinkVideo extends Vue {
  private playerOptions = {
    language: "en",
    muted: true,
    playbackRates: [0.7, 1.0, 1.5, 2.0],
    playsinline: false,
    sources: [{
    }],
    start: 0,
  };

  private sources = [{}];

  private _hapticsHandler: HapticFileHandler;

  private onVideoFileChange(event: any) {
    const files = event.target.files || event.dataTransfer.files;
    if (!files.length) {
      return;
    }
    this.playerOptions.sources = [{
      src: URL.createObjectURL(files[0]),
      type: "video/mp4",
    }];
  }

  private onHapticsFileChange(event: any) {
    const files = event.target.files || event.dataTransfer.files;
    if (!files.length) {
      return;
    }
    LoadFile(files[0]).then((h: HapticFileHandler) => {
      this._hapticsHandler = h;
    });
  }

  private onPlayerPause(player: any) {
    // TODO: Send stop messages to haptics devices
  }

  private onPlayerTimeupdate(player: Player) {
    const cmd = this._hapticsHandler.GetValueNearestTime(Math.floor(player.currentTime() * 1000));
    this.$emit("hapticEvent", cmd);
  }

  // or listen state event
  // private playerStateChanged(playerCurrentState: Player) {
  // }

  // player is ready
  // private playerReadied(player: Player) {
  // }
}
