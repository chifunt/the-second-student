export type StatDatum = {
  label: string;
  value: number;
  note?: string;
};

export type SurveySource = {
  title: string;
  publisher: string;
  reportNumber: string;
  year: number;
  url: string;
  fieldwork: string;
  sample: string;
};

export const surveySource: SurveySource = {
  title: "Student Generative Artificial Intelligence Survey 2026",
  publisher: "Higher Education Policy Institute, sponsored by Kortext",
  reportNumber: "HEPI Report 199",
  year: 2026,
  url: "https://www.hepi.ac.uk/reports/student-generative-ai-survey-2026/",
  fieldwork: "December 2025",
  sample: "1,054 full-time UK undergraduates",
};

export const stats = {
  adoption: {
    aiUse: 95,
    genAiAssessment: 94,
  },

  barriers: [
    { label: "Being accused of cheating", value: 42 },
    { label: "False results / hallucinations", value: 35 },
    { label: "Biased results", value: 32 },
    { label: "Environmental impact", value: 23 },
    { label: "Institution discourages or bans AI", value: 21 },
  ],

  motivations: [
    { label: "Improve quality of work", value: 47 },
    { label: "Save time", value: 45 },
    { label: "Instant support", value: 38 },
    { label: "Personalised support", value: 31 },
    { label: "Outside traditional study hours", value: 28 },
  ],

  assessmentUses: [
    { label: "Explain concepts", value: 61 },
    { label: "Summarise a relevant article", value: 49 },
    { label: "Suggest research ideas", value: 40 },
    { label: "Structure thoughts", value: 39 },
    { label: "Search the internet", value: 36 },
    { label: "Generate text, then edit", value: 25 },
    { label: "Include AI text directly", value: 12 },
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
