<template>
  <div id="app">
    <header>
      <div>
        <button class="toggle-button" @click="toggleLeftSidenav">
          <icon name="bars" scale="2"></icon>
        </button>
      </div>
    </header>
    <syncy-dink-video-component
      v-on:buttplugEvent="buttplugEvent"/>
    <md-sidenav class="md-left" ref="leftSidenav">
      <nav id="menu">
        <buttplug-panel-component
          v-bind:buttplugMessage='this.buttplugMessage' />
      </nav>
    </md-sidenav>
  </div>
</template>

<script lang="ts" src="./App.ts">
</script>

<style src="vue-material/dist/vue-material.css"></style>

<style lang="css">
 html, body {
   margin: 0;
   padding: 0;
   height: 100%;
   width:100%
 }

 #app {
   font-size: 16px;
   font-weight: 400;
   text-align: left;
   text-transform: none;
   font-family: Roboto,Noto Sans,Noto,sans-serif;
   -webkit-font-smoothing: antialiased;
   -moz-osx-font-smoothing: grayscale;
   color: #2c3e50;
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

 .md-input-container.md-has-value input {
   font-size:10pt;
 }

 md-sidenav,
 md-sidenav.md-locked-open,
 md-sidenav.md-closed.md-locked-open-add-active {
   min-width: 200px !important;
   width: 85vw !important;
   max-width: 400px !important;
 }
</style>
