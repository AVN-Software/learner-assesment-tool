/** ---------------------------
 *  Types & Interfaces
 *  --------------------------- */
export type Phase = "Foundation" | "Intermediate" | "Senior" | "FET";
export type CompetencyId = "motivation" | "teamwork" | "analytical" | "curiosity" | "leadership";
export type TierLevel = 1 | 2 | 3;

export interface Competency {
  competency_id: CompetencyId;
  competency_name: string;
  description: string;
  icon?: string; // Optional icon name for UI
}

export interface PhaseCompetencyTierDescriptor {
  phase: Phase;
  competency_id: CompetencyId;
  tier: TierLevel;
  description: string;
  indicators?: string[]; // Specific behavioral indicators
}

export interface CompetencyRubric {
  competency: Competency;
  descriptors: PhaseCompetencyTierDescriptor[];
}

/** ---------------------------
 *  Core Competency Definitions
 *  --------------------------- */
export const COMPETENCIES: Competency[] = [
  {
    competency_id: "motivation",
    competency_name: "Motivation & Self-Awareness",
    description: "Learners develop emotional awareness, resilience, and motivation to sustain engagement in learning.",
    icon: "sparkles",
  },
  {
    competency_id: "teamwork",
    competency_name: "Teamwork",
    description: "Learners collaborate with peers, follow group norms, and contribute meaningfully to shared tasks.",
    icon: "users",
  },
  {
    competency_id: "analytical",
    competency_name: "Analytical Thinking",
    description: "Learners recognise patterns, integrate concepts, and apply reasoning to solve increasingly complex problems.",
    icon: "brain",
  },
  {
    competency_id: "curiosity",
    competency_name: "Curiosity & Creativity",
    description: "Learners ask questions, explore ideas, and adapt creatively to generate innovative solutions.",
    icon: "search",
  },
  {
    competency_id: "leadership",
    competency_name: "Leadership & Social Influence",
    description: "Learners practise social influence, take initiative, and guide peers in collaborative and inclusive ways.",
    icon: "flag",
  },
];

/** ---------------------------
 *  Phase–Tier Descriptors with True Developmental Progression
 *  --------------------------- */
