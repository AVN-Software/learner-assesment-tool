import { Fellow, Learner } from "@/types/people";

/* ---------------------------------------------------------------------------
   🎓 TTN Fellowship — Mock Data (All Coaches Complete)
--------------------------------------------------------------------------- */

/* ---------------------- Fellows ---------------------- */
export const MOCK_FELLOWS: Fellow[] = [
  // Cindy
  {
    id: "fellow-001",
    name: "Nomsindisi Mbolekwa",
    email: "nomsindisimbolekwa2@gmail.com",
    coachName: "Cindy",
    yearOfFellowship: 2025,
  },
  {
    id: "fellow-002",
    name: "Andrew Petersen",
    email: "3856571@myuwc.ac.za",
    coachName: "Cindy",
    yearOfFellowship: 2025,
  },

  // Bruce
  {
    id: "fellow-003",
    name: "Mickayla Cummings",
    email: "mickayla0201@gmail.com",
    coachName: "Bruce",
    yearOfFellowship: 2025,
  },
  {
    id: "fellow-004",
    name: "Zikhona Ngcongo",
    email: "zikhonan2209@gmail.com",
    coachName: "Bruce",
    yearOfFellowship: 2025,
  },

  // Angie
  {
    id: "fellow-005",
    name: "Kauthar Congo",
    email: "kautharcongo1@gmail.com",
    coachName: "Angie",
    yearOfFellowship: 2025,
  },
  {
    id: "fellow-006",
    name: "Siyamthanda Matiwabe",
    email: "matiwanesiya1999@gmail.com",
    coachName: "Angie",
    yearOfFellowship: 2025,
  },

  // Robin
  {
    id: "fellow-007",
    name: "Lailaa Koopman",
    email: "lailaakoopman10@gmail.com",
    coachName: "Robin",
    yearOfFellowship: 2025,
  },
  {
    id: "fellow-008",
    name: "Vhuwavho Pophi",
    email: "vhuhwavhop@gmail.com",
    coachName: "Robin",
    yearOfFellowship: 2025,
  },

  // Corretta
  {
    id: "fellow-009",
    name: "Lufuno Mudau",
    email: "lufuno.mudau@teachthenation.org",
    coachName: "Corretta",
    yearOfFellowship: 2025,
  },
  {
    id: "fellow-010",
    name: "Victoria Mokhali",
    email: "victoria.mokhali@teachthenation.org",
    coachName: "Corretta",
    yearOfFellowship: 2025,
  },
];

