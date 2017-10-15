<template>
  <div class="vibrator-simulator-component">
    <div class="vibrator-image">
      <img :src="vibratorImage" :style="vibratorStyle">
    </div>
  </div>
</template>

<script lang="ts" src="./VibratorSimulator.ts">
</script>

<style lang="css">
 .vibrator-simulator-component {
   width: 100%;
   height: 100%;
   background: #fff;
   display: flex;
   align-items: center;
   justify-content: center;
 }

 .vibrator-image-container {
   width: 100%;
 }

 .vibrator-simulator-component img {
   position: relative;
   width: 200px;
   height: auto;
   image-rendering: -moz-crisp-edges;
	 image-rendering: -o-crisp-edges;
	 image-rendering: -webkit-optimize-contrast;
	 image-rendering: pixelated;
 }
</style>
