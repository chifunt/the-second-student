export type StatDatum = {
  label: string;
  value: number;
  note?: string;
  sourceTable?: string;
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
    { label: "Being accused of cheating", value: 42, sourceTable: "Table 23" },
    { label: "False results / hallucinations", value: 35, sourceTable: "Table 23" },
    { label: "Biased results", value: 32, sourceTable: "Table 23" },
    { label: "Environmental impact", value: 23, sourceTable: "Table 23" },
    {
      label: "Institution discourages or bans AI",
      value: 21,
      sourceTable: "Table 23",
    },
  ],

  motivations: [
    { label: "Improve quality of work", value: 47, sourceTable: "Table 22" },
    { label: "Save time", value: 45, sourceTable: "Table 22" },
    { label: "Instant support", value: 38, sourceTable: "Table 22" },
    { label: "Personalised support", value: 31, sourceTable: "Table 22" },
    {
      label: "Outside traditional study hours",
      value: 28,
      sourceTable: "Table 22",
    },
  ],

  assessmentUses: [
    { label: "Explain concepts", value: 61, sourceTable: "Table 18" },
    { label: "Summarise a relevant article", value: 49, sourceTable: "Table 18" },
    { label: "Suggest research ideas", value: 40, sourceTable: "Table 18" },
    { label: "Structure thoughts", value: 39, sourceTable: "Table 18" },
    { label: "Search the internet", value: 36, sourceTable: "Table 18" },
    { label: "Generate text, then edit", value: 25, sourceTable: "Table 18" },
    { label: "Include AI text directly", value: 12, sourceTable: "Table 18" },
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
  motivations: "Workbook Table 22.",
  barriers: "Workbook Table 23.",
  supportGap: "Workbook Tables 29 and 30.",
  loneliness: "Workbook Tables 34 and 35.",
  quotes:
    "Short fragments are used as illustrative free-text-derived material, not attributed to identifiable respondents.",
} as const;
