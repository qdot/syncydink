import Vue from "vue";
import { Component, Model, Prop, Watch } from "vue-property-decorator";
import * as d3 from "d3";
import { HapticCommand, HapticFileHandler, LoadString, LoadFile, FunscriptCommand } from "haptic-movie-file-reader";
import * as Mousetrap from "mousetrap";

@Component({})
export default class VideoEncoder extends Vue {

  private svgXAxis: any;
  private svgBody: any;
  private xScale: d3.ScaleLinear<number, number>;
  private xDisplayScale: d3.ScaleLinear<number, number>;
  private yScale: d3.ScaleLinear<number, number>;
  private line: d3.Line<[number, number]>;
  private dataExtent: [number, number];

  // Everything below is a selection with a complex type, so make them anys and
  // hope we don't regret it later.
  private circles: any;
  private path: any;
  private xAxis: any;
  private yAxis: any;
  private xAxisDisplay: any;
  private playhead: any;
  private playLine: d3.Line<[number, number]>;

  @Prop()
  private hapticsCommands: FunscriptCommand[];
  private hapticsValues: Array<[number, number]> = [];

  @Prop()
  private currentPlayTime: number = 0;
  private lastUpdateTime: number = 0;

  private hapticsPlaying: boolean = false;
  private hapticsLooped: boolean = true;
  private hapticsLocked: boolean = true;

  public mounted() {
    this.buildTimeline();
    for (const i of [...Array(10).keys()]) {
      Mousetrap.bind(i.toString(), () => this.addNodeAtPoint(i * 10));
    }
  }

  public beforeDestroy() {
    for (const i of [...Array(10).keys()]) {
      Mousetrap.unbind(i.toString());
    }
  }

  private addNodeAtPoint(value: number) {
    this.hapticsValues.push([this.currentPlayTime, value]);
    this.hapticsValues.sort((a, b) => a[0] > b[0] ? 1 : -1);
    this.updateGraph();
  }

  private updateGraph() {
    this.path.attr("d", this.line(this.hapticsValues));
    // Additions aren't working without full removal?!
    this.circles
      .selectAll("circle").remove();
    this.circles
      .selectAll("circle")
      .data(this.hapticsValues)
      .enter()
      .append("circle")
      .attr("fill", "white")
      .attr("r", 4)
      .attr("cx", (d: [number, number]) => this.xDisplayScale(d[0]))
      .attr("cy", (d: [number, number]) => this.yScale(d[1]))
      .on("mouseover", (d: any) => d3.select(d3.event.currentTarget).attr("fill", "red"))
      .on("mouseout", (d: any) => d3.select(d3.event.currentTarget).attr("fill", "white"))
      .call(d3.drag()
            .on("start", () => this.$emit("dragStart"))
            .on("end", () => this.$emit("dragStop"))
            .on("drag", this.nodeDragged(this)));
  }

  private nodeDragged(self: VideoEncoder) {
    return function(this: SVGCircleElement, d: [number, number], i: number) {
      if (self.hapticsLocked) {
        return;
      }
      let moveX = self.xDisplayScale.invert(d3.event.x);
      let moveY = self.yScale.invert(d3.event.y);

      const xRange: [number, number] = [0, 0];
      if (i === 0) {
        xRange[0] = 0;
        xRange[1] = self.hapticsValues[1][0];
      } else if (i > 0 && i < self.hapticsValues.length - 1) {
        xRange[0] = self.hapticsValues[i - 1][0];
        xRange[1] = self.hapticsValues[i + 1][0];
      } else if (i === self.hapticsValues.length - 1) {
        xRange[0] = self.hapticsValues[i - 1][0];
        xRange[1] = self.hapticsValues[i][0];
      }

      if (moveX < xRange[0]) {
        moveX = xRange[0] + 1;
      } else if (moveX > xRange[1]) {
        moveX = xRange[1] - 1;
      }

      if (moveY < 0) {
        moveY = 0;
      } else if (moveY > 100) {
        moveY = 100;
      }

      // 'this' in this context will be the d3 element
      d[0] = moveX;
      d[1] = moveY;
      self.hapticsValues[i] = d;
      self.path.attr("d", self.line(self.hapticsValues));
      d3.select(this).attr("cx", self.xDisplayScale(moveX));
      d3.select(this).attr("cy", self.yScale(moveY));
    };
  }

