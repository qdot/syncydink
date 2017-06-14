<template>
  <div id="buttplug-connection-manager">
    <label>Buttplug Server Address</label>
    <input v-model="address"/><br />
    <button @click="Connect">Connect</button>
  </div>
</template>

<script lang="ts" src="./ButtplugConnectionManager.ts">
</script>

<style lang="less" src="./ButtplugConnectionManager.less">
</style>
