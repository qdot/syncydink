<template>
  <div id="app">
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

<script lang="ts" src="./App.ts">
</script>

<style>
 html, body {
   margin: 0;
   padding: 0;
   height: 100%;
   width:100%
 }

 #app {
   font-family: 'Avenir', Helvetica, Arial, sans-serif;
   -webkit-font-smoothing: antialiased;
   -moz-osx-font-smoothing: grayscale;
   color: #2c3e50;
   width: 33%;
   height: 100%;
 }

 h1, h2 {
   font-weight: normal;
 }

 ul {
   list-style-type: none;
   padding: 0;
 }

 li {
   display: inline-block;
   margin: 0 10px;
 }

 a {
   color: #42b983;
 }

 .bp-config-area {
   border-radius: 20px;
   border: 5px #000000 solid;
   background: #bbbbbb;
   text-align: center;
   width: 100%;
   margin-bottom: 1%;
   padding-top: 10px;
   height: 30.333333%;
 }

 select {
   width: 90%;
 }

 input {
   width: 90%;
 }
</style>
