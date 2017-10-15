import Vue from "vue";
import { Component, Model, Prop, Watch } from "vue-property-decorator";
import { ButtplugMessage, ButtplugDeviceMessage, SingleMotorVibrateCmd } from "buttplug";
import * as TWEEN from "@tweenjs/tween.js";

@Component({})
export default class VibratorSimulator extends Vue {
  @Prop()
  private vibratorImage: any = require("../../../../static/images/hush-250.png");
  @Prop()
  private currentMessages: ButtplugMessage[];
  @Prop()
  private paused: boolean;
  private moveRadius: number;
  private currentPosition: any = { x: 0, y: 0 };
  private vibratorStyle: any = {
    top: "0px",
    right: "0px",
  };

  @Watch("paused")
  private onPauseChange() {
    if (!this.paused) {
      requestAnimationFrame(this.animate);
    }
  }

  @Watch("currentMessages")
  private move() {
    if (this.currentMessages.length === 0) {
      return;
    }
    for (const msg of this.currentMessages) {
      if (msg.getType() !== "SingleMotorVibrateCmd") {
        return;
      }
      this.moveRadius = (msg as SingleMotorVibrateCmd).Speed;
      requestAnimationFrame(this.animate);
    }
  }

  private animate(timestamp: number) {
    if (!TWEEN.update() || this.paused) {
      new TWEEN.Tween(this.currentPosition)
        .to({x: Math.floor(Math.random() * this.moveRadius * 20),
             y: Math.floor(Math.random() * this.moveRadius * 20)}
            , 34)
        .start();
      return;
    }
    this.vibratorStyle.top = `${this.currentPosition.x}px`;
    this.vibratorStyle.right = `${this.currentPosition.y}px`;
    requestAnimationFrame(this.animate);
  }

}
