// rubricTypes.ts

// Phase Codes - these match the keys in LEARNER_RUBRIC_SYSTEM.phases
export type PhaseCode = "foundation" | "intermediate" | "senior" | "fet";

export type TierKey = "tier1" | "tier2" | "tier3";
export type TierName =
  | "Tier 1: Emerging Learner"
  | "Tier 2: Progressing Learner"
  | "Tier 3: Advancing Learner";

export type CompetencyArea =
  | "Academic Outcomes"
  | "Teamwork"
  | "Curiosity and Creativity"
  | "Analytic Thinking"
  | "Leadership"
  | "Motivation and Self-Awareness";

export type CompetencyCategory = "overall" | "SE" | "AII" | "KPC" | "IA" | "LE";

export type CompetencyTierData = {
  description: string;
  learnerPhrase: string;
};

export type CompetencyData = {
  category: CompetencyCategory;
  tiers: Record<TierKey, CompetencyTierData>;
};

export type RubricPhase = {
  phaseName: string;
  phaseCode: PhaseCode; // Now properly typed
  description?: string;
  competencies: Record<CompetencyArea, CompetencyData>;
};

export type LearnerRubricSystem = {
  phases: Record<PhaseCode, RubricPhase>; // Now properly typed with PhaseCode
  metadata: {
    version: string;
    academicYear: string;
    tiers: Record<TierKey, TierName>;
  };
};

// Helper function to get all phase codes
export const ALL_PHASE_CODES: PhaseCode[] = [
  "foundation",
  "intermediate",
  "senior",
  "fet",
];

// Helper function to validate phase codes
export function isValidPhaseCode(code: string): code is PhaseCode {
  return ALL_PHASE_CODES.includes(code as PhaseCode);
}

// Type guard for phase code
export function assertPhaseCode(code: string): asserts code is PhaseCode {
  if (!isValidPhaseCode(code)) {
    throw new Error(
      `Invalid phase code: ${code}. Must be one of: ${ALL_PHASE_CODES.join(
        ", "
      )}`
    );
  }
}

// tiers.ts - Consistent across all phases
export const TIER_DEFINITIONS = {
  tier1: "Emerging Learner",
  tier2: "Progressing Learner",
  tier3: "Advancing Learner",
} as const;

