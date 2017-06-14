import Vue from 'vue';
import { Component } from 'vue-property-decorator'

@Component
export default class ButtplugConnectionManager extends Vue {
  address: string = "";
  Connect() {
    this.$emit('connect', this.address);
  }

}
