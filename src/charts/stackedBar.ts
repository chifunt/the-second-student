import * as d3 from "d3";
import type { ChartOptions, StackDatum } from "./chartTypes";
import { escapeHtml, renderFigure, toneClass } from "./chartUtils";

export function renderStackedBar(
  data: readonly StackDatum[],
  options: ChartOptions,
): string {
  const width = d3.scaleLinear().domain([0, 100]).range([0, 100]).clamp(true);
  const body = `
    <div class="stack-100">
      ${data
        .map(
          (datum) => `
            <div class="seg seg--${datum.tone}" style="--w:${width(datum.value).toFixed(
              2,
            )}%;">
              <span>${datum.value}%</span>
              <small>${escapeHtml(datum.label)}</small>
            </div>
          `,
        )
        .join("")}
    </div>
    <div class="stack-legend">
      ${data
        .map(
          (datum) => `
            <span class="key key--${datum.tone}">
              <i class="sw"></i>${escapeHtml(datum.label)}
            </span>
          `,
        )
        .join("")}
    </div>
  `;

  return renderFigure(
    `chart chart--stacked ${toneClass(options.tone)}`,
    options.title,
    body,
    options.description,
  );
}
