import * as d3 from "d3";
import type { ChartDatum, ChartOptions } from "./chartTypes";
import {
  escapeHtml,
  renderEvidenceAttributes,
  renderFigure,
  toneClass,
} from "./chartUtils";

export function renderProgressBars(
  data: readonly ChartDatum[],
  options: ChartOptions,
): string {
  const width = d3.scaleLinear().domain([0, 100]).range([0, 100]).clamp(true);
  const body = `
    <div class="progress-stack">
      ${data
        .map(
          (datum) => `
            <div class="progress-stat" style="--w:${width(datum.value).toFixed(
              2,
            )}%;" ${renderEvidenceAttributes(datum.label, datum.value, options.evidence)}>
              <div class="progress-stat__num">${datum.value}<span>%</span></div>
              <div class="progress-stat__label">${escapeHtml(datum.label)}</div>
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
    `chart chart--progress ${toneClass(options.tone)}`,
    options.title,
    body,
    options.description,
  );
}
