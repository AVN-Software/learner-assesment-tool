// services/wordExportService.ts
import { 
  Document, 
  Packer, 
  Paragraph, 
  Table, 
  TableRow, 
  TableCell, 
  WidthType,
  AlignmentType,
  HeadingLevel,
  BorderStyle,
  ShadingType,
  TextRun,
  PageOrientation
} from 'docx';
import { saveAs } from 'file-saver';
import { RubricPhase, LEARNER_RUBRIC_SYSTEM, PhaseCode } from "./RubricTableConfig";

export interface WordExportOptions {
  orientation: 'portrait' | 'landscape';
  includeHeader: boolean;
  includeDescription: boolean;
  fontSize: number;
  margins: number; // in twips (1440 = 1 inch)
}

interface TierData {
  description: string;
  learnerPhrase: string;
}

interface CompetencyData {
  category: string;
  tiers: Record<string, TierData>;
}

export class WordExportService {
  private static readonly DEFAULT_OPTIONS: WordExportOptions = {
    orientation: 'landscape',
    includeHeader: true,
    includeDescription: true,
    fontSize: 20, // in half-points (20 = 10pt)
    margins: 720 // 0.5 inch in twips
  };

  static async generateWordDocument(
    phaseCode: PhaseCode, 
    options: Partial<WordExportOptions> = {}
  ): Promise<Blob> {
    const fullOptions = { ...this.DEFAULT_OPTIONS, ...options };
    const phase = LEARNER_RUBRIC_SYSTEM.phases[phaseCode];
    
    const doc = this.createDocument(phase, fullOptions);
    return await Packer.toBlob(doc);
  }

  private static createDocument(phase: RubricPhase, options: WordExportOptions): Document {
    const sections = [];
    const children = [];

    // Add header
    if (options.includeHeader) {
      children.push(...this.createHeader(phase, options));
    }

    // Add table
    children.push(this.createRubricTable(phase, options));

    // Add footer
    children.push(...this.createFooter());

    sections.push({
      properties: {
        page: {
          orientation: options.orientation === 'landscape' 
            ? PageOrientation.LANDSCAPE 
            : PageOrientation.PORTRAIT,
          margin: {
            top: options.margins,
            right: options.margins,
            bottom: options.margins,
            left: options.margins
          }
        }
      },
      children
    });

    return new Document({
      sections,
      creator: "Learner Rubric System",
      description: `${phase.phaseName} Competency Rubric`,
      title: `${phase.phaseName} - Learner Competency Rubric`
    });
  }

  private static createHeader(phase: RubricPhase, options: WordExportOptions): Paragraph[] {
    const paragraphs: Paragraph[] = [];

    // Document title
    paragraphs.push(
      new Paragraph({
        text: "Learner Competency Rubric",
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 }
      })
    );

    // Phase name
    paragraphs.push(
      new Paragraph({
        text: phase.phaseName,
        heading: HeadingLevel.HEADING_2,
        alignment: AlignmentType.CENTER,
        spacing: { after: options.includeDescription && phase.description ? 150 : 400 }
      })
    );

