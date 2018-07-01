import Vue from "vue";
import { Component, Model, Prop, Watch } from "vue-property-decorator";
const videoPlayer = require("vue-video-player").videoPlayer;
import videojs from "video.js";
import AframeVideoPlayerComponent from "../AframeVideoPlayer/AframeVideoPlayer.vue";

@Component({
  components: {
    videoPlayer,
    AframeVideoPlayerComponent,
  },
})
export default class VideoPlayer extends Vue {
  @Prop({default: null})
  private videoFile!: File | null;
  @Prop({default: 0})
  private desiredPlayTime!: number;
  @Prop({default: false})
  private loopVideo!: boolean;
  @Prop({default: 0})
  private currentPlayTime!: number;
  @Prop({default: false})
  private vrMode: boolean;

  private vrControlButton: videojs.Component | null = null;
  private videoElementId: string | null = null;
  private currentPlayer: videojs.Player | null = null;

  private playerOptions = {
    language: "en",
    muted: true,
    playbackRates: [0.7, 1.0, 1.5, 2.0],
    playsinline: true,
    sources: [{}],
    start: 0,
    loop: this.loopVideo,
  };

  public mounted() {
    // If we're mounted, it means a video file has been loaded, but that won't
    // trigger the options update. Do it manually.
    this.onVideoFileChange();
    window.addEventListener("resize", () => {
      this.onHeightUpdate();
    });
  }

  // There has to be a CSS way of doing this, but I can't figure out the right
  // combination of vjs-fluid class plus other flex attributes to make it work
  // with the encoder, so we're going with a hacky js solution for now.
  private onHeightUpdate() {
    if (!this.currentPlayer) {
      return;
    }
    const containerHeight = document.getElementById("video-simulator-container")!.clientHeight;
    if (document.getElementById("video-encoder") !== null) {
      this.currentPlayer.height(containerHeight - document.getElementById("video-encoder")!.clientHeight);
    } else {
      this.currentPlayer.height(containerHeight);
    }
  }

  private CurrentTimeInMS(): number {
    if (this.currentPlayer === null) {
      return 0;
    }
    return Math.floor(this.currentPlayer.currentTime() * 1000);
  }

  @Watch("desiredPlayTime")
  private onAdvanceFrame() {
    if (this.currentPlayer === null) {
      return;
    }
    this.currentPlayer.currentTime(this.desiredPlayTime / 1000);
  }

  @Watch("loopVideo")
  private onLoopVideoChange() {
    if (!this.currentPlayer) {
      return;
    }
    this.playerOptions.loop = this.loopVideo;
    this.onVideoFileChange();
  }

  @Watch("videoFile")
  private onVideoFileChange() {
    if (this.videoFile === null) {
      return;
    }
    this.playerOptions.sources = [{
      src: URL.createObjectURL(this.videoFile),
      type: "video/mp4",
    }];
  }

  private onPlayerReady() {
    // Get the ID for our video tag, so we can add it as a material source to
    // aframe if VR is selected.
    const playerElement = (this.$refs.videoPlayer as Vue).$el;
    this.currentPlayer = (this.$refs.videoPlayer as any).player;
    const videoElement = playerElement.querySelector("video");
    if (videoElement === undefined || videoElement === null) {
      console.log("Can't find video element for aframe setup?");
      return;
    }
    this.videoElementId = videoElement.id;
    this.currentPlayer!.height(document.getElementById("video-container")!.offsetHeight);
    this.$emit("videoLoaded", this.currentPlayer!.duration() * 1000);
  }

  private onPlayerPlay(player: videojs.Player) {
    this.currentPlayer = player;
    this.$emit("videoPlaying");
    this.runTimeUpdateLoop();
  }

  private onPlayerPause(player: videojs.Player) {
    this.currentPlayer = player;
    this.$emit("videoPaused");
  }

  private runTimeUpdateLoop() {
    window.requestAnimationFrame(() => {
      if (this.currentPlayer!.paused()) {
        return;
      }
      this.$emit("timeUpdate", this.CurrentTimeInMS());
      this.runTimeUpdateLoop();
    });
  }
}
