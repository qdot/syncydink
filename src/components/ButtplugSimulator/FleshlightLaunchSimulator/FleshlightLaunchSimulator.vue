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
   display: flex;
   flex: 1;
   background: #fff;
 }

 div.c-fleshlight img {
	 image-rendering: -moz-crisp-edges;
	 image-rendering: -o-crisp-edges;
	 image-rendering: -webkit-optimize-contrast;
	 image-rendering: pixelated;
 }

 div.c-fleshlight .o-fleshlight {
   position: relative;
	 height: 77%;
   flex-grow: 1;
 }

 div.c-fleshlight .o-ruler {
   flex: 0;
 }
</style>
