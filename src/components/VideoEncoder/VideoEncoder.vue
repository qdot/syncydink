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
            <v-icon
              color="white" v-if="!this.hapticsPlaying" title="play haptics script" alt="">play_circle_outline</v-icon>
            <v-icon
              color="white" v-if="this.hapticsPlaying" title="pause haptics script" alt="">pause_circle_outline</v-icon>
          </li>
          <li @click="ToggleHapticsLooped">
            <v-icon
              color="white" v-if="this.hapticsLooped" title="haptics synced" alt="">sync</v-icon>
            <v-icon
              color="white" v-if="!this.hapticsLooped" title="haptics syncing disabled" alt="">sync_disabled</v-icon>
          </li>
          <li @click="ToggleHapticsLocked">
            <v-icon
              color="white" v-if="this.hapticsLocked" title="haptics editing enabled" alt="">lock_outline</v-icon>
            <v-icon
              color="white" v-if="!this.hapticsLocked" title="haptics editing disabled" alt="">lock_open</v-icon>
          </li>
          <li @click="ExportHaptics">
            <v-icon
              color="white" title="export haptics script" alt="">import_export</v-icon>
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
   max-height: 20px;
   background: #000;
 }

 #graph-x-axis text {
   color: #fff;
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
   /* The video encoder should be able to shrink, but allowing 
      it to grow causes it to take up too much space */
   flex-grow: 0;
   flex-shrink: 1;
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
   z-index: 1;
 }

 .encoder-button-bar ul > li {
   display: inline-block;
   /* Requires important here, otherwise vue-material enacts a weird margin rule. */
   margin: 0px !important;
   padding: 0px 3px 0px 3px;
   color: #ccc;
   border-right: 1px solid #fff;
   cursor: pointer;
   text-align: center;
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
