import Vue from "vue";
import { Component } from "vue-property-decorator";
import VFileInput from "./components/VFileInput/VFileInput.vue";

const AppConfig = require("../dist/appconfig.json");

import { Device } from "buttplug";

@Component({
  components: {
    VFileInput,
  },
})
export default class App extends Vue {

  // Application configuration
  private config: object = AppConfig;

  // Sidenav/UI properties
  private leftSideNavOpened: boolean = false;
  private isDragging: boolean = false;
  private menuOpened: boolean = false;

  // Video selection properties
  private loopVideo: boolean = true;
  private videoMode: string = "2D";
  private videoTypes: string[] = ["2D", "Split", "VR"];

  // Haptic selection properties
  private showHapticsTimeline: boolean = false;
  private showSimulator: boolean = false;

  // Buttplug properties
  private devices: Device[] = [];

  /////////////////////////////////////
  // Component and UI methods
  /////////////////////////////////////

  public mounted() {
    // Horrible hack since buggyfill doesn't work for android chrome. Just lose
    // like 16 units from viewport height. Remove this once the android fix
    // lands in the buggyfill.
    if (/Android/i.test(navigator.userAgent)) {
      document.getElementById("gesture-wrapper")!.style.height = "84vh";
    }
    // this.loadHapticsTestData();
  }

  private SideNavOpen() {
    if (this.isDragging) {
      return;
    }
    this.menuOpened = true;
  }

  private SideNavClose() {
    if (this.isDragging) {
      return;
    }
    this.menuOpened = false;
  }

  private ToggleLeftSideNav() {
    this.menuOpened = !this.menuOpened;
  }

  private onDragStart() {
    this.isDragging = true;
  }

  private onDragStop() {
    this.isDragging = false;
  }

  /////////////////////////////////////
  // Buttplug Event Handlers
  /////////////////////////////////////

  private OnDeviceConnected(aDevice: Device) {
    this.devices.push(aDevice);
  }

  private OnDeviceDisconnected(aDevice: Device) {
    this.devices = this.devices.filter((device) => device.Index !== aDevice.Index);
  }

}
