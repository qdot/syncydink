import Vue from "vue";
import { Component, Model, Prop, Watch } from "vue-property-decorator";
import videojs from "video.js";
import "videojs-hotkeys";
const vjsyoutube = require("./videojs-youtube");
const videoPlayer = require("vue-video-player").videoPlayer;

@Component({
  components: {
    videoPlayer,
  },
})
export default class VideoPlayer extends Vue {
  @Prop({default: null})
  private videoFile!: File | string | null;
  @Prop({default: 0})
  private desiredPlayTime!: number;
  @Prop({default: false})
  private loopVideo!: boolean;
  @Prop({default: 0})
  private currentPlayTime!: number;
  @Prop({default: false})
  private vrMode: boolean;

  private vrControlButton: videojs.Component | null = null;
  private currentPlayer: videojs.Player | null = null;

  private showPlaybackSpeed: boolean = false;
  private playbackSpeed: number = 1;

  // This is a combination of videojs's Playback options plus some extra stuff
  // from vue-video-player, so it has to be an any instead of a
  // videojs.PlaybackOptions until we derive something that supports both.
  private playerOptions: any = {
    language: "en",
    muted: true,
    playbackRates: [0.7, 1.0, 1.5, 2.0],
    playsinline: true,
    sources: [{}],
    start: 0,
    loop: this.loopVideo,
    plugins: {
      hotkeys: {
        enableVolumeScroll: false,
        skipInitialFocus: true,
        enableInactiveFocus: false,
        captureDocumentHotkeys: true,
        documentHotkeysFocusElementFilter: (e: HTMLElement) => {
          const tagName = e.tagName.toLowerCase();
          return e.id === "content" || tagName === "body" || tagName === "video";
        },

        forwardKey: ({ key }: KeyboardEvent) => {
          return key === "ArrowRight" || key === "ArrowUp";
        },
        rewindKey: ({ key }: KeyboardEvent) => {
          return key === "ArrowLeft" || key === "ArrowDown";
        },

        seekStep: ({ key }: KeyboardEvent) => {
          console.log("key - - - - - ", key);
          // mimic mpv seek behavior, 5s for left/right, 60s for up/down
          if (key === "ArrowUp" || key === "ArrowDown") {
            return 60;
          } else {
            return 5;
          }
        },

        customKeys: {
          // mimic mpv the playback behavior, change playback rate by 10%
          incPlayback: {
            key: ({ key }: KeyboardEvent) => key === "]",
            handler: () => this.setPlaybackSpeed(0.1),
          },
          decPlayback: {
            key: ({ key }: KeyboardEvent) => key === "[",
            handler: () => this.setPlaybackSpeed(-0.1),
          },
        },
      },
    },
  };

  public mounted() {
    // If we're mounted, it means a video file has been loaded, but that won't
    // trigger the options update. Do it manually.
    this.onVideoFileChange();
    window.addEventListener("resize", this.onHeightUpdate);
    vjsyoutube.addYoutubePlugin(videojs);
  }

  public beforeDestroy() {
    window.removeEventListener("resize", this.onHeightUpdate);
  }

  // There has to be a CSS way of doing this, but I can't figure out the right
  // combination of vjs-fluid class plus other flex attributes to make it work
  // with the encoder, so we're going with a hacky js solution for now.
  private onHeightUpdate() {
    if (!this.currentPlayer) {
      return;
    }
    const containerHeight = document.getElementById("video-encoder-container")!.clientHeight;
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
    if (typeof(this.videoFile) === "string") {
      this.playerOptions.techOrder = ["youtube", "html5"];
      this.playerOptions.sources = [{
        type: "video/youtube",
        src: this.videoFile,
      }];
    } else {
      this.playerOptions.techOrder = ["html5"];
      this.playerOptions.sources = [{
        src: URL.createObjectURL(this.videoFile),
        type: "video/mp4",
      }];
    }
    // The videojs-youtube plugin never fires loadeddata, and vue-video-player
    // doesn't expose loadedmetadata, so here we are, handling it ourselves.
    process.nextTick(() => {
      this.currentPlayer = (this.$refs.videoPlayer as any).player;
      this.currentPlayer!.on("durationchange", () => {
        this.onPlayerReady();
      });
    });
  }

  private onPlayerReady() {
    console.log("vue player ready!");
    // Get the ID for our video tag, so we can add it as a material source to
    // aframe if VR is selected.
    const playerElement = (this.$refs.videoPlayer as Vue).$el;
    this.currentPlayer = (this.$refs.videoPlayer as any).player;
    this.currentPlayer!.height(document.getElementById("video-container")!.offsetHeight);
    this.$emit("videoLoaded", this.currentPlayer!.duration() * 1000);
    console.log(`duration: ${this.currentPlayer!.duration() * 1000}`);
    this.onHeightUpdate();
  }

  private onPlayerPlay(player: videojs.Player) {
    if (this.currentPlayer !== player) {
      this.onPlayerReady();
    }
    this.$emit("videoPlaying");
    this.runTimeUpdateLoop();
  }

  private onPlayerPause(player: videojs.Player) {
    if (this.currentPlayer !== player) {
      this.onPlayerReady();
    }
    this.$emit("videoPaused");
  }

  private setPlaybackSpeed(playbackSpeedChange: number) {
    const player = this.currentPlayer;
    if (!player) {
      return;
    }
    // not a great way to handle the playback type here
    const currentSpeed = player.playbackRate() as any;
    if (currentSpeed > 0.1 || playbackSpeedChange > 0) {
      // set the playback speed, then show a speed notification over the video
      const newSpeed = +(currentSpeed + playbackSpeedChange).toPrecision(2);
      player.playbackRate(newSpeed);
      this.playbackSpeed = newSpeed;
      this.showPlaybackSpeed = true;

      // hide the speed notification after 3 seconds
      const id = setInterval(() => this.showPlaybackSpeed = true, 10);
      setTimeout(() => {
        clearInterval(id);
        this.showPlaybackSpeed = false;
      }, 3000);
    }
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

// Since aframe-video-player is a subcomponent, we can register it as part of
// our component here, then delay load it as needed.
Vue.component("aframe-video-player",
              () => import (/* webpackChunkName: "syncydinkvr" */ "../AframeVideoPlayer/AframeVideoPlayer.vue" ));
