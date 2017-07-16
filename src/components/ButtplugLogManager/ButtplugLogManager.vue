<template>
  <div id="buttplug-log-manager">
    <textarea>{{ logMessages.join("\n") }}</textarea>
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

<style lang="css">
 #buttplug-log-manager textarea {
   width:28em;
   height:20em;
   overflow: auto;
   font-size: 9px;
   white-space: pre;
 }
</style>
