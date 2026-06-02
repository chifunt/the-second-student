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
  let finalQuestionTimer: number | undefined;
  let finalSecondLineTimer: number | undefined;

  const resetFinalRevealTimers = (): void => {
    if (finalQuestionTimer) {
      window.clearTimeout(finalQuestionTimer);
    }
    if (finalSecondLineTimer) {
      window.clearTimeout(finalSecondLineTimer);
    }
    finalQuestionTimer = undefined;
    finalSecondLineTimer = undefined;
  };

  finalScene?.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    const continueButton = finalScene.querySelector<HTMLButtonElement>(".continue-btn");

    if (target.closest(".continue-btn")) {
      resetFinalRevealTimers();
      finalScene.classList.add("gated");
      finalScene.classList.remove("final-question-visible", "final-second-line-visible");
      continueButton?.classList.add("used");
      finalQuestionTimer = window.setTimeout(() => {
        finalScene.classList.add("final-question-visible");
      }, 1000);
      finalSecondLineTimer = window.setTimeout(() => {
        finalScene.classList.add("final-second-line-visible");
      }, 2000);
    }

    if (target.closest(".later")) {
      resetFinalRevealTimers();
      finalScene.classList.remove("gated");
      finalScene.classList.remove("final-question-visible", "final-second-line-visible");
      continueButton?.classList.remove("used");
    }
  });
}
