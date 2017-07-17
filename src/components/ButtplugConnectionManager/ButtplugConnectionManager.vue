<template>
  <div id="buttplug-connection-manager" class="buttplug-sidebar">
    <md-input-container v-if="!isConnected">
      <label id="form-label">Client Name</label>
      <md-input class="form-text md-block" v-model="clientName" placeholder="Syncydink Video Client"/>
    </md-input-container>
    <md-input-container v-if="!isConnected">
      <label id="form-label">Server Address</label>
      <md-input class="form-text md-block" v-model="address"/>
    </md-input-container>
    <md-button class="md-raised md-primary" @click="Connect">{{ ConnectText }}</md-button>
  </div>
</template>

<script lang="ts" src="./ButtplugConnectionManager.ts">
</script>

<style lang="css">
</style>
