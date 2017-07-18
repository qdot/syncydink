<template>
  <div id="haptic-video-player">
    <div id="video-player"
         v-if="haveVideoFile">
      <video-player
        ref="videoPlayer"
        :options="playerOptions"
        @play="onPlayerPlay($event)"
        @pause="onPlayerPause($event)">
      </video-player>
    </div>
  </div>
</template>

<script lang="ts" src="./HapticVideoPlayer.ts">
</script>

<style lang="css">
 #player {
   width: 100%;
   height: 100%;
 }

 #vjs_video_3 {
   height: 100vh;
 }
</style>

<style src="video.js/dist/video-js.min.css" lang="css">
</style>
