<template>
  <div class="c-fleshlight">
    <img
      src="../../../../static/images/ruler.png"
      class="o-ruler">
    <img
      src="../../../../static/images/fleshlight.png"
      class="o-fleshlight"
      id="fleshlight-image"
      v-bind:style="fleshlightStyle">
  </div>
</template>

<script lang="ts" src="./FleshlightLaunchSimulator.ts">
</script>

<style lang="css">
 div.c-fleshlight {
	 height: 100%;
	 width: auto;
	 line-height: 0;
   background: #fff;
   display: flex;
 }

 div.c-fleshlight img {
	 max-height: 100%;
	 image-rendering: -moz-crisp-edges;
	 image-rendering: -o-crisp-edges;
	 image-rendering: -webkit-optimize-contrast;
	 image-rendering: pixelated;
 }

 div.c-fleshlight .o-fleshlight {
	 position: relative;
	 width: auto;
	 height: 77%;
 }

 div.c-fleshlight .o-ruler {
	 width: auto;
	 height: 100%;
	 float: left;
 }
</style>
