<template>
  <div id="player">
    <input type="file" accept="video/*" @change="onFileChange"/>
    <video-player  ref="videoPlayer"
                   :options="playerOptions"
                   title="you can listen some event if you need"
                   @play="onPlayerPlay($event)"
                   @pause="onPlayerPause($event)"
                   @ended="onPlayerEnded($event)"
                   @loadeddata="onPlayerLoadeddata($event)"
                   @waiting="onPlayerWaiting($event)"
                   @playing="onPlayerPlaying($event)"
                   @timeupdate="onPlayerTimeupdate($event)"
                   @canplay="onPlayerCanplay($event)"
                   @canplaythrough="onPlayerCanplaythrough($event)"
                   @statechanged="playerStateChanged($event)"
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
