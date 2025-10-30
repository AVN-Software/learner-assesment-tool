import { Grade, Phase } from "@/types/core";

// Helper: Derive phase from grade
export const derivePhaseFromGrade = (grade: Grade): Phase => {
  if (["Grade R", "Grade 1", "Grade 2", "Grade 3"].includes(grade)) {
    return "Foundation";
  }
  if (["Grade 4", "Grade 5", "Grade 6"].includes(grade)) {
    return "Intermediate";
  }
  if (["Grade 7", "Grade 8", "Grade 9"].includes(grade)) {
    return "Senior";
  }
  if (["Grade 10", "Grade 11", "Grade 12"].includes(grade)) {
    return "FET";
  }
  return "Foundation"; // fallback
};
