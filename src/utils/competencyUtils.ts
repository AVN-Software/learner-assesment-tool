import competencies from "@/data/competencies.json";
import tierDescriptors from "@/data/Phase_Competency_Tier_Descriptors.json";
import indicators from "@/data/Phase_Rubric_Indicators.json";

import {
  Competency,
  PhaseCompetencyTierDescriptor,
  RubricIndicator,
} from "@/types/rubric";

/**
 * Safely returns all rubric information for a specific phase × competency.
 * Ensures grouping, type-safety, and fallbacks even with incomplete JSON data.
 */
export function getPhaseCompetencyRubric(phase: string, competencyId: string) {
  // 🔹 1. Normalize identifiers (trim & lowercase)
  const normalizedPhase = phase.trim().toLowerCase();
  const normalizedCompetencyId = competencyId.trim().toLowerCase();

  // 🔹 2. Find base competency
  const competency = (competencies as Competency[]).find(
    (c) => c.competency_id.toLowerCase() === normalizedCompetencyId
  );

  if (!competency) {
    console.warn(`[RubricUtils] No competency found for ID: ${competencyId}`);
    return null;
  }

  // 🔹 3. Filter tier descriptors for this phase + competency
  const descriptors = (
    tierDescriptors as PhaseCompetencyTierDescriptor[]
  ).filter(
    (d) =>
      d.phase.trim().toLowerCase() === normalizedPhase &&
      d.competency_id.trim().toLowerCase() === normalizedCompetencyId
  );

  // 🔹 4. Filter indicators for this phase + competency
  const phaseIndicators = (indicators as RubricIndicator[]).filter(
    (i) =>
      i.phase.trim().toLowerCase() === normalizedPhase &&
      i.competency_id.trim().toLowerCase() === normalizedCompetencyId
  );

  // 🔹 5. Group by tier (1 → 3)
  const grouped = [1, 2, 3].map((tier) => {
    // handle case where tier in JSON might be "1" (string)
    const tierNum = Number(tier);
    const description =
      descriptors.find((d) => Number(d.tier) === tierNum && !!d.description)
        ?.description ?? "";

    const items = phaseIndicators.filter((i) => Number(i.tier) === tierNum);

    return {
      tier: tierNum,
      description,
      items,
    };
  });

  // 🔹 6. Sort for consistency (just in case)
  grouped.sort((a, b) => a.tier - b.tier);

  return { competency, grouped };
}
