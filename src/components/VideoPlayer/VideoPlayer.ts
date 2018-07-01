import Vue from "vue";
import { Component, Model, Prop, Watch } from "vue-property-decorator";
const videoPlayer = require("vue-video-player").videoPlayer;
import videojs from "video.js";
import "aframe";
const asc = require("aframe-stereo-component");
const vrButton = require("./VRButton");

@Component({
  components: {
    videoPlayer,
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

  @Watch("vrMode")
  private SetupVRMode() {
    if (this.vrMode) {
      if (!AFRAME.components.hasOwnProperty("stereo")) {
        AFRAME.registerComponent("stereo", asc.stereo_component);
        AFRAME.registerComponent("stereocam", asc.stereocam_component);
      }
      const Button = videojs.getComponent("Button");
      const OnVRClick = () => {
        this.RunVRMode();
      };
      const VRButton = (videojs as any).extend(videojs.getComponent("Button"), {
        // tslint:disable-next-line object-literal-shorthand
        constructor: function() {
          (Button as any).apply(this, arguments);
          this.controlText("VR");
        },
        // tslint:disable-next-line object-literal-shorthand
        handleClick: function() {
          OnVRClick();
        },
      });

      videojs.registerComponent("vrButton", VRButton);
      this.vrControlButton =
        this.currentPlayer!
        .getChild("controlBar")!
        .addChild("vrButton", { id: "vr-aframe-button", text: "VR" }, 12);
      this.vrControlButton.el().innerHTML = this.vrControlButton.el().innerHTML + "<b>VR</b>";
    } else {
      this.currentPlayer!.getChild("controlBar")!.removeChild(this.vrControlButton!);
      this.vrControlButton = null;
    }
  }

  private RunVRMode() {
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
      npot: true,
      side: "back",
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
      npot: true,
      side: "back",
      src: "#" + this.videoElementId} as any);
    rightEye.setAttribute("stereo", {
      eye: "right",
      mode: "half"} as any);
    scene.appendChild(rightEye);
    document.querySelector("a-scene").enterVR();
  }
}
