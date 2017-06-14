<template>
  <div id="buttplug-log-manager">
    <select size="10">
      <option v-for="message in logMessages">
        {{ message }}
      </option>
    </select>
    <br/>
    <select v-model="logLevel" @change="LogLevelChange">
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
