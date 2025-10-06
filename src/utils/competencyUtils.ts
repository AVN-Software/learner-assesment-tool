import competencies from "@/data/competencies.json";
import tierDescriptors from "@/data/Phase_Competency_Tier_Descriptors.json";
import indicators from "@/data/Phase_Rubric_Indicators.json";

import {
  Competency,
  PhaseCompetencyTierDescriptor,
  RubricIndicator,
} from "@/types/rubric";

/**
 * Return all rubric data for a specific phase × competency
 */
export function getPhaseCompetencyRubric(
  phase: "Foundation" | "Intermediate" | "Senior" | "FET",
  competencyId: string
) {
  // 1️⃣ Get base competency info
  const competency = (competencies as Competency[]).find(
    (c) => c.competency_id === competencyId
  );

  if (!competency) return null;

  // 2️⃣ Get tier descriptors
  const descriptors = (
    tierDescriptors as PhaseCompetencyTierDescriptor[]
  ).filter((d) => d.phase === phase && d.competency_id === competencyId);

  // 3️⃣ Get indicators
  const phaseIndicators = (indicators as RubricIndicator[]).filter(
    (i) => i.phase === phase && i.competency_id === competencyId
  );

  // 4️⃣ Group by tier
  const grouped = [1, 2, 3].map((tier) => ({
    tier,
    description: descriptors.find((d) => d.tier === tier)?.description ?? "",
    items: phaseIndicators.filter((i) => i.tier === tier),
  }));

  return { competency, grouped };
}
