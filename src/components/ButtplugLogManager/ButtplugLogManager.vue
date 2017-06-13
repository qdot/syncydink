<template>
  <div id="buttplug-log-manager">
    <textarea name="buttplug-log-area"></textarea>
    <select name="buttplug-log-level">
      <option value="Off">Off</option>
      <option value="Fatal">Fatal</option>
      <option value="Error">Error</option>
      <option value="Warn">Warn</option>
      <option value="Info">Info</option>
      <option value="Debug">Debug</option>
      <option value="Trace">Trace</option>
    </select>
  </div>
</template>

<script lang="ts" src="./ButtplugLogManager.ts">
</script>

<style lang="less" src="./ButtplugLogManager.less">
</style>
