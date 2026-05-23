import { escapeHtml } from "../charts/chartUtils";
import { sourceNotes, surveySource } from "../data/surveyStats";
import type { SceneConfig } from "../scenes/sceneTypes";

export function renderStoryChrome(scenes: readonly SceneConfig[]): void {
  document.querySelector(".progress")?.remove();
  document.querySelector(".about-toggle")?.remove();
  document.querySelector(".about-drawer")?.remove();

  const progress = document.createElement("nav");
  progress.className = "progress";
  progress.setAttribute("aria-label", "Scene navigation");

  scenes.forEach((scene, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.target = scene.id;
    button.setAttribute("aria-label", `Go to scene ${index}: ${scene.title}`);
    progress.appendChild(button);
  });

  const aboutButton = document.createElement("button");
  aboutButton.type = "button";
  aboutButton.className = "about-toggle";
  aboutButton.setAttribute("aria-controls", "about-drawer");
  aboutButton.textContent = "About the data";

  const drawer = document.createElement("aside");
  drawer.className = "about-drawer";
  drawer.id = "about-drawer";
  drawer.setAttribute("role", "region");
  drawer.setAttribute("aria-label", "About the data");
  drawer.innerHTML = `
    <button class="close" type="button" aria-label="Close">close x</button>
    <h3>About the data</h3>
    <p>This story uses the HEPI / Kortext <em>${escapeHtml(
      surveySource.title,
    )}</em>, based on ${escapeHtml(
      surveySource.sample,
    )} surveyed by Savanta in ${escapeHtml(surveySource.fieldwork)}.</p>
    <p>The workbook <span class="mono">${escapeHtml(
      surveySource.workbook,
    )}</span> is treated as canonical for the displayed figures. ${escapeHtml(
      surveySource.marginOfError,
    )}. ${escapeHtml(sourceNotes.quotes)}</p>
    <a href="${escapeHtml(
      surveySource.url,
    )}" target="_blank" rel="noreferrer">View HEPI report</a>
  `;

  document.body.prepend(drawer);
  document.body.prepend(aboutButton);
  document.body.prepend(progress);
}
