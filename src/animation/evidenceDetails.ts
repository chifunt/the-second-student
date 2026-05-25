import { escapeHtml } from "../charts/chartUtils";

let controller: AbortController | undefined;

function getEvidenceTarget(target: EventTarget | null): HTMLElement | null {
  return target instanceof Element
    ? target.closest<HTMLElement>("[data-evidence-title]")
    : null;
}

function renderCard(card: HTMLElement, target: HTMLElement): void {
  const { evidenceTitle, evidenceValue, evidenceSource, evidenceQuestion, evidenceBase } =
    target.dataset;
  const evidenceNote = target.dataset.evidenceNote;
  const evidenceBreakdown = target.dataset.evidenceBreakdown;

  card.innerHTML = `
    <div class="evidence-card__eyebrow">Survey evidence</div>
    <h3>${escapeHtml(evidenceTitle ?? "Evidence")}</h3>
    <div class="evidence-card__value">${escapeHtml(evidenceValue ?? "")}</div>
    ${
      evidenceNote ? `<p class="evidence-card__note">${escapeHtml(evidenceNote)}</p>` : ""
    }
    <dl>
      ${
        evidenceSource
          ? `<div><dt>Source</dt><dd>${escapeHtml(evidenceSource)}</dd></div>`
          : ""
      }
      ${
        evidenceBase ? `<div><dt>Base</dt><dd>${escapeHtml(evidenceBase)}</dd></div>` : ""
      }
      ${
        evidenceQuestion
          ? `<div><dt>Question</dt><dd>${escapeHtml(evidenceQuestion)}</dd></div>`
          : ""
      }
      ${
        evidenceBreakdown
          ? `<div><dt>Breakdown</dt><dd>${escapeHtml(evidenceBreakdown)}</dd></div>`
          : ""
      }
    </dl>
  `;
}

function positionCard(card: HTMLElement, target: HTMLElement): void {
  const targetBox = target.getBoundingClientRect();
  const cardBox = card.getBoundingClientRect();
  const margin = 12;
  const mobile = window.innerWidth < 760;
  const maxLeft = window.innerWidth - cardBox.width - margin;
  const maxTop = window.innerHeight - cardBox.height - margin;
  const clampLeft = (left: number) => Math.min(Math.max(margin, left), maxLeft);
  const clampTop = (top: number) => Math.min(Math.max(margin, top), maxTop);
  const verticalCenter = targetBox.top + targetBox.height / 2 - cardBox.height / 2;

  const placements = mobile
    ? [
        { left: targetBox.left, top: targetBox.bottom + margin },
        { left: targetBox.left, top: targetBox.top - cardBox.height - margin },
      ]
    : [
        { left: targetBox.right + margin, top: verticalCenter },
        { left: targetBox.left - cardBox.width - margin, top: verticalCenter },
        { left: targetBox.left, top: targetBox.bottom + margin },
        { left: targetBox.left, top: targetBox.top - cardBox.height - margin },
      ];

  const placement =
    placements.find(
      ({ left, top }) =>
        left >= margin &&
        top >= margin &&
        left + cardBox.width <= window.innerWidth - margin &&
        top + cardBox.height <= window.innerHeight - margin,
    ) ?? placements[0];
  const left = clampLeft(placement.left);
  const top = clampTop(placement.top);

  card.style.left = `${left}px`;
  card.style.top = `${top}px`;
}

function closeCard(card: HTMLElement): void {
  card.classList.remove("is-visible", "is-pinned");
  document
    .querySelectorAll<HTMLElement>("[data-evidence-title].is-evidence-active")
    .forEach((element) => element.classList.remove("is-evidence-active"));
}

function showCard(card: HTMLElement, target: HTMLElement, pinned = false): void {
  renderCard(card, target);
  card.classList.add("is-visible");
  card.classList.toggle("is-pinned", pinned);
  document
    .querySelectorAll<HTMLElement>("[data-evidence-title].is-evidence-active")
    .forEach((element) => element.classList.remove("is-evidence-active"));
  target.classList.add("is-evidence-active");
  positionCard(card, target);
}

export function setupEvidenceDetails(): void {
  controller?.abort();
  controller = new AbortController();

  document.querySelector(".evidence-card")?.remove();

  const card = document.createElement("aside");
  card.id = "evidence-detail-card";
  card.className = "evidence-card";
  card.setAttribute("role", "tooltip");
  document.body.appendChild(card);

  const { signal } = controller;

  document.addEventListener(
    "pointerover",
    (event) => {
      const target = getEvidenceTarget(event.target);

      if (target && !card.classList.contains("is-pinned")) {
        showCard(card, target);
      }
    },
    { signal },
  );

  document.addEventListener(
    "pointerout",
    (event) => {
      const target = getEvidenceTarget(event.target);
      const nextTarget = getEvidenceTarget(event.relatedTarget);

      if (target && target !== nextTarget && !card.classList.contains("is-pinned")) {
        closeCard(card);
      }
    },
    { signal },
  );

  document.addEventListener(
    "focusin",
    (event) => {
      const target = getEvidenceTarget(event.target);

      if (target) {
        showCard(card, target);
      }
    },
    { signal },
  );

  document.addEventListener(
    "focusout",
    (event) => {
      if (
        !getEvidenceTarget(event.relatedTarget) &&
        !card.classList.contains("is-pinned")
      ) {
        closeCard(card);
      }
    },
    { signal },
  );

  document.addEventListener(
    "click",
    (event) => {
      const target = getEvidenceTarget(event.target);

      if (target) {
        event.preventDefault();
        event.stopPropagation();

        if (
          card.classList.contains("is-pinned") &&
          target.classList.contains("is-evidence-active")
        ) {
          closeCard(card);
          return;
        }

        showCard(card, target, true);
        return;
      }

      if (!card.contains(event.target as Node)) {
        closeCard(card);
      }
    },
    { signal },
  );

  document.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "Escape") {
        closeCard(card);
      }
    },
    { signal },
  );

  window.addEventListener(
    "resize",
    () => {
      const active = document.querySelector<HTMLElement>(
        "[data-evidence-title].is-evidence-active",
      );

      if (active && card.classList.contains("is-visible")) {
        positionCard(card, active);
      }
    },
    { signal },
  );
}
