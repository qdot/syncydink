<template>
    <video-player
      class="vjs-big-play-centered"
      id="videojs-player"
      v-if="videoFile"
      ref="videoPlayer"
      :options="playerOptions"
      @play="onPlayerPlay($event)"
      @pause="onPlayerPause($event)"
      @loadeddata="onPlayerReady($event)">
    </video-player>
</template>

<script lang="ts" src="./VideoPlayer.ts">
</script>

<style src="video.js/dist/video-js.min.css" lang="css">
</style>
