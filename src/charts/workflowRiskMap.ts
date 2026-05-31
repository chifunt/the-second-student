import * as d3 from "d3";
import type { ChartDatum, ChartOptions } from "./chartTypes";
import {
  escapeHtml,
  renderEvidenceAttributes,
  renderFigure,
  toneClass,
} from "./chartUtils";

type WorkflowZone = NonNullable<ChartDatum["zone"]>;

const zoneCopy: Record<WorkflowZone, { label: string; caption: string }> = {
  support: {
    label: "Understanding",
    caption: "AI helps the student find, explain, and organise material.",
  },
  amber: {
    label: "Drafting boundary",
    caption: "The draft starts to arrive before judgement is fully settled.",
  },
  risk: {
    label: "Authorship risk",
    caption: "The submitted words may no longer show the student.",
  },
};

const zoneOrder: WorkflowZone[] = ["support", "amber", "risk"];

const summaryLabels = [
  "Explain concepts",
  "Summarise a relevant article",
  "Include AI text directly",
] as const;

export function renderWorkflowRiskMap(
  data: readonly ChartDatum[],
  options: ChartOptions,
): string {
  const width = d3.scaleLinear().domain([0, 100]).range([0, 100]).clamp(true);
  const summary = summaryLabels
    .map((label) => data.find((datum) => datum.label === label))
    .filter((datum): datum is ChartDatum => Boolean(datum));
  const body = `
    <div class="workflow-map">
      <div class="workflow-map__summary">
        ${summary
          .map(
            (datum) => `
              <div class="workflow-map__summary-card workflow-map__summary-card--${
                datum.zone ?? "support"
              }" ${renderEvidenceAttributes(datum.label, datum.value, options.evidence)}>
                <strong><span data-chart-count data-chart-target="${datum.value}">${datum.value}</span><small>%</small></strong>
                <span>${escapeHtml(datum.label)}</span>
              </div>
            `,
          )
          .join("")}
      </div>
      ${zoneOrder
        .map((zone) => {
          const zoneItems = data.filter((datum) => datum.zone === zone);

          return `
            <section class="workflow-map__zone workflow-map__zone--${zone}">
              <div class="workflow-map__head">
                <strong>${zoneCopy[zone].label}</strong>
                <span>${zoneCopy[zone].caption}</span>
              </div>
              <div class="workflow-map__items">
                ${zoneItems
                  .map(
                    (datum) => `
                      <div class="workflow-map__item" style="--w:${width(
                        datum.value,
                      ).toFixed(2)}%;" ${renderEvidenceAttributes(
                        datum.label,
                        datum.value,
                        options.evidence,
                      )}>
                        <div class="workflow-map__meta">
                          <span>${escapeHtml(datum.label)}</span>
                          <strong><span data-chart-count data-chart-target="${datum.value}">${datum.value}</span>%</strong>
                        </div>
                        <div class="bar-track"><i class="bar-fill" aria-hidden="true"></i></div>
                      </div>
                    `,
                  )
                  .join("")}
              </div>
            </section>
          `;
        })
        .join("")}
    </div>
  `;

  return renderFigure(
    `chart chart--workflow-map ${toneClass(options.tone)}`,
    options.title,
    body,
    options.description,
  );
}
