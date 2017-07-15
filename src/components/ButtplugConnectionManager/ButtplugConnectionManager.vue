<template>
  <div id="buttplug-connection-manager" class="buttplug-sidebar">
    <md-input-container>
      <label id="form-label">Server Address</label>
      <md-input class="form-text md-block" v-model="address"/>
    </md-input-container>
    <md-button class="md-raised md-primary" @click="Connect">Connect</md-button>
  </div>
</template>

<script lang="ts" src="./ButtplugConnectionManager.ts">
</script>

<style lang="css">
</style>
