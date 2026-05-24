import * as d3 from "d3";
import type { ChartDatum, ChartOptions } from "./chartTypes";
import { escapeHtml, renderFigure, toneClass } from "./chartUtils";

type WorkflowZone = NonNullable<ChartDatum["zone"]>;

const zoneCopy: Record<WorkflowZone, { label: string; caption: string }> = {
  support: {
    label: "Support",
    caption: "The student still decides what matters.",
  },
  amber: {
    label: "Amber",
    caption: "The draft starts to arrive before judgement.",
  },
  risk: {
    label: "Authorship risk",
    caption: "The submitted words may no longer show the student.",
  },
};

const zoneOrder: WorkflowZone[] = ["support", "amber", "risk"];

export function renderWorkflowRiskMap(
  data: readonly ChartDatum[],
  options: ChartOptions,
): string {
  const width = d3.scaleLinear().domain([0, 70]).range([0, 100]).clamp(true);
  const body = `
    <div class="workflow-map">
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
                      ).toFixed(2)}%;">
                        <div class="workflow-map__meta">
                          <span>${escapeHtml(datum.label)}</span>
                          <strong>${datum.value}%</strong>
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