export const PHASE_COMPETENCY_TIER_DESCRIPTORS: PhaseCompetencyTierDescriptor[] = [
  // ===== MOTIVATION & SELF-AWARENESS =====
  {
    phase: "Foundation",
    competency_id: "motivation",
    tier: 1,
    description: "Begins to identify basic emotions and follows classroom routines with guidance.",
    indicators: ["Names simple emotions", "Follows daily routines", "Seeks adult reassurance"]
  },
  {
    phase: "Foundation",
    competency_id: "motivation",
    tier: 2,
    description: "Demonstrates emerging self-motivation and supports peers in structured activities.",
    indicators: ["Attempts tasks independently", "Comforts upset peers", "Expresses preferences"]
  },
  {
    phase: "Foundation",
    competency_id: "motivation",
    tier: 3,
    description: "Shows consistent engagement and begins to reflect on personal learning experiences.",
    indicators: ["Sustains focus on tasks", "Shares feelings about learning", "Shows pride in work"]
  },

  {
    phase: "Intermediate",
    competency_id: "motivation",
    tier: 1,
    description: "Identifies personal strengths and challenges in learning contexts.",
    indicators: ["Describes what they're good at", "Recognizes when tasks are difficult", "Accepts constructive feedback"]
  },
  {
    phase: "Intermediate",
    competency_id: "motivation",
    tier: 2,
    description: "Sets simple learning goals and demonstrates resilience when facing challenges.",
    indicators: ["Sets achievable goals", "Tries different strategies", "Persists through difficulties"]
  },
  {
    phase: "Intermediate",
    competency_id: "motivation",
    tier: 3,
    description: "Articulates personal learning processes and motivates peers through positive engagement.",
    indicators: ["Explains how they learn best", "Encourages classmates", "Seeks additional challenges"]
  },

  {
    phase: "Senior",
    competency_id: "motivation",
    tier: 1,
    description: "Analyzes factors affecting motivation and applies self-regulation strategies.",
    indicators: ["Identifies what motivates them", "Uses calming strategies", "Manages frustration"]
  },
  {
    phase: "Senior",
    competency_id: "motivation",
    tier: 2,
    description: "Develops personalized learning strategies and demonstrates academic resilience.",
    indicators: ["Creates study plans", "Learns from mistakes", "Maintains effort despite setbacks"]
  },
  {
    phase: "Senior",
    competency_id: "motivation",
    tier: 3,
    description: "Exhibits strong self-direction and contributes to positive learning environments.",
    indicators: ["Seeks learning opportunities", "Models positive attitude", "Builds classroom community"]
  },

  {
    phase: "FET",
    competency_id: "motivation",
    tier: 1,
    description: "Articulates personal values and their connection to long-term goals.",
    indicators: ["Connects learning to future plans", "Identifies personal values", "Sets meaningful goals"]
  },
  {
    phase: "FET",
    competency_id: "motivation",
    tier: 2,
    description: "Demonstrates sophisticated self-regulation and adapts motivation strategies to different contexts.",
    indicators: ["Balances multiple priorities", "Adapts to different learning contexts", "Manages stress effectively"]
  },
  {
    phase: "FET",
    competency_id: "motivation",
    tier: 3,
    description: "Exhibits mastery orientation and mentors others in developing self-awareness.",
    indicators: ["Seeks deep understanding", "Mentors younger students", "Leads wellbeing initiatives"]
  },

  // ===== TEAMWORK =====
  {
    phase: "Foundation",
    competency_id: "teamwork",
    tier: 1,
    description: "Participates in paired activities and begins sharing resources with guidance.",
    indicators: ["Takes turns with support", "Shares materials when asked", "Listens to partner"]
  },
  {
    phase: "Foundation",
    competency_id: "teamwork",
    tier: 2,
    description: "Collaborates in small groups and contributes ideas to shared tasks.",
    indicators: ["Offers ideas in groups", "Listens to peers' ideas", "Helps clean up together"]
  },
  {
    phase: "Foundation",
    competency_id: "teamwork",
    tier: 3,
    description: "Takes on simple roles in group work and helps resolve minor conflicts.",
    indicators: ["Performs assigned role", "Uses 'I feel' statements", "Includes quieter peers"]
  },

  {
    phase: "Intermediate",
    competency_id: "teamwork",
    tier: 1,
    description: "Engages in cooperative learning structures and respects group decisions.",
    indicators: ["Follows group rules", "Accepts majority decisions", "Completes assigned parts"]
  },
  {
    phase: "Intermediate",
    competency_id: "teamwork",
    tier: 2,
    description: "Actively facilitates group discussions and integrates diverse perspectives.",
    indicators: ["Asks clarifying questions", "Builds on others' ideas", "Seeks consensus"]
  },
  {
    phase: "Intermediate",
    competency_id: "teamwork",
    tier: 3,
    description: "Coordinates group tasks and mediates conflicts constructively.",
    indicators: ["Delegates tasks appropriately", "Mediates disagreements", "Ensures equal participation"]
  },

  {
    phase: "Senior",
    competency_id: "teamwork",
    tier: 1,
    description: "Engages in complex group projects and provides constructive peer feedback.",
    indicators: ["Gives specific feedback", "Receives feedback graciously", "Manages project timelines"]
  },
  {
    phase: "Senior",
    competency_id: "teamwork",
    tier: 2,
    description: "Facilitates collaborative problem-solving and adapts communication style to group needs.",
    indicators: ["Facilitates brainstorming", "Adapts to different personalities", "Synthesizes group ideas"]
  },
  {
    phase: "Senior",
    competency_id: "teamwork",
    tier: 3,
    description: "Leads collaborative initiatives and models advanced teamwork skills.",
    indicators: ["Organizes group projects", "Models effective collaboration", "Develops team protocols"]
  },

  {
    phase: "FET",
    competency_id: "teamwork",
    tier: 1,
    description: "Engages in professional-style collaboration and cross-functional teams.",
    indicators: ["Works in diverse teams", "Applies professional norms", "Navigates team dynamics"]
  },
  {
    phase: "FET",
    competency_id: "teamwork",
    tier: 2,
    description: "Facilitates complex team processes and optimizes group performance.",
    indicators: ["Optimizes team composition", "Manages complex projects", "Develops team culture"]
  },
  {
    phase: "FET",
    competency_id: "teamwork",
    tier: 3,
    description: "Leads organizational collaboration and mentors others in teamwork excellence.",
    indicators: ["Leads cross-functional teams", "Mentors team leaders", "Designs collaborative systems"]
  },

  // ===== ANALYTICAL THINKING =====
  {
    phase: "Foundation",
    competency_id: "analytical",
    tier: 1,
    description: "Recognizes simple patterns and sequences in familiar contexts.",
    indicators: ["Sorts objects by attribute", "Follows simple sequences", "Notices obvious patterns"]
  },
  {
    phase: "Foundation",
    competency_id: "analytical",
    tier: 2,
    description: "Makes basic connections between concepts and asks clarifying questions.",
    indicators: ["Connects related ideas", "Asks 'why' questions", "Makes simple predictions"]
  },
  {
    phase: "Foundation",
    competency_id: "analytical",
    tier: 3,
    description: "Solves simple problems using trial and error and explains basic reasoning.",
    indicators: ["Tests different solutions", "Explains simple reasoning", "Learns from mistakes"]
  },

  {
    phase: "Intermediate",
    competency_id: "analytical",
    tier: 1,
    description: "Applies learned strategies to new problems and identifies relevant information.",
    indicators: ["Uses known strategies", "Identifies key information", "Organizes information logically"]
  },
  {
    phase: "Intermediate",
    competency_id: "analytical",
    tier: 2,
    description: "Analyzes multi-step problems and evaluates different solution approaches.",
    indicators: ["Breaks down complex problems", "Compares different solutions", "Identifies patterns across contexts"]
  },
  {
    phase: "Intermediate",
    competency_id: "analytical",
    tier: 3,
    description: "Synthesizes information from multiple sources and develops systematic approaches.",
    indicators: ["Combines information sources", "Creates problem-solving plans", "Justifies methods used"]
  },

  {
    phase: "Senior",
    competency_id: "analytical",
    tier: 1,
    description: "Analyzes complex systems and applies critical thinking to evaluate evidence.",
    indicators: ["Identifies system components", "Evaluates source credibility", "Recognizes biases"]
  },
  {
    phase: "Senior",
    competency_id: "analytical",
    tier: 2,
    description: "Develops sophisticated models and transfers analytical approaches across domains.",
    indicators: ["Creates conceptual models", "Applies thinking across subjects", "Anticipates consequences"]
  },
  {
    phase: "Senior",
    competency_id: "analytical",
    tier: 3,
    description: "Engages in meta-cognitive analysis and designs original analytical frameworks.",
    indicators: ["Reflects on thinking processes", "Creates analysis frameworks", "Solves novel complex problems"]
  },

  {
    phase: "FET",
    competency_id: "analytical",
    tier: 1,
    description: "Applies disciplinary thinking modes and analyzes complex real-world problems.",
    indicators: ["Uses subject-specific methods", "Analyzes real-world cases", "Identifies underlying assumptions"]
  },
  {
    phase: "FET",
    competency_id: "analytical",
    tier: 2,
    description: "Synthesizes interdisciplinary perspectives and critiques complex arguments.",
    indicators: ["Integrates multiple disciplines", "Critiques complex arguments", "Develops nuanced positions"]
  },
  {
    phase: "FET",
    competency_id: "analytical",
    tier: 3,
    description: "Creates original analytical models and contributes to knowledge development.",
    indicators: ["Develops original theories", "Designs research methodologies", "Advances disciplinary understanding"]
  },

  // ===== CURIOSITY & CREATIVITY ===== (truncated for brevity - similar structure)
  {
    phase: "Foundation",
    competency_id: "curiosity",
    tier: 1,
    description: "Asks simple questions and explores materials with guidance.",
    indicators: ["Asks 'what' questions", "Explores sensory materials", "Shows wonder and surprise"]
  },
  {
    phase: "Foundation",
    competency_id: "curiosity",
    tier: 2,
    description: "Generates ideas and makes creative connections in play.",
    indicators: ["Combines ideas in play", "Suggests alternative uses", "Engages in pretend play"]
  },
  {
    phase: "Foundation",
    competency_id: "curiosity",
    tier: 3,
    description: "Poses thoughtful questions and experiments with creative solutions.",
    indicators: ["Asks 'how' and 'why' questions", "Tests creative ideas", "Adapts solutions when stuck"]
  },

  // ===== LEADERSHIP & SOCIAL INFLUENCE ===== (truncated for brevity)
  {
    phase: "Foundation",
    competency_id: "leadership",
    tier: 1,
    description: "Follows classroom leaders and participates in group activities.",
    indicators: ["Follows line leaders", "Joins group games", "Listens to peer suggestions"]
  },
  {
    phase: "Foundation",
    competency_id: "leadership",
    tier: 2,
    description: "Takes turns leading simple activities and suggests game ideas.",
    indicators: ["Leads calendar time", "Suggests play activities", "Helps organize materials"]
  },
  {
    phase: "Foundation",
    competency_id: "leadership",
    tier: 3,
    description: "Organizes small group activities and includes diverse participants.",
    indicators: ["Organizes group centers", "Includes shy children", "Models inclusive behavior"]
  }
];

