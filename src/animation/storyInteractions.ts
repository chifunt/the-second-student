export function setupAboutDrawer(): void {
  const toggle = document.querySelector<HTMLButtonElement>(".about-toggle");
  const drawer = document.querySelector<HTMLElement>(".about-drawer");
  const close = drawer?.querySelector<HTMLButtonElement>(".close");

  toggle?.addEventListener("click", () => drawer?.classList.toggle("open"));
  close?.addEventListener("click", () => drawer?.classList.remove("open"));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      drawer?.classList.remove("open");
    }
  });
}

export function setupInteractiveDetails(): void {
  document.querySelectorAll<HTMLButtonElement>(".ladder .rung").forEach((rung) => {
    rung.addEventListener("click", () => {
      const alreadyOpen = rung.classList.contains("open");
      rung.parentElement
        ?.querySelectorAll(".rung")
        .forEach((item) => item.classList.remove("open"));

      if (!alreadyOpen) {
        rung.classList.add("open");
      }
    });
  });

  const finalScene = document.querySelector<HTMLElement>(".s10");
  finalScene?.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    const continueButton = finalScene.querySelector<HTMLButtonElement>(".continue-btn");

    if (target.closest(".continue-btn")) {
      finalScene.classList.add("gated");
      finalScene.classList.add("final-question-visible");
      continueButton?.classList.add("used");
    }

    if (target.closest(".later")) {
      finalScene.classList.remove("gated");
      continueButton?.classList.remove("used");
    }
  });
}
