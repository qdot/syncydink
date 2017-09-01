<template>
  <div id="video-encoder">
    <div id="graph">
    </div>
  </div>
</template>

<script lang="ts" src="./VideoEncoder.ts">
</script>

<style lang="css">
 #graph div {
   font: 10px sans-serif;
   background-color: steelblue;
   text-align: right;
   padding: 3px;
   margin: 1px;
   color: white;
 }

 #line {
   stroke: steelblue;
   fill: none;
   stroke-width: 3px;
   shape-rendering: auto;
 }
</style>
