"use client";

import React from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Check } from "lucide-react";

import { useAssessment } from "@/providers/AssessmentProvider";
import { useWizard, STEPS, STEP_CONFIGS } from "@/hooks/useWizard";

export default function StepIndicator() {
  const {
    currentStep,
    selectedLearners,
    completionStats,
    isComplete,
    mode,
    goToStep,
  } = useAssessment();

  const wizard = useWizard({
    currentStep,
    canProceed: isComplete,
    selectedLearnersCount: selectedLearners.length,
    completionPercentage: completionStats.completionPercentage,
    mode,
    goToStep,
  });

  const activeIndex = STEPS.indexOf(currentStep);

  const stepDescriptions: Record<string, string> = {
    login: "Sign in with your coach, fellow name, and email to begin.",
    intro:
      "Review assessment guidelines and competency rubrics before starting.",
    selection: "Choose learners for new assessments or edit existing ones.",
    assessment:
      "Evaluate learners using tier scores and provide evidence for each competency.",
    review: "Review all assessments and submit when ready.",
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, x: -8 },
    active: {
      opacity: 1,
      x: 0,
      scale: 1.02,
      transition: { type: "spring", stiffness: 260, damping: 22 },
    },
    neighbor: {
      opacity: 0.95,
      x: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 240, damping: 24 },
    },
    far: {
      opacity: 0.75,
      x: 0,
      scale: 0.98,
      transition: { type: "spring", stiffness: 220, damping: 26 },
    },
  };

  const getVariant = (index: number) => {
    if (index === activeIndex) return "active";
    const d = Math.abs(index - activeIndex);
    return d === 1 ? "neighbor" : "far";
  };

  const progressPct =
    STEPS.length > 1 ? (activeIndex / (STEPS.length - 1)) * 100 : 0;

  return (
    <div
      className={["h-full w-full", "overflow-y-auto", "bg-[#8ED1C1]/10"].join(
        " "
      )}
    >
      <motion.div
        className="relative w-full min-h-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="relative px-4 py-6">
          {/* Progress spine */}
          <div className="absolute left-5 top-6 bottom-6 w-px bg-[#004854]/15" />
          <motion.div
            className="absolute left-5 top-6 w-px bg-[#004854]"
            style={{ height: `${progressPct}%` }}
            initial={{ height: 0 }}
            animate={{ height: `${progressPct}%` }}
            transition={{ duration: 0.35 }}
          />

          {/* Step list */}
          <div className="relative flex flex-col gap-4">
            <AnimatePresence mode="popLayout">
              {STEPS.map((step, index) => {
                const config = STEP_CONFIGS[step];
                const Icon = config.icon;
                const isActive = index === activeIndex;
                const isCompleted = index < activeIndex;
                const description = stepDescriptions[step];

                // Optional: allow clicking completed steps to navigate back
                const handleClick = () => {
                  if (isCompleted) goToStep(step);
                };

                return (
                  <motion.div
                    key={step}
                    className="flex items-start gap-3 cursor-default"
                    initial="hidden"
                    animate={getVariant(index)}
                    variants={itemVariants}
                    layout
                    onClick={handleClick}
                    style={{
                      cursor: isCompleted ? "pointer" : "default",
                    }}
                  >
                    {/* Bullet / Icon */}
                    <motion.div
                      className={[
                        "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                        isActive
                          ? "bg-[#004854] text-white shadow-md ring-4 ring-[#8ED1C1]/25"
                          : isCompleted
                          ? "bg-emerald-500 text-white"
                          : "bg-white text-[#004854] border border-[#004854]/20",
                      ].join(" ")}
                      whileHover={isCompleted ? { scale: 1.05 } : {}}
                    >
                      {isCompleted ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </motion.div>

                    {/* Labels */}
                    <div className="flex-1 min-w-0">
                      <motion.span
                        className={[
                          "block text-sm font-medium mb-1 truncate",
                          isActive
                            ? "text-[#004854]"
                            : isCompleted
                            ? "text-[#004854]/80"
                            : "text-[#004854]/70",
                        ].join(" ")}
                      >
                        {config.label}
                      </motion.span>

                      <AnimatePresence initial={false}>
                        {isActive && (
                          <motion.p
                            className="text-xs text-[#32353C]/80 leading-relaxed"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25 }}
                          >
                            {description}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
