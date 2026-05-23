import * as d3 from "d3";
import type { ChartOptions } from "./chartTypes";
import { escapeHtml, renderFigure, toneClass } from "./chartUtils";

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
        )}%;">Less ${data.lessValue}%</div>
        <div class="seg no" style="--w:${width(data.neutralValue).toFixed(
          2,
        )}%;">No impact ${data.neutralValue}%</div>
        <div class="seg more" style="--w:${width(data.moreValue).toFixed(
          2,
        )}%;">More ${data.moreValue}%</div>
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
