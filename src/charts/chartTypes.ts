import type { StatDatum } from "../data/surveyStats";

export type ChartTone = "risk" | "support" | "neutral" | "mixed";

export type ChartOptions = {
  title: string;
  tone?: ChartTone;
  description?: string;
};

export type ChartDatum = StatDatum;

export type GapDatum = {
  label: string;
  expected: number;
  actual: number;
  expectedLabel: string;
  actualLabel: string;
};

export type StackDatum = {
  label: string;
  value: number;
  tone: ChartTone;
};
