import { Device } from "buttplug";
import Vue from "vue";
import { Component, Model, Prop } from "vue-property-decorator";

@Component
export default class ButtplugDeviceManager extends Vue {
  @Prop()
  private devices: Device[];
}
