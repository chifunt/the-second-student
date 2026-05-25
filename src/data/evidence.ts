import { stats, surveySource } from "./surveyStats";

const allRespondents = `Base: ${surveySource.sample}`;

export const evidence = {
  adoption: {
    source: "Workbook Table 17 / HEPI report summary",
    question:
      "Which of the following have you used artificial intelligence (AI) for this academic year?",
    base: allRespondents,
    note: "The overview combines reported AI use across listed purposes.",
  },
  assessmentPrevalence: {
    source: "Workbook Table 18, Q2a",
    question:
      "When thinking about using generative AI to prepare assessed work, which of the following have you ever done?",
    base: allRespondents,
    note: `${stats.adoption.genAiAssessment}% represents students who reported at least one generative-AI use connected to assessed work.`,
  },
  barriers: {
    source: "Workbook Table 34, Q10b",
    question:
      "Which of the below, if any, are reasons which make you less likely to use generative AI tools for your studies?",
    base: allRespondents,
    note: "These are barriers to use, so the same number can signal both caution and anxiety.",
    interpretations: {
      "Being accused of cheating":
        "Academic-risk concern; this is the leading barrier in the chart.",
      "False results / hallucinations":
        "Information-risk concern; the tool may sound confident while being wrong.",
      "Biased results": "Information-risk concern; output quality is also a trust issue.",
      "Environmental impact": "System-cost concern; the barrier is not only academic.",
      "Institution discourages or bans AI":
        "Academic-risk concern; institutional rules shape whether use feels safe.",
    },
  },
  motivations: {
    source: "Workbook Table 33, Q10a",
    question:
      "Which of the below, if any, are reasons which make you more likely to use generative AI tools for your studies?",
    base: allRespondents,
    note: "Motivations are shown on a true 0-100 scale.",
    interpretations: {
      "Instant support": "The closest survey motive to Arman's panic-chat moment.",
      "Outside traditional study hours":
        "Availability matters when institutional support is offline.",
      "Improve quality of work": "A performance motive, not only a shortcut motive.",
      "Save time": "Efficiency is one reason the chat opens quickly.",
      "Personalised support": "The tool feels tailored even when the setting is generic.",
    },
  },
  assessmentUses: {
    source: "Workbook Table 18, Q2a",
    question:
      "When thinking about using generative AI to prepare assessed work, which of the following have you ever done?",
    base: allRespondents,
    note: "The zones are narrative groupings; the percentages are workbook values.",
    interpretations: {
      "Explain concepts":
        "Support zone: understanding comes before the student's submitted words.",
      "Summarise a relevant article":
        "Support zone: AI compresses source material, but judgement still selects what matters.",
      "Suggest research ideas":
        "Support zone: idea generation still needs student filtering.",
      "Structure thoughts":
        "Support zone: ordering ideas can preserve the student's argument.",
      "Search the internet": "Support zone: discovery still requires source checking.",
      "Generate text, then edit":
        "Drafting-boundary zone: generated prose enters before judgement is fully settled.",
      "Include AI text directly":
        "Authorship-risk zone: submitted words may no longer show the student's thinking.",
    },
  },
  supportGap: {
    source: "Workbook Tables 28, 29, 30, and 32",
    question:
      "Selected institutional-support statements about AI skills, staff support, and provided AI tools.",
    base: allRespondents,
    note: "Each line compares a student expectation or need with what students say is available.",
  },
  experience: {
    source: "Workbook Table 37, Q12a",
    question:
      "Overall, how do you believe the use of generative AI has impacted your student experience?",
    base: allRespondents,
    note: "The visible chart is grouped; this detail shows the full response spread.",
    breakdown: stats.experienceDetailed,
    interpretations: {
      Better: "Grouped from somewhat better and significantly better.",
      "No significant impact":
        "The middle response keeps the mirror scene from becoming a binary story.",
      Worse: "Grouped from somewhat worse and significantly worse.",
    },
  },
  sourceBalance: {
    source: "Workbook Table 38, Q13",
    question:
      "Which option best captures how you typically work with generative AI and traditional sources?",
    base: allRespondents,
    note: "The visible chart is grouped; this detail shows the five original response options.",
    breakdown: stats.sourceBalanceDetailed,
    interpretations: {
      "AI-first": "Grouped from students who mostly use AI or use both but use AI more.",
      Balanced: "Students reporting an equal balance of AI and traditional sources.",
      "Traditional-first":
        "Grouped from students who use both but lean traditional, or mostly use traditional sources.",
    },
  },
  companionshipUse: {
    source: "Workbook Table 17, Q1",
    question:
      "Which of the following have you used artificial intelligence (AI) for this academic year?",
    base: allRespondents,
    note: "This item is the share using AI for friendship, company, advice, or tackling loneliness.",
  },
  lonelinessImpact: {
    source: "Workbook Table 36, Q11_1",
    question: "How does generative AI impact your level of loneliness?",
    base: allRespondents,
    note: "The visible chart groups significantly/somewhat less lonely and significantly/somewhat more lonely.",
    breakdown: [
      { label: "Significantly less lonely", value: 4 },
      { label: "Somewhat less lonely", value: 17 },
      { label: "No impact", value: 59 },
      { label: "Somewhat more lonely", value: 15 },
      { label: "Significantly more lonely", value: 5 },
    ],
  },
  finalRecap: {
    adoption: {
      source: "Workbook Table 17 / HEPI report summary",
      question: "Any reported AI use during the academic year.",
      base: allRespondents,
      note: "Headline prevalence sets the scale for the story.",
    },
    assessment: {
      source: "Workbook Table 18, Q2a",
      question: "Any reported generative-AI use connected to assessed work.",
      base: allRespondents,
      note: "The assessed-work figure is why the email scene is not an edge case.",
    },
    better: {
      source: "Workbook Table 37, Q12a",
      question: "Overall impact of generative AI on student experience.",
      base: allRespondents,
      note: "Grouped better response.",
    },
    worse: {
      source: "Workbook Table 37, Q12a",
      question: "Overall impact of generative AI on student experience.",
      base: allRespondents,
      note: "Grouped worse response.",
    },
    skills: {
      source: "Workbook Table 29, Q8.3",
      question:
        "To thrive in today's world, it is essential to understand and be able to use AI effectively.",
      base: allRespondents,
      note: "Net agree.",
    },
    support: {
      source: "Workbook Table 31, Q8.6",
      question: "Teaching staff help me develop AI skills for my future career.",
      base: allRespondents,
      note: "Net agree.",
    },
  },
} as const;