export const FOUNDATION_PHASE: RubricPhase = {
  phaseName: "Foundation Phase",
  phaseCode: "foundation",
  description: "Core developmental competencies for early learners ages 5-7",

  competencies: {
    "Academic Outcomes": {
      category: "overall",
      tiers: {
        tier1: {
          description: "Recognizes letters, numbers, and simple concepts.",
          learnerPhrase: "I don't know.",
        },
        tier2: {
          description: "Applies simple knowledge to familiar tasks.",
          learnerPhrase: "I remember!",
        },
        tier3: {
          description: "Explains basic concepts or stories in own words.",
          learnerPhrase: "I can tell you what happened!",
        },
      },
    },

    Teamwork: {
      category: "SE",
      tiers: {
        tier1: {
          description: "Plays near others with support.",
          learnerPhrase: "Can I play alone?",
        },
        tier2: {
          description: "Shares toys or materials in group activities.",
          learnerPhrase: "Let's share.",
        },
        tier3: {
          description:
            "Initiates helping peers and group tasks without prompting.",
          learnerPhrase: "Let's do this together!",
        },
      },
    },

    "Curiosity and Creativity": {
      category: "AII",
      tiers: {
        tier1: {
          description: "Responds to teacher prompts.",
          learnerPhrase: "What do I do?",
        },
        tier2: {
          description: 'Asks simple "why" questions.',
          learnerPhrase: "Why is it like that?",
        },
        tier3: {
          description: "Creates drawings, stories, or ideas independently.",
          learnerPhrase: "Can I draw my own idea?",
        },
      },
    },

    "Analytic Thinking": {
      category: "KPC",
      tiers: {
        tier1: {
          description: "Names objects and facts with support.",
          learnerPhrase: "Is this right?",
        },
        tier2: {
          description: "Groups objects by categories.",
          learnerPhrase: "They are the same!",
        },
        tier3: {
          description: "Notices simple patterns and differences independently.",
          learnerPhrase: "I see a pattern!",
        },
      },
    },

    Leadership: {
      category: "IA",
      tiers: {
        tier1: {
          description: "Follows basic classroom routines.",
          learnerPhrase: "What do I do next?",
        },
        tier2: {
          description: "Volunteers for helper roles (e.g., line leader).",
          learnerPhrase: "I'll do it!",
        },
        tier3: {
          description: "Encourages peers and leads simple group activities.",
          learnerPhrase: "Come with me!",
        },
      },
    },

    "Motivation and Self-Awareness": {
      category: "LE",
      tiers: {
        tier1: {
          description: "Completes tasks with reminders.",
          learnerPhrase: "Do I have to?",
        },
        tier2: {
          description: "Begins tasks independently after instruction.",
          learnerPhrase: "I'll start now!",
        },
        tier3: {
          description:
            "Expresses pride in completing tasks and reflects on effort.",
          learnerPhrase: "I worked really hard!",
        },
      },
    },
  },
};
// intermediate-phase.ts - Different content, same structure
export const INTERMEDIATE_PHASE: RubricPhase = {
  phaseName: "Intermediate Phase",
  phaseCode: "intermediate",
  description:
    "Developing independent learning skills and deeper conceptual understanding",

  competencies: {
    "Academic Outcomes": {
      category: "overall",
      tiers: {
        tier1: {
          description: "Recalls facts when asked directly.",
          learnerPhrase: "I don't get it.",
        },
        tier2: {
          description: "Applies knowledge to basic problem-solving.",
          learnerPhrase: "I think I know how!",
        },
        tier3: {
          description: "Connects and applies knowledge across subjects.",
          learnerPhrase: "This connects to what we learned before!",
        },
      },
    },

    Teamwork: {
      category: "SE",
      tiers: {
        tier1: {
          description: "Works quietly alongside others.",
          learnerPhrase: "Do I have to work with them?",
        },
        tier2: {
          description: "Shares responsibilities during group tasks.",
          learnerPhrase: "Let's do it together.",
        },
        tier3: {
          description: "Supports peers to complete group work effectively.",
          learnerPhrase: "I can help the group finish.",
        },
      },
    },

    "Curiosity and Creativity": {
      category: "AII",
      tiers: {
        tier1: {
          description: "Responds to teacher-led exploration.",
          learnerPhrase: "Is that right?",
        },
        tier2: {
          description: "Asks follow-up questions about topics.",
          learnerPhrase: "Why does it work that way?",
        },
        tier3: {
          description:
            "Develops original ideas or projects based on classroom learning.",
          learnerPhrase: "Can I try a different way?",
        },
      },
    },

    "Analytic Thinking": {
      category: "KPC",
      tiers: {
        tier1: {
          description: "Answers basic questions with guidance.",
          learnerPhrase: "What happened?",
        },
        tier2: {
          description: "Connects cause and effect in familiar situations.",
          learnerPhrase: "Because it caused...",
        },
        tier3: {
          description: "Evaluates ideas or solutions with evidence.",
          learnerPhrase: "I can prove it because...",
        },
      },
    },

    Leadership: {
      category: "IA",
      tiers: {
        tier1: {
          description: "Listens when peers speak.",
          learnerPhrase: "Can someone else go first?",
        },
        tier2: {
          description: "Takes initiative in small group discussions.",
          learnerPhrase: "I can help start.",
        },
        tier3: {
          description: "Organizes peers to complete classroom-based tasks.",
          learnerPhrase: "I'll organise who does what.",
        },
      },
    },

    "Motivation and Self-Awareness": {
      category: "LE",
      tiers: {
        tier1: {
          description: "Needs encouragement to complete tasks.",
          learnerPhrase: "This is too hard.",
        },
        tier2: {
          description: "Sets learning goals with teacher support.",
          learnerPhrase: "I'll try again.",
        },
        tier3: {
          description: "Reflects on learning success and areas to improve.",
          learnerPhrase: "Next time I want to improve by...",
        },
      },
    },
  },
};

export const SENIOR_PHASE: RubricPhase = {
  phaseName: "Senior Phase",
  phaseCode: "senior",
  description:
    "Developing advanced critical thinking, independence, and real-world application skills",

  competencies: {
    "Academic Outcomes": {
      category: "overall",
      tiers: {
        tier1: {
          description: "Remembers isolated facts with support.",
          learnerPhrase: "I just memorized it.",
        },
        tier2: {
          description: "Applies learned material to basic new tasks.",
          learnerPhrase: "I see how to use this.",
        },
        tier3: {
          description:
            "Applies knowledge to real-world scenarios with growing independence.",
          learnerPhrase: "This reminds me of real life because...",
        },
      },
    },

    Teamwork: {
      category: "SE",
      tiers: {
        tier1: {
          description: "Participates when directed.",
          learnerPhrase: "I guess I'll join.",
        },
        tier2: {
          description: "Contributes ideas in a group.",
          learnerPhrase: "Let's share the work.",
        },
        tier3: {
          description: "Initiates collaboration and supports team goals.",
          learnerPhrase: "How can we make this work better?",
        },
      },
    },

    "Curiosity and Creativity": {
      category: "AII",
      tiers: {
        tier1: {
          description: "Answers teacher questions with prompting.",
          learnerPhrase: "What page are we on?",
        },
        tier2: {
          description: "Asks meaningful 'how' and 'why' questions.",
          learnerPhrase: "Why does it happen like that?",
        },
        tier3: {
          description:
            "Proposes new ideas or project approaches independently.",
          learnerPhrase: "What if we change it like this?",
        },
      },
    },

    "Analytic Thinking": {
      category: "KPC",
      tiers: {
        tier1: {
          description: "Repeats facts when prompted.",
          learnerPhrase: "The book says...",
        },
        tier2: {
          description: "Draws basic conclusions from information.",
          learnerPhrase: "I think it means...",
        },
        tier3: {
          description:
            "Evaluates arguments or solutions with growing independence.",
          learnerPhrase: "I disagree because the evidence shows...",
        },
      },
    },

    Leadership: {
      category: "IA",
      tiers: {
        tier1: {
          description: "Responds to teacher leadership.",
          learnerPhrase: "Do I have to lead?",
        },
        tier2: {
          description: "Volunteers to lead small tasks.",
          learnerPhrase: "I'll help lead.",
        },
        tier3: {
          description: "Coordinates small teams for classroom projects.",
          learnerPhrase: "Let's plan the project together.",
        },
      },
    },

    "Motivation and Self-Awareness": {
      category: "LE",
      tiers: {
        tier1: {
          description: "Works when supported.",
          learnerPhrase: "I don't care.",
        },
        tier2: {
          description: "Sets academic goals with guidance.",
          learnerPhrase: "I'll try to get better.",
        },
        tier3: {
          description: "Independently adjusts strategies based on feedback.",
          learnerPhrase: "I realised I needed a new plan.",
        },
      },
    },
  },
};

