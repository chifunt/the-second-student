import type { StatDatum } from "../data/surveyStats";

export type ChartTone = "risk" | "support" | "neutral" | "mixed";

export type ChartOptions = {
  title: string;
  tone?: ChartTone;
  description?: string;
  evidence?: EvidenceContext;
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

export type EvidenceBreakdown = {
  label: string;
  value: number;
};

export type EvidenceContext = {
  source: string;
  question: string;
  base?: string;
  note?: string;
  breakdown?: readonly EvidenceBreakdown[];
  interpretations?: Readonly<Record<string, string>>;
};
