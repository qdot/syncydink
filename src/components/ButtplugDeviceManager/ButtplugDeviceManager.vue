<template>
  <div id="buttplug-device-manager">
    <md-list>
      <md-list-item
        v-for="device in devices"
        v-bind:value="device"
        :key="device.Id"
        class="buttplug-device-checkbox">
        <md-checkbox>{{ device.Index + ": " + device.Name }}</md-checkbox>
      </md-list-item>
    </md-list>
    <md-button
      @click="ScanningClicked"
      model="ScanningText"
      class="md-raised md-primary">{{ ScanningText }}</md-button>
    <span v-show="IsScanning">
      <md-spinner :md-size="40" md-indeterminate />
    </span>
  </div>
</template>

<script lang="ts" src="./ButtplugDeviceManager.ts">
</script>

<style lang="css">
 .buttplug-device-manager label {
   font-size: 14px;
 }

</style>
