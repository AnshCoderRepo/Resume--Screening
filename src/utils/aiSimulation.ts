import { Candidate, JobDescription } from '../types';

const MOCK_NAMES = [
  'Sarah Chen', 'Marcus Johnson', 'Elena Rodriguez', 'David Kim', 'Priya Patel',
  'Alex Thompson', 'Maria Garcia', 'James Wilson', 'Aisha Ahmed', 'Lucas Brown',
  'Sophia Lee', 'Michael Davis', 'Nina Kowalski', 'Ryan O\'Connor', 'Zara Ali'
];

const MOCK_SKILLS = [
  'JavaScript', 'Python', 'React', 'Node.js', 'TypeScript', 'AWS', 'Docker',
  'PostgreSQL', 'MongoDB', 'GraphQL', 'Vue.js', 'Angular', 'Java', 'C#',
  'Kubernetes', 'CI/CD', 'Git', 'Agile', 'Scrum', 'Machine Learning',
  'Data Science', 'SQL', 'NoSQL', 'Microservices', 'REST APIs', 'DevOps'
];

const MOCK_ROLES = [
  'Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
  'Data Scientist', 'Product Manager', 'DevOps Engineer', 'UI/UX Designer',
  'System Architect', 'Technical Lead', 'Senior Developer', 'Team Lead'
];

const MOCK_COMPANIES = [
  'TechCorp', 'InnovateNow', 'DataSoft', 'CloudFirst', 'NextGen Solutions',
  'DigitalEdge', 'ScaleUp', 'TechVision', 'CodeCraft', 'FutureBuilders'
];

export const generateMockCandidates = (count: number, jobDescription: JobDescription): Candidate[] => {
  const candidates: Candidate[] = [];
  
  for (let i = 0; i < count; i++) {
    const name = MOCK_NAMES[i % MOCK_NAMES.length];
    const skills = generateSkillsForJob(jobDescription);
    const experience = Math.floor(Math.random() * 10) + 1;
    
    candidates.push({
      id: `candidate-${i + 1}`,
      name,
      email: `${name.toLowerCase().replace(' ', '.')}@email.com`,
      phone: `+1 (555) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      location: ['San Francisco, CA', 'New York, NY', 'Austin, TX', 'Seattle, WA', 'Boston, MA'][Math.floor(Math.random() * 5)],
      experience,
      skills,
      education: ['Bachelor\'s in Computer Science', 'Master\'s in Software Engineering', 'Bachelor\'s in Information Technology'][Math.floor(Math.random() * 3)],
      currentRole: MOCK_ROLES[Math.floor(Math.random() * MOCK_ROLES.length)],
      previousRoles: MOCK_ROLES.slice(0, Math.floor(Math.random() * 3) + 1),
      matchScore: 0, // Will be calculated
      strengths: [],
      concerns: [],
      summary: ''
    });
  }
  
  return candidates;
};

const generateSkillsForJob = (jobDescription: JobDescription): string[] => {
  const jobSkills = [...jobDescription.requirements, ...jobDescription.preferredSkills];
  const relevantSkills = MOCK_SKILLS.filter(skill => 
    jobSkills.some(jobSkill => 
      jobSkill.toLowerCase().includes(skill.toLowerCase()) ||
      skill.toLowerCase().includes(jobSkill.toLowerCase())
    )
  );
  
  const additionalSkills = MOCK_SKILLS.filter(skill => !relevantSkills.includes(skill))
    .slice(0, Math.floor(Math.random() * 5) + 2);
  
  return [...relevantSkills.slice(0, Math.floor(Math.random() * relevantSkills.length) + 1), ...additionalSkills];
};

export const analyzeResumes = (candidates: Candidate[], jobDescription: JobDescription): Candidate[] => {
  return candidates.map(candidate => {
    const analysis = analyzeCandidateMatch(candidate, jobDescription);
    return {
      ...candidate,
      ...analysis
    };
  }).sort((a, b) => b.matchScore - a.matchScore);
};

const analyzeCandidateMatch = (candidate: Candidate, jobDescription: JobDescription) => {
  let matchScore = 0;
  const strengths: string[] = [];
  const concerns: string[] = [];
  
  // Experience matching
  const experienceDiff = Math.abs(candidate.experience - jobDescription.experience);
  if (experienceDiff <= 1) {
    matchScore += 25;
    strengths.push('Experience level perfectly matches requirements');
  } else if (experienceDiff <= 2) {
    matchScore += 15;
    strengths.push('Experience level closely matches requirements');
  } else if (candidate.experience < jobDescription.experience) {
    concerns.push(`May lack required experience (${candidate.experience} vs ${jobDescription.experience} years)`);
  }
  
  // Skills matching
  const requiredSkills = jobDescription.requirements.map(r => r.toLowerCase());
  const candidateSkills = candidate.skills.map(s => s.toLowerCase());
  
  const matchedRequiredSkills = requiredSkills.filter(skill =>
    candidateSkills.some(cSkill => cSkill.includes(skill) || skill.includes(cSkill))
  );
  
  const skillMatchRatio = matchedRequiredSkills.length / requiredSkills.length;
  matchScore += skillMatchRatio * 40;
  
  if (skillMatchRatio >= 0.8) {
    strengths.push('Excellent skill match with job requirements');
  } else if (skillMatchRatio >= 0.6) {
    strengths.push('Good skill alignment with most requirements');
  } else {
    concerns.push('Limited match with required technical skills');
  }
  
  // Preferred skills bonus
  const preferredSkills = jobDescription.preferredSkills.map(s => s.toLowerCase());
  const matchedPreferredSkills = preferredSkills.filter(skill =>
    candidateSkills.some(cSkill => cSkill.includes(skill) || skill.includes(cSkill))
  );
  
  if (matchedPreferredSkills.length > 0) {
    matchScore += (matchedPreferredSkills.length / preferredSkills.length) * 20;
    strengths.push(`Strong in ${matchedPreferredSkills.length} preferred skill areas`);
  }
  
  // Education and role relevance
  if (candidate.currentRole.toLowerCase().includes(jobDescription.title.toLowerCase().split(' ')[0])) {
    matchScore += 10;
    strengths.push('Current role directly relevant to position');
  }
  
  // Add some randomness for realism
  matchScore += Math.random() * 10 - 5;
  matchScore = Math.max(0, Math.min(100, matchScore));
  
  const summary = generateCandidateSummary(candidate, matchScore, strengths, concerns);
  
  return {
    matchScore: Math.round(matchScore),
    strengths,
    concerns,
    summary
  };
};

const generateCandidateSummary = (candidate: Candidate, matchScore: number, strengths: string[], concerns: string[]): string => {
  const grade = matchScore >= 80 ? 'Excellent' : matchScore >= 60 ? 'Good' : matchScore >= 40 ? 'Fair' : 'Limited';
  
  return `${grade} candidate with ${candidate.experience} years of experience in ${candidate.currentRole}. ` +
         `Key strengths include ${strengths.slice(0, 2).join(' and ').toLowerCase()}. ` +
         (concerns.length > 0 ? `Areas for consideration: ${concerns[0].toLowerCase()}.` : 'Strong overall fit for the position.');
};