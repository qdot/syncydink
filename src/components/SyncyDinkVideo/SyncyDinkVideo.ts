import Vue from 'vue';
import { Prop, Model, Component } from 'vue-property-decorator';
const videoPlayer = require('vue-video-player').videoPlayer;
import { HapticFileHandler, LoadString, LoadFile } from 'haptic-movie-file-reader';
import { Player } from 'video.js';

interface FileReaderEventTarget extends EventTarget {
    result:string
}

interface FileReaderEvent extends Event {
    target: FileReaderEventTarget;
    getMessage():string;
}

@Component({
  components: {
    videoPlayer,
  },
})
export default class SyncyDinkVideo extends Vue {
  private playerOptions = {
    // component options
    start: 0,
    playsinline: false,
    // videojs options
    muted: true,
    language: 'en',
    playbackRates: [0.7, 1.0, 1.5, 2.0],
    sources: [{
    }],
  };

  sources = [{}];

  _hapticsHandler : HapticFileHandler;

  onVideoFileChange(event : any) {
    var files = event.target.files || event.dataTransfer.files;
    if (!files.length)
    {
      return;
    }
    this.playerOptions.sources = [{
        type: "video/mp4",
        src: URL.createObjectURL(files[0])
    }];
  }

  onHapticsFileChange(event: any) {
    var files = event.target.files || event.dataTransfer.files;
    if (!files.length)
    {
      return;
    }
    LoadFile(files[0]).then((h : HapticFileHandler) => {
      this._hapticsHandler = h;
    });
  }

  onPlayerPause(player : any) {
    // TODO: Send stop messages to haptics devices
  }

  onPlayerTimeupdate(player: Player) {
    let cmd = this._hapticsHandler.GetValueNearestTime(Math.floor(player.currentTime() * 1000));
    this.$emit('hapticEvent', cmd);
  }

  // or listen state event
  playerStateChanged(playerCurrentState : Player) {
  }

  // player is ready
  playerReadied(player : Player) {
  }
}
