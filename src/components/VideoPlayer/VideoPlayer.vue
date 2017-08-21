<template>
  <div id="video-player" class="full-screen">
    <div>
      <video-player
        id="videojs-player"
        ref="videoPlayer"
        v-show="this.show2DVideo"
        :options="playerOptions"
        @play="onPlayerPlay($event)"
        @pause="onPlayerPause($event)">
      </video-player>
    </div>
    <div id="vr-player" v-if="this.showVRVideo">
      <a-scene embedded>
      </a-scene>
    </div>
  </div>
</template>

<script lang="ts" src="./VideoPlayer.ts">
</script>

<style lang="css">
 .full-screen {
   width: 100vw;
   height: 100vh;
 }

 .half-screen {
   width: 100vw;
   height: 50vh;
 }

 .full-screen-android {
   width: 100vw;
   height: 84vh;
 }

 .half-screen-android {
   width: 100vw;
   height: 42vh;
 }
</style>

<style src="video.js/dist/video-js.min.css" lang="css">
</style>
