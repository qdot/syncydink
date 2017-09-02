import Vue from "vue";
import { Component, Model, Prop, Watch } from "vue-property-decorator";
import * as d3 from "d3";
import { HapticCommand, HapticFileHandler, LoadString, LoadFile, FunscriptCommand } from "haptic-movie-file-reader";

@Component({})
export default class VideoEncoder extends Vue {

  private xScale: d3.ScaleLinear<number, number>;
  private yScale: d3.ScaleLinear<number, number>;
  private line: d3.Line<[number, number]>;
  private dataExtent: [number, number];
  private xAxis: any;
  private yAxis: any;
  // This ends up being a very complicated selection, so call it any. I am lazy.
  private xAxisDisplay: any;

  @Prop()
  private hapticsCommands: FunscriptCommand[];

  private buildTimeline() {
    // If we have to rebuild from scratch, clear all svgs first
    d3.select("#graph").selectAll("svg").remove();
    const svg = d3.select("#graph")
      .append("svg")
      .attr("width", "100%")
      .attr("height", "150px")
      .style("border", "1px solid");

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
    this.xAxisDisplay = svg.append("g")
      .classed("x-axis", true)
      .attr("transform", function() {
        return "translate(" + 0 + "," + (150 - 20) + ")";
      })
      .call(this.xAxis);

    this.line = d3.line()
      .x((d: any) => this.xScale(d.Time))
      .y((d: any) => this.yScale(d.Position));

    const path = svg.append("path")
      .attr("id", "line")
      .attr("d", this.line(this.hapticsCommands as any)!)
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("transform", function() {
        return "translate(" + 0 + "," + 0 + ")";
      });

    const circles = svg.append("g")
      .attr("id", "circles")
      .selectAll("circle")
      .data(this.hapticsCommands)
      .enter()
      .append("circle")
      .attr("r", 4)
      .attr("cx", (d) => this.xScale(d.Time))
      .attr("cy", (d) => this.yScale(d.Position));

    const zoom = d3.zoom()
      .scaleExtent([.95, 50])
      .translateExtent([[this.xScale(-1000), 0], [this.xScale(this.dataExtent[1] + 1000), this.yScale(100)]])
      .on("zoom", () => {
        const newxScale = d3.event.transform.rescaleX(this.xScale);
        this.xAxisDisplay.transition()
          .duration(10)
          .call((this.xAxis as any).scale(newxScale));
        circles.attr("cx", function(d) { return newxScale(d.Time); });
        this.line.x(function(d: any) { return newxScale(d.Time); });
        path.attr("d", this.line(this.hapticsCommands as any)!);
      });
    svg.call(zoom);
  }

  @Watch("hapticsCommands")
  private updateTimelineDataSource() {
    this.buildTimeline();
  }
}