    // Phase description
    if (options.includeDescription && phase.description) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: phase.description,
              size: 22,
              color: "718096"
            })
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 }
        })
      );
    }

    return paragraphs;
  }

  private static createRubricTable(phase: RubricPhase, options: WordExportOptions): Table {
    const tiers = LEARNER_RUBRIC_SYSTEM.metadata.tiers;
    const tierEntries = Object.entries(tiers) as [string, string][];
    
    const headerRow = this.createHeaderRow(tierEntries);
    const competencyRows = Object.entries(phase.competencies).map(
      ([competencyName, competencyData]) => 
        this.createCompetencyRow(competencyName, competencyData as CompetencyData, tiers, options)
    );

    return new Table({
      width: {
        size: 100,
        type: WidthType.PERCENTAGE
      },
      rows: [headerRow, ...competencyRows],
      borders: {
        top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
        bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
        left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
        right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
        insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
        insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "000000" }
      }
    });
  }

  private static createHeaderRow(tierEntries: [string, string][]): TableRow {
    const headerCells = [
      new TableCell({
        children: [new Paragraph({ 
          children: [new TextRun({ text: "Competency", bold: true, color: "ffffff" })]
        })],
        shading: { fill: "2d3748", type: ShadingType.SOLID },
        width: { size: 15, type: WidthType.PERCENTAGE }
      }),
      ...tierEntries.map(([_, tierName]) => 
        new TableCell({
          children: [new Paragraph({ 
            children: [new TextRun({ text: tierName, bold: true, color: "ffffff" })]
          })],
          shading: { fill: "2d3748", type: ShadingType.SOLID },
          width: { size: 22, type: WidthType.PERCENTAGE }
        })
      ),
      new TableCell({
        children: [new Paragraph({ 
          children: [new TextRun({ text: "Learner Words/Phrases", bold: true, color: "ffffff" })]
        })],
        shading: { fill: "2d3748", type: ShadingType.SOLID },
        width: { size: 25, type: WidthType.PERCENTAGE }
      })
    ];

    return new TableRow({
      children: headerCells,
      tableHeader: true
    });
  }

  private static createCompetencyRow(
    competencyName: string,
    competencyData: CompetencyData,
    tiers: Record<string, string>,
    options: WordExportOptions
  ): TableRow {
    const tierEntries = Object.entries(competencyData.tiers) as [string, TierData][];

    // Competency name cell
    const competencyCell = new TableCell({
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text: competencyName,
              bold: true,
              size: options.fontSize,
              color: "2d3748"
            })
          ]
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: competencyData.category,
              italics: true,
              size: options.fontSize - 2,
              color: "718096"
            })
          ]
        })
      ],
      shading: { fill: "f7fafc", type: ShadingType.SOLID },
      width: { size: 15, type: WidthType.PERCENTAGE }
    });

// Tier description cells
const tierCells = tierEntries.map(([_, tierData]) => 
  new TableCell({
    children: [
      new Paragraph({
        children: [
          new TextRun({
            text: tierData.description,
            size: Number(options.fontSize)
          })
        ]
      })
    ],
    width: { size: 22, type: WidthType.PERCENTAGE }
  })
);
    // Learner phrases cell
    const learnerPhraseParagraphs = tierEntries.map(([tierKey, tierData]) => {
      const tierLabel = tiers[tierKey].split(':')[0];
      
      return new Paragraph({
        children: [
          new TextRun({
            text: `${tierLabel}: `,
            bold: true,
            size: options.fontSize - 4,
            color: this.getTierColor(tierKey)
          }),
          new TextRun({
            text: `"${tierData.learnerPhrase}"`,
            italics: true,
            size: options.fontSize,
            color: "4a5568"
          })
        ],
        spacing: { before: 80, after: 80 }
      });
    });

    const learnerPhraseCell = new TableCell({
      children: learnerPhraseParagraphs,
      width: { size: 25, type: WidthType.PERCENTAGE }
    });

    return new TableRow({
      children: [competencyCell, ...tierCells, learnerPhraseCell]
    });
  }

  private static getTierColor(tierKey: string): string {
    const tierColors: Record<string, string> = {
      tier1: "c53030",
      tier2: "2b6cb0",
      tier3: "276749"
    };
    return tierColors[tierKey] || "2d3748";
  }

  private static createFooter(): Paragraph[] {
    const generatedDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return [
      new Paragraph({
        children: [
          new TextRun({
            text: `Generated on ${generatedDate} | Learner Competency Rubric System`,
            size: 18,
            color: "a0aec0"
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { before: 600 },
        border: {
          top: {
            color: "e2e8f0",
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6
          }
        }
      })
    ];
  }

  static async downloadWordDocument(
    phaseCode: PhaseCode, 
    options?: Partial<WordExportOptions>
  ): Promise<void> {
    const blob = await this.generateWordDocument(phaseCode, options);
    const phase = LEARNER_RUBRIC_SYSTEM.phases[phaseCode];
    const fileName = `${phase.phaseName.replace(/\s+/g, '_')}_Competency_Rubric.docx`;
    
    saveAs(blob, fileName);
  }
}