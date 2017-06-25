import Vue from 'vue';
import { Component } from 'vue-property-decorator'

@Component
export default class ButtplugConnectionManager extends Vue {
  address: string = "ws://192.168.123.2:12345/buttplug";
  Connect() {
    this.$emit('connect', this.address);
  }

}
