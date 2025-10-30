'use client';

import React, { useMemo } from 'react';
import { CheckCircle2, AlertTriangle, Users, ClipboardList, Info } from 'lucide-react';
import { useAssessment } from '@/providers/AssessmentProvider';
import { useData } from '@/providers/DataProvider';

import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { COMPETENCIES, CompetencyId, TierLevel, TIERS, getTierByLevel } from '@/types/rubric.types';

const SubmissionSummary: React.FC = () => {
  const { assessmentDrafts, isComplete, completionStats, mode } = useAssessment();

  const { fellowData } = useData();

  /** ------ Per-learner summaries ------ */
  const learnerSummaries = useMemo(() => {
    return assessmentDrafts.map((draft) => {
      const compTiers = COMPETENCIES.map((comp) => {
        const competency = draft[comp.id];
        const tier = competency.tierScore;
        const evidence = competency.evidence || '';
        return { comp: comp.id, tier, evidence };
      });

      const tierCounts = compTiers.reduce(
        (acc, t) => {
          if (t.tier === 1) acc.T1 += 1;
          if (t.tier === 2) acc.T2 += 1;
          if (t.tier === 3) acc.T3 += 1;
          return acc;
        },
        { T1: 0, T2: 0, T3: 0 },
      );

      const setCount = compTiers.filter((t) => t.tier !== null).length;
      const evidenceCount = compTiers.filter((t) => t.evidence.trim().length > 0).length;

      const missingEvidence = compTiers
        .filter((t) => t.tier !== null && t.evidence.trim().length === 0)
        .map((t) => t.comp);

      const unsetTiers = compTiers.filter((t) => t.tier === null).map((t) => t.comp);

      return {
        draft,
        compTiers,
        tierCounts,
        allTiersSet: setCount === COMPETENCIES.length,
        allEvidencePresent: evidenceCount === COMPETENCIES.length,
        evidenceCount,
        missingEvidence,
        unsetTiers,
      };
    });
  }, [assessmentDrafts]);

  /** ------ Cohort metrics ------ */
  const totalPairs = assessmentDrafts.length * COMPETENCIES.length;
  const totalEvidencePairs = learnerSummaries.reduce((acc, s) => acc + s.evidenceCount, 0);
  const evidenceCoveragePct =
    totalPairs > 0 ? Math.round((totalEvidencePairs / totalPairs) * 100) : 0;

  const learnersAssessed = learnerSummaries.filter(
    (s) => s.allTiersSet && s.allEvidencePresent,
  ).length;

  const overallBuckets = learnerSummaries.reduce(
    (acc, s) => {
      acc.T1 += s.tierCounts.T1;
      acc.T2 += s.tierCounts.T2;
      acc.T3 += s.tierCounts.T3;
      return acc;
    },
    { T1: 0, T2: 0, T3: 0 },
  );

  /** ------ Gaps ------ */
  const gaps = useMemo(() => {
    const items: {
      learnerId: string;
      learnerName: string;
      type: 'missingEvidence' | 'unsetTier';
      comp: CompetencyId;
    }[] = [];
    learnerSummaries.forEach((s) => {
      s.missingEvidence.forEach((c) =>
        items.push({
          learnerId: s.draft.learnerId,
          learnerName: s.draft.learnerName,
          type: 'missingEvidence',
          comp: c,
        }),
      );
      s.unsetTiers.forEach((c) =>
        items.push({
          learnerId: s.draft.learnerId,
          learnerName: s.draft.learnerName,
          type: 'unsetTier',
          comp: c,
        }),
      );
    });
    return items;
  }, [learnerSummaries]);

  /** ------ Submission readiness ------ */
  const readyToSubmit = isComplete;

  /** ------ Status banner ------ */
  const StatusIcon = readyToSubmit ? CheckCircle2 : gaps.length > 0 ? AlertTriangle : Info;
  const statusBg = readyToSubmit
    ? 'border-emerald-200 bg-emerald-50'
    : gaps.length > 0
      ? 'border-amber-200 bg-amber-50'
      : 'border-[#004854]/20 bg-[#8ED1C1]/10';
  const statusMsg = readyToSubmit
    ? 'All learners fully assessed with evidence. Ready to submit.'
    : gaps.length > 0
      ? `${gaps.length} gap${gaps.length === 1 ? '' : 's'} to resolve before submission.`
      : 'Assess learners and add evidence to proceed.';

  const isEditMode = mode?.type === 'edit';

  if (!fellowData) return null;

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#004854]">Review & Submit</h2>
          <p className="mt-1 text-sm text-slate-600">
            {isEditMode
              ? 'Review changes before updating assessment'
              : 'Review assessments before final submission'}
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          {fellowData.grade} • {fellowData.phase}
        </Badge>
      </div>

      {/* Status */}
      <Alert className={statusBg}>
        <StatusIcon
          className={`h-4 w-4 ${
            readyToSubmit ? 'text-emerald-600' : gaps.length ? 'text-amber-600' : 'text-[#004854]'
          }`}
        />
        <AlertDescription className="text-sm font-medium">{statusMsg}</AlertDescription>
      </Alert>

      {/* Assessment Overview */}
      <div className="rounded-xl border border-[#004854]/12 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#8ED1C1]/20">
            <ClipboardList className="h-5 w-5 text-[#004854]" />
          </div>
          <h3 className="font-semibold text-[#004854]">Assessment Overview</h3>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-center">
            <div className="text-2xl font-bold text-[#004854]">{assessmentDrafts.length}</div>
            <div className="mt-1 text-xs text-slate-600">{isEditMode ? 'Learner' : 'Learners'}</div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-center">
            <div className="text-2xl font-bold text-[#004854]">{learnersAssessed}</div>
            <div className="mt-1 text-xs text-slate-600">Completed</div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-center">
            <div className="text-2xl font-bold text-[#004854]">{evidenceCoveragePct}%</div>
            <div className="mt-1 text-xs text-slate-600">Evidence Coverage</div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-center">
            <div className="text-2xl font-bold text-[#004854]">
              {completionStats.completionPercentage}%
            </div>
            <div className="mt-1 text-xs text-slate-600">Overall Progress</div>
          </div>
        </div>

        {/* Tier Distribution */}
        <div className="mt-4 border-t border-[#004854]/12 pt-4">
          <p className="mb-2 text-xs font-semibold text-[#004854]">Tier Distribution</p>
          <div className="flex gap-3">
            {TIERS.slice()
              .reverse()
              .map((tier) => (
                <div key={tier.key} className="flex items-center gap-1.5">
                  <div className={`h-3 w-3 rounded-full ${tier.dotColor}`}></div>
                  <span className="text-xs text-slate-600">
                    {tier.label}: {overallBuckets[`T${tier.level}` as keyof typeof overallBuckets]}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Per-Learner Summary */}
      <div className="rounded-xl border border-[#004854]/12 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#8ED1C1]/20">
            <Users className="h-5 w-5 text-[#004854]" />
          </div>
          <h3 className="font-semibold text-[#004854]">Per-Learner Summary</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-[#004854] to-[#0a5e6c] text-left text-xs text-white">
                <th className="rounded-l-md px-3 py-2">Learner</th>
                {COMPETENCIES.map((comp) => (
                  <th key={comp.id} className="px-3 py-2">
                    {comp.label}
                  </th>
                ))}
                <th className="rounded-r-md px-3 py-2 text-center">Evidence</th>
              </tr>
            </thead>
            <tbody>
              {learnerSummaries.map((s, idx) => (
                <tr
                  key={s.draft.learnerId}
                  className={`${
                    idx % 2 ? 'bg-slate-50/60' : 'bg-white'
                  } border-b border-[#004854]/10`}
                >
                  <td className="px-3 py-3 whitespace-nowrap">
                    <div className="font-medium text-[#004854]">{s.draft.learnerName}</div>
                    <div className="text-xs text-[#32353C]/70">
                      {fellowData.grade} • {fellowData.phase}
                    </div>
                  </td>
                  {s.compTiers.map((t) => {
                    const tierStyle = t.tier ? getTierByLevel(t.tier) : null;
                    return (
                      <td key={`${s.draft.learnerId}-${t.comp}`} className="px-3 py-3">
                        <Badge
                          variant="outline"
                          className={`text-[11px] ${
                            tierStyle
                              ? tierStyle.color
                              : 'border-slate-300 bg-slate-50 text-slate-600'
                          }`}
                        >
                          {t.tier ? tierStyle?.label : '—'}
                        </Badge>
                      </td>
                    );
                  })}
                  <td className="px-3 py-3">
                    <div className="flex items-center justify-center gap-1.5">
                      {s.compTiers.map((t) => {
                        const comp = COMPETENCIES.find((c) => c.id === t.comp);
                        return (
                          <span
                            key={`${s.draft.learnerId}-${t.comp}-e`}
                            title={`${comp?.label}: ${
                              t.evidence.trim() ? 'Has evidence' : 'No evidence'
                            }`}
                            className={`inline-block h-2.5 w-2.5 rounded-full ${
                              t.evidence.trim() ? 'bg-emerald-500' : 'bg-amber-400'
                            }`}
                          />
                        );
                      })}
                    </div>
                  </td>
                </tr>
              ))}
              {learnerSummaries.length === 0 && (
                <tr>
                  <td
                    colSpan={COMPETENCIES.length + 2}
                    className="px-3 py-6 text-center text-[#32353C]/70"
                  >
                    No learners selected.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Gaps Warning */}
        {gaps.length > 0 && (
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3">
            <p className="mb-2 text-xs font-semibold text-amber-900">
              ⚠️ Issues to Resolve ({gaps.length})
            </p>
            <div className="space-y-1">
              {gaps.slice(0, 5).map((g, i) => {
                const comp = COMPETENCIES.find((c) => c.id === g.comp);
                return (
                  <p key={i} className="text-xs text-amber-800">
                    • {g.learnerName} - {comp?.label}:{' '}
                    {g.type === 'unsetTier' ? 'Tier not selected' : 'Evidence missing'}
                  </p>
                );
              })}
              {gaps.length > 5 && (
                <p className="text-xs text-amber-700 italic">...and {gaps.length - 5} more</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmissionSummary;
