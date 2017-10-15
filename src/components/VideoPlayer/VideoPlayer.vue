<template>
  <div>
    <div id="twod-player">
      <video-player
        id="videojs-player"
        ref="videoPlayer"
        v-show="this.show2DVideo"
        :options="playerOptions"
        @play="onPlayerPlay($event)"
        @pause="onPlayerPause($event)"
        @loadeddata="onPlayerReady($event)">
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
   flex: 1;
 }

 .half-screen {
   width: 100%;
   height: 50%;
 }
</style>

<style src="video.js/dist/video-js.min.css" lang="css">
</style>
