import { ButtplugDeviceMessage, FleshlightLaunchFW12Cmd, SingleMotorVibrateCmd } from "buttplug";
import { FunscriptCommand, HapticFileHandler, HapticCommand } from "haptic-movie-file-reader";

export default class HapticCommandToButtplugMessage {

  public static HapticCommandToButtplugMessage(aCommands: HapticCommand[]): Map<number, ButtplugDeviceMessage[]> {
    let buttplugCommands = new Map<number, ButtplugDeviceMessage[]>();
    // Funscript conversion
    //
    // Funscript
    switch (aCommands[0].constructor.name) {
    case "FunscriptCommand": {
      const launchCommands =
        HapticCommandToButtplugMessage.FunScriptToFleshlightLaunchCommands(aCommands as FunscriptCommand[]);
      const vibratorCommands =
        HapticCommandToButtplugMessage.FunscriptToSingleMotorVibrateCommands(aCommands as FunscriptCommand[]);
      buttplugCommands = HapticCommandToButtplugMessage.ZipCommandMaps([launchCommands, vibratorCommands]);
    }
    }

    return buttplugCommands;
  }

  // Puts out a sorted command map, with commands at matching times merged.
  public static ZipCommandMaps(aCommandMaps: Array<Map<number, ButtplugDeviceMessage[]>>):
  Map<number, ButtplugDeviceMessage[]> {
    const commands = new Map<number, ButtplugDeviceMessage[]>();
    // Make an array of iterators to sorted maps
    const iters = aCommandMaps.map((aCommandMap) => aCommandMap.entries());
    // Store iter values
    const entries = iters.map((iter) => iter.next());
    let lowestTimeIndex = 0;
    let lowestTime = Number.MAX_SAFE_INTEGER;
    let done = true;
    let i;
    let entry;
    while (true) {
      lowestTimeIndex = 0;
      lowestTime = Number.MAX_SAFE_INTEGER;
      // Find the lowest time value
      for (i = 0; i < iters.length; i++) {
        if (entries[i].done) {
          continue;
        }
        if (entries[i].value[0] < lowestTime) {
          lowestTime = entries[i].value[0];
          lowestTimeIndex = i;
        }
      }
      if (commands.has(lowestTime)) {
        // If the time is already in the map, add command to value array
        commands.set(lowestTime, commands.get(lowestTime)!.concat(entries[lowestTimeIndex].value[1]));
      } else {
        // Otherwise, just insert it in the map
        commands.set(lowestTime, entries[lowestTimeIndex].value[1]);
      }
      entries[lowestTimeIndex] = iters[lowestTimeIndex].next();
      done = true;
      for (entry of entries) {
        if (!entry.done) {
          done = false;
          break;
        }
      }
      if (done) {
        break;
      }
    }
    return commands;
  }

  // For going from Funscript to Fleshlight Launch, we just follow funjack's
  // code, using the magic algorithm listed at
  //
  // https://godoc.org/github.com/funjack/launchcontrol/protocol/funscript
  private static FunScriptToFleshlightLaunchCommands(aCommands: FunscriptCommand[]):
  Map<number, ButtplugDeviceMessage[]> {
    let lastTime: number = 0;
    let lastPosition: number = 0;

    // TODO: We should make a way to change this somehow
    const range: number = 90;
    const commands: Map<number, ButtplugDeviceMessage[]> = new Map();
    let currentTime: number;
    let currentPosition: number;

    let timeDelta: number;

    let positionDelta: number;
    let speed: number;
    let positionGoal: number;
    for (const aCommand of aCommands) {
      // if this is our first element, save off and continue.
      if (lastTime < 0) {
        lastTime = aCommand.Time;
        lastPosition = aCommand.Position;
        continue;
      }

      currentTime = aCommand.Time;
      currentPosition = aCommand.Position;

      timeDelta = currentTime - lastTime;

      positionDelta = Math.abs(currentPosition - lastPosition);
      speed = Math.floor(25000 * Math.pow(((timeDelta * 90) / positionDelta), -1.05));

      // Clamp speed on 20 <= x <= 80 so we don't crash or break the launch.
      speed = Math.min(Math.max(speed, 5), 90);

      positionGoal = Math.floor(((currentPosition / 99) * range) + ((99 - range) / 2));
      // Set movement to happen at the PREVIOUS time, since we're moving toward
      // the goal position with this command, and want to arrive there by the
      // current time.
      commands.set(lastTime, [new FleshlightLaunchFW12Cmd(speed, positionGoal)]);
      lastTime = aCommand.Time;
      lastPosition = aCommand.Position;
    }
    return commands;
  }

  // For now, we can process to FleshlightLaunch first, then process to
  // vibration. This means all of the timing work is already done for us, and we
  // just need to do vibration frame interpolation
  private static FunscriptToSingleMotorVibrateCommands(aCommands: FunscriptCommand[]):
  Map<number, ButtplugDeviceMessage[]> {
    let lastTime: number = 0;
    let lastPosition: number = 0;

    // amount of time (in milliseconds) to put between every interpolated vibration command
    const density = 75;
    const commands: Map<number, ButtplugDeviceMessage[]> = new Map();

    let currentTime: number;
    let currentPosition: number;

    let timeDelta: number;

    let timeSteps: number;
    let posStep: number;
    let step: number;

    for (const aCommand of aCommands) {
      if (lastTime < 0) {
        lastTime = aCommand.Time;
        lastPosition = aCommand.Position;
        continue;
      }
      currentTime = aCommand.Time;
      currentPosition = aCommand.Position;

      timeDelta = currentTime - lastTime;

      timeSteps = Math.floor(timeDelta / density);
      posStep = ((currentPosition - lastPosition) / 100) / timeSteps;
      step = 0;
      while (lastTime + (step * density) < currentTime) {
        commands.set(lastTime + (step * density),
                     [new SingleMotorVibrateCmd((lastPosition * 0.01) + (posStep * step))]);
        step += 1;
      }
      lastTime = currentTime;
      lastPosition = currentPosition;
    }
    // Make sure we stop the vibrator at the end
    commands.set(lastTime + 100, [new SingleMotorVibrateCmd(0)]);
    return commands;
  }
}
