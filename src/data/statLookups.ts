import { stats, type StatDatum } from "./surveyStats";

function findStat(data: readonly StatDatum[], label: string): StatDatum {
  const datum = data.find((item) => item.label === label);

  if (!datum) {
    throw new Error(`Missing survey stat: ${label}`);
  }

  return datum;
}

export function getAssessmentUse(label: string): StatDatum {
  return findStat(stats.assessmentUses, label);
}

export function getExperienceGroup(label: string): StatDatum {
  return findStat(stats.experienceGrouped, label);
}

export function getSourceBalanceGroup(label: string): StatDatum {
  return findStat(stats.sourceBalanceGrouped, label);
}
