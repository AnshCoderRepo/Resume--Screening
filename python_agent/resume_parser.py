"""
Resume Parser Module
Handles PDF parsing and information extraction from resumes
"""

import re
import logging
from pathlib import Path
from typing import Dict, List, Any, Optional
import PyPDF2
import spacy
from datetime import datetime

class ResumeParser:
    """Parses PDF resumes and extracts structured information"""
    
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.logger = logging.getLogger(__name__)
        
        # Load spaCy model for NLP
        try:
            self.nlp = spacy.load("en_core_web_sm")
        except OSError:
            self.logger.warning("spaCy model not found. Install with: python -m spacy download en_core_web_sm")
            self.nlp = None
        
        # Common skills database
        self.common_skills = self._load_skills_database()
        
    def _load_skills_database(self) -> List[str]:
        """Load common technical skills for matching"""
        return [
            # Programming Languages
            'Python', 'JavaScript', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift',
            'TypeScript', 'Kotlin', 'Scala', 'R', 'MATLAB', 'Perl', 'Shell', 'Bash',
            
            # Web Technologies
            'React', 'Angular', 'Vue.js', 'Node.js', 'Express.js', 'Django', 'Flask', 'Spring',
            'HTML', 'CSS', 'SASS', 'LESS', 'Bootstrap', 'Tailwind CSS', 'jQuery',
            
            # Databases
            'SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite', 'Oracle', 'Cassandra',
            'DynamoDB', 'Elasticsearch', 'Neo4j',
            
            # Cloud & DevOps
            'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Jenkins', 'GitLab CI', 'GitHub Actions',
            'Terraform', 'Ansible', 'Chef', 'Puppet',
            
            # Tools & Frameworks
            'Git', 'GitHub', 'GitLab', 'Bitbucket', 'JIRA', 'Confluence', 'Slack',
            'REST API', 'GraphQL', 'Microservices', 'API Gateway',
            
            # Methodologies
            'Agile', 'Scrum', 'Kanban', 'DevOps', 'CI/CD', 'TDD', 'BDD',
            
            # Data & AI
            'Machine Learning', 'Deep Learning', 'AI', 'Data Science', 'Analytics',
            'Pandas', 'NumPy', 'TensorFlow', 'PyTorch', 'Scikit-learn',
            
            # Operating Systems
            'Linux', 'Unix', 'Windows', 'macOS', 'Ubuntu', 'CentOS'
        ]
    
    def parse_resume(self, file_path: Path) -> Dict[str, Any]:
        """Parse a PDF resume and extract structured information"""
        self.logger.info(f"Parsing resume: {file_path.name}")
        
        try:
            # Extract text from PDF
            text = self._extract_pdf_text(file_path)
            
            if not text.strip():
                raise ValueError("No text could be extracted from PDF")
            
            # Parse information from text
            candidate_data = {
                'id': f"candidate_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{file_path.stem}",
                'name': self._extract_name(text, file_path.stem),
                'email': self._extract_email(text),
                'phone': self._extract_phone(text),
                'location': self._extract_location(text),
                'skills': self._extract_skills(text),
                'experience': self._extract_experience_years(text),
                'education': self._extract_education(text),
                'current_role': self._extract_current_role(text),
                'previous_roles': self._extract_previous_roles(text),
                'summary': self._extract_summary(text),
                'raw_text': text,
                'file_name': file_path.name
            }
            
            self.logger.info(f"Successfully parsed resume for {candidate_data['name']}")
            return candidate_data
            
        except Exception as e:
            self.logger.error(f"Failed to parse resume {file_path.name}: {str(e)}")
            raise
    
    def _extract_pdf_text(self, file_path: Path) -> str:
        """Extract text from PDF file"""
        text = ""
        try:
            with open(file_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                for page in pdf_reader.pages:
                    text += page.extract_text() + "\n"
        except Exception as e:
            raise ValueError(f"Could not extract text from PDF: {str(e)}")
        
        return text.strip()
    
    def _extract_name(self, text: str, filename: str) -> str:
        """Extract candidate name from resume text"""
        lines = [line.strip() for line in text.split('\n') if line.strip()]
        
        # Look for name in first few lines
        for line in lines[:5]:
            # Skip common headers
            if any(header in line.lower() for header in ['resume', 'curriculum', 'cv', 'vitae']):
                continue
            
            # Check if line looks like a name (2-4 words, proper case)
            words = line.split()
            if 2 <= len(words) <= 4:
                if all(word[0].isupper() and word[1:].islower() for word in words if len(word) > 1):
                    return line
        
        # Fallback to filename
        return filename.replace('_', ' ').replace('-', ' ').title()
    
    def _extract_email(self, text: str) -> Optional[str]:
        """Extract email address from text"""
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        matches = re.findall(email_pattern, text)
        return matches[0] if matches else None
    
    def _extract_phone(self, text: str) -> Optional[str]:
        """Extract phone number from text"""
        phone_patterns = [
            r'\+?1?[-.\s]?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})',
            r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b'
        ]
        
        for pattern in phone_patterns:
            matches = re.findall(pattern, text)
            if matches:
                if isinstance(matches[0], tuple):
                    return f"({matches[0][0]}) {matches[0][1]}-{matches[0][2]}"
                else:
                    return matches[0]
        
        return None
    
    def _extract_location(self, text: str) -> Optional[str]:
        """Extract location from text"""
        location_patterns = [
            r'([A-Z][a-z]+,?\s+[A-Z]{2})',  # City, State
            r'([A-Z][a-z]+\s+[A-Z][a-z]+,?\s+[A-Z]{2})',  # City Name, State
        ]
        
        for pattern in location_patterns:
            matches = re.findall(pattern, text)
            if matches:
                return matches[0]
        
        return None
    
    def _extract_skills(self, text: str) -> List[str]:
        """Extract technical skills from text"""
        found_skills = []
        text_lower = text.lower()
        
        for skill in self.common_skills:
            if skill.lower() in text_lower:
                found_skills.append(skill)
        
        # Remove duplicates and sort
        return sorted(list(set(found_skills)))
    
    def _extract_experience_years(self, text: str) -> Optional[int]:
        """Extract years of experience from text"""
        experience_patterns = [
            r'(\d+)\+?\s*years?\s*(?:of\s*)?experience',
            r'(\d+)\+?\s*yrs?\s*(?:of\s*)?experience',
            r'experience[:\s]*(\d+)\+?\s*years?',
        ]
        
        for pattern in experience_patterns:
            matches = re.findall(pattern, text.lower())
            if matches:
                return int(matches[0])
        
        return None
    
    def _extract_education(self, text: str) -> Optional[str]:
        """Extract education information from text"""
        education_keywords = [
            'bachelor', 'master', 'phd', 'doctorate', 'degree', 
            'university', 'college', 'institute', 'school'
        ]
        
        lines = text.split('\n')
        for line in lines:
            line_lower = line.lower()
            if any(keyword in line_lower for keyword in education_keywords):
                if len(line.strip()) > 10 and len(line.strip()) < 200:
                    return line.strip()
        
        return None
    
    def _extract_current_role(self, text: str) -> Optional[str]:
        """Extract current job role from text"""
        current_indicators = ['current', 'present', 'now', 'currently', '2024', '2023']
        lines = text.split('\n')
        
        for i, line in enumerate(lines):
            line_lower = line.lower()
            if any(indicator in line_lower for indicator in current_indicators):
                # Look for job title in nearby lines
                for j in range(max(0, i-2), min(len(lines), i+3)):
                    nearby_line = lines[j].strip()
                    if 5 < len(nearby_line) < 100:
                        # Check if it looks like a job title
                        if any(title_word in nearby_line.lower() for title_word in 
                               ['developer', 'engineer', 'manager', 'analyst', 'designer', 'architect']):
                            return nearby_line
        
        return None
    
    def _extract_previous_roles(self, text: str) -> List[str]:
        """Extract previous job roles from text"""
        job_titles = []
        title_keywords = [
            'developer', 'engineer', 'manager', 'analyst', 'consultant',
            'architect', 'designer', 'specialist', 'coordinator', 'lead',
            'director', 'senior', 'junior', 'associate'
        ]
        
        lines = text.split('\n')
        for line in lines:
            line_clean = line.strip()
            if 5 < len(line_clean) < 100:
                line_lower = line_clean.lower()
                if any(keyword in line_lower for keyword in title_keywords):
                    job_titles.append(line_clean)
        
        # Remove duplicates and limit to 5
        return list(dict.fromkeys(job_titles))[:5]
    
    def _extract_summary(self, text: str) -> str:
        """Extract or generate a summary from the resume"""
        # Look for existing summary sections
        summary_keywords = ['summary', 'profile', 'objective', 'about']
        lines = text.split('\n')
        
        for i, line in enumerate(lines):
            line_lower = line.lower().strip()
            if any(keyword in line_lower for keyword in summary_keywords):
                # Get next few lines as summary
                summary_lines = []
                for j in range(i+1, min(len(lines), i+5)):
                    next_line = lines[j].strip()
                    if next_line and len(next_line) > 20:
                        summary_lines.append(next_line)
                        if len(' '.join(summary_lines)) > 200:
                            break
                
                if summary_lines:
                    return ' '.join(summary_lines)[:300]
        
        # Generate basic summary from available info
        return f"Professional with experience in software development and technology."