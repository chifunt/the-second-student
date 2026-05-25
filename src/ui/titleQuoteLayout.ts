export type FloatingQuote = {
  text: string;
  voice: "ai" | "student";
};

export type TitleQuoteLayoutItem = FloatingQuote & {
  delay: number;
  depth: "far" | "mid" | "near";
  duration: number;
  lane: number;
  y: number;
};

const DESKTOP_LANES = 18;
const DESKTOP_ACTIVE_QUOTES = 36;

function getQuoteDepth(
  quote: FloatingQuote,
  index: number,
): TitleQuoteLayoutItem["depth"] {
  if (quote.text.length > 34) {
    return "far";
  }

  if (quote.voice === "ai" && index % 3 !== 0) {
    return "near";
  }

  return index % 4 === 0 ? "far" : "mid";
}

function getLanePopulation(index: number, activeCount: number): number {
  const lane = index % DESKTOP_LANES;
  let population = 0;

  for (let item = lane; item < activeCount; item += DESKTOP_LANES) {
    population += 1;
  }

  return population;
}

export function getTitleQuoteLayout(
  quotes: readonly FloatingQuote[],
): TitleQuoteLayoutItem[] {
  const activeCount = Math.min(DESKTOP_ACTIVE_QUOTES, quotes.length);

  return Array.from({ length: activeCount }, (_, index) => {
    // Sample across the whole pool so the visible set contains both HEPI-grounded
    // student fragments and the more synthetic AI-response texture.
    const quote = quotes[Math.floor((index * quotes.length) / activeCount)] ?? quotes[0];
    const lane = index % DESKTOP_LANES;
    const lanePosition = Math.floor(index / DESKTOP_LANES);
    const lanePopulation = getLanePopulation(index, activeCount);
    const duration = 31 + (lane % 6) * 3.4 + (quote.text.length > 34 ? 6 : 0);
    const delay = -((lanePosition / lanePopulation) * duration + lane * 0.32);

    return {
      ...quote,
      delay,
      depth: getQuoteDepth(quote, index),
      duration,
      lane,
      y: 4 + lane * 5.25,
    };
  });
}
