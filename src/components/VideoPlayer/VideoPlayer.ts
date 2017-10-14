import Vue from "vue";
import { Component, Model, Prop, Watch } from "vue-property-decorator";
const videoPlayer = require("vue-video-player").videoPlayer;
import { Player } from "video.js";
// Have to bring in aframe here to make sure we initialize before our
// component.
import "aframe";
const asc = require("aframe-stereo-component");

@Component({
  components: {
    videoPlayer,
  },
})
export default class VideoPlayer extends Vue {
  @Prop()
  private videoFile: File;
  @Prop()
  private videoMode: string = "2d";
  @Prop()
  private videoHeight: number;
  @Prop()
  private desiredPlayTime: number;
  @Prop()
  private loopVideo: boolean;
  @Prop()
  private currentPlayTime: number;

  private videoElementId: string | null = null;
  private currentPlayer: Player | null = null;
  private show2DVideo: boolean = true;
  private showVRVideo: boolean = false;
  private fullScreenClass: string = "full-screen";
  private halfScreenClass: string = "half-screen";

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
    const videojs = document.querySelector("#twod-player");
    if (videojs !== null) {
      videojs.classList.add(this.fullScreenClass);
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

  @Watch("videoHeight")
  private onHeightUpdate() {
    if (!this.currentPlayer) {
      return;
    }
    this.currentPlayer.height(this.videoHeight);
  }

  @Watch("loopVideo")
  private onLoopVideoChange() {
    if (!this.currentPlayer) {
      return;
    }
    this.playerOptions.loop = this.loopVideo;
    this.onVideoFileChange();
  }

  private updateVRSource() {
    const videojs = document.getElementById("twod-player")!;
    const vr = document.getElementById("vr-player")!;
    switch (this.videoMode) {
    case "2d":
      videojs.classList.remove(this.halfScreenClass);
      videojs.classList.add(this.fullScreenClass);
      this.currentPlayer!.height(this.videoHeight);
      return;
    case "split":
      this.show2DVideo = true;
      // Make the video frame take half the window, VR take the other half. Hacky.
      videojs.classList.remove(this.fullScreenClass);
      videojs.classList.add(this.halfScreenClass);
      this.currentPlayer!.height(videojs.offsetHeight);
      vr.classList.remove(this.fullScreenClass);
      vr.classList.add(this.halfScreenClass);
      break;
    case "vr":
      this.show2DVideo = false;
      videojs!.classList.remove(this.halfScreenClass);
      videojs!.classList.remove(this.fullScreenClass);
      vr.classList.remove(this.halfScreenClass);
      vr.classList.add(this.fullScreenClass);
      break;
    }
    if (vr === null) {
      return;
    }
    if (!AFRAME.components.hasOwnProperty("stereo")) {
      AFRAME.registerComponent("stereo", asc.stereo_component);
      AFRAME.registerComponent("stereocam", asc.stereocam_component);
    }
    process.nextTick(() => {
      const scene = document.querySelector("a-scene");
      const camera = document.createElement("a-camera");
      // Objects here need to be cast to any, otherwise typescript gets angry
      // about not being able to discern their shape. So what was that anna was
      // saying about these type systems being more trouble than they are
      // help...
      camera.setAttribute("position", "0 0 10");
      camera.setAttribute("stereocam", { eye: "left" } as any);
      scene.appendChild(camera);
      const leftEye = document.createElement("a-entity");
      leftEye.setAttribute("geometry", {
        primitive: "sphere",
        radius: 100,
        segmentsHeight: 64,
        segmentsWidth: 64,
      } as any);
      leftEye.setAttribute("scale", "-1 1 1");
      leftEye.setAttribute("material", {
        shader: "flat",
        src: "#" + this.videoElementId} as any);
      leftEye.setAttribute("stereo", {
        eye: "left",
        mode: "half"} as any);
      scene.appendChild(leftEye);
      const rightEye = document.createElement("a-entity");
      rightEye.setAttribute("geometry", {
        primitive: "sphere",
        radius: 100,
        segmentsHeight: 64,
        segmentsWidth: 64,
      } as any);
      rightEye.setAttribute("scale", "-1 1 1");
      rightEye.setAttribute("material", {
        shader: "flat",
        src: "#" + this.videoElementId} as any);
      rightEye.setAttribute("stereo", {
        eye: "right",
        mode: "half"} as any);
      scene.appendChild(rightEye);
    });
  }

  @Watch("videoMode")
  private onVRModeChange() {
    switch (this.videoMode) {
    case "2d":
      this.show2DVideo = true;
      this.showVRVideo = false;
      break;
    case "split":
      this.show2DVideo = true;
      this.showVRVideo = true;
      break;
    case "vr":
      this.show2DVideo = false;
      this.showVRVideo = true;
      break;
    }
    process.nextTick(() => this.updateVRSource());
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
    this.currentPlayer!.height(document.getElementById("twod-player")!.offsetHeight);
    this.updateVRSource();
    this.$emit("videoLoaded", this.currentPlayer!.duration() * 1000);
  }

  private onPlayerPlay(player: Player) {
    this.currentPlayer = player;
    this.$emit("videoPlaying");
    this.runTimeUpdateLoop();
  }

  private onPlayerPause(player: Player) {
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
