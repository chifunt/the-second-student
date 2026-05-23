import * as d3 from "d3";
import type { ChartOptions, GapDatum } from "./chartTypes";
import { createSvgChart, renderFigure, toneClass } from "./chartUtils";

export function renderGapChart(
  data: readonly GapDatum[],
  options: ChartOptions,
): string {
  const width = 680;
  const rowHeight = 82;
  const left = 210;
  const chartWidth = 360;
  const height = 20 + data.length * rowHeight;
  const x = d3.scaleLinear().domain([0, 100]).range([0, chartWidth]).clamp(true);
  const svg = createSvgChart(options.title, width, height);

  const rows = svg
    .append("g")
    .selectAll("g")
    .data(data)
    .join("g")
    .attr("class", "gap-chart__row")
    .attr("transform", (_datum, index) => `translate(0 ${22 + index * rowHeight})`);

  rows
    .append("text")
    .attr("class", "gap-chart__label")
    .attr("x", 0)
    .attr("y", 16)
    .text((datum) => datum.label);

  rows
    .append("line")
    .attr("class", "gap-chart__line")
    .attr("x1", (datum) => left + x(datum.actual))
    .attr("x2", (datum) => left + x(datum.expected))
    .attr("y1", 34)
    .attr("y2", 34);

  rows
    .append("circle")
    .attr("class", "gap-chart__actual")
    .attr("cx", (datum) => left + x(datum.actual))
    .attr("cy", 34)
    .attr("r", 8);

  rows
    .append("circle")
    .attr("class", "gap-chart__expected")
    .attr("cx", (datum) => left + x(datum.expected))
    .attr("cy", 34)
    .attr("r", 8);

  rows
    .append("text")
    .attr("class", "gap-chart__actual-label")
    .attr("x", (datum) => left + x(datum.actual))
    .attr("y", 61)
    .text((datum) => `${datum.actualLabel}: ${datum.actual}%`);

  rows
    .append("text")
    .attr("class", "gap-chart__expected-label")
    .attr("x", (datum) => left + x(datum.expected))
    .attr("y", 61)
    .text((datum) => `${datum.expectedLabel}: ${datum.expected}%`);

  return renderFigure(
    `chart chart--gap ${toneClass(options.tone)}`,
    options.title,
    svg.node()?.outerHTML ?? "",
    options.description,
  );
}
