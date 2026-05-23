import { escapeHtml } from "../charts/chartUtils";

export type WindowChromeOptions = {
  title: string;
  body: string;
  meta?: string;
};

export function renderWindowChrome(options: WindowChromeOptions): string {
  return `
    <article class="window-chrome">
      <header class="window-chrome__bar">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <strong>${escapeHtml(options.title)}</strong>
      </header>
      <div class="window-chrome__body">
        ${options.meta ? `<p class="window-chrome__meta">${escapeHtml(options.meta)}</p>` : ""}
        ${options.body}
      </div>
    </article>
  `;
}
