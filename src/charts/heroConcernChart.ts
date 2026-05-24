import * as d3 from "d3";
import type { ChartDatum, ChartOptions } from "./chartTypes";
import { escapeHtml, renderFigure, toneClass } from "./chartUtils";

export function renderHeroConcernChart(
  data: readonly ChartDatum[],
  options: ChartOptions,
): string {
  const [hero, ...rest] = data;

  if (!hero) {
    return "";
  }

  const angle = d3.scaleLinear().domain([0, 100]).range([0, 360]).clamp(true);
  const max = Math.max(50, d3.max(rest, (datum) => datum.value) ?? 50);
  const width = d3.scaleLinear().domain([0, max]).range([0, 100]).clamp(true);
  const strips = rest
    .map(
      (datum) => `
        <div class="hero-concern__strip" style="--w:${width(datum.value).toFixed(2)}%;">
          <span>${escapeHtml(datum.label)}</span>
          <strong>${datum.value}%</strong>
          <div class="bar-track"><i class="bar-fill" aria-hidden="true"></i></div>
        </div>
      `,
    )
    .join("");

  const body = `
    <div class="hero-concern">
      <div class="hero-concern__dial" style="--angle:${angle(hero.value).toFixed(2)}deg;">
        <div class="hero-concern__ring" aria-hidden="true">
          <span>${hero.value}<small>%</small></span>
        </div>
        <div class="hero-concern__label">${escapeHtml(hero.label)}</div>
      </div>
      <div class="hero-concern__note">The email does not create the fear. It gives the fear a subject line.</div>
      <div class="hero-concern__strips">${strips}</div>
    </div>
  `;

  return renderFigure(
    `chart chart--hero-concern ${toneClass(options.tone)}`,
    options.title,
    body,
    options.description,
  );
}
