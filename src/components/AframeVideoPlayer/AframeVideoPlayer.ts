import Vue from "vue";
import { Component, Model, Prop, Watch } from "vue-property-decorator";
import videojs from "video.js";
import "aframe";
const asc = require("aframe-stereo-component");

@Component({
})
export default class AframeVideoPlayer extends Vue {
  @Prop({default: null})
  private currentPlayer: videojs.Player | null;
  private vrControlButton: videojs.Component | null = null;
  private videoElementId: string | null = null;

  public mounted() {
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
    if (this.currentPlayer) {
      this.OnCurrentPlayerChange();
    }
  }

  @Watch("currentPlayer")
  public OnCurrentPlayerChange() {
    this.vrControlButton =
      this.currentPlayer!
      .getChild("controlBar")!
      .addChild("vrButton", { id: "vr-aframe-button", text: "VR" }, 12);
    this.vrControlButton.el().innerHTML = this.vrControlButton.el().innerHTML + "<b>VR</b>";

    const videoElement = this.currentPlayer!.el().querySelector("video");
    if (videoElement === undefined || videoElement === null) {
      console.log("Can't find video element for aframe setup?");
      return;
    }
    this.videoElementId = videoElement.id;
  }

  public beforeDestroy() {
    this.currentPlayer!.getChild("controlBar")!.removeChild(this.vrControlButton!);
    this.vrControlButton = null;
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
