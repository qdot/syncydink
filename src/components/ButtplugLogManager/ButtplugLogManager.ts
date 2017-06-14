import Vue from 'vue';
import { Prop, Model, Component } from 'vue-property-decorator'

@Component
export default class ButtplugLogManager extends Vue {
  @Prop()
  logMessages: Array<string>;

  @Model()
  logLevel: string = "Off";

  LogLevelChange() {
    this.$emit('loglevel', this.logLevel);
  }
}
