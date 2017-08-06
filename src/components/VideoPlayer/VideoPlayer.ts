import Vue from "vue";
import { Component, Model, Prop, Watch } from "vue-property-decorator";
const videoPlayer = require("vue-video-player").videoPlayer;
import { Player } from "video.js";
import IVideoComponent from "../HapticVideoPlayer/IVideoComponent";
// Have to bring in aframe here to make sure we initialize before our
// component.
import "aframe";
const asc = require("aframe-stereo-component");

@Component({
  components: {
    videoPlayer,
  },
})
export default class VideoPlayer extends Vue implements IVideoComponent {
  @Prop()
  private videoFile: File;
  @Prop()
  private vrMode: boolean = false;
  private videoElementId: string | null = null;
  private currentPlayer: Player | null = null;

  private playerOptions = {
    language: "en",
    muted: true,
    playbackRates: [0.7, 1.0, 1.5, 2.0],
    playsinline: true,
    sources: [{
    }],
    start: 0,
  };

  public mounted() {
    const videojs = document.querySelector(".video-js");
    if (videojs !== null) {
      videojs.classList.add("full-screen");
    }
  }

  public CurrentTimeInMS(): number {
    if (this.currentPlayer === null) {
      return 0;
    }
    return Math.floor(this.currentPlayer.currentTime() * 1000);
  }

  private updateVRSource() {
    const videojs = document.querySelector(".video-js");
    if (!this.vrMode) {
      if (videojs !== null) {
        videojs.classList.remove("half-screen");
        videojs.classList.add("full-screen");
      }
      return;
    }
    if (!AFRAME.components.hasOwnProperty("stereo")) {
      AFRAME.registerComponent("stereo", asc.stereo_component);
      AFRAME.registerComponent("stereocam", asc.stereocam_component);
    }
    // Make the video frame take half the window, VR take the other half. Hacky.
    if (videojs !== null) {
      videojs.classList.add("half-screen");
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

  @Watch("vrMode")
  private onVRModeChange() {
    this.updateVRSource();
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
    process.nextTick(() => {
      // Get the ID for our video tag, so we can add it as a material source to
      // aframe if VR is selected.
      const playerElement = (this.$refs.videoPlayer as Vue).$el;
      const videoElement = playerElement.querySelector("video");
      if (videoElement === undefined || videoElement === null) {
        console.log("Can't find video element for aframe setup?");
        return;
      }
      this.videoElementId = videoElement.id;
      this.updateVRSource();
    });
  }

  private onPlayerPlay(player: Player) {
    this.currentPlayer = player;
    this.$emit("videoPlaying");
  }

  private onPlayerPause(player: Player) {
    this.currentPlayer = player;
    this.$emit("videoPaused");
  }
}
