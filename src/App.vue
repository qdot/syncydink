<template>
  <div id="app">
    <v-touch
      id="gesture-wrapper"
      @swiperight="SideNavOpen"
      @swipeleft="SideNavClose">
      <header>
        <transition name="slide-fade">
          <div id="sidetab-aligner" v-if="!this.leftSideNavOpened">
            <div id="sidetab-arrow" @click="ToggleLeftSideNav">
              <md-icon>play_arrow</md-icon>
            </div>
            <div id="sidetab" @click="ToggleLeftSideNav">
            </div>
          </div>
        </transition>
        <patreon-button></patreon-button>
      </header>
      <div id="video-container">
        <div v-if="!this.hasOpenedMenu" class="select-message">
          <p>Click on the tab on the left or swipe right to select movie/haptics files and connect to Buttplug.</p>
        </div>
        <div class="video-simulator-container" v-if="haveVideoFile || showEncoder || showSimulator">
          <video-player-component
            id="video-player"
            ref="videoPlayer"
            v-if="haveVideoFile"
            :videoFile="this.videoFile"
            :videoMode="this.videoMode"
            :videoHeight="this.videoHeight"
            :loopVideo="this.loopVideo"
            :desiredPlayTime="this.desiredPlayTime"
            @videoPlaying="onPlay"
            @videoPaused="onPause"
            @timeUpdate="onTimeUpdate"
            @videoLoaded="onVideoLoaded"
          />
          <buttplug-simulator-component
            id="buttplug-simulator"
            v-if="showSimulator"
            :paused="this.paused"
            :currentMessages="this.currentMessages"
          />
        </div>
        <video-encoder-component
          id="video-encoder"
          ref="videoEncoder"
          v-if="showEncoder"
          :hapticsCommands="this.hapticsCommands"
          :currentPlayTime="this.currentPlayTime"
          @play="onPlay"
          @pause="onPause"
          @timeUpdate="onTimeUpdate"
          @inputTimeUpdate="onInputTimeUpdate"
          @dragStart="onDragStart"
          @dragStop="onDragStop"
        />
      </div>
      <md-sidenav
        layout="column"
        class="md-left"
        id="left-side-nav-element"
        ref="leftSideNav"
        @open="OnLeftSideNavOpen"
        @close="OnLeftSideNavClose">
        <md-tabs md-centered>
          <md-tab md-label="Video">
            <div class="sidebar-form">
              <md-subheader>Video</md-subheader>
              <md-input-container class="syncydink-nav-file-input">
                <md-file
                  accept="video/mp4,video/x-m4v,video/*"
                  placeholder="Click to select video file"
                  @selected="onVideoFileChange" />
              </md-input-container>
              <md-checkbox
                v-model="loopVideo"
                @change="onLoopVideoChange($event)" checked>Loop Video</md-checkbox>
              <div>
                <md-subheader>Video Mode</md-subheader>
                <md-list>
                  <md-list-item><md-radio v-model="videoMode" id="video-mode-2d" name="video-mode-group" md-value="2d" class="md-primary" selected>2D</md-radio></md-list-item>
                  <md-list-item><md-radio v-model="videoMode" id="video-mode-vr" name="video-mode-group" md-value="split" class="md-primary">2D/VR Split (Buggy!)</md-radio></md-list-item>
                  <md-list-item><md-radio v-model="videoMode" id="video-mode-vr" name="video-mode-group" md-value="vr" class="md-primary">VR</md-radio></md-list-item>
                </md-list>
              </div>
            </div>
            <md-divider />
            <div class="sidebar-form">
              <md-subheader>Haptics</md-subheader>
              <md-input-container class="syncydink-nav-file-input">
                <md-file
                  accept="*"
                  placeholder="Click to select haptics file"
                  @selected="onHapticsFileChange" />
              </md-input-container>
              <md-checkbox
                @change="onShowTimelineChange($event)">Show Haptics Timeline</md-checkbox>
              <md-checkbox
                @change="onShowSimulatorChange($event)">Show Haptics Simulator</md-checkbox>
              <div v-if="this.hapticCommandsSize != 0">
                <ul class="haptics-info">
                  <li># of Haptic Commands Loaded: {{ this.hapticCommandsSize }}</li>
                  <li>Haptics Type: {{ this.hapticCommandsType }}</li>
                </ul>
              </div>
            </div>
          </md-tab>
          <md-tab md-label="Buttplug">
            <buttplug-panel
              ref="buttplugPanel"
              @deviceconnected="OnDeviceConnected"
              @devicedisconnected="OnDeviceDisconnected"
            />
          </md-tab>
          <md-tab md-label="About">
            <md-list class="md-double-line">
              <md-list-item><b>Syncydink Version 20170829</b></md-list-item>
              <md-list-item><div class="md-list-text-container">Developed By<a href="https://metafetish.com">Metafetish</a></div></md-list-item>
              <md-list-item><div class="md-list-text-container">Need help?<a href="https://metafetish.club/t/tutorial-syncydink-v20170821/82">Tutorial available!</a></div></md-list-item>
              <md-list-item><div class="md-list-text-container">Open Source!<a href="https://github.com/metafetish/syncydink">Code available on Github</a></div></md-list-item>
              <md-list-item><div class="md-list-text-container">We Like Money!<a href="https://patreon.com/qdot">Visit Our Patreon</a></div></md-list-item>
            </md-list>
          </md-tab>
        </md-tabs>
      </md-sidenav>
    </v-touch>
  </div>
