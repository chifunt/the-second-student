import "./styles/main.scss";
import { setupScroll } from "./animation/setupScroll";
import { scenes } from "./scenes";
import { renderStoryChrome } from "./ui/storyChrome";

const app = document.querySelector<HTMLElement>("#app");

if (!app) {
  throw new Error("Missing #app root");
}

app.innerHTML = "";
renderStoryChrome(scenes);

for (const scene of scenes) {
  const section = document.createElement("section");
  section.id = scene.id;
  section.className = `scene scene--${scene.mode}`;
  section.dataset.scene = scene.id;
  section.setAttribute("role", "region");
  section.setAttribute("aria-labelledby", `${scene.id}-title`);

  scene.render(section);
  app.appendChild(section);
}

setupScroll(scenes);
