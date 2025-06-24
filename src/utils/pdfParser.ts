import * as pdfjsLib from 'pdfjs-dist';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

export interface ParsedResumeData {
  text: string;
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  skills: string[];
  experience?: string;
  education?: string;
  currentRole?: string;
}

export const parseResumeFromFile = async (file: File): Promise<ParsedResumeData> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = '';
    
    // Extract text from all pages
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + ' ';
    }
    
    // Parse the extracted text
    return parseResumeText(fullText, file.name);
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error(`Failed to parse resume: ${file.name}`);
  }
};

const parseResumeText = (text: string, fileName: string): ParsedResumeData => {
  const cleanText = text.replace(/\s+/g, ' ').trim();
  
  return {
    text: cleanText,
    name: extractName(cleanText, fileName),
    email: extractEmail(cleanText),
    phone: extractPhone(cleanText),
    location: extractLocation(cleanText),
    skills: extractSkills(cleanText),
    experience: extractExperience(cleanText),
    education: extractEducation(cleanText),
    currentRole: extractCurrentRole(cleanText)
  };
};

const extractName = (text: string, fileName: string): string => {
  // Try to extract name from the beginning of the resume
  const lines = text.split('\n').filter(line => line.trim().length > 0);
  
  // Look for name patterns in first few lines
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i].trim();
    
    // Skip common headers
    if (line.toLowerCase().includes('resume') || 
        line.toLowerCase().includes('curriculum') ||
        line.toLowerCase().includes('cv')) {
      continue;
    }
    
    // Check if line looks like a name (2-4 words, proper case)
    const words = line.split(' ').filter(w => w.length > 1);
    if (words.length >= 2 && words.length <= 4) {
      const isName = words.every(word => 
        /^[A-Z][a-z]+$/.test(word) || /^[A-Z]\.?$/.test(word)
      );
      if (isName) {
        return line;
      }
    }
  }
  
  // Fallback to filename without extension
  return fileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
};

const extractEmail = (text: string): string => {
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
  const match = text.match(emailRegex);
  return match ? match[0] : '';
};

const extractPhone = (text: string): string => {
  const phoneRegex = /(\+?1?[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/;
  const match = text.match(phoneRegex);
  return match ? match[0] : '';
};

const extractLocation = (text: string): string => {
  // Look for city, state patterns
  const locationRegex = /([A-Z][a-z]+,?\s+[A-Z]{2})|([A-Z][a-z]+\s+[A-Z][a-z]+,?\s+[A-Z]{2})/;
  const match = text.match(locationRegex);
  return match ? match[0] : '';
};

const extractSkills = (text: string): string[] => {
  const commonSkills = [
    'JavaScript', 'Python', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift',
    'React', 'Angular', 'Vue', 'Node.js', 'Express', 'Django', 'Flask', 'Spring',
    'HTML', 'CSS', 'SASS', 'LESS', 'Bootstrap', 'Tailwind',
    'SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite',
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Jenkins',
    'Git', 'GitHub', 'GitLab', 'Bitbucket',
    'Agile', 'Scrum', 'DevOps', 'CI/CD',
    'Machine Learning', 'AI', 'Data Science', 'Analytics',
    'REST', 'GraphQL', 'API', 'Microservices',
    'Linux', 'Unix', 'Windows', 'macOS'
  ];
  
  const foundSkills: string[] = [];
  const lowerText = text.toLowerCase();
  
  commonSkills.forEach(skill => {
    if (lowerText.includes(skill.toLowerCase())) {
      foundSkills.push(skill);
    }
  });
  
  return foundSkills;
};

const extractExperience = (text: string): string => {
  // Look for experience patterns
  const expRegex = /(\d+)\+?\s*(years?|yrs?)\s*(of\s*)?(experience|exp)/i;
  const match = text.match(expRegex);
  return match ? match[1] + ' years' : '';
};

const extractEducation = (text: string): string => {
  const educationKeywords = ['bachelor', 'master', 'phd', 'degree', 'university', 'college'];
  const lines = text.split('\n');
  
  for (const line of lines) {
    const lowerLine = line.toLowerCase();
    if (educationKeywords.some(keyword => lowerLine.includes(keyword))) {
      return line.trim();
    }
  }
  
  return '';
};

const extractCurrentRole = (text: string): string => {
  // Look for current role indicators
  const roleIndicators = ['current', 'present', 'now', 'currently'];
  const lines = text.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase();
    if (roleIndicators.some(indicator => line.includes(indicator))) {
      // Look for job title in nearby lines
      for (let j = Math.max(0, i - 2); j <= Math.min(lines.length - 1, i + 2); j++) {
        const nearbyLine = lines[j].trim();
        if (nearbyLine.length > 5 && nearbyLine.length < 50) {
          return nearbyLine;
        }
      }
    }
  }
  
  return '';
};