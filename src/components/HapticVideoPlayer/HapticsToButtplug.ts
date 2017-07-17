import { FleshlightLaunchFW12Cmd } from "buttplug";
import { FunscriptCommand, HapticFileHandler } from "haptic-movie-file-reader";

export default class HapticCommandToButtplugMessage {
  public static FunScriptToFleshlightLaunchCommands(aCommands: FunscriptCommand[]):
  Map<number, FleshlightLaunchFW12Cmd> {
    let lastTime: number = 0;
    let lastPosition: number = 0;

    // TODO: We should make a way to change this somehow
    const range: number = 90;
    const commands: Map<number, FleshlightLaunchFW12Cmd> = new Map();
    console.log("Got " + aCommands.length + " commands");
    for (const aCommand of aCommands) {
      // if this is our first element, save off and continue.
      if (lastTime < 0) {
        lastTime = aCommand.Time;
        lastPosition = aCommand.Position;
        continue;
      }

      const currentTime = aCommand.Time;
      const currentPosition = aCommand.Position;

      const duration = currentTime - lastTime;

      const positionDelta = Math.abs(currentPosition - lastPosition);
      let speed = Math.floor(25000 * Math.pow(((duration * 90) / positionDelta), -1.05));

      // Clamp speed on 20 <= x <= 80 so we don't crash or break the launch.
      speed = Math.min(Math.max(speed, 5), 90);

      const positionGoal = Math.floor(((currentPosition / 99) * range) + ((99 - range) / 2));
      // Set movement to happen at the PREVIOUS time, since we're moving toward
      // the goal position with this command, and want to arrive there by the
      // current time.
      commands.set(lastTime, new FleshlightLaunchFW12Cmd(speed, positionGoal));
      lastTime = aCommand.Time;
      lastPosition = aCommand.Position;
    }
    console.log("Created " + commands.size + " commands");
    return commands;
  }
}
