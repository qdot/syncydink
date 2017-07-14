<template>
  <div id="app">
    <Slideout menu="#menu" panel="#panel" :toggleSelectors="['.toggle-button']">
      <nav id="menu">
        <buttplug-panel-component
          v-bind:buttplugMessage='this.buttplugMessage' />
      </nav>
      <main id="panel">
        <header>
          <div>
            <button class="toggle-button">
              <icon name="bars" scale="2"></icon>
            </button>
          </div>
        </header>
        <syncy-dink-video-component
          v-on:buttplugEvent="buttplugEvent"/>
      </main>
    </Slideout>
  </div>
</template>

<script lang="ts" src="./App.ts">
</script>

<style lang="css">
 html, body {
   margin: 0;
   padding: 0;
   height: 100%;
   width:100%
 }

 #app {
   font-size: 10pt;
   font-family: 'Avenir', Helvetica, Arial, sans-serif;
   -webkit-font-smoothing: antialiased;
   -moz-osx-font-smoothing: grayscale;
   color: #2c3e50;
   width: 100%;
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

 .slideout-menu {
   position: fixed;
   top: 0;
   bottom: 0;
   width: 256px;
   height: 100vh;
   overflow:hidden;
   -webkit-overflow-scrolling: touch;
   z-index: 0;
   display: none;
   background-color: #1D1F20;
   color: white;
 }

 .slideout-menu-left {
   left: 0;
 }

 .slideout-menu-right {
   right: 0;
 }

 .slideout-panel {
   background-color: #fff;
   color: white;
   position: relative;
   z-index: 1;
   will-change: transform;
   min-height: 100vh;
 }

 .slideout-open,
 .slideout-open body,
 .slideout-open .slideout-panel {
   overflow: hidden;
 }

 .slideout-open .slideout-menu {
   display: block;
 }
</style>
