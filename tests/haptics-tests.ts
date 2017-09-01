import { expect } from "chai";
import "mocha";
import { ButtplugDeviceMessage, FleshlightLaunchFW12Cmd, SingleMotorVibrateCmd, KiirooCmd } from "buttplug";
import HapticCommandToButtplugMessage from "../src/utils/HapticsToButtplug";

const testFunscript = '{"version":"1.0",\
"inverted":false,\
"range":85,\
"actions":[{"pos":99,"at":23563},\
{"pos":15,"at":24030},\
{"pos":99,"at":24513},\
{"pos":15,"at":24963},\
{"pos":99,"at":25430}';

describe("Haptics Translation Tests", () => {
  it("Should zip multiple command arrays correctly", async () => {
    const fleshlightMap = new Map<number, FleshlightLaunchFW12Cmd[]>();
    const fleshlightCommands = [new FleshlightLaunchFW12Cmd(10, 20),
                                new FleshlightLaunchFW12Cmd(20, 30),
                                new FleshlightLaunchFW12Cmd(30, 40)];
    fleshlightMap.set(1, [fleshlightCommands[0]]);
    fleshlightMap.set(3, [fleshlightCommands[1]]);
    fleshlightMap.set(5, [fleshlightCommands[2]]);
    fleshlightMap.set(10, [fleshlightCommands[0]]);
    const vibrateMap = new Map<number, SingleMotorVibrateCmd[]>();
    const vibrateCommands = [new SingleMotorVibrateCmd(10),
                             new SingleMotorVibrateCmd(20),
                             new SingleMotorVibrateCmd(30)];
    vibrateMap.set(1, [vibrateCommands[0]]);
    vibrateMap.set(2, [vibrateCommands[1]]);
    vibrateMap.set(4, [vibrateCommands[2]]);
    // Map with no messages
    const emptyMap = new Map<number, KiirooCmd[]>();
    const commandArray = HapticCommandToButtplugMessage.ZipCommandMaps([fleshlightMap, vibrateMap, emptyMap]);
    const expectedCommandArray = new Map<number, ButtplugDeviceMessage[]>();
    expectedCommandArray.set(1, [fleshlightCommands[0], vibrateCommands[0]]);
    expectedCommandArray.set(2, [vibrateCommands[1]]);
    expectedCommandArray.set(3, [fleshlightCommands[1]]);
    expectedCommandArray.set(4, [vibrateCommands[2]]);
    expectedCommandArray.set(5, [fleshlightCommands[2]]);
    expectedCommandArray.set(10, [fleshlightCommands[0]]);
    expect(commandArray).to.deep.equal(expectedCommandArray);
    expect(Array.from(commandArray.keys())).to.deep.equal([1, 2, 3, 4, 5, 10]);
  });

});
