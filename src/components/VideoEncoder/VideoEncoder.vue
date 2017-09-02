<template>
  <div id="video-encoder">
    <div id="graph">
    </div>
  </div>
</template>

<script lang="ts" src="./VideoEncoder.ts">
</script>

<style lang="css">
 #video-encoder {
   width: 100%;
   height: 150px;
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

 .tick line {
   stroke: #fff;
 }

 .tick text {
   stroke: none;
   fill: #fff;
 }

 #axis line {
   stroke: #fff;
 }

 #axis path {
   stroke: #fff;
 }

 #graph div {
   font: 10px sans-serif;
   text-align: right;
   padding: 3px;
   margin: 1px;
   color: white;
 }

 .graph-line {
   stroke: steelblue;
   stroke-width: 3px;
   shape-rendering: auto;
 }
</style>
