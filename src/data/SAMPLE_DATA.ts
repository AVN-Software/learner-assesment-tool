/* ---------------------------------------------------------------------------
   🎓 TTN Fellowship — Mock Data (for testing and local development)
--------------------------------------------------------------------------- */

import { Fellow, Learner } from "@/types/assessment";

/* ---------------------- Fellows ---------------------- */
export const MOCK_FELLOWS: Fellow[] = [
  {
    id: "fellow-001",
    name: "Lufuno Mudau",
    email: "lufuno.mudau@teachthenation.org",
    coachName: "Correta",
    yearOfFellowship: 2025,
  },
  {
    id: "fellow-002",
    name: "Victoria Mokhali",
    email: "victoria.mokhali@teachthenation.org",
    coachName: "Correta",
    yearOfFellowship: 2025,
  },
  {
    id: "fellow-003",
    name: "Vhuwavho Phophi",
    email: "vhuwavho.phophi@teachthenation.org",
    coachName: "Robin",
    yearOfFellowship: 2025,
  },
  {
    id: "fellow-004",
    name: "Lailaa Koopman",
    email: "lailaa.koopman@teachthenation.org",
    coachName: "Robin",
    yearOfFellowship: 2025,
  },
  {
    id: "fellow-005",
    name: "Kauthar Congo",
    email: "kauthar.congo@teachthenation.org",
    coachName: "Angie",
    yearOfFellowship: 2025,
  },
  {
    id: "fellow-006",
    name: "Siyamthanda Matiwane",
    email: "siyamthanda.matiwane@teachthenation.org",
    coachName: "Angie",
    yearOfFellowship: 2025,
  },
  {
    id: "fellow-007",
    name: "Mickayla Cummings",
    email: "mickayla.cummings@teachthenation.org",
    coachName: "Bruce",
    yearOfFellowship: 2025,
  },
  {
    id: "fellow-008",
    name: "Zikhona Ngcongo",
    email: "zikhona.ngcongo@teachthenation.org",
    coachName: "Bruce",
    yearOfFellowship: 2025,
  },
  {
    id: "fellow-009",
    name: "Nomsindisi Mbolekwa",
    email: "nomsindisi.mbolekwa@teachthenation.org",
    coachName: "Cindy",
    yearOfFellowship: 2025,
  },
  {
    id: "fellow-010",
    name: "Andrew Petersen",
    email: "andrew.petersen@teachthenation.org",
    coachName: "Cindy",
    yearOfFellowship: 2025,
  },
];

/* ---------------------- Learners ---------------------- */
export const MOCK_LEARNERS: Learner[] = [
  {
    id: "learner-001",
    fellowId: "fellow-001",
    name: "Thabo Mokoena",
    grade: "Grade 3",
    subject: "Mathematics",
    phase: "Foundation",
  },
  {
    id: "learner-002",
    fellowId: "fellow-001",
    name: "Naledi Dlamini",
    grade: "Grade 2",
    subject: "English",
    phase: "Foundation",
  },
  {
    id: "learner-003",
    fellowId: "fellow-002",
    name: "Sipho Khumalo",
    grade: "Grade 5",
    subject: "Natural Sciences",
    phase: "Intermediate",
  },
  {
    id: "learner-004",
    fellowId: "fellow-002",
    name: "Ayanda Nene",
    grade: "Grade 6",
    subject: "Life Skills",
    phase: "Intermediate",
  },
  {
    id: "learner-005",
    fellowId: "fellow-003",
    name: "Lerato Mabuza",
    grade: "Grade 8",
    subject: "Geography",
    phase: "Senior",
  },
  {
    id: "learner-006",
    fellowId: "fellow-003",
    name: "Tebogo Nkosi",
    grade: "Grade 9",
    subject: "Mathematics",
    phase: "Senior",
  },
  {
    id: "learner-007",
    fellowId: "fellow-004",
    name: "Kea Jacobs",
    grade: "Grade 11",
    subject: "English Home Language",
    phase: "FET",
  },
  {
    id: "learner-008",
    fellowId: "fellow-004",
    name: "Anele Sithole",
    grade: "Grade 12",
    subject: "Accounting",
    phase: "FET",
  },
];
