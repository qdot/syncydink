import Vue from "vue";
import { Component, Model, Prop, Watch } from "vue-property-decorator";
import * as d3 from "d3";
import { HapticCommand, HapticFileHandler, LoadString, LoadFile, FunscriptCommand } from "haptic-movie-file-reader";

@Component({
})
export default class VideoEncoder extends Vue {

  private wolfFile: string = "{\"version\": \"1.0\", \"inverted\": false, \"actions\": [{\"at\": 367, \"pos\": 20}, {\"at\": 667, \"pos\": 80}, {\"at\": 1101, \"pos\": 20}, {\"at\": 1535, \"pos\": 80}, {\"at\": 1902, \"pos\": 20}, {\"at\": 2269, \"pos\": 80}, {\"at\": 2569, \"pos\": 20}, {\"at\": 3036, \"pos\": 80}, {\"at\": 3403, \"pos\": 20}, {\"at\": 3670, \"pos\": 80}, {\"at\": 4137, \"pos\": 20}, {\"at\": 4505, \"pos\": 80}, {\"at\": 4838, \"pos\": 20}, {\"at\": 5472, \"pos\": 30}, {\"at\": 5706, \"pos\": 50}, {\"at\": 5873, \"pos\": 30}, {\"at\": 6206, \"pos\": 30}, {\"at\": 6840, \"pos\": 40}, {\"at\": 7307, \"pos\": 30}, {\"at\": 7674, \"pos\": 20}, {\"at\": 8175, \"pos\": 80}, {\"at\": 8575, \"pos\": 20}, {\"at\": 8876, \"pos\": 80}, {\"at\": 9276, \"pos\": 20}, {\"at\": 9576, \"pos\": 80}, {\"at\": 9943, \"pos\": 20}, {\"at\": 10277, \"pos\": 80}, {\"at\": 10644, \"pos\": 20}, {\"at\": 11144, \"pos\": 80}, {\"at\": 11512, \"pos\": 20}, {\"at\": 11945, \"pos\": 80}, {\"at\": 12279, \"pos\": 20}, {\"at\": 12713, \"pos\": 80}, {\"at\": 13113, \"pos\": 20}, {\"at\": 13447, \"pos\": 80}, {\"at\": 13947, \"pos\": 20}, {\"at\": 14281, \"pos\": 80}, {\"at\": 14581, \"pos\": 20}, {\"at\": 15048, \"pos\": 80}, {\"at\": 15382, \"pos\": 20}, {\"at\": 15749, \"pos\": 80}, {\"at\": 16116, \"pos\": 20}, {\"at\": 16517, \"pos\": 80}, {\"at\": 16917, \"pos\": 20}, {\"at\": 17217, \"pos\": 80}, {\"at\": 17551, \"pos\": 20}, {\"at\": 17918, \"pos\": 80}, {\"at\": 18318, \"pos\": 20}, {\"at\": 18685, \"pos\": 80}, {\"at\": 19019, \"pos\": 20}, {\"at\": 19386, \"pos\": 80}, {\"at\": 19686, \"pos\": 20}, {\"at\": 20020, \"pos\": 70}, {\"at\": 20354, \"pos\": 20}, {\"at\": 20687, \"pos\": 70}, {\"at\": 21021, \"pos\": 20}, {\"at\": 21455, \"pos\": 50}, {\"at\": 21889, \"pos\": 20}, {\"at\": 22189, \"pos\": 50}, {\"at\": 22723, \"pos\": 20}, {\"at\": 23223, \"pos\": 60}, {\"at\": 23557, \"pos\": 10}, {\"at\": 23957, \"pos\": 60}, {\"at\": 24358, \"pos\": 60}, {\"at\": 24925, \"pos\": 60}, {\"at\": 25225, \"pos\": 10}, {\"at\": 25626, \"pos\": 50}, {\"at\": 26026, \"pos\": 10}, {\"at\": 26493, \"pos\": 50}, {\"at\": 26660, \"pos\": 10}, {\"at\": 26927, \"pos\": 50}, {\"at\": 27261, \"pos\": 10}, {\"at\": 27528, \"pos\": 50}, {\"at\": 27861, \"pos\": 10}, {\"at\": 28195, \"pos\": 50}, {\"at\": 28629, \"pos\": 10}, {\"at\": 28996, \"pos\": 50}, {\"at\": 29296, \"pos\": 10}, {\"at\": 29596, \"pos\": 50}, {\"at\": 30163, \"pos\": 10}, {\"at\": 30230, \"pos\": 10}, {\"at\": 30664, \"pos\": 50}, {\"at\": 31064, \"pos\": 10}, {\"at\": 31532, \"pos\": 50}, {\"at\": 31798, \"pos\": 40}, {\"at\": 31999, \"pos\": 70}, {\"at\": 32299, \"pos\": 20}, {\"at\": 32733, \"pos\": 70}, {\"at\": 33100, \"pos\": 20}, {\"at\": 33367, \"pos\": 60}, {\"at\": 33901, \"pos\": 20}, {\"at\": 34301, \"pos\": 70}, {\"at\": 34601, \"pos\": 20}, {\"at\": 34968, \"pos\": 60}, {\"at\": 35369, \"pos\": 20}, {\"at\": 35736, \"pos\": 60}, {\"at\": 36103, \"pos\": 20}, {\"at\": 36470, \"pos\": 60}, {\"at\": 36803, \"pos\": 20}, {\"at\": 37137, \"pos\": 60}, {\"at\": 37504, \"pos\": 20}, {\"at\": 37938, \"pos\": 60}, {\"at\": 38338, \"pos\": 20}, {\"at\": 38672, \"pos\": 60}, {\"at\": 39072, \"pos\": 20}, {\"at\": 39506, \"pos\": 60}, {\"at\": 39840, \"pos\": 20}, {\"at\": 40207, \"pos\": 60}, {\"at\": 40507, \"pos\": 20}, {\"at\": 41208, \"pos\": 50}, {\"at\": 41508, \"pos\": 10}, {\"at\": 41842, \"pos\": 50}, {\"at\": 42175, \"pos\": 10}, {\"at\": 42476, \"pos\": 50}, {\"at\": 42910, \"pos\": 10}, {\"at\": 43176, \"pos\": 50}, {\"at\": 43443, \"pos\": 10}, {\"at\": 43677, \"pos\": 50}, {\"at\": 44011, \"pos\": 10}, {\"at\": 44244, \"pos\": 50}, {\"at\": 44344, \"pos\": 10}, {\"at\": 44511, \"pos\": 50}, {\"at\": 44745, \"pos\": 10}, {\"at\": 45112, \"pos\": 40}, {\"at\": 45779, \"pos\": 10}, {\"at\": 46847, \"pos\": 0}], \"range\": 100}";

