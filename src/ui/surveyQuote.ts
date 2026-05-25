import { escapeHtml } from "../charts/chartUtils";
import { copy } from "../data/copy";

type SurveyQuoteOptions = {
  className?: string;
};

function renderSourceMark(tag: "figcaption" | "span"): string {
  return `
    <${tag} class="survey-quote__source">
      <span>${escapeHtml(copy.quoteSource.label)}</span>
      <small>${escapeHtml(copy.quoteSource.detail)}</small>
    </${tag}>
  `;
}

export function renderSurveyQuote(
  quote: string,
  options: SurveyQuoteOptions = {},
): string {
  const className = ["survey-quote", options.className].filter(Boolean).join(" ");

  return `
    <figure class="${className}">
      ${renderSourceMark("figcaption")}
      <blockquote>"${escapeHtml(quote)}"</blockquote>
    </figure>
  `;
}

export function renderInlineSurveyQuote(quote: string): string {
  return `
    <span class="survey-quote survey-quote--inline">
      ${renderSourceMark("span")}
      <em>"${escapeHtml(quote)}"</em>
    </span>
  `;
}
