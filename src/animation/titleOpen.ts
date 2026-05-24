export function setupTitleOpen(reduceMotion: boolean): void {
  const titleScene = document.querySelector<HTMLElement>(".s0");
  const button = document.querySelector<HTMLButtonElement>(".s0-open");
  const next = document.querySelector<HTMLElement>(".s1");

  if (!titleScene || !button || !next) {
    return;
  }

  if (!reduceMotion && window.scrollY < 8) {
    document.body.classList.add("scroll-locked");
  }

  button.addEventListener("click", () => {
    titleScene.classList.add("opened");
    document.body.classList.remove("scroll-locked");
    next.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  });
}
