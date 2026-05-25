import * as d3 from "d3";
import type { ChartTone, EvidenceContext } from "./chartTypes";

const htmlEntities: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export function escapeHtml(value: string): string {
  // Chart and UI helpers return template strings, so text is escaped at the
  // boundary where data becomes markup.
  return value.replace(/[&<>"']/g, (character) => htmlEntities[character] ?? character);
}

export function toneClass(tone: ChartTone = "neutral"): string {
  return `chart--${tone}`;
}

export function createSvgChart(
  title: string,
  width: number,
  height: number,
): d3.Selection<SVGSVGElement, undefined, null, undefined> {
  const svg = d3
    .create("svg")
    .attr("class", "chart__svg")
    .attr("role", "img")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet");

  svg.append("title").text(title);
  return svg;
}

function formatBreakdown(context: EvidenceContext): string | undefined {
  if (!context.breakdown || context.breakdown.length === 0) {
    return undefined;
  }

  return context.breakdown.map((datum) => `${datum.label}: ${datum.value}%`).join(" | ");
}

export function renderEvidenceAttributes(
  title: string,
  value: number | string,
  context: EvidenceContext | undefined,
): string {
  if (!context) {
    return "";
  }

  const payload = {
    title,
    value: typeof value === "number" ? `${value}%` : value,
    source: context.source,
    question: context.question,
    base: context.base,
    note: context.interpretations?.[title] ?? context.note,
    breakdown: formatBreakdown(context),
  };

  const dataAttributes = Object.entries(payload)
    .filter((entry): entry is [string, string] => Boolean(entry[1]))
    .map(([key, datum]) => `data-evidence-${key}="${escapeHtml(datum)}"`)
    .join(" ");

  return `${dataAttributes} tabindex="0" role="button" aria-describedby="evidence-detail-card" aria-label="Show evidence for ${escapeHtml(
    title,
  )}"`;
}

export function renderFigure(
  className: string,
  title: string,
  body: string,
  description?: string,
): string {
  return `
    <figure class="${className}" aria-label="${escapeHtml(title)}">
      <figcaption>${escapeHtml(title)}</figcaption>
      ${description ? `<p class="chart__description">${escapeHtml(description)}</p>` : ""}
      ${body}
    </figure>
  `;
}
