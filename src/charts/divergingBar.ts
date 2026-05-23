import * as d3 from "d3";
import type { ChartOptions } from "./chartTypes";
import { createSvgChart, renderFigure, toneClass } from "./chartUtils";

export type DivergingDatum = {
  lessLabel: string;
  lessValue: number;
  neutralLabel: string;
  neutralValue: number;
  moreLabel: string;
  moreValue: number;
};

export function renderDivergingBar(
  data: DivergingDatum,
  options: ChartOptions,
): string {
  const width = 660;
  const height = 152;
  const center = 330;
  const sideWidth = 180;
  const neutralWidth = 180;
  const sideScale = d3.scaleLinear().domain([0, 25]).range([0, sideWidth]).clamp(true);
  const neutralScale = d3
    .scaleLinear()
    .domain([0, 100])
    .range([0, neutralWidth])
    .clamp(true);
  const svg = createSvgChart(options.title, width, height);
  const lessWidth = sideScale(data.lessValue);
  const moreWidth = sideScale(data.moreValue);
  const middleWidth = neutralScale(data.neutralValue);

  svg
    .append("line")
    .attr("class", "diverging-chart__axis")
    .attr("x1", center)
    .attr("x2", center)
    .attr("y1", 12)
    .attr("y2", 70);

  svg
    .append("rect")
    .attr("class", "bar-fill diverging-chart__less")
    .attr("x", center - lessWidth)
    .attr("y", 22)
    .attr("width", lessWidth)
    .attr("height", 26)
    .attr("rx", 6);

  svg
    .append("rect")
    .attr("class", "bar-fill diverging-chart__neutral")
    .attr("x", center - middleWidth / 2)
    .attr("y", 62)
    .attr("width", middleWidth)
    .attr("height", 22)
    .attr("rx", 6);

  svg
    .append("rect")
    .attr("class", "bar-fill diverging-chart__more")
    .attr("x", center)
    .attr("y", 22)
    .attr("width", moreWidth)
    .attr("height", 26)
    .attr("rx", 6);

  svg
    .append("text")
    .attr("class", "diverging-chart__label")
    .attr("x", center - lessWidth - 12)
    .attr("y", 40)
    .attr("text-anchor", "end")
    .text(`${data.lessValue}% ${data.lessLabel}`);

  svg
    .append("text")
    .attr("class", "diverging-chart__label")
    .attr("x", center + moreWidth + 12)
    .attr("y", 40)
    .text(`${data.moreValue}% ${data.moreLabel}`);

  svg
    .append("text")
    .attr("class", "diverging-chart__label")
    .attr("x", center)
    .attr("y", 112)
    .attr("text-anchor", "middle")
    .text(`${data.neutralValue}% ${data.neutralLabel}`);

  return renderFigure(
    `chart chart--diverging ${toneClass(options.tone)}`,
    options.title,
    svg.node()?.outerHTML ?? "",
    options.description,
  );
}
