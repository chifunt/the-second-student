import * as d3 from "d3";
import type { ChartOptions } from "./chartTypes";
import {
  escapeHtml,
  renderEvidenceAttributes,
  renderFigure,
  toneClass,
} from "./chartUtils";

export type DivergingDatum = {
  lessLabel: string;
  lessValue: number;
  neutralLabel: string;
  neutralValue: number;
  moreLabel: string;
  moreValue: number;
};

export function renderDivergingBar(data: DivergingDatum, options: ChartOptions): string {
  const width = d3.scaleLinear().domain([0, 100]).range([0, 100]).clamp(true);
  const body = `
    <div class="diverging">
      <div class="diverging-bar">
        <div class="seg less" style="--w:${width(data.lessValue).toFixed(
          2,
        )}%;" ${renderEvidenceAttributes(data.lessLabel, data.lessValue, options.evidence)}>
          <span class="diverging-bar__label">Less</span>
          <strong class="diverging-bar__value"><span data-chart-count data-chart-target="${data.lessValue}">${data.lessValue}</span><small>%</small></strong>
        </div>
        <div class="seg no" style="--w:${width(data.neutralValue).toFixed(
          2,
        )}%;" ${renderEvidenceAttributes(data.neutralLabel, data.neutralValue, options.evidence)}>
          <span class="diverging-bar__label">No impact</span>
          <strong class="diverging-bar__value"><span data-chart-count data-chart-target="${data.neutralValue}">${data.neutralValue}</span><small>%</small></strong>
        </div>
        <div class="seg more" style="--w:${width(data.moreValue).toFixed(
          2,
        )}%;" ${renderEvidenceAttributes(data.moreLabel, data.moreValue, options.evidence)}>
          <span class="diverging-bar__label">More</span>
          <strong class="diverging-bar__value"><span data-chart-count data-chart-target="${data.moreValue}">${data.moreValue}</span><small>%</small></strong>
        </div>
      </div>
      <div class="diverging-axis">
        <span>${escapeHtml(data.lessLabel)}</span>
        <span>${escapeHtml(data.moreLabel)}</span>
      </div>
    </div>
  `;

  return renderFigure(
    `chart chart--diverging ${toneClass(options.tone)}`,
    options.title,
    body,
    options.description,
  );
}
