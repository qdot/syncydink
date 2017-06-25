import Vue from 'vue';
import { Prop, Model, Component } from 'vue-property-decorator';
const videoPlayer = require('vue-video-player').videoPlayer;

@Component({
  components: {
    videoPlayer
  }
})
export default class SyncyDinkVideo extends Vue {
  playerOptions = {
    // component options
    start: 0,
    playsinline: false,
    // videojs options
    muted: true,
    language: 'en',
    playbackRates: [0.7, 1.0, 1.5, 2.0],
    sources: [{
      //type: "video/mp4",
      //src: "http://localhost:8080/jakeline1gb.mp4"
      //src: "file:///home/qdot/Downloads/jakeline1gb.mp4"
    }],
  };

  sources = [{}];

  onFileChange(event : any) {
    var files = event.target.files || event.dataTransfer.files;
    if (!files.length)
    {
      return;
    }
    this.playerOptions.sources = [{
        type: "video/mp4",
        src: URL.createObjectURL(files[0])
        //src: "http://localhost:8080/jakeline1gb.mp4"
        //src: "file:///home/qdot/Downloads/jakeline1gb.mp4"
    }];
  }
  onPlayerCanplay(player : any) {
    console.log("can play");
    player.updateSrc(this.sources);
  }
  onPlayerPlay(player : any) {
    console.log("can play");
    player.updateSrc(this.sources);
    // console.log('player play!', player)
  }
  onPlayerPause(player : any) {
    // console.log('player pause!', player)
  }
  onPlayerTimeupdate(player: any) {
    console.log('player time:', player);
  }
  // or listen state event
  playerStateChanged(playerCurrentState : any) {
    console.log('player current update state', playerCurrentState)
  }

  // player is ready
  playerReadied(player : any) {
    console.log('the player is readied', player)
    // you can use it to do something...
    // player.[methods]
  }
}
