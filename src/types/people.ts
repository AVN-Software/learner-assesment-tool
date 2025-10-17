import { Phase } from "./core";

/* ---------------------------------------------------------------------------
   👩‍🏫 FELLOWS / LEARNERS
--------------------------------------------------------------------------- */
/* 👩‍🏫 FELLOWS / LEARNERS */
export interface Fellow {
  id: string;
  name: string;
  email: string;
  coachName: string;
  yearOfFellowship: number;
}
// in "@/types/people"
export interface Learner {
  id: string;
  name: string;
  grade?: string;
  subject?: string;
  phase?: string;
  fellowId?: string;     // existing
  fellowName?: string;   // 👈 new
}

