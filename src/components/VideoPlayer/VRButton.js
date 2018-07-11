const videojs = require("video.js");

var Button = videojs.getComponent('Button');

// Extend default
export var VRButton = videojs.extend(Button, {
  //constructor: function(player, options) {
  constructor: function() {
    let a = arguments;
    a["id"] = "vr-aframe-button";
    Button.apply(this, a);
    //this.addClass('vjs-chapters-button');
    console.log(a);
    this.addClass('a-enter-vr-button');
    this.controlText("VR");
  },

  handleClick: function() {
    document.querySelector('a-scene').enterVR();
  }
});
