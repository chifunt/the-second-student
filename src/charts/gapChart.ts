import * as d3 from "d3";
import type { ChartOptions, GapDatum } from "./chartTypes";
import { escapeHtml, renderFigure, toneClass } from "./chartUtils";

export function renderGapChart(data: readonly GapDatum[], options: ChartOptions): string {
  const position = d3.scaleLinear().domain([0, 100]).range([0, 100]).clamp(true);
  const body = `
    <div class="dumbbells">
      ${data
        .map((datum) => {
          const low = Math.min(datum.actual, datum.expected);
          const high = Math.max(datum.actual, datum.expected);
          return `
            <div class="dumbbell">
              <div class="dumbbell__title">${escapeHtml(datum.label)}</div>
              <div
                class="dumbbell-axis"
                style="--have:${position(datum.actual).toFixed(2)}%;--need:${position(
                  datum.expected,
                ).toFixed(2)}%;--low:${position(low).toFixed(2)}%;--high:${position(
                  high,
                ).toFixed(2)}%;"
              >
                <div class="dumbbell-bar gap-chart__line" aria-hidden="true"></div>
                <div class="dumbbell-node have gap-chart__actual" aria-hidden="true"></div>
                <div class="dumbbell-node need gap-chart__expected" aria-hidden="true"></div>
                <div class="dumbbell-label have">${datum.actual}%</div>
                <div class="dumbbell-label need">${datum.expected}%</div>
                <div class="dumbbell-gap">${Math.abs(datum.expected - datum.actual)} pt gap</div>
              </div>
              <div class="dumbbell-legend">
                <span><i class="sw have"></i>${escapeHtml(datum.actualLabel)}</span>
                <span><i class="sw need"></i>${escapeHtml(datum.expectedLabel)}</span>
              </div>
            </div>
          `;
        })
        .join("")}
    </div>
  `;

  return renderFigure(
    `chart chart--gap ${toneClass(options.tone)}`,
    options.title,
    body,
    options.description,
  );
}
