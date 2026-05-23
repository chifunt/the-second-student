import * as d3 from "d3";
import type { ChartDatum, ChartOptions } from "./chartTypes";
import { createSvgChart, renderFigure, toneClass } from "./chartUtils";

export function renderProgressBars(
  data: readonly ChartDatum[],
  options: ChartOptions,
): string {
  const width = 560;
  const rowHeight = 58;
  const height = data.length * rowHeight + 18;
  const x = d3.scaleLinear().domain([0, 100]).range([0, 330]).clamp(true);
  const svg = createSvgChart(options.title, width, height);

  const rows = svg
    .append("g")
    .selectAll("g")
    .data(data)
    .join("g")
    .attr("class", "progress-chart__row")
    .attr("transform", (_datum, index) => `translate(0 ${12 + index * rowHeight})`);

  rows
    .append("text")
    .attr("class", "progress-chart__value")
    .attr("x", 0)
    .attr("y", 31)
    .text((datum) => `${datum.value}%`);

  rows
    .append("text")
    .attr("class", "progress-chart__label")
    .attr("x", 92)
    .attr("y", 18)
    .text((datum) => datum.label);

  rows
    .append("rect")
    .attr("class", "progress-chart__track")
    .attr("x", 92)
    .attr("y", 28)
    .attr("width", 330)
    .attr("height", 12)
    .attr("rx", 6);

  rows
    .append("rect")
    .attr("class", "bar-fill progress-chart__fill")
    .attr("x", 92)
    .attr("y", 28)
    .attr("width", (datum) => x(datum.value))
    .attr("height", 12)
    .attr("rx", 6);

  return renderFigure(
    `chart chart--progress ${toneClass(options.tone)}`,
    options.title,
    svg.node()?.outerHTML ?? "",
    options.description,
  );
}
