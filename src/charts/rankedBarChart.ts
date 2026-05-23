import * as d3 from "d3";
import type { ChartDatum, ChartOptions } from "./chartTypes";
import { createSvgChart, renderFigure, toneClass } from "./chartUtils";

export function renderRankedBarChart(
  data: readonly ChartDatum[],
  options: ChartOptions,
): string {
  const width = 720;
  const rowHeight = 44;
  const top = 18;
  const left = 250;
  const barWidth = 330;
  const height = top + data.length * rowHeight + 18;
  const max = Math.max(100, d3.max(data, (datum) => datum.value) ?? 100);
  const x = d3.scaleLinear().domain([0, max]).range([0, barWidth]).clamp(true);
  const svg = createSvgChart(options.title, width, height);

  const rows = svg
    .append("g")
    .attr("class", "ranked-bar")
    .selectAll("g")
    .data(data)
    .join("g")
    .attr("class", "ranked-bar__row")
    .attr("transform", (_datum, index) => `translate(0 ${top + index * rowHeight})`);

  rows
    .append("text")
    .attr("class", "ranked-bar__label")
    .attr("x", 0)
    .attr("y", 20)
    .text((datum) => datum.label);

  rows
    .append("rect")
    .attr("class", "ranked-bar__track")
    .attr("x", left)
    .attr("y", 5)
    .attr("width", barWidth)
    .attr("height", 16)
    .attr("rx", 8);

  rows
    .append("rect")
    .attr("class", "bar-fill ranked-bar__fill")
    .attr("x", left)
    .attr("y", 5)
    .attr("width", (datum) => x(datum.value))
    .attr("height", 16)
    .attr("rx", 8);

  rows
    .append("text")
    .attr("class", "ranked-bar__value")
    .attr("x", left + barWidth + 18)
    .attr("y", 20)
    .text((datum) => `${datum.value}%`);

  return renderFigure(
    `chart chart--ranked-bar ${toneClass(options.tone)}`,
    options.title,
    svg.node()?.outerHTML ?? "",
    options.description,
  );
}
