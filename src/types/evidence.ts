// types/evidence.ts

import { Phase } from "./core";
import { CompetencyId, TierLevel } from "./rubric";




export interface Evidence {
  learnerId: string;          // who the note is for
  learnerName: string;        // display convenience
  phase: Phase;               // Foundation | Intermediate | Senior | FET
  competencyId: CompetencyId; // rubric competency
  competencyName: string;     // display convenience
  tierLevel: TierLevel;       // 1 | 2 | 3
  text: string;               // the evidence note
  updatedAt: string;          // ISO timestamp
}
