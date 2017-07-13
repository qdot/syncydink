<template>
  <div id="player">
    <input type="file" accept="video/*" @change="onVideoFileChange"/>
    <input type="file" accept="*" @change="onHapticsFileChange"/>
    <div id="video-player">
      <video-player  ref="videoPlayer"
                     :options="playerOptions"
                     @timeupdate="onPlayerTimeupdate($event)"
                     @ready="playerReadied">
      </video-player>
    </div>
  </div>
</template>

<script lang="ts" src="./SyncyDinkVideo.ts">
</script>

<style lang="css">
 #player {
   width: 100%;
   height: 100%;
 }
</style>

<style src="video.js/dist/video-js.min.css" lang="css">
</style>
