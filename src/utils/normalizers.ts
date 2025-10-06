import { Phase } from "@/types/core";
import { CompetencyId } from "@/types/rubric";

/* ------------------ Normalizers ------------------ */
export const normalizePhase = (p: string): Phase | null => {
  const s = (p || "").trim().toLowerCase();
  if (s === "foundation") return "Foundation";
  if (s === "intermediate") return "Intermediate";
  if (s === "senior") return "Senior";
  if (s === "fet") return "FET";
  return null;
};

export const normalizeCompetency = (c: string): CompetencyId | null => {
  const s = (c || "").trim().toLowerCase();
  if (s === "motivation") return "motivation";
  if (s === "teamwork") return "teamwork";
  if (s === "analytical") return "analytical";
  if (s === "curiosity") return "curiosity";
  if (s === "leadership") return "leadership";
  return null;
};