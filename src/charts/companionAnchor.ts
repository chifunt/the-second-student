import type { ChartOptions } from "./chartTypes";
import { escapeHtml, renderFigure, toneClass } from "./chartUtils";

export type CompanionAnchorOptions = ChartOptions & {
  label: string;
  value: number;
};

export function renderCompanionAnchor(options: CompanionAnchorOptions): string {
  const litCount = Math.round(options.value);
  const icons = Array.from({ length: 100 }, (_item, index) => {
    const isLit = index < litCount;

    return `
      <span class="companion-anchor__dot${isLit ? " companion-anchor__dot--lit" : ""}" aria-hidden="true"></span>
    `;
  }).join("");
  const body = `
    <div class="companion-anchor">
      <div class="companion-anchor__stat">
        <span>${options.value}</span><small>%</small>
      </div>
      <div class="companion-anchor__label">${escapeHtml(options.label)}</div>
      <div class="companion-anchor__grid">${icons}</div>
    </div>
  `;

  return renderFigure(
    `chart chart--companion-anchor ${toneClass(options.tone)}`,
    options.title,
    body,
    options.description,
  );
}
