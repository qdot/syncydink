<template>
  <div id="buttplug-device-manager">
    <select size="10">
      <option v-for="device in devices" v-bind:value="device">
        {{ device.Index + ": " + device.Name }}
      </option>
    </select>
    <button @click="$emit('startScanning')">Start Scanning</button><br/>
    <button @click="$emit('stopScanning')">Stop Scanning</button><br/>
  </div>
</template>

<script lang="ts" src="./ButtplugDeviceManager.ts">
</script>

<style lang="less" src="./ButtplugDeviceManager.less">
</style>