  private onResize() {
    const graphdiv = document.getElementById("graph")!;
    this.xScale.range([0, graphdiv.clientWidth]);
  }

  private updatePlayheadPositionFromEvent() {
    const moveX = this.xDisplayScale.invert(d3.event.x);
    this.playhead.attr("d", this.playLine([[moveX, 0], [moveX, 100]]));
    this.$emit("inputTimeUpdate", moveX);
  }

  private playheadDragged(self: VideoEncoder) {
    return function(this: any, d: [number, number], i: number) {
      self.updatePlayheadPositionFromEvent();
    };
  }

  private onBodyClick() {
    this.updatePlayheadPositionFromEvent();
    const moveX = this.xDisplayScale.invert(d3.event.x);
    this.currentPlayTime
    this.$emit("inputTimeUpdate", moveX);
  }

  private onBodyDblClick() {
    if (this.hapticsLocked) {
      return;
    }
    let i = 0;
    const moveX = Math.floor(this.xDisplayScale.invert(d3.event.x));
    const moveY = Math.floor(this.yScale.invert(d3.event.y));
    const newNode: [number, number] = [moveX, moveY];
    for (const n of this.hapticsValues) {
      if (n[0] > moveX) {
        this.hapticsValues.splice(i, 0, newNode);
        break;
      }
      i += 1;
    }

    this.updateGraph();
  }