/* ---------------------- Learners ---------------------- */
export const MOCK_LEARNERS: Learner[] = [
  // Cindy → Nomsindisi Mbolekwa
  { id: "learner-001", fellowId: "fellow-001", name: "Hanna De Jongh", grade: "Grade 3", subject: "English Literacy", phase: "Foundation" },
  { id: "learner-002", fellowId: "fellow-001", name: "Liyema Khwaza", grade: "Grade 2", subject: "Mathematics", phase: "Foundation" },
  { id: "learner-003", fellowId: "fellow-001", name: "Sihle Sanayi", grade: "Grade 3", subject: "Life Skills", phase: "Foundation" },
  { id: "learner-004", fellowId: "fellow-001", name: "Naila Cupido", grade: "Grade 1", subject: "English Literacy", phase: "Foundation" },
  { id: "learner-005", fellowId: "fellow-001", name: "Mbali Mpanda", grade: "Grade 2", subject: "Numeracy", phase: "Foundation" },

  // Bruce → Mickayla Cummings
  { id: "learner-006", fellowId: "fellow-003", name: "Nyasha Dondo", grade: "Grade 7", subject: "Mathematics", phase: "Senior" },
  { id: "learner-007", fellowId: "fellow-003", name: "Abdul Meyer", grade: "Grade 8", subject: "Natural Sciences", phase: "Senior" },
  { id: "learner-008", fellowId: "fellow-003", name: "Lesedi Nyati", grade: "Grade 9", subject: "English Home Language", phase: "Senior" },
  { id: "learner-009", fellowId: "fellow-003", name: "Sintiche Berry", grade: "Grade 7", subject: "Social Sciences", phase: "Senior" },
  { id: "learner-010", fellowId: "fellow-003", name: "Unako Kem", grade: "Grade 8", subject: "Mathematics", phase: "Senior" },

  // Bruce → Zikhona Ngcongo
  { id: "learner-011", fellowId: "fellow-004", name: "Leonard Zubair Azeez", grade: "Grade 5", subject: "Mathematics", phase: "Intermediate" },
  { id: "learner-012", fellowId: "fellow-004", name: "Madlakamela Thandile", grade: "Grade 6", subject: "English Home Language", phase: "Intermediate" },
  { id: "learner-013", fellowId: "fellow-004", name: "Mapuza Esona", grade: "Grade 4", subject: "Life Skills", phase: "Intermediate" },
  { id: "learner-014", fellowId: "fellow-004", name: "Mujinga Jenovic", grade: "Grade 5", subject: "Natural Sciences", phase: "Intermediate" },
  { id: "learner-015", fellowId: "fellow-004", name: "Christians Tamia", grade: "Grade 6", subject: "Social Sciences", phase: "Intermediate" },

  // Angie → Kauthar Congo
  { id: "learner-016", fellowId: "fellow-005", name: "Liyah Hoffman", grade: "Grade 8", subject: "Mathematics", phase: "Senior" },
  { id: "learner-017", fellowId: "fellow-005", name: "Ziyaad Joubert", grade: "Grade 7", subject: "Natural Sciences", phase: "Senior" },
  { id: "learner-018", fellowId: "fellow-005", name: "Kensley Bailey", grade: "Grade 9", subject: "English Home Language", phase: "Senior" },
  { id: "learner-019", fellowId: "fellow-005", name: "Aafiyah Adams", grade: "Grade 8", subject: "Life Orientation", phase: "Senior" },
  { id: "learner-020", fellowId: "fellow-005", name: "Keenan Maclula", grade: "Grade 9", subject: "Mathematics", phase: "Senior" },

  // Angie → Siyamthanda Matiwabe
  { id: "learner-021", fellowId: "fellow-006", name: "Sikho Nakile", grade: "Grade 4", subject: "English Home Language", phase: "Intermediate" },
  { id: "learner-022", fellowId: "fellow-006", name: "Aqhama Alven", grade: "Grade 4", subject: "Mathematics", phase: "Intermediate" },
  { id: "learner-023", fellowId: "fellow-006", name: "Libongo Mabuda", grade: "Grade 5", subject: "Life Skills", phase: "Intermediate" },
  { id: "learner-024", fellowId: "fellow-006", name: "Iviwe Mankayi", grade: "Grade 6", subject: "Natural Sciences", phase: "Intermediate" },
  { id: "learner-025", fellowId: "fellow-006", name: "Palesa Khaele", grade: "Grade 5", subject: "Social Sciences", phase: "Intermediate" },

  // Robin → Lailaa Koopman
  { id: "learner-026", fellowId: "fellow-007", name: "Jordan Kagan", grade: "Grade 10", subject: "Mathematics", phase: "FET" },
  { id: "learner-027", fellowId: "fellow-007", name: "Vaughan Edson", grade: "Grade 11", subject: "Physical Sciences", phase: "FET" },
  { id: "learner-028", fellowId: "fellow-007", name: "Raymond Ibrahim", grade: "Grade 12", subject: "English Home Language", phase: "FET" },
  { id: "learner-029", fellowId: "fellow-007", name: "Promise Mwale", grade: "Grade 10", subject: "Life Orientation", phase: "FET" },
  { id: "learner-030", fellowId: "fellow-007", name: "Christiana Eniola", grade: "Grade 11", subject: "Accounting", phase: "FET" },

  // Corretta → Lufuno Mudau
  { id: "learner-031", fellowId: "fellow-009", name: "Thabo Mokoena", grade: "Grade 4", subject: "Mathematics", phase: "Intermediate" },
  { id: "learner-032", fellowId: "fellow-009", name: "Naledi Dlamini", grade: "Grade 4", subject: "English Home Language", phase: "Intermediate" },
  { id: "learner-033", fellowId: "fellow-009", name: "Ayanda Nene", grade: "Grade 5", subject: "Life Skills", phase: "Intermediate" },
  { id: "learner-034", fellowId: "fellow-009", name: "Sipho Khumalo", grade: "Grade 6", subject: "Natural Sciences", phase: "Intermediate" },
  { id: "learner-035", fellowId: "fellow-009", name: "Lerato Mabuza", grade: "Grade 5", subject: "Social Sciences", phase: "Intermediate" },

  // Corretta → Victoria Mokhali
  { id: "learner-036", fellowId: "fellow-010", name: "Kea Jacobs", grade: "Grade 10", subject: "English Home Language", phase: "FET" },
  { id: "learner-037", fellowId: "fellow-010", name: "Anele Sithole", grade: "Grade 11", subject: "Accounting", phase: "FET" },
  { id: "learner-038", fellowId: "fellow-010", name: "Tebogo Nkosi", grade: "Grade 12", subject: "Mathematics", phase: "FET" },
  { id: "learner-039", fellowId: "fellow-010", name: "Kea Lebepe", grade: "Grade 10", subject: "Life Orientation", phase: "FET" },
  { id: "learner-040", fellowId: "fellow-010", name: "Refilwe Mofokeng", grade: "Grade 11", subject: "Physical Sciences", phase: "FET" },
];
