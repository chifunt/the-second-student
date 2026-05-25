import * as d3 from "d3";
import type { ChartDatum, ChartOptions } from "./chartTypes";
import {
  escapeHtml,
  renderEvidenceAttributes,
  renderFigure,
  toneClass,
} from "./chartUtils";

export function renderRankedBarChart(
  data: readonly ChartDatum[],
  options: ChartOptions,
): string {
  const max = Math.max(50, d3.max(data, (datum) => datum.value) ?? 100);
  const width = d3.scaleLinear().domain([0, max]).range([0, 100]).clamp(true);
  const body = `
    <div class="bars data-bars">
      ${data
        .map(
          (datum) => `
            <div class="bar-row" style="--w:${width(datum.value).toFixed(
              2,
            )}%;" ${renderEvidenceAttributes(datum.label, datum.value, options.evidence)}>
              <div class="bar-row__top">
                <span class="label">${escapeHtml(datum.label)}</span>
                <span class="val">${datum.value}%</span>
              </div>
              <div class="bar-track">
                <span class="bar-fill" aria-hidden="true"></span>
              </div>
            </div>
          `,
        )
        .join("")}
    </div>
  `;

  return renderFigure(
    `chart chart--ranked-bar ${toneClass(options.tone)}`,
    options.title,
    body,
    options.description,
  );
}
