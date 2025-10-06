
import { Competency } from "@/data/competencies";
import competencies from "@/data/competencies.json";
import tierDescriptors from "@/data/Phase_Competency_Tier_Descriptors.json";
import indicators from "@/data/Phase_Rubric_Indicators.json";

import {

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

/**
 * Get the description for a specific phase and tier
 * @param phase - The phase (Foundation, Intermediate, Senior, FET)
 * @param tier - The tier number (1, 2, 3)
 * @returns The tier description or empty string if not found
 */
export function getTierDescription(phase: string, tier: number): string {
  const normalizedPhase = phase.trim().toLowerCase();
  const tierNum = Number(tier);

  const descriptor = (tierDescriptors as PhaseCompetencyTierDescriptor[]).find(
    (d) =>
      d.phase.trim().toLowerCase() === normalizedPhase &&
      Number(d.tier) === tierNum
  );

  return descriptor?.description || "";
}

/**
 * Get tier descriptions for a specific phase across all tiers
 * @param phase - The phase (Foundation, Intermediate, Senior, FET)
 * @returns Object with tier numbers as keys and descriptions as values
 */
export function getPhaseTierDescriptions(phase: string): Record<number, string> {
  const normalizedPhase = phase.trim().toLowerCase();
  
  const descriptors = (tierDescriptors as PhaseCompetencyTierDescriptor[]).filter(
    (d) => d.phase.trim().toLowerCase() === normalizedPhase
  );

  const result: Record<number, string> = {};
  
  descriptors.forEach(descriptor => {
    const tierNum = Number(descriptor.tier);
    result[tierNum] = descriptor.description;
  });

  // Ensure all tiers 1-3 are present, even if empty
  for (let tier = 1; tier <= 3; tier++) {
    if (!result[tier]) {
      result[tier] = "";
    }
  }

  return result;
}

/**
 * Get tier description for a specific phase and competency
 * @param phase - The phase (Foundation, Intermediate, Senior, FET)
 * @param competencyId - The competency ID
 * @param tier - The tier number (1, 2, 3)
 * @returns The tier description or empty string if not found
 */
export function getCompetencyTierDescription(
  phase: string, 
  competencyId: string, 
  tier: number
): string {
  const normalizedPhase = phase.trim().toLowerCase();
  const normalizedCompetencyId = competencyId.trim().toLowerCase();
  const tierNum = Number(tier);

  const descriptor = (tierDescriptors as PhaseCompetencyTierDescriptor[]).find(
    (d) =>
      d.phase.trim().toLowerCase() === normalizedPhase &&
      d.competency_id.trim().toLowerCase() === normalizedCompetencyId &&
      Number(d.tier) === tierNum
  );

  return descriptor?.description || "";
}