<template>
  <div id="app">
    <v-touch id="gesture-wrapper" v-on:swiperight="SideNavOpen" v-on:swipeleft="SideNavClose">
      <header>
        <div id="nav-icon" @click="ToggleLeftSidenav">
          <div id="nav-icon3" ref="navicon">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </header>
      <haptic-video-player-component
        v-on:hapticsEvent="onHapticsEvent"
        v-on:hapticsLoaded="onHapticsLoaded"
        v-on:videoPaused="onVideoPaused"
        v-bind:videoFile="this.videoFile"
        v-bind:hapticsFile="this.hapticsFile" />
      <md-sidenav
        layout="column"
        class="md-left"
        ref="leftSidenav"
        @open="NavIconOpen"
        @close="NavIconClose">
        <md-tabs md-centered>
          <md-tab md-label="Video">
            <md-input-container class="syncydink-nav-file-input">
              <md-file
                accept="video/*"
                placeholder="Click to select video file"
                @selected="onVideoFileChange" />
            </md-input-container>
            <md-input-container class="syncydink-nav-file-input">
              <md-file
                accept="*"
                placeholder="Click to select haptics file"
                @selected="onHapticsFileChange" />
            </md-input-container>
            <div v-if="this.hapticCommandsSize != 0">
              <ul class="haptics-info">
                <li># of Haptic Commands Loaded: {{ this.hapticCommandsSize }}</li>
                <li>Haptics Type: {{ this.hapticCommandsType }}</li>
              </ul>
            </div>
          </md-tab>
          <md-tab md-label="Buttplug">
            <buttplug-panel-component
              ref="buttplugPanel" />
          </md-tab>
        </md-tabs>
      </md-sidenav>
    </v-touch>
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
   height: 100vh;
   width: 100vw;
   font-size: 16px;
   font-weight: 400;
   text-align: left;
   text-transform: none;
   font-family: Roboto,Noto Sans,Noto,sans-serif;
   -webkit-font-smoothing: antialiased;
   -moz-osx-font-smoothing: grayscale;
   color: #2c3e50;
 }

 /* Make our touch wrapper div take up the whole screen, but also make it
    fixed so that we don't have problems with readjustment snapping */
 #gesture-wrapper {
   position: fixed;
   height: 100vh;
   width: 100vw;
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

 .md-tabs .md-tab  {
   padding: 0;
 }

 .haptics-info {
   font-size: 14px;
 }

 /* Taken from https://codepen.io/designcouch/pen/Atyop */

 #nav-icon3 {
   width: 60px;
   height: 45px;
   position: fixed;
   z-index:50;
   top: 20px;
   left: 20px;
   -webkit-transform: rotate(0deg);
   -moz-transform: rotate(0deg);
   -o-transform: rotate(0deg);
   transform: rotate(0deg);
   -webkit-transition: .5s ease-in-out;
   -moz-transition: .5s ease-in-out;
   -o-transition: .5s ease-in-out;
   transition: .5s ease-in-out;
   cursor: pointer;
 }

 #nav-icon3 span {
   display: block;
   position: absolute;
   height: 9px;
   width: 100%;
   background: #3f51b5;
   border-radius: 9px;
   opacity: 1;
   left: 0;
   -webkit-transform: rotate(0deg);
   -moz-transform: rotate(0deg);
   -o-transform: rotate(0deg);
   transform: rotate(0deg);
   -webkit-transition: .25s ease-in-out;
   -moz-transition: .25s ease-in-out;
   -o-transition: .25s ease-in-out;
   transition: .25s ease-in-out;
 }

 /* Icon 3 */

 #nav-icon3 span:nth-child(1) {
   top: 0px;
 }

 #nav-icon3 span:nth-child(2),#nav-icon3 span:nth-child(3) {
   top: 18px;
 }

 #nav-icon3 span:nth-child(4) {
   top: 36px;
 }

 #nav-icon3.open span:nth-child(1) {
   top: 18px;
   width: 0%;
   left: 50%;
 }

 #nav-icon3.open span:nth-child(2) {
   -webkit-transform: rotate(45deg);
   -moz-transform: rotate(45deg);
   -o-transform: rotate(45deg);
   transform: rotate(45deg);
 }

 #nav-icon3.open span:nth-child(3) {
   -webkit-transform: rotate(-45deg);
   -moz-transform: rotate(-45deg);
   -o-transform: rotate(-45deg);
   transform: rotate(-45deg);
 }

 #nav-icon3.open span:nth-child(4) {
   top: 18px;
   width: 0%;
   left: 50%;
 }

 .syncydink-nav-file-input {
   max-width: 95%;
   margin: auto;
 }
</style>
