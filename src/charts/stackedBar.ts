import * as d3 from "d3";
import type { ChartOptions, StackDatum } from "./chartTypes";
import { createSvgChart, escapeHtml, renderFigure, toneClass } from "./chartUtils";

export function renderStackedBar(
  data: readonly StackDatum[],
  options: ChartOptions,
): string {
  const width = 640;
  const height = 150;
  const left = 12;
  const barWidth = 520;
  const x = d3.scaleLinear().domain([0, 100]).range([0, barWidth]).clamp(true);
  const svg = createSvgChart(options.title, width, height);
  let cursor = left;

  const segments = svg
    .append("g")
    .attr("class", "stacked-chart")
    .selectAll("g")
    .data(data)
    .join("g")
    .attr("class", (datum) => `stacked-chart__segment stacked-chart__segment--${datum.tone}`)
    .attr("transform", (datum) => {
      const current = cursor;
      cursor += x(datum.value);
      return `translate(${current} 18)`;
    });

  segments
    .append("rect")
    .attr("class", "bar-fill stacked-chart__fill")
    .attr("width", (datum) => x(datum.value))
    .attr("height", 28)
    .attr("rx", 6);

  segments
    .append("text")
    .attr("class", "stacked-chart__value")
    .attr("x", (datum) => x(datum.value) / 2)
    .attr("y", 19)
    .text((datum) => `${datum.value}%`);

  const legend = data
    .map(
      (datum) => `
        <li class="chart-legend__item chart-legend__item--${datum.tone}">
          <span aria-hidden="true"></span>
          <strong>${datum.value}%</strong>
          ${escapeHtml(datum.label)}
        </li>
      `,
    )
    .join("");

  return renderFigure(
    `chart chart--stacked ${toneClass(options.tone)}`,
    options.title,
    `${svg.node()?.outerHTML ?? ""}<ul class="chart-legend">${legend}</ul>`,
    options.description,
  );
}
