// services/wordExportService.ts
import { RubricPhase, LEARNER_RUBRIC_SYSTEM, PhaseCode } from "./RubricTableConfig";

export interface WordExportOptions {
  orientation: 'portrait' | 'landscape';
  includeHeader: boolean;
  includeDescription: boolean;
  fontSize: number;
  margins: string;
}

export class WordExportService {
  static generateWordDocument(phaseCode: PhaseCode, options: WordExportOptions = {
    orientation: 'landscape',
    includeHeader: true,
    includeDescription: true,
    fontSize: 10,
    margins: '0.5in'
  }): Blob {
    const phase = LEARNER_RUBRIC_SYSTEM.phases[phaseCode];
    
    const html = this.generateHTML(phase, options);
    return new Blob([html], { type: 'application/msword' });
  }

  private static generateHTML(phase: RubricPhase, options: WordExportOptions): string {
    const tableHTML = this.generateTableHTML(phase);
    
    return `
<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" 
      xmlns:w="urn:schemas-microsoft-com:office:word" 
      xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta charset="utf-8">
  <title>${phase.phaseName} - Learner Competency Rubric</title>
  ${this.generateWordXML()}
  <style>
    ${this.generateStyles(options)}
  </style>
</head>
<body>
  ${this.generateHeader(phase, options)}
  ${tableHTML}
  ${this.generateFooter()}
</body>
</html>`;
  }

  private static generateWordXML(): string {
    return `<!--[if gte mso 9]>
<xml>
  <w:WordDocument>
    <w:View>Print</w:View>
    <w:Zoom>100</w:Zoom>
    <w:DoNotOptimizeForBrowser/>
    <w:ValidateAgainstSchemas/>
    <w:SaveIfXMLInvalid>false</w:SaveIfXMLInvalid>
    <w:IgnoreMixedContent>false</w:IgnoreMixedContent>
    <w:AlwaysShowPlaceholderText>false</w:AlwaysShowPlaceholderText>
    <w:Compatibility>
      <w:BreakWrappedTables/>
      <w:SnapToGridInCell/>
      <w:WrapTextWithPunct/>
      <w:UseAsianBreakRules/>
      <w:UseWord2010TableStyleRules/>
    </w:Compatibility>
  </w:WordDocument>
</xml>
<![endif]-->`;
  }

  private static generateStyles(options: WordExportOptions): string {
    return `
    @page {
      size: ${options.orientation};
      margin: ${options.margins};
      mso-page-orientation: ${options.orientation};
    }
    body {
      margin: 0;
      padding: 20px;
      font-family: 'Calibri', 'Arial', sans-serif;
      line-height: 1.3;
    }
    .document-header {
      text-align: center;
      margin-bottom: 20px;
      border-bottom: 2px solid #2d3748;
      padding-bottom: 15px;
    }
    .document-title {
      font-size: 18pt;
      font-weight: bold;
      color: #2d3748;
      margin-bottom: 8px;
    }
    .phase-name {
      font-size: 14pt;
      font-weight: bold;
      color: #4a5568;
      margin-bottom: 8px;
    }
    .phase-description {
      font-size: 11pt;
      color: #718096;
      max-width: 800px;
      margin: 0 auto;
      line-height: 1.4;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      table-layout: fixed;
      page-break-inside: avoid;
    }
    th, td {
      border: 1px solid #000000 !important;
      padding: 6px 8px;
      text-align: left;
      vertical-align: top;
      font-size: ${options.fontSize}pt;
      mso-border-alt: solid windowtext .5pt;
    }
    th {
      background-color: #2d3748;
      color: #ffffff;
      font-weight: bold;
      padding: 8px 10px;
    }
    .competency-cell {
      background-color: #f7fafc;
    }
    .competency-name {
      font-weight: bold;
      color: #2d3748;
      font-size: ${options.fontSize}pt;
    }
    .competency-category {
      color: #718096;
      font-size: ${options.fontSize - 1}pt;
      font-style: italic;
    }
    .tier-description {
      line-height: 1.4;
    }
    .learner-phrase-container {
      margin: 4px 0;
    }
    .tier-badge {
      background-color: #e2e8f0;
      padding: 2px 6px;
      border-radius: 3px;
      font-size: ${options.fontSize - 2}pt;
      font-weight: bold;
      display: inline-block;
      margin-right: 6px;
    }
    .tier-1-badge { background-color: #fed7d7; color: #c53030; }
    .tier-2-badge { background-color: #bee3f8; color: #2b6cb0; }
    .tier-3-badge { background-color: #c6f6d5; color: #276749; }
    .learner-phrase {
      font-style: italic;
      color: #4a5568;
      display: inline;
    }
    .document-footer {
      margin-top: 30px;
      text-align: center;
      font-size: 9pt;
      color: #a0aec0;
      border-top: 1px solid #e2e8f0;
      padding-top: 10px;
    }
    @media print {
      body { margin: 0; }
      table { page-break-inside: auto; }
      tr { page-break-inside: avoid; page-break-after: auto; }
    }`;
  }

  private static generateHeader(phase: RubricPhase, options: WordExportOptions): string {
    if (!options.includeHeader) return '';

    return `
    <div class="document-header">
      <div class="document-title">Learner Competency Rubric</div>
      <div class="phase-name">${phase.phaseName}</div>
      ${options.includeDescription && phase.description ? 
        `<div class="phase-description">${phase.description}</div>` : ''
      }
    </div>`;
  }

  private static generateTableHTML(phase: RubricPhase): string {
    const tiers = LEARNER_RUBRIC_SYSTEM.metadata.tiers;
    const tierEntries = Object.entries(tiers) as [string, string][];

    return `
    <table>
      <thead>
        <tr>
          <th width="15%">Competency</th>
          ${tierEntries.map(([_, tierName]) => 
            `<th width="22%">${tierName}</th>`
          ).join('')}
          <th width="25%">Learner Words/Phrases</th>
        </tr>
      </thead>
      <tbody>
        ${Object.entries(phase.competencies).map(([competencyName, competencyData]) => 
          this.generateCompetencyRow(competencyName, competencyData, tiers)
        ).join('')}
      </tbody>
    </table>`;
  }

  private static generateCompetencyRow(competencyName: string, competencyData: any, tiers: any): string {
    const tierEntries = Object.entries(competencyData.tiers) as [string, any][];

    return `
    <tr>
      <td class="competency-cell">
        <div class="competency-name">${competencyName}</div>
        <div class="competency-category">${competencyData.category}</div>
      </td>
      ${tierEntries.map(([tierKey, tierData]) => 
        `<td>
          <div class="tier-description">${tierData.description}</div>
        </td>`
      ).join('')}
      <td>
        ${tierEntries.map(([tierKey, tierData]) => 
          `<div class="learner-phrase-container">
            <span class="tier-badge tier-${tierKey.replace('tier', '')}-badge">
              ${tiers[tierKey].split(':')[0]}:
            </span>
            <span class="learner-phrase">"${tierData.learnerPhrase}"</span>
          </div>`
        ).join('')}
      </td>
    </tr>`;
  }

  private static generateFooter(): string {
    const generatedDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return `
    <div class="document-footer">
      Generated on ${generatedDate} | Learner Competency Rubric System
    </div>`;
  }

  static downloadWordDocument(phaseCode: PhaseCode, options?: WordExportOptions): void {
    const blob = this.generateWordDocument(phaseCode, options);
    const phase = LEARNER_RUBRIC_SYSTEM.phases[phaseCode];
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = `${phase.phaseName.replace(/\s+/g, '_')}_Competency_Rubric.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}