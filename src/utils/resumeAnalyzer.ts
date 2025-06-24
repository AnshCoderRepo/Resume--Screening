import { Candidate, JobDescription } from '../types';
import { ParsedResumeData } from './pdfParser';

export const analyzeParsedResume = (
  parsedData: ParsedResumeData,
  jobDescription: JobDescription,
  candidateId: string
): Candidate => {
  const matchScore = calculateMatchScore(parsedData, jobDescription);
  const { strengths, concerns } = analyzeStrengthsAndConcerns(parsedData, jobDescription);
  const summary = generateSummary(parsedData, matchScore, strengths, concerns);
  
  return {
    id: candidateId,
    name: parsedData.name || 'Unknown Candidate',
    email: parsedData.email || 'No email found',
    phone: parsedData.phone || 'No phone found',
    location: parsedData.location || 'Location not specified',
    experience: extractExperienceYears(parsedData.experience || ''),
    skills: parsedData.skills,
    education: parsedData.education || 'Education not specified',
    currentRole: parsedData.currentRole || 'Current role not specified',
    previousRoles: extractPreviousRoles(parsedData.text),
    matchScore,
    strengths,
    concerns,
    summary
  };
};

const calculateMatchScore = (parsedData: ParsedResumeData, jobDescription: JobDescription): number => {
  let score = 0;
  let maxScore = 100;
  
  // Skills matching (40% of total score)
  const requiredSkills = jobDescription.requirements.map(r => r.toLowerCase());
  const candidateSkills = parsedData.skills.map(s => s.toLowerCase());
  
  let skillMatches = 0;
  requiredSkills.forEach(reqSkill => {
    const isMatch = candidateSkills.some(candSkill => 
      candSkill.includes(reqSkill) || 
      reqSkill.includes(candSkill) ||
      parsedData.text.toLowerCase().includes(reqSkill)
    );
    if (isMatch) skillMatches++;
  });
  
  const skillScore = requiredSkills.length > 0 ? (skillMatches / requiredSkills.length) * 40 : 0;
  score += skillScore;
  
  // Experience matching (25% of total score)
  const candidateExp = extractExperienceYears(parsedData.experience || '');
  const requiredExp = jobDescription.experience || 0;
  
  if (candidateExp >= requiredExp) {
    score += 25;
  } else if (candidateExp >= requiredExp * 0.8) {
    score += 20;
  } else if (candidateExp >= requiredExp * 0.6) {
    score += 15;
  } else {
    score += 10;
  }
  
  // Education relevance (15% of total score)
  const education = parsedData.education?.toLowerCase() || '';
  if (education.includes('computer') || education.includes('software') || 
      education.includes('engineering') || education.includes('technology')) {
    score += 15;
  } else if (education.includes('bachelor') || education.includes('master')) {
    score += 10;
  } else if (education.includes('degree')) {
    score += 5;
  }
  
  // Preferred skills bonus (10% of total score)
  const preferredSkills = jobDescription.preferredSkills?.map(s => s.toLowerCase()) || [];
  let preferredMatches = 0;
  preferredSkills.forEach(prefSkill => {
    const isMatch = candidateSkills.some(candSkill => 
      candSkill.includes(prefSkill) || 
      prefSkill.includes(candSkill) ||
      parsedData.text.toLowerCase().includes(prefSkill)
    );
    if (isMatch) preferredMatches++;
  });
  
  if (preferredSkills.length > 0) {
    score += (preferredMatches / preferredSkills.length) * 10;
  }
  
  // Role relevance (10% of total score)
  const currentRole = parsedData.currentRole?.toLowerCase() || '';
  const jobTitle = jobDescription.title.toLowerCase();
  
  if (currentRole.includes(jobTitle.split(' ')[0]) || 
      jobTitle.includes(currentRole.split(' ')[0])) {
    score += 10;
  } else if (currentRole.includes('developer') || currentRole.includes('engineer')) {
    score += 5;
  }
  
  return Math.min(100, Math.max(0, Math.round(score)));
};

