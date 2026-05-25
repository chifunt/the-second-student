export type StatDatum = {
  label: string;
  value: number;
  note?: string;
  sourceTable?: string;
  zone?: "support" | "amber" | "risk";
};

export type SurveySource = {
  title: string;
  publisher: string;
  reportNumber: string;
  year: number;
  url: string;
  fieldwork: string;
  sample: string;
  workbook: string;
  marginOfError: string;
};

export const surveySource: SurveySource = {
  title: "Student Generative Artificial Intelligence Survey 2026",
  publisher: "Higher Education Policy Institute, sponsored by Kortext",
  reportNumber: "HEPI Report 199",
  year: 2026,
  url: "https://www.hepi.ac.uk/reports/student-generative-ai-survey-2026/",
  fieldwork: "December 2025",
  sample: "1,054 full-time UK undergraduates",
  workbook: "Third-version-of-2026-weighted-data.xlsx",
  marginOfError: "Approximately +/-3 percentage points",
};

export const stats = {
  adoption: {
    aiUse: 95,
    genAiAssessment: 94,
  },

  barriers: [
    { label: "Being accused of cheating", value: 42, sourceTable: "Table 34" },
    { label: "False results / hallucinations", value: 35, sourceTable: "Table 34" },
    { label: "Biased results", value: 32, sourceTable: "Table 34" },
    { label: "Environmental impact", value: 23, sourceTable: "Table 34" },
    {
      label: "Institution discourages or bans AI",
      value: 21,
      sourceTable: "Table 34",
    },
  ],

  motivations: [
    { label: "Improve quality of work", value: 47, sourceTable: "Table 33" },
    { label: "Save time", value: 45, sourceTable: "Table 33" },
    { label: "Instant support", value: 38, sourceTable: "Table 33" },
    { label: "Personalised support", value: 31, sourceTable: "Table 33" },
    {
      label: "Outside traditional study hours",
      value: 28,
      sourceTable: "Table 33",
    },
  ],

  assessmentUses: [
    {
      label: "Explain concepts",
      value: 61,
      sourceTable: "Table 18",
      zone: "support",
    },
    {
      label: "Summarise a relevant article",
      value: 49,
      sourceTable: "Table 18",
      zone: "support",
    },
    {
      label: "Suggest research ideas",
      value: 40,
      sourceTable: "Table 18",
      zone: "support",
    },
    {
      label: "Structure thoughts",
      value: 39,
      sourceTable: "Table 18",
      zone: "support",
    },
    {
      label: "Search the internet",
      value: 36,
      sourceTable: "Table 18",
      zone: "support",
    },
    {
      label: "Generate text, then edit",
      value: 25,
      sourceTable: "Table 18",
      zone: "amber",
    },
    {
      label: "Include AI text directly",
      value: 12,
      sourceTable: "Table 18",
      zone: "risk",
    },
  ],

  supportGap: {
    essentialSkills: 68,
    staffCareerSupport: 48,
    shouldProvideTools: 50,
    doesProvideTools: 38,
  },

  experience: {
    better: 49,
    noImpact: 35,
    worse: 16,
  },

  experienceGrouped: [
    { label: "Better", value: 49, sourceTable: "Table 37" },
    { label: "No significant impact", value: 35, sourceTable: "Table 37" },
    { label: "Worse", value: 16, sourceTable: "Table 37" },
  ],

  experienceDetailed: [
    { label: "Significantly worse", value: 3, sourceTable: "Table 37" },
    { label: "Somewhat worse", value: 13, sourceTable: "Table 37" },
    { label: "No significant impact", value: 35, sourceTable: "Table 37" },
    { label: "Somewhat better", value: 40, sourceTable: "Table 37" },
    { label: "Significantly better", value: 9, sourceTable: "Table 37" },
  ],

  sourceBalance: {
    aiFirst: 37,
    balanced: 29,
    traditionalFirst: 34,
  },

  sourceBalanceGrouped: [
    { label: "AI-first", value: 37, sourceTable: "Table 38" },
    { label: "Balanced", value: 29, sourceTable: "Table 38" },
    { label: "Traditional-first", value: 34, sourceTable: "Table 38" },
  ],

  sourceBalanceDetailed: [
    {
      label: "Mostly AI, rarely traditional sources",
      value: 8,
      sourceTable: "Table 38",
    },
    { label: "Both, but AI more", value: 29, sourceTable: "Table 38" },
    { label: "Equal balance", value: 29, sourceTable: "Table 38" },
    {
      label: "Both, but traditional sources more",
      value: 21,
      sourceTable: "Table 38",
    },
    {
      label: "Mostly traditional sources",
      value: 13,
      sourceTable: "Table 38",
    },
  ],

  loneliness: {
    companionshipUse: 15,
    lessLonely: 21,
    noImpact: 59,
    moreLonely: 20,
  },

  finalRecap: [
    { label: "Use AI", value: 95 },
    { label: "Use GenAI for assessed work", value: 94 },
    { label: "Better experience", value: 49 },
    { label: "Worse experience", value: 16 },
    { label: "AI skills essential", value: 68 },
    { label: "Feel supported", value: 48 },
  ],
} as const;

export const sourceNotes = {
  adoption: "Workbook prevalence tables and HEPI/Kortext report summary.",
  assessmentUses: "Workbook Table 18, Q2a.",
  motivations: "Workbook Table 33.",
  barriers: "Workbook Table 34.",
  supportGap: "Workbook Tables 28, 29, 30, 31, and 32.",
  experience: "Workbook Table 37.",
  sourceBalance: "Workbook Table 38.",
  loneliness: "Workbook Tables 34 and 35.",
  quotes:
    "The workbook contains weighted aggregate tables; survey quote cards use short excerpts from HEPI Report 199 open-text responses, with no respondent identified.",
} as const;