export const FET_PHASE: RubricPhase = {
  phaseName: "FET Phase",
  phaseCode: "fet",
  description:
    "Developing advanced academic independence, real-world problem-solving, and leadership capabilities for further education and career readiness",

  competencies: {
    "Academic Outcomes": {
      category: "overall",
      tiers: {
        tier1: {
          description: "Struggles to complete academic tasks independently.",
          learnerPhrase: "I don't get it.",
        },
        tier2: {
          description:
            "Applies knowledge to structured academic problems with guidance.",
          learnerPhrase: "I think this is how to do it.",
        },
        tier3: {
          description:
            "Applies knowledge flexibly to real-world and interdisciplinary tasks.",
          learnerPhrase: "We can use this to solve real problems!",
        },
      },
    },

    Teamwork: {
      category: "SE",
      tiers: {
        tier1: {
          description: "Participates in groups when prompted.",
          learnerPhrase: "I'll just listen.",
        },
        tier2: {
          description: "Shares leadership roles during projects.",
          learnerPhrase: "Let's share the roles.",
        },
        tier3: {
          description:
            "Supports team collaboration and mentors peers informally.",
          learnerPhrase: "I'll guide the group and check in.",
        },
      },
    },

    "Curiosity and Creativity": {
      category: "AII",
      tiers: {
        tier1: {
          description: "Shows surface-level engagement with new topics.",
          learnerPhrase: "Is this on the test?",
        },
        tier2: {
          description: "Investigates familiar real-world problems.",
          learnerPhrase: "What happens if we try this?",
        },
        tier3: {
          description:
            "Designs projects addressing real-world problems creatively.",
          learnerPhrase: "Let's design a project for this.",
        },
      },
    },

    "Analytic Thinking": {
      category: "KPC",
      tiers: {
        tier1: {
          description: "Identifies basic causes and effects with support.",
          learnerPhrase: "We just have to memorise it.",
        },
        tier2: {
          description: "Builds structured arguments using evidence.",
          learnerPhrase: "I think the cause was...",
        },
        tier3: {
          description:
            "Analyzes complex problems and shares reasoned solutions.",
          learnerPhrase: "This solution works because...",
        },
      },
    },

    Leadership: {
      category: "IA",
      tiers: {
        tier1: {
          description: "Participates when assigned leadership tasks.",
          learnerPhrase: "Someone else should do it.",
        },
        tier2: {
          description: "Leads group activities in the classroom setting.",
          learnerPhrase: "I'll help lead the group.",
        },
        tier3: {
          description:
            "Initiates and organizes small-scale classroom or community projects.",
          learnerPhrase: "I'll plan the project and help everyone.",
        },
      },
    },

    "Motivation and Self-Awareness": {
      category: "LE",
      tiers: {
        tier1: {
          description: "Requires reminders for task completion.",
          learnerPhrase: "I give up.",
        },
        tier2: {
          description: "Sets goals and seeks feedback with support.",
          learnerPhrase: "I want to do better.",
        },
        tier3: {
          description:
            "Sustains independent motivation and reflects on challenges constructively.",
          learnerPhrase: "I improved by changing my study habits.",
        },
      },
    },
  },
};
// Complete system
export const LEARNER_RUBRIC_SYSTEM: LearnerRubricSystem = {
  phases: {
    foundation: FOUNDATION_PHASE,
    intermediate: INTERMEDIATE_PHASE,
    senior: SENIOR_PHASE,
    fet: FET_PHASE,
  },
  metadata: {
    version: "1.0",
    academicYear: "2024",
    tiers: {
      tier1: "Tier 1: Emerging Learner",
      tier2: "Tier 2: Progressing Learner",
      tier3: "Tier 3: Advancing Learner",
    },
  },
};
