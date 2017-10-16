<template>
  <div class="c-fleshlight">
    <div class="fl-div-ruler">
      <img
        src="../../../../static/images/ruler.png"
        class="o-ruler">
    </div>
    <div class="fl-div">
      <img
        src="../../../../static/images/fleshlight.png"
        class="o-fleshlight"
        id="fleshlight-image"
        v-bind:style="fleshlightStyle">
    </div>
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
   flex: 1;
	 image-rendering: -moz-crisp-edges;
	 image-rendering: -o-crisp-edges;
	 image-rendering: -webkit-optimize-contrast;
	 image-rendering: pixelated;
 }

 div.c-fleshlight .o-fleshlight {
   flex: 1;
   position: relative;
   padding-left: 5px;
   padding-right: 5px;
   height: 77%;
 }

 div.c-fleshlight .fl-div {
   display: flex;
   flex: 10;
 }

 div.c-fleshlight .fl-div-ruler {
   display: flex;
   flex-grow: 1;
 }

 div.c-fleshlight .o-ruler {
   flex: 0;
 }
</style>