/** ---------------------------
 *  Utility Functions
 *  --------------------------- */
export const getCompetencyById = (id: CompetencyId): Competency | undefined =>
  COMPETENCIES.find(comp => comp.competency_id === id);

export const getTierDescriptors = (
  phase: Phase,
  competencyId: CompetencyId
): PhaseCompetencyTierDescriptor[] =>
  PHASE_COMPETENCY_TIER_DESCRIPTORS.filter(
    desc => desc.phase === phase && desc.competency_id === competencyId
  ).sort((a, b) => a.tier - b.tier);

export const getTierDescriptor = (
  phase: Phase,
  competencyId: CompetencyId,
  tier: TierLevel
): PhaseCompetencyTierDescriptor | undefined =>
  PHASE_COMPETENCY_TIER_DESCRIPTORS.find(
    desc => desc.phase === phase && desc.competency_id === competencyId && desc.tier === tier
  );

export const getCompetencyRubric = (competencyId: CompetencyId): CompetencyRubric => {
  const competency = getCompetencyById(competencyId);
  if (!competency) {
    throw new Error(`Competency ${competencyId} not found`);
  }
  
  return {
    competency,
    descriptors: PHASE_COMPETENCY_TIER_DESCRIPTORS.filter(desc => desc.competency_id === competencyId)
  };
};

/** ---------------------------
 *  Type Guards & Validation
 *  --------------------------- */
export const isValidPhase = (phase: string): phase is Phase =>
  ["Foundation", "Intermediate", "Senior", "FET"].includes(phase);

export const isValidCompetencyId = (id: string): id is CompetencyId =>
  COMPETENCIES.some(comp => comp.competency_id === id);

export const isValidTier = (tier: number): tier is TierLevel =>
  [1, 2, 3].includes(tier);

export default {
  COMPETENCIES,
  PHASE_COMPETENCY_TIER_DESCRIPTORS,
  getCompetencyById,
  getTierDescriptors,
  getTierDescriptor,
  getCompetencyRubric,
  isValidPhase,
  isValidCompetencyId,
  isValidTier,
};