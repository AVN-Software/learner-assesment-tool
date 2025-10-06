// sampleData.ts

// reuse the interface
// sampleLearners.ts
import { Learner } from "@/types/learner";

export const SAMPLE_LEARNERS: Learner[] = [
  // FET (Abigail Michaels)
  {
    id: "l1",
    name: "John Smith",
    grade: "Grade 10",
    phase: "fet",
    fellowId: "f1",
  },
  {
    id: "l2",
    name: "Sarah Johnson",
    grade: "Grade 10",
    phase: "fet",
    fellowId: "f1",
  },
  {
    id: "l3",
    name: "Michael Brown",
    grade: "Grade 11",
    phase: "fet",
    fellowId: "f1",
  },
  {
    id: "l4",
    name: "Emily Davis",
    grade: "Grade 11",
    phase: "fet",
    fellowId: "f1",
  },
  {
    id: "l5",
    name: "Daniel Wilson",
    grade: "Grade 12",
    phase: "fet",
    fellowId: "f1",
  },

  // Foundation (Sipho Mokoena)
  {
    id: "l6",
    name: "Lerato Khumalo",
    grade: "Grade 3",
    phase: "foundation",
    fellowId: "f2",
  },
  {
    id: "l7",
    name: "Thabo Dlamini",
    grade: "Grade 2",
    phase: "foundation",
    fellowId: "f2",
  },
  {
    id: "l8",
    name: "Naledi Molefe",
    grade: "Grade 1",
    phase: "foundation",
    fellowId: "f2",
  },
  {
    id: "l9",
    name: "Kgosi Nkosi",
    grade: "Grade R",
    phase: "foundation",
    fellowId: "f2",
  },
  {
    id: "l10",
    name: "Ayanda Zulu",
    grade: "Grade 3",
    phase: "foundation",
    fellowId: "f2",
  },

  // Intermediate (Stephanie Nel)
  {
    id: "l11",
    name: "Kabelo Mthembu",
    grade: "Grade 4",
    phase: "intermediate",
    fellowId: "f3",
  },
  {
    id: "l12",
    name: "Palesa Radebe",
    grade: "Grade 5",
    phase: "intermediate",
    fellowId: "f3",
  },
  {
    id: "l13",
    name: "Sibongile Ndlovu",
    grade: "Grade 6",
    phase: "intermediate",
    fellowId: "f3",
  },
  {
    id: "l14",
    name: "Mpho Mashaba",
    grade: "Grade 6",
    phase: "intermediate",
    fellowId: "f3",
  },
  {
    id: "l15",
    name: "Karabo Shabalala",
    grade: "Grade 5",
    phase: "intermediate",
    fellowId: "f3",
  },

  // Senior (David Oliphant)
  {
    id: "l16",
    name: "Zanele Mokoena",
    grade: "Grade 7",
    phase: "senior",
    fellowId: "f4",
  },
  {
    id: "l17",
    name: "Siphesihle Mbatha",
    grade: "Grade 8",
    phase: "senior",
    fellowId: "f4",
  },
  {
    id: "l18",
    name: "Tumi Phiri",
    grade: "Grade 9",
    phase: "senior",
    fellowId: "f4",
  },
  {
    id: "l19",
    name: "Jabu Sibanda",
    grade: "Grade 7",
    phase: "senior",
    fellowId: "f4",
  },
  {
    id: "l20",
    name: "Nandi Cele",
    grade: "Grade 9",
    phase: "senior",
    fellowId: "f4",
  },
];

// sampleFellows.ts
import { Fellow } from "@/types/learner";

export const SAMPLE_FELLOWS: Fellow[] = [
  {
    id: "f1",
    name: "Ms. Abigail Michaels",
    coachName: "Robin Williams",
    schoolName: "Elsies River Secondary",
    schoolLevel: "Secondary",
  },
  {
    id: "f2",
    name: "Mr. Sipho Mokoena",
    coachName: "Cindy Gamanie",
    schoolName: "William Lloyd Primary",
    schoolLevel: "Primary",
  },
  {
    id: "f3",
    name: "Ms. Stephanie Nel",
    coachName: "Bruce Oom",
    schoolName: "Stellenbosch Intermediate",
    schoolLevel: "Intermediate",
  },
  {
    id: "f4",
    name: "Mr. David Oliphant",
    coachName: "Angie Nord",
    schoolName: "Cape Town Senior",
    schoolLevel: "Senior",
  },
];