</template>

<script lang="ts" src="./App.ts">
</script>

<style src="vue-material/dist/vue-material.css"></style>
<style src="../static/css/video-js.5.4.6.min.css"></style>

<style lang="css">
 @font-face {
   font-family: 'Material Icons';
   font-style: normal;
   font-weight: 400;
   src: local('Material Icons'),
   local('MaterialIcons-Regular'),
   url(../static/fonts/MaterialIcons-Regular.woff2) format('woff2');
 }

 .material-icons {
   font-family: 'Material Icons';
   font-weight: normal;
   font-style: normal;
   font-size: 24px;  /* Preferred icon size */
   display: inline-block;
   line-height: 1;
   text-transform: none;
   letter-spacing: normal;
   word-wrap: normal;
   white-space: nowrap;
   direction: ltr;

   /* Support for all WebKit browsers. */
   -webkit-font-smoothing: antialiased;
   /* Support for Safari and Chrome. */
   text-rendering: optimizeLegibility;

   /* Support for Firefox. */
   -moz-osx-font-smoothing: grayscale;

   /* Support for IE. */
   font-feature-settings: 'liga';
 }

 html, body {
   margin: 0;
   padding: 0;
   display: flex;
   flex: 1;
 }

 body {
   background-image:url(../static/images/syncydinklogo.svg);
   background-repeat: no-repeat;
   background-position: center;
   display: flex;
 }

 #app {
   display: flex;
   flex: 1;
   font-size: 16px;
   font-weight: 400;
   text-align: left;
   text-transform: none;
   font-family: Roboto,Noto Sans,Noto,sans-serif;
   -webkit-font-smoothing: antialiased;
   -moz-osx-font-smoothing: grayscale;
   color: #2c3e50;
 }

 #video-container {
   display: flex;
   flex: 1;
   flex-direction: column;
   justify-content: space-between;
 }

 #video-player {
   flex: 1 1 auto;
 }

 #video-encoder {
   flex: 1 0 auto;
 }

 /* Make our touch wrapper div take up the whole screen, but also make it
    fixed so that we don't have problems with readjustment snapping */
 #gesture-wrapper {
   display: flex;
   flex: 1;
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

 .sidebar-form {
   margin-left: 5px;
 }

 .sidebar-form .md-checkbox {
   margin-left: 10px;
 }

 .sidebar-form .md-list-item-container {
   min-height: 36px;
 }

 .sidebar-form .md-radio {
   margin-top: 8px;
   margin-bottom: 8px;
 }

 #sidetab-aligner {
   height: 100vh;
   display: flex;
   align-items: center;
   justify-content: center;
	 left: 0px;
	 position: fixed;
   z-index: 1000;
   pointer-events: none;
 }

 #sidetab {
	 background: #000;
   border: 2px solid #000;
	 height: 75px;
   left: 0;
	 width: 25px;
   border-top-right-radius: 15px;
   border-bottom-right-radius: 15px;
	 margin: 0;
	 padding: 0;
	 position: fixed;
	 display: block;
   z-index: 1001;
   cursor: pointer;
   pointer-events: all;
 }

 #sidetab-arrow {
   color: #fff;
   margin: auto;
   text-align: right;
   z-index: 1002;
   cursor: pointer;
   pointer-events: all;
 }

 .syncydink-nav-file-input {
   max-width: 95%;
   margin: auto;
 }

</style>
