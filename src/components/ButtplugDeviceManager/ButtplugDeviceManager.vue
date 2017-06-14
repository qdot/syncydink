<template>
  <div id="buttplug-device-manager">
    <select size="10">
      <option v-for="device in devices" v-bind:value="device">
        {{ device.Index + ": " + device.Name }}
      </option>
    </select>
  </div>
</template>

<script lang="ts" src="./ButtplugDeviceManager.ts">
</script>

<style lang="less" src="./ButtplugDeviceManager.less">
</style>
