<template>
  <div id="buttplug-panel">
    <div class="bp-config-area">
      <buttplug-connection-manager-component
        v-on:connect="Connect" />
    </div>
    <div class="bp-config-area">
      <buttplug-log-manager-component
        v-bind:logMessages="logMessages"
        v-on:loglevel="SetLogLevel"/>
    </div>
    <div class="bp-config-area">
      <buttplug-device-manager-component
        v-bind:devices="devices"
        v-on:startScanning="StartScanning"
        v-on:stopScanning="StopScanning" />
    </div>
  </div>
</template>

<script lang="ts" src="./ButtplugPanel.ts">
</script>

<style>
 #buttplug-panel {
   width: 95%;
 }
</style>
