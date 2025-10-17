"use client";

import React, { useState, useMemo } from "react";
import { GraduationCap } from "lucide-react";

import { MOCK_FELLOWS } from "@/data/SAMPLE_DATA";
import type { Term } from "@/types/core";
import type { Fellow } from "@/types/people";

import { FormSelect } from "@/components/form";
import { EmailConfirmModal } from "@/components/modals/EmailConfirmModal";
import { useStepModals } from "@/hooks/useStepModals";
import { useAssessment } from "@/context/AssessmentProvider";
import { FellowSummaryCard } from "../FellowSummaryCard";

/**
 * 🎓 Fellow Selection Step
 * - Select term, coach, and fellow
 * - Verify fellow via email confirmation
 * - Commits verified fellow directly to global context
 */
const FellowSelectionStep: React.FC = () => {
  // ==================== CONTEXT ====================
  const {
    term,
    setTerm,
    selectedCoach,
    setSelectedCoach,
    selectedFellow,
    setSelectedFellow,
    isFellowVerified,
    setIsFellowVerified,
  } = useAssessment();

  // ==================== LOCAL STATE ====================
  const [pendingFellow, setPendingFellow] = useState<Fellow | null>(null);
  const [showEmailModal, setShowEmailModal] = useState<boolean>(false);

  const modals = useStepModals(["help"] as const);

  // ==================== DERIVED DATA ====================
  const coaches = useMemo(
    () => Array.from(new Set(MOCK_FELLOWS.map((f) => f.coachName))).sort(),
    []
  );

  const fellowsForCoach = useMemo<Fellow[]>(
    () =>
      selectedCoach
        ? MOCK_FELLOWS.filter((f) => f.coachName === selectedCoach)
        : [],
    [selectedCoach]
  );

  // ==================== HANDLERS ====================
  const handleCoachChange = (val: string) => {
    setSelectedCoach(val);
    setSelectedFellow(null);
    setIsFellowVerified(false);
  };

  const handleFellowChange = (id: string) => {
    if (!id) {
      setSelectedFellow(null);
      setIsFellowVerified(false);
      return;
    }

    const fellow = MOCK_FELLOWS.find((f) => f.id === id) ?? null;
    setPendingFellow(fellow); // store locally until confirmed
    setShowEmailModal(!!fellow);
  };

  /** ✅ Fired when email is confirmed */
  const handleEmailConfirm = () => {
    if (pendingFellow) {
      setSelectedFellow(pendingFellow); // ✅ commit to global context
      setIsFellowVerified(true);
      setPendingFellow(null);
    }
    setShowEmailModal(false);
  };

  // ==================== RENDER ====================
  return (
    <>
      <div className="w-full space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left: Form card */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-[#004854]/12 bg-white p-4 sm:p-6 shadow-sm">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <FormSelect
                  label="Academic Term"
                  value={term}
                  onChange={(e) => setTerm(e.target.value as Term | "")}
                  placeholder="Select term"
                  options={["Term 1", "Term 2", "Term 3", "Term 4"]}
                />

                <FormSelect
                  label="Coach Name"
                  value={selectedCoach}
                  onChange={(e) => handleCoachChange(e.target.value)}
                  placeholder="Select coach"
                  options={coaches}
                />

                <FormSelect
                  label="Fellow (Teacher)"
                  value={selectedFellow?.id ?? ""}
                  onChange={(e) => handleFellowChange(e.target.value)}
                  placeholder={
                    selectedCoach ? "Select fellow" : "Choose coach first"
                  }
                  options={fellowsForCoach.map((f) => ({
                    label: f.name,
                    value: f.id,
                  }))}
                  disabled={!selectedCoach}
                />
              </div>

              {/* Inline guidance */}
              <div className="mt-4 rounded-lg bg-[#8ED1C1]/10 border border-[#004854]/10 p-3">
                <p className="text-xs text-[#32353C]/80">
                  Tip: Select a coach first to narrow the fellow list. You’ll be
                  asked to confirm the fellow’s email before continuing.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Status */}
          <aside className="space-y-4">
            <div className="rounded-xl border border-[#004854]/12 bg-white p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-[#004854] mb-2">
                Selection Status
              </h3>
              <dl className="text-sm space-y-2">
                <div className="flex justify-between">
                  <dt className="text-[#838998]">Term</dt>
                  <dd className="text-[#32353C] font-medium">{term || "—"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[#838998]">Coach</dt>
                  <dd className="text-[#32353C] font-medium">
                    {selectedCoach || "—"}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[#838998]">Fellow</dt>
                  <dd className="text-[#32353C] font-medium">
                    {selectedFellow?.name || "—"}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Verified summary OR empty */}
            {isFellowVerified && selectedFellow ? (
              <FellowSummaryCard fellow={selectedFellow} />
            ) : (
              <div className="rounded-xl border-2 border-dashed border-[#004854]/20 bg-[#8ED1C1]/10 p-8 text-center">
                <GraduationCap className="mx-auto h-12 w-12 text-[#004854]/70 mb-3" />
                <h4 className="text-sm font-semibold text-[#004854] mb-1">
                  No fellow verified
                </h4>
                <p className="text-xs text-[#32353C]/80 max-w-sm mx-auto">
                  Choose a coach and fellow on the left, then confirm their
                  email to continue.
                </p>
              </div>
            )}
          </aside>
        </div>
      </div>

      {/* Email Confirmation Modal */}
      {showEmailModal && pendingFellow && (
        <EmailConfirmModal
          fellow={pendingFellow}
          onConfirm={handleEmailConfirm}
          onClose={() => {
            setShowEmailModal(false);
            setPendingFellow(null);
          }}
        />
      )}
    </>
  );
};

export default FellowSelectionStep;
