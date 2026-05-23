import { surveySource } from "../data/surveyStats";
import { escapeHtml } from "../charts/chartUtils";

export function renderSourcePanel(): string {
  return `
    <aside class="source-panel" aria-label="About the data">
      <p class="source-panel__eyebrow">About the data</p>
      <h3>${escapeHtml(surveySource.reportNumber)}</h3>
      <p>${escapeHtml(surveySource.title)}</p>
      <dl>
        <div>
          <dt>Publisher</dt>
          <dd>${escapeHtml(surveySource.publisher)}</dd>
        </div>
        <div>
          <dt>Fieldwork</dt>
          <dd>${escapeHtml(surveySource.fieldwork)}</dd>
        </div>
        <div>
          <dt>Sample</dt>
          <dd>${escapeHtml(surveySource.sample)}</dd>
        </div>
      </dl>
      <a href="${escapeHtml(surveySource.url)}" target="_blank" rel="noreferrer">View source report</a>
    </aside>
  `;
}
