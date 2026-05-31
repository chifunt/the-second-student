import gsap from "gsap";

function isPreparedChartElement(element: Element): boolean {
  return !element.closest(".s7");
}

function getPreparedChartElements<T extends Element>(
  container: ParentNode,
  selector: string,
): T[] {
  return Array.from(container.querySelectorAll<T>(selector)).filter(
    isPreparedChartElement,
  );
}

export function prepareCharts(container: ParentNode = document): void {
  const bars = getPreparedChartElements(container, ".bar-fill").filter(
    (bar) => !bar.closest(".workflow-map"),
  );
  const gapLines = getPreparedChartElements(container, ".gap-chart__line");
  const gapDots = getPreparedChartElements(
    container,
    ".gap-chart__actual, .gap-chart__expected",
  );
  const ladderMeters = getPreparedChartElements(container, ".rung-meter i");
  const pictogramLitIcons = getPreparedChartElements<HTMLElement>(
    container,
    ".pictogram__icon--lit",
  );
  const heroConcernDials = getPreparedChartElements<HTMLElement>(
    container,
    ".hero-concern__dial",
  );
  const supportSignalMeters = getPreparedChartElements(
    container,
    ".support-signal__meter i",
  );
  const workflowBars = getPreparedChartElements(container, ".workflow-map .bar-fill");
  const stackSegments = getPreparedChartElements(container, ".stack-100 .seg");
  const divergingSegments = getPreparedChartElements(container, ".diverging-bar .seg");
  const chartCounts = getPreparedChartElements<HTMLElement>(
    container,
    "[data-chart-count]",
  );

  chartCounts.forEach((element) => {
    element.dataset.chartFinal =
      element.dataset.chartFinal ??
      element.dataset.chartTarget ??
      element.textContent ??
      "0";
    setChartCount(element, 0);
  });

  pictogramLitIcons.forEach((icon) => {
    icon.classList.remove("pictogram__icon--active");
  });

  heroConcernDials.forEach((dial) => {
    const finalAngle =
      dial.dataset.finalAngle ??
      (dial.style.getPropertyValue("--angle").trim() ||
        getComputedStyle(dial).getPropertyValue("--angle").trim());

    dial.dataset.finalAngle = finalAngle;
    dial.style.setProperty("--angle", "0deg");
  });

  gsap.set(bars, { scaleX: 0, transformOrigin: "left center" });
  gsap.set(gapLines, { scaleX: 0, transformOrigin: "left center" });
  gsap.set(gapDots, { autoAlpha: 0, scale: 0.7, transformOrigin: "center" });
  gsap.set(ladderMeters, { scaleX: 0, transformOrigin: "left center" });
  gsap.set(supportSignalMeters, { scaleX: 0, transformOrigin: "left center" });
  gsap.set(workflowBars, { scaleX: 0, transformOrigin: "left center" });
  gsap.set(stackSegments, { scaleX: 0, transformOrigin: "left center" });
  gsap.set(divergingSegments, { scaleX: 0, transformOrigin: "center" });
}

