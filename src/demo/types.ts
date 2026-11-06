import type { Project, Finding, Recommendation, ProcessStep } from '../domain/schema';
export type Page =
  | 'overview'
  | 'sources'
  | 'findings'
  | 'perspectives'
  | 'processes'
  | 'target'
  | 'recommendations'
  | 'report';
export type PageProps = {
  project: Project;
  navigate: (page: Page) => void;
  inspect: (finding: Finding) => void;
  editFinding: (finding: Finding) => void;
  editRecommendation: (rec: Recommendation) => void;
  editProcess: (step: ProcessStep) => void;
  save: (project: Project) => void;
  editRatings: () => void;
};
