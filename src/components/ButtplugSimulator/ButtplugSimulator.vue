<template>
  <div class="simulator-component">
    <div class="simulator-container">
      <fleshlight-launch-simulator-component
        v-if="fleshlightMode"
        :paused="this.paused"
        :currentMessages="this.currentMessages">
      </fleshlight-launch-simulator-component>
      <vibrator-simulator-component
        v-if="!fleshlightMode"
        :paused="this.paused"
        :currentMessages="this.currentMessages"
        :vibratorImage="this.vibratorImageURL">
      </vibrator-simulator-component>
    </div>

    <div class="simulator-button-container">
      <div v-for="mode in this.modes"
           class="simulator-button"
           @click="onModeChange(mode)">
        <img :src="mode.imageurl"
             class="simulator-button-image">
      </div>
    </div>

  </div>
</template>

<script lang="ts" src="./ButtplugSimulator.ts">
</script>

<style lang="css">

 .simulator-component {
   flex-grow: 1;
   flex-shrink: 0;
   display: flex;
   flex-direction: column;
   background: #fff;
   min-width: 300px;
 }

 .simulator-container {
   flex-grow: 1;
   flex-shrink: 0;
   border-bottom: 1px solid #000;
   display: flex;
 }

 .simulator-button-container {
   clear: both;
   height: 48px;
   display: flex;
   margin: auto;
   cursor: pointer;
 }

 .simulator-button {
   height: 48px;
   width: 48px;
 }

 .simulator-button-image {
   margin: auto;
   min-height: 48px;
   max-height: 48px;
   min-width: auto;
	 image-rendering: -moz-crisp-edges;
	 image-rendering: -o-crisp-edges;
	 image-rendering: -webkit-optimize-contrast;
	 image-rendering: pixelated;
 }
</style>