  private buildTimeline() {

    this.hapticsValues = [];
    for (const cmd of this.hapticsCommands) {
      this.hapticsValues.push([cmd.Time, cmd.Position]);
    }

    const graphdiv = document.getElementById("graph-body")!;
    // If we have to rebuild from scratch, clear all svgs first
    d3.select("#graph").selectAll("svg").remove();
    this.svgBody = d3.select("#graph-body")
      .append("svg")
      .attr("width", "100%")
      .on("dblclick", () => this.onBodyDblClick())
      .on("click", () => this.onBodyClick());
    // Typing definition for d3.extent is wrong
    this.dataExtent = (d3 as any).extent(this.hapticsValues, function(d: [number, number]) { return d[0]; });

    this.xScale = d3.scaleLinear()
      .domain(this.dataExtent)
      .range([0, graphdiv.clientWidth]);

    this.xDisplayScale = this.xScale.copy();

    this.yScale = d3.scaleLinear()
      .domain([100, 0])
      .range([0, graphdiv.clientHeight]);
    console.log("Client height " + graphdiv.clientHeight);

    this.xAxis = d3.axisTop(this.xScale)
      .tickFormat((d: number) => `${d / 1000.0}s`);
    this.yAxis = d3.axisRight(this.yScale)
      .tickSize(graphdiv.clientWidth);

    const customYAxis = (g: any) => {
      g.call(this.yAxis);
      g.select(".domain").remove();
      g.selectAll(".tick:not(:first-of-type) line")
        .attr("stroke", "#777")
        .attr("stroke-dasharray", "2,4");
    };
    this.svgBody.append("g").call(customYAxis);

    this.svgXAxis = d3.select("#graph-x-axis")
      .append("svg")
      .attr("width", "100%")
      .attr("height", "20px")
      .attr("background", "#000");

    // This still needs to be translated?
    this.xAxisDisplay = this.svgXAxis.append("g")
      .classed("axis", true)
      .call(this.xAxis)
      .attr("transform", function() {
        return "translate(" + 0 + "," + 19 + ")";
      });

    this.line = d3.line()
      .x((d: [number, number]) => this.xDisplayScale(d[0]))
      .y((d: [number, number]) => this.yScale(d[1]));

    this.path = this.svgBody.append("path")
      .classed("graph-line", true)
      .attr("d", this.line(this.hapticsValues)!)
      .attr("fill", "none")
      .attr("stroke", "steelblue");

    this.circles = this.svgBody.append("g");

    this.updateGraph();

    this.playLine = d3.line()
      .x((d: [number, number]) => this.xDisplayScale(d[0]))
      .y((d: [number, number]) => this.yScale(d[1]));

    // Emit events to turn off gestures while dragging playhead.
    const playheadDrag = d3.drag()
      .on("drag", this.playheadDragged(this))
      .on("start", () => this.$emit("dragStart"))
      .on("end", () => {
        this.onBodyClick();
        this.$emit("dragStop");
      });

    this.playhead = this.svgBody.append("path")
      .classed("play-head", true)
      .attr("d", this.playLine([[this.currentPlayTime, 0], [this.currentPlayTime, 100]]))
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("cursor", "col-resize")
      .call(playheadDrag);

    const zoom = d3.zoom()
      .filter(() => {
        return d3.event.type !== "dblclick";
      })
      .scaleExtent([.95, 50])
      .translateExtent([[this.xScale(-1000), 0], [this.xScale(this.dataExtent[1] + 1000), this.yScale(100)]])
      .on("start", () => this.$emit("dragStart"))
      .on("end", () => this.$emit("dragStop"))
      .on("zoom", () => {
        this.xDisplayScale = d3.event.transform.rescaleX(this.xScale);

        this.xAxisDisplay
          .call((this.xAxis as any).scale(this.xDisplayScale));
        this.circles
          .selectAll("circle")
          .attr("cx", (d: [number, number]) => this.xDisplayScale(d[0]));
        this.path.attr("d", this.line(this.hapticsValues)!);
        if (this.currentPlayTime !== undefined) {
          this.updateCurrentPlayTime();
        }
      });
    this.svgBody.call(zoom);
    // Scale all the way out to start.
    zoom.scaleTo(this.svgBody, 0.95);
  }

  @Watch("hapticsCommands")
  private updateTimelineDataSource() {
    this.buildTimeline();
  }

  @Watch("currentPlayTime")
  private updateCurrentPlayTime() {
    this.playhead.attr("d", this.playLine([[this.currentPlayTime, 0], [this.currentPlayTime, 100]]));
  }

  private ToggleHapticsPlayback() {
    this.hapticsPlaying = !this.hapticsPlaying;
    this.$emit(this.hapticsPlaying ? "play" : "pause");
    if (this.hapticsPlaying) {
      this.runTimeUpdateLoop();
    }
  }

  private ToggleHapticsLooped() {
    this.hapticsLooped = !this.hapticsLooped;
  }

  private ToggleHapticsLocked() {
    this.hapticsLocked = !this.hapticsLocked;
  }

  private runTimeUpdateLoop() {
    window.requestAnimationFrame(() => {
      if (!this.hapticsPlaying) {
        this.lastUpdateTime = 0;
        return;
      }
      if (this.lastUpdateTime === 0) {
        this.lastUpdateTime = Date.now();
        this.runTimeUpdateLoop();
        return;
      }
      const currentUpdateTime = Date.now();
      let newPlayTime = (this.currentPlayTime + (currentUpdateTime - this.lastUpdateTime));
      if (newPlayTime > this.hapticsValues[this.hapticsValues.length - 1][0]) {
        if (!this.hapticsLooped) {
          return;
        }
        this.lastUpdateTime = 0;
        newPlayTime = 0;
      }
      this.lastUpdateTime = currentUpdateTime;
      this.$emit("timeUpdate", newPlayTime);
      this.runTimeUpdateLoop();
    });
  }

}
