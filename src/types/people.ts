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
export interface Learner {
  id: string;
  fellowId: string;
  name: string;
  grade: string;
  subject: string;
  phase: Phase;
}