  public mounted() {

    const handler = LoadString(this.wolfFile)!;
    const commands: FunscriptCommand[] = (handler.Commands as FunscriptCommand[]);

    const svg = d3.select("#graph")
      .append("svg")
      .attr("width", "100%")
      .attr("height", "150px")
      .style("border", "1px solid");

    const dataExtent = (d3 as any).extent(commands, function(d: FunscriptCommand) { return d.Time; });
    // Typing definition for d3.extent is wrong
    const xScale: any = d3.scaleLinear()
      .domain(dataExtent)
      .range([0, 1920]);

    const yScale = d3.scaleLinear()
      .domain([100, 0])
      .range([0, 100]);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);
    const x_axis = svg.append("g")
      .classed("x-axis", true)
      .attr("transform", function() {
        return "translate(" + 0 + "," + (150 - 20) + ")";
      })
      .call(xAxis);

    const line = d3.line()
      .x(function(d: any) { return xScale(d.Time); })
      .y(function(d: any) { return yScale(d.Position); });

    const path = svg.append("path")
      .attr("id", "line")
      .attr("d", line(commands as any)!)
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("transform", function() {
        return "translate(" + 0 + "," + 0 + ")";
      });

    const circles = svg.append("g")
      .attr("id", "circles")
      .selectAll("circle")
      .data(commands)
      .enter()
      .append("circle")
      .attr("r", 4)
      .attr("cx", function(d) { return xScale(d.Time); })
      .attr("cy", function(d) { return yScale(d.Position); });

    const zoom = d3.zoom()
      .scaleExtent([.95, 50])
      .translateExtent([[xScale(-1000), 0], [xScale(dataExtent[1] + 1000), yScale(100)]])
      .on("zoom", function() {
        const newxScale = d3.event.transform.rescaleX(xScale);
        x_axis.transition()
          .duration(10)
          .call((xAxis as any).scale(newxScale));
        circles.attr("cx", function(d) { return newxScale(d.Time); });
        line.x(function(d: any) { return newxScale(d.Time); });
        path.attr("d", line(commands as any)!);
      });
    svg.call(zoom);
  }
}
