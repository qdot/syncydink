<template>
  <div>
    <div>
      <video-player
        id="videojs-player"
        ref="videoPlayer"
        :options="playerOptions"
        @play="onPlayerPlay($event)"
        @pause="onPlayerPause($event)">
      </video-player>
    </div>
    <div id="vr-player" class="half-screen" v-if="vrMode">
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
</style>

<style src="video.js/dist/video-js.min.css" lang="css">
</style>
