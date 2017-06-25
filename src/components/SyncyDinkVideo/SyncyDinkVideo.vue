<template>
  <div id="player">
    <input type="file" accept="video/*" @change="onFileChange"/>
    <video-player  ref="videoPlayer"
                   :options="playerOptions"
                   @timeupdate="onPlayerTimeupdate($event)"
                   @ready="playerReadied">
    </video-player>
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
