import Vue from "vue";
import { Component, Model, Prop, Watch } from "vue-property-decorator";
import * as d3 from "d3";
import { HapticCommand, HapticFileHandler, LoadString, LoadFile, FunscriptCommand } from "haptic-movie-file-reader";

@Component({})
export default class VideoEncoder extends Vue {

  private svg: any;
  private xScale: d3.ScaleLinear<number, number>;
  private yScale: d3.ScaleLinear<number, number>;
  private line: d3.Line<[number, number]>;
  private dataExtent: [number, number];
  private xAxis: any;
  private yAxis: any;
  // This ends up being a very complicated selection, so call it any. I am lazy.
  private xAxisDisplay: any;
  private playCursor: any;
  private playLine: d3.Line<[number, number]>;

  @Prop()
  private hapticsCommands: FunscriptCommand[];

  @Prop()
  private currentPlayTime: number;

  private buildTimeline() {
    // If we have to rebuild from scratch, clear all svgs first
    d3.select("#graph").selectAll("svg").remove();
    this.svg = d3.select("#graph")
      .append("svg")
      .attr("id", "encoder-timeline")
      .attr("width", "100%")
      .attr("height", "150px");

    this.dataExtent = (d3 as any).extent(this.hapticsCommands, function(d: FunscriptCommand) { return d.Time; });
    // Typing definition for d3.extent is wrong
    this.xScale = d3.scaleLinear()
      .domain(this.dataExtent)
      .range([0, 1920]);

    this.yScale = d3.scaleLinear()
      .domain([100, 0])
      .range([0, 100]);

    this.xAxis = d3.axisBottom(this.xScale);
    this.yAxis = d3.axisLeft(this.yScale);
    this.xAxisDisplay = this.svg.append("g")
      .classed("axis", true)
      .attr("transform", function() {
        return "translate(" + 0 + "," + (150 - 20) + ")";
      })
      .call(this.xAxis);

    this.line = d3.line()
      .x((d: any) => this.xScale(d.Time))
      .y((d: any) => this.yScale(d.Position));

    const path = this.svg.append("path")
      .classed("graph-line", true)
      .attr("d", this.line(this.hapticsCommands as any)!)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("transform", function() {
        return "translate(" + 0 + "," + 0 + ")";
      });

    const circles = this.svg.append("g")
      .attr("id", "circles")
      .selectAll("circle")
      .data(this.hapticsCommands)
      .enter()
      .append("circle")
      .attr("fill", "white")
      .attr("r", 4)
      .attr("cx", (d: any) => this.xScale(d.Time))
      .attr("cy", (d: any) => this.yScale(d.Position));

    this.playLine = d3.line()
      .x((d: [number, number]) => this.xScale(d[0]))
      .y((d: [number, number]) => this.yScale(d[1]));

    this.playCursor = this.svg.append("path")
      .attr("id", "line")
      .attr("d", this.playLine([[0, 0], [0, 100]]))
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("transform", function() {
        return "translate(" + 0 + "," + 0 + ")";
      });

    const zoom = d3.zoom()
      .scaleExtent([.95, 50])
      .translateExtent([[this.xScale(-1000), 0], [this.xScale(this.dataExtent[1] + 1000), this.yScale(100)]])
      .on("zoom", () => {
        const newxScale = d3.event.transform.rescaleX(this.xScale);

        this.xAxisDisplay.transition()
          .duration(10)
          .call((this.xAxis as any).scale(newxScale));
        circles.attr("cx", function(d: any) { return newxScale(d.Time); });
        this.line.x(function(d: any) { return newxScale(d.Time); });
        this.playLine.x(function(d: [number, number]) { return newxScale(d[0]); });
        path.attr("d", this.line(this.hapticsCommands as any)!);
      });
    this.svg.call(zoom);
  }

  @Watch("hapticsCommands")
  private updateTimelineDataSource() {
    this.buildTimeline();
  }

  @Watch("currentPlayTime")
  private updateCurrentPlayTime() {
    this.playCursor.attr("d", this.playLine([[this.currentPlayTime, 0], [this.currentPlayTime, 100]]));
  }
}
