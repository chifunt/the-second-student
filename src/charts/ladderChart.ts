import { escapeHtml, renderFigure, toneClass } from "./chartUtils";
import type { ChartOptions } from "./chartTypes";

export function renderLadderChart(
  rungs: readonly string[],
  options: ChartOptions,
): string {
  const body = `
    <ol class="ladder-chart" aria-label="${escapeHtml(options.title)}">
      ${rungs
        .map(
          (rung, index) => `
            <li class="ladder-chart__rung">
              <span class="ladder-chart__index">${index + 1}</span>
              <span>${escapeHtml(rung)}</span>
            </li>
          `,
        )
        .join("")}
    </ol>
  `;

  return renderFigure(
    `chart chart--ladder ${toneClass(options.tone)}`,
    options.title,
    body,
    options.description,
  );
}
