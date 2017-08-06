<template>
  <div id="haptic-video-player">
    <video-player-component
      ref="videoJSPlayer"
      v-bind:videoFile="this.internalVideoFile"
      v-bind:vrMode="this.vrMode"
      v-on:videoPlaying="onPlay"
      v-on:videoPaused="onPause"
      v-if="haveVideoFile"></video-player-component>
  </div>
</template>

<script lang="ts" src="./HapticVideoPlayer.ts">
</script>

<style lang="css">
 #haptic-video-player {
   width: 100%;
   height: 100%;
 }
</style>
