<template>
  <div id="video-encoder">
    <div id="graph">
      <div id="graph-x-axis">
      </div>
      <div id="graph-body">
      </div>
      <div class="encoder-button-bar">
        <ul>
          <li @click="ToggleHapticsPlayback">
            <md-icon
              v-if="!this.hapticsPlaying">play_circle_outline</md-icon>
            <md-icon
              v-if="this.hapticsPlaying">pause_circle_outline</md-icon>
          </li>
          <li @click="ToggleHapticsLooped">
            <md-icon
              v-if="this.hapticsLooped">sync</md-icon>
            <md-icon
              v-if="!this.hapticsLooped">sync_disabled</md-icon>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./VideoEncoder.ts">
</script>

<style lang="css">

 #graph div {
   display: flex;
 }

 #graph-x-axis {
   flex: 1 1 auto;
   min-height: 20px;
   background: #000;
 }

 #graph-x-axis text {
   stroke: #fff;
   fill: #fff;
 }

 #graph-x-axis tick {
   stroke: #fff;
   fill: #fff;
 }
 #graph-x-axis line {
   stroke: #fff;
   fill: #fff;
 }

 .graph-line {
   stroke: steelblue;
   stroke-width: 3px;
   shape-rendering: auto;
 }

 #graph-body {
   flex: 1 1 auto;
   min-height: 170px;
   background: #000;
 }

 #video-encoder {
   width: 100%;
   min-height: 120px;
 }

 #encoder-timeline {
   background: #000;
   stroke: #888;
   border: 1px solid #000;
 }

 #encoder-timeline text {
   stroke: none;
   fill: #fff;
   font-weight: bold;
 }

 .encoder-button-bar ul {
   height: 25px;
   width: 100%;
   background: #000;
   border-top: 1px solid #fff;
   clear: both;
   padding: 0px;
   margin: 0px;
 }

 .encoder-button-bar ul > li {
   display: inline-block;
   /* Requires important here, otherwise vue-material enacts a weird margin rule. */
   margin: 0px !important;
   padding: 0px 3px 0px 3px;
   color: #ccc;
   border-right: 1px solid #fff;
   cursor: pointer;
 }

 .encoder-button-bar ul > li:hover {
   color: #f00;
 }

 .domain {
   stroke: #fff;
 }

 .tick text {
   stroke: none;
   fill: #fff;
 }

 .play-head {
   stroke: #f00;
   stroke-width: 3px;
   shape-rendering: auto;
 }

</style>
