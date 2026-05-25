import type { ChartOptions } from "./chartTypes";
import {
  escapeHtml,
  renderEvidenceAttributes,
  renderFigure,
  toneClass,
} from "./chartUtils";

export type PictogramOptions = ChartOptions & {
  label: string;
  value: number;
  total?: number;
};

export function renderPictogram(options: PictogramOptions): string {
  const total = options.total ?? 100;
  const litCount = Math.round((options.value / 100) * total);
  const icons = Array.from({ length: total }, (_item, index) => {
    const isLit = index < litCount;

    return `
      <span
        class="pictogram__icon${isLit ? " pictogram__icon--lit" : ""}"
        aria-hidden="true"
        style="--i:${index};"
      >
        <svg viewBox="0 0 16 16" focusable="false">
          <circle cx="8" cy="4.25" r="2.45" />
          <path d="M3.7 14c.35-3.1 2-5.05 4.3-5.05S11.95 10.9 12.3 14z" />
        </svg>
      </span>
    `;
  }).join("");

  const body = `
    <div class="pictogram" aria-label="${escapeHtml(
      `${options.value} of ${total} students ${options.label}`,
    )}" ${renderEvidenceAttributes(options.title, `${options.value} of ${total}`, options.evidence)}>
      <div class="pictogram__headline">
        <span>${options.value}</span><small>of ${total}</small>
      </div>
      <div class="pictogram__label">${escapeHtml(options.label)}</div>
      <div class="pictogram__grid">${icons}</div>
    </div>
  `;

  return renderFigure(
    `chart chart--pictogram ${toneClass(options.tone)}`,
    options.title,
    body,
    options.description,
  );
}
