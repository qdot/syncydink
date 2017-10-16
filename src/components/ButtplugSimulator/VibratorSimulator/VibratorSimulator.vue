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
   background: #fff;
   display: flex;
   align-items: center;
   justify-content: center;
   flex: 1;
 }

 .vibrator-image {
   flex: 1;
   display: flex;
 }

 .vibrator-image img {
   flex: 1;
   padding: 20px;
   max-height: 100%;
   width: auto;
   image-rendering: -moz-crisp-edges;
	 image-rendering: -o-crisp-edges;
	 image-rendering: -webkit-optimize-contrast;
	 image-rendering: pixelated;
 }
</style>
