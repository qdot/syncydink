<template>
  <div id="video-encoder">
    <div id="graph">
      <div id="graph-x-axis">
      </div>
      <div id="graph-body">
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
