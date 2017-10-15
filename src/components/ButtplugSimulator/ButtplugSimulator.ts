import Vue from "vue";
import { Component, Model, Prop, Watch } from "vue-property-decorator";
import { ButtplugMessage, ButtplugDeviceMessage, FleshlightLaunchFW12Cmd } from "buttplug";
import * as TWEEN from "@tweenjs/tween.js";
import FleshlightLaunchSimulatorComponent from "./FleshlightLaunchSimulator/FleshlightLaunchSimulator.vue";
import VibratorSimulatorComponent from "./VibratorSimulator/VibratorSimulator.vue";
const fleshlightSmallIcon = require("../../../static/images/fleshlight-small.png");
const hushSmallIcon = require("../../../static/images/hush-250.png");

@Component({
  components: {
    FleshlightLaunchSimulatorComponent,
    VibratorSimulatorComponent,
  },
})
export default class ButtplugSimulator extends Vue {

  @Prop()
  private currentMessages: ButtplugMessage[];
  @Prop()
  private paused: boolean;
  private modes: any = [
    {
      name: "Fleshlight Launch",
      imageurl: fleshlightSmallIcon,
    },
    {
      name: "Lovense Hush",
      imageurl: hushSmallIcon,
    },
  ];
  private fleshlightMode: boolean = true;

  private onModeChange(mode: any) {
    if (mode.name === "Fleshlight Launch") {
      this.fleshlightMode = true;
    } else {
      this.fleshlightMode = false;
    }
  }
}
