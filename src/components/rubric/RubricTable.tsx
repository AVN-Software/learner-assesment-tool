// RubricTable.tsx
import React from "react";
import {
  CompetencyArea,
  CompetencyData,
  CompetencyTierData,
  LEARNER_RUBRIC_SYSTEM,
  PhaseCode,
  TierKey,
  TierName,
} from "./RubricTableConfig";
import { WordExportService } from "./WordExport";


interface RubricTableProps {
  phase: PhaseCode;
}

export const RubricTable: React.FC<RubricTableProps> = ({ phase }) => {
  const currentPhase = LEARNER_RUBRIC_SYSTEM.phases[phase];
  const tiers = LEARNER_RUBRIC_SYSTEM.metadata.tiers;

  const handleExport = () => {
    WordExportService.downloadWordDocument(phase, {
      orientation: 'landscape',
      includeHeader: true,
      includeDescription: true,
      fontSize: 10,
      margins: '0.5in'
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Export Button */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <div className="inline-flex items-center justify-center px-4 py-2 bg-white rounded-full shadow-sm border border-slate-200 mb-4">
              <span className="text-sm font-medium text-slate-600 uppercase tracking-wide">
                {currentPhase.phaseName}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-3">
              Learner Competency Rubric
            </h1>
            {currentPhase.description && (
              <p className="text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
                {currentPhase.description}
              </p>
            )}
          </div>
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-sm transition-colors duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export to Word
          </button>
        </div>

        {/* Rubric Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-300 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-slate-300">
              <thead className="bg-gradient-to-r from-slate-800 to-slate-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider border border-slate-600 w-1/6">
                    Competency
                  </th>
                  {(Object.entries(tiers) as [TierKey, TierName][]).map(
                    ([tierKey, tierName]) => (
                      <th
                        key={tierKey}
                        className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider border border-slate-600 w-1/5"
                      >
                        {tierName}
                      </th>
                    )
                  )}
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider border border-slate-600 w-1/4">
                    Learner Words/Phrases
                  </th>
                </tr>
              </thead>
              <tbody>
                {(
                  Object.entries(currentPhase.competencies) as [
                    CompetencyArea,
                    CompetencyData
                  ][]
                ).map(([competencyName, competencyData]) => (
                  <CompetencyRow
                    key={competencyName}
                    competencyName={competencyName}
                    competencyData={competencyData}
                    tiers={tiers}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export type CompetencyRowProps = {
  competencyName: CompetencyArea;
  competencyData: CompetencyData;
  tiers: Record<TierKey, TierName>;
};

// Individual Competency Row Component
const CompetencyRow: React.FC<CompetencyRowProps> = ({
  competencyName,
  competencyData,
  tiers,
}) => {
  return (
    <tr className="group hover:bg-blue-50/50 transition-all duration-200">
      {/* Competency Cell */}
      <td className="px-6 py-4 whitespace-nowrap border border-slate-300 bg-slate-50/80 group-hover:bg-blue-100/30 align-top">
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-slate-900 leading-tight">
            {competencyName}
          </span>
          <span className="text-xs text-slate-500 mt-1 font-medium">
            ({competencyData.category})
          </span>
        </div>
      </td>

      {/* Tier Description Cells */}
      {(
        Object.entries(competencyData.tiers) as [TierKey, CompetencyTierData][]
      ).map(([tierKey, tierData]) => (
        <td 
          key={tierKey} 
          className="px-6 py-4 border border-slate-300 align-top"
        >
          <div className="text-sm text-slate-700 leading-relaxed">
            {tierData.description}
          </div>
        </td>
      ))}

      {/* Learner Phrases Cell */}
      <td className="px-6 py-4 border border-slate-300 align-top">
        <div className="space-y-3">
          {(
            Object.entries(competencyData.tiers) as [
              TierKey,
              CompetencyTierData
            ][]
          ).map(([tierKey, tierData]) => (
            <div key={tierKey} className="flex items-start gap-3">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 border ${
                tierKey === 'tier1' 
                  ? 'bg-amber-100 text-amber-800 border-amber-300' 
                  : tierKey === 'tier2'
                  ? 'bg-blue-100 text-blue-800 border-blue-300'
                  : 'bg-emerald-100 text-emerald-800 border-emerald-300'
              }`}>
                {tiers[tierKey].split(":")[0]}:
              </span>
              <span className="text-sm text-slate-600 italic leading-relaxed flex-1">
                "{tierData.learnerPhrase}"
              </span>
            </div>
          ))}
        </div>
      </td>
    </tr>
  );
};

export default RubricTable;