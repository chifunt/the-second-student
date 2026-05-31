import * as d3 from "d3";
import type { ChartDatum, ChartOptions } from "./chartTypes";
import {
  escapeHtml,
  renderEvidenceAttributes,
  renderFigure,
  toneClass,
} from "./chartUtils";

type ConcernTone = "academic" | "information" | "system";

type ConcernColor = {
  label: string;
  tone: ConcernTone;
};

function concernColorFor(label: string): ConcernColor {
  const normalized = label.toLowerCase();

  if (normalized.includes("accused") || normalized.includes("institution")) {
    return { label: "Academic risk", tone: "academic" };
  }

  if (
    normalized.includes("false") ||
    normalized.includes("hallucination") ||
    normalized.includes("biased")
  ) {
    return { label: "Information risk", tone: "information" };
  }

  return { label: "System cost", tone: "system" };
}

export function renderHeroConcernChart(
  data: readonly ChartDatum[],
  options: ChartOptions,
): string {
  if (data.length === 0) {
    return "";
  }

  const angle = d3.scaleLinear().domain([0, 100]).range([0, 360]).clamp(true);
  const dials = data
    .map((datum, index) => {
      const isHero = index === 0;
      const color = concernColorFor(datum.label);

      return `
        <div class="hero-concern__dial hero-concern__dial--${color.tone}${
          isHero ? " hero-concern__dial--primary" : ""
        }" style="--angle:${angle(datum.value).toFixed(2)}deg;" ${renderEvidenceAttributes(
          datum.label,
          datum.value,
          options.evidence,
        )}>
          <div class="hero-concern__ring" aria-hidden="true">
            <span data-chart-count data-chart-target="${datum.value}">${datum.value}<small>%</small></span>
          </div>
          <div class="hero-concern__kind">${escapeHtml(color.label)}</div>
          <div class="hero-concern__label">${escapeHtml(datum.label)}</div>
        </div>
      `;
    })
    .join("");

  const body = `
    <div class="hero-concern">
      <div class="hero-concern__grid">${dials}</div>
      <div class="hero-concern__note">The email does not create the fear. It gives the fear a subject line.</div>
    </div>
  `;

  return renderFigure(
    `chart chart--hero-concern ${toneClass(options.tone)}`,
    options.title,
    body,
    options.description,
  );
}