const analyzeStrengthsAndConcerns = (
  parsedData: ParsedResumeData, 
  jobDescription: JobDescription
): { strengths: string[], concerns: string[] } => {
  const strengths: string[] = [];
  const concerns: string[] = [];
  
  // Analyze skills
  const requiredSkills = jobDescription.requirements.map(r => r.toLowerCase());
  const candidateSkills = parsedData.skills.map(s => s.toLowerCase());
  
  let skillMatches = 0;
  requiredSkills.forEach(reqSkill => {
    const isMatch = candidateSkills.some(candSkill => 
      candSkill.includes(reqSkill) || reqSkill.includes(candSkill)
    );
    if (isMatch) skillMatches++;
  });
  
  const skillMatchRatio = requiredSkills.length > 0 ? skillMatches / requiredSkills.length : 0;
  
  if (skillMatchRatio >= 0.8) {
    strengths.push('Excellent technical skill alignment with job requirements');
  } else if (skillMatchRatio >= 0.6) {
    strengths.push('Good match with most required technical skills');
  } else if (skillMatchRatio < 0.4) {
    concerns.push('Limited match with required technical skills');
  }
  
  // Analyze experience
  const candidateExp = extractExperienceYears(parsedData.experience || '');
  const requiredExp = jobDescription.experience || 0;
  
  if (candidateExp >= requiredExp * 1.2) {
    strengths.push('Exceeds required experience level');
  } else if (candidateExp >= requiredExp) {
    strengths.push('Meets required experience level');
  } else if (candidateExp < requiredExp * 0.7) {
    concerns.push(`May lack sufficient experience (${candidateExp} vs ${requiredExp} years required)`);
  }
  
  // Analyze education
  const education = parsedData.education?.toLowerCase() || '';
  if (education.includes('computer') || education.includes('software')) {
    strengths.push('Relevant educational background in technology');
  }
  
  // Analyze preferred skills
  const preferredSkills = jobDescription.preferredSkills?.map(s => s.toLowerCase()) || [];
  let preferredMatches = 0;
  preferredSkills.forEach(prefSkill => {
    const isMatch = candidateSkills.some(candSkill => 
      candSkill.includes(prefSkill) || prefSkill.includes(candSkill)
    );
    if (isMatch) preferredMatches++;
  });
  
  if (preferredMatches > 0) {
    strengths.push(`Strong in ${preferredMatches} preferred skill areas`);
  }
  
  // Check for missing critical information
  if (!parsedData.email) {
    concerns.push('Contact email not found in resume');
  }
  if (!parsedData.phone) {
    concerns.push('Phone number not found in resume');
  }
  if (parsedData.skills.length === 0) {
    concerns.push('No technical skills clearly identified in resume');
  }
  
  return { strengths, concerns };
};

const generateSummary = (
  parsedData: ParsedResumeData,
  matchScore: number,
  strengths: string[],
  concerns: string[]
): string => {
  const grade = matchScore >= 80 ? 'Excellent' : 
                matchScore >= 60 ? 'Good' : 
                matchScore >= 40 ? 'Fair' : 'Limited';
  
  const experience = extractExperienceYears(parsedData.experience || '');
  const role = parsedData.currentRole || 'professional';
  
  let summary = `${grade} candidate`;
  
  if (experience > 0) {
    summary += ` with ${experience} years of experience`;
  }
  
  if (role !== 'professional') {
    summary += ` currently working as ${role}`;
  }
  
  summary += '. ';
  
  if (strengths.length > 0) {
    summary += `Key strengths include ${strengths.slice(0, 2).join(' and ').toLowerCase()}. `;
  }
  
  if (concerns.length > 0) {
    summary += `Areas for consideration: ${concerns[0].toLowerCase()}.`;
  } else {
    summary += 'Strong overall fit for the position.';
  }
  
  return summary;
};

const extractExperienceYears = (experienceText: string): number => {
  if (!experienceText) return 0;
  
  const match = experienceText.match(/(\d+)/);
  return match ? parseInt(match[1]) : 0;
};

const extractPreviousRoles = (text: string): string[] => {
  // This is a simplified extraction - in a real implementation,
  // you'd use more sophisticated NLP techniques
  const roles: string[] = [];
  const commonTitles = [
    'developer', 'engineer', 'manager', 'analyst', 'consultant',
    'architect', 'designer', 'specialist', 'coordinator', 'lead'
  ];
  
  const lines = text.split('\n');
  lines.forEach(line => {
    const lowerLine = line.toLowerCase();
    commonTitles.forEach(title => {
      if (lowerLine.includes(title) && line.length < 100) {
        roles.push(line.trim());
      }
    });
  });
  
  return [...new Set(roles)].slice(0, 3); // Remove duplicates and limit to 3
};