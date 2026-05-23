import * as d3 from "d3";
import type { ChartDatum, ChartOptions } from "./chartTypes";
import { escapeHtml, renderFigure, toneClass } from "./chartUtils";

export function renderDialGrid(
  data: readonly ChartDatum[],
  options: ChartOptions,
): string {
  const angle = d3.scaleLinear().domain([0, 100]).range([0, 360]).clamp(true);
  const body = `
    <div class="dials">
      ${data
        .map(
          (datum, index) => `
            <div class="dial${index === 0 ? " dial--wide" : ""}" style="--pct:${
              datum.value
            };--angle:${angle(datum.value).toFixed(2)}deg;">
              <div class="dial-ring" aria-hidden="true">
                <span>${datum.value}%</span>
              </div>
              <div class="dial-label">${escapeHtml(datum.label)}</div>
            </div>
          `,
        )
        .join("")}
    </div>
  `;

  return renderFigure(
    `chart chart--dials ${toneClass(options.tone)}`,
    options.title,
    body,
    options.description,
  );
}
