import Vue from "vue";
import { Component, Model, Prop, Watch } from "vue-property-decorator";
import { ButtplugMessage, ButtplugDeviceMessage, FleshlightLaunchFW12Cmd } from "buttplug";
import * as TWEEN from "@tweenjs/tween.js";

@Component({})
export default class FleshlightLaunchSimulator extends Vue {
  private fleshlight: HTMLElement;
  private currentPosition: any = { x: 0, y: 0 };
  private lastPosition: number = 0;
  private fleshlightStyle: any = {
    bottom: "0%",
  };
  private pauseTime: number = -1;
  @Prop()
  private currentMessages: ButtplugMessage[];
  @Prop()
  private paused: boolean;

  public mounted() {
    this.fleshlight = document.getElementById("fleshlight-image")!;
  }

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
    for (const msg of this.currentMessages!) {
      if (msg.getType() !== "FleshlightLaunchFW12Cmd") {
        continue;
      }
      const flMsg: FleshlightLaunchFW12Cmd = msg as FleshlightLaunchFW12Cmd;
      const p = -((100 - flMsg.Position) * 0.22);
      const duration = this.moveDuration(flMsg.Position, flMsg.Speed);
      new TWEEN.Tween(this.currentPosition)
        .to({x: 0, y: p}, duration)
        .start();
      requestAnimationFrame(this.animate);
    }
  }

  private animate(timestamp: number) {
    if (!TWEEN.update() || this.paused) {
      return;
    }
    this.fleshlightStyle.bottom = `${this.currentPosition.y}%`;
    requestAnimationFrame(this.animate);
  }

  // positions returns the current position in percent (0-100).
  private position() {
    const bottomPx = parseFloat(this.fleshlight!.style.bottom!);
    const widgetHeightPx = document.getElementById("buttplug-simulator-component")!.clientHeight;
    const percentValue = bottomPx / widgetHeightPx * 100;
    return Math.round(percentValue / .22);
  }

  // moveDuration returns the time in milliseconds it will take to move
  // to position at speed.
  //
  // position: position in percent (0-100).
  // speed:    speed in percent (20-100).
  private moveDuration(position: number, speed: number) {
    const distance = Math.abs(position - this.lastPosition);
    this.lastPosition = position;
    return this.calcDuration(distance, speed);
  }

  // _calcDuration returns duration of a move in milliseconds for a given
  // distance/speed.
  //
  // distance: amount to move percent (0-100).
  // speed: speed to move at in percent (20-100).
  private calcDuration(distance: number, speed: number) {
    return Math.pow(speed / 25000, -0.95) / (90 / distance);
  }
}

// Some code in this file taken from https://github.com/funjack/launchcontrol
// MIT License:
/*
Lauchcontrol UI Fleshlight

https://github.com/funjack/launchcontrol

Copyright 2017 Funjack

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice,
this list of conditions and the following disclaimer in the documentation
and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its contributors
may be used to endorse or promote products derived from this software without
specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