export function animateCharts(
  timeline: gsap.core.Timeline,
  container: HTMLElement,
  position = 0.25,
): void {
  prepareCharts(container);

  const bars = Array.from(container.querySelectorAll(".bar-fill")).filter(
    (bar) => !bar.closest(".workflow-map"),
  );
  const gapLines = container.querySelectorAll(".gap-chart__line");
  const gapDots = container.querySelectorAll(".gap-chart__actual, .gap-chart__expected");
  const ladderMeters = container.querySelectorAll(".rung-meter i");
  const pictogramLitIcons = container.querySelectorAll<HTMLElement>(
    ".pictogram__icon--lit",
  );
  const heroConcernRings = container.querySelectorAll(".hero-concern__ring");
  const heroConcernDials = container.querySelectorAll<HTMLElement>(".hero-concern__dial");
  const supportSignalMeters = container.querySelectorAll(".support-signal__meter i");
  const workflowBars = container.querySelectorAll(".workflow-map .bar-fill");
  const stackSegments = container.querySelectorAll(".stack-100 .seg");
  const divergingSegments = container.querySelectorAll(".diverging-bar .seg");
  const chartCounts = container.querySelectorAll<HTMLElement>("[data-chart-count]");

  chartCounts.forEach((element, index) => {
    const target = Number(element.dataset.chartFinal ?? "0");
    const counter = { value: 0 };

    timeline.to(
      counter,
      {
        duration: 0.82,
        ease: "power2.out",
        onUpdate: () => setChartCount(element, counter.value),
        value: target,
      },
      position + index * 0.012,
    );
  });

  if (bars.length > 0) {
    timeline.to(
      bars,
      {
        duration: 0.75,
        scaleX: 1,
        stagger: 0.05,
      },
      position,
    );
  }

  if (gapLines.length > 0) {
    timeline.to(
      gapLines,
      {
        duration: 0.7,
        scaleX: 1,
        stagger: 0.12,
      },
      position,
    );
  }

  if (gapDots.length > 0) {
    timeline.to(
      gapDots,
      {
        autoAlpha: 1,
        duration: 0.45,
        scale: 1,
        stagger: 0.06,
      },
      position + 0.18,
    );
  }

  if (ladderMeters.length > 0) {
    timeline.to(
      ladderMeters,
      {
        duration: 0.55,
        scaleX: 1,
        stagger: 0.06,
      },
      position,
    );
  }

  if (pictogramLitIcons.length > 0) {
    pictogramLitIcons.forEach((icon, index) => {
      const activateAt =
        position +
        (pictogramLitIcons.length <= 1 ? 0 : index * (0.72 / pictogramLitIcons.length));

      timeline.add(() => icon.classList.add("pictogram__icon--active"), activateAt);
      timeline.fromTo(
        icon,
        {
          scale: 0.86,
        },
        {
          duration: 0.16,
          scale: 1,
        },
        activateAt,
      );
    });
  }

  if (heroConcernDials.length > 0) {
    timeline.to(
      heroConcernDials,
      {
        "--angle": (_index, target: HTMLElement) =>
          target.dataset.finalAngle && target.dataset.finalAngle.length > 0
            ? target.dataset.finalAngle
            : "0deg",
        duration: 0.45,
        ease: "power2.out",
        stagger: 0.08,
      },
      position,
    );
  }

  if (heroConcernRings.length > 0) {
    timeline.fromTo(
      heroConcernRings,
      {
        scale: 0.92,
      },
      {
        duration: 0.32,
        scale: 1,
        stagger: 0.08,
        transformOrigin: "center",
      },
      position,
    );
  }

  if (supportSignalMeters.length > 0) {
    timeline.to(
      supportSignalMeters,
      {
        duration: 0.7,
        scaleX: 1,
        stagger: 0.08,
      },
      position,
    );
  }

  if (workflowBars.length > 0) {
    timeline.to(
      workflowBars,
      {
        duration: 0.55,
        scaleX: 1,
        stagger: 0.06,
      },
      position,
    );
  }

  if (stackSegments.length > 0) {
    timeline.to(
      stackSegments,
      {
        duration: 0.7,
        scaleX: 1,
        stagger: 0.04,
      },
      position,
    );
  }

  if (divergingSegments.length > 0) {
    timeline.to(
      divergingSegments,
      {
        duration: 0.65,
        scaleX: 1,
        stagger: 0.04,
      },
      position,
    );
  }
}

function setChartCount(element: HTMLElement, value: number): void {
  const roundedValue = Math.round(value);
  const textNode = Array.from(element.childNodes).find(
    (node): node is Text => node.nodeType === Node.TEXT_NODE,
  );

  if (textNode) {
    textNode.textContent = String(roundedValue);
    return;
  }

  element.textContent = String(roundedValue);
}
