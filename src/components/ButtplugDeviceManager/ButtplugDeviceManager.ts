import Vue from 'vue';
import { Prop, Model, Component } from 'vue-property-decorator'
import { Device } from 'buttplug';

@Component
export default class ButtplugDeviceManager extends Vue {
  @Prop()
  devices: Array<Device>;
}
