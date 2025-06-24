export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  experience: number;
  skills: string[];
  education: string;
  currentRole: string;
  previousRoles: string[];
  matchScore: number;
  strengths: string[];
  concerns: string[];
  summary: string;
  resumeFile?: File;
}

export interface JobDescription {
  title: string;
  company: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'remote';
  level: 'junior' | 'mid' | 'senior' | 'lead' | 'executive';
  description: string;
  requirements: string[];
  preferredSkills: string[];
  experience: number;
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
}

export interface ScreeningResult {
  jobId: string;
  candidates: Candidate[];
  topMatches: Candidate[];
  processingTime: number;
  totalResumes: number;
  analysisDate: Date;
}