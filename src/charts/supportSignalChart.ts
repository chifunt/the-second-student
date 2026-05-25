import * as d3 from "d3";
import type { ChartDatum, ChartOptions } from "./chartTypes";
import {
  escapeHtml,
  renderEvidenceAttributes,
  renderFigure,
  toneClass,
} from "./chartUtils";

function findDatum(data: readonly ChartDatum[], label: string): ChartDatum | undefined {
  return data.find((datum) => datum.label === label);
}

function renderTrack(
  datum: ChartDatum,
  width: d3.ScaleLinear<number, number>,
  options: ChartOptions,
): string {
  return `
    <div class="support-signal__track" style="--w:${width(datum.value).toFixed(
      2,
    )}%;" ${renderEvidenceAttributes(datum.label, datum.value, options.evidence)}>
      <div>
        <span>${escapeHtml(datum.label)}</span>
        <strong>${datum.value}%</strong>
      </div>
      <div class="bar-track">
        <span class="bar-fill support-signal__track-fill" aria-hidden="true"></span>
      </div>
    </div>
  `;
}

export function renderSupportSignalChart(
  data: readonly ChartDatum[],
  options: ChartOptions,
): string {
  const instantSupport = findDatum(data, "Instant support");
  const outsideHours = findDatum(data, "Outside traditional study hours");
  const supportingMotives = [
    findDatum(data, "Improve quality of work"),
    findDatum(data, "Save time"),
    findDatum(data, "Personalised support"),
  ].filter((datum): datum is ChartDatum => Boolean(datum));

  if (!instantSupport || !outsideHours || supportingMotives.length === 0) {
    return "";
  }

  const width = d3.scaleLinear().domain([0, 100]).range([0, 100]).clamp(true);
  const tracks = supportingMotives
    .map((datum) => renderTrack(datum, width, options))
    .join("");

  const body = `
    <div class="support-signal">
      <div class="support-signal__hero" style="--w:${width(instantSupport.value).toFixed(
        2,
      )}%;" ${renderEvidenceAttributes(
        instantSupport.label,
        instantSupport.value,
        options.evidence,
      )}>
        <span class="support-signal__kicker">Immediate reply</span>
        <strong>${instantSupport.value}<small>%</small></strong>
        <p>Instant support</p>
        <span>The data point closest to this panic moment.</span>
        <div class="support-signal__meter" aria-hidden="true">
          <i></i>
        </div>
      </div>
      <div class="support-signal__night" style="--w:${width(outsideHours.value).toFixed(
        2,
      )}%;" ${renderEvidenceAttributes(
        outsideHours.label,
        outsideHours.value,
        options.evidence,
      )}>
        <strong>${outsideHours.value}<small>%</small></strong>
        <div>
          <span class="support-signal__kicker">After-hours support</span>
          <span>use AI outside traditional study hours</span>
        </div>
        <div class="support-signal__meter" aria-hidden="true">
          <i></i>
        </div>
      </div>
      <div class="support-signal__tracks">${tracks}</div>
      <p class="support-signal__note">Arman is alone with the email, but not alone in the behaviour.</p>
    </div>
  `;

  return renderFigure(
    `chart chart--support-signal ${toneClass(options.tone)}`,
    options.title,
    body,
    options.description,
  );
}
