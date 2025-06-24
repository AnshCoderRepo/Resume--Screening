"""
Job Analyzer Module
Analyzes candidates against job requirements and calculates match scores
"""

import logging
from typing import Dict, List, Any
import re

class JobAnalyzer:
    """Analyzes candidates against job requirements"""
    
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.logger = logging.getLogger(__name__)
        
        # Scoring weights
        self.weights = {
            'skills': 0.40,      # 40% - Technical skills matching
            'experience': 0.25,   # 25% - Years of experience
            'education': 0.15,    # 15% - Educational background
            'preferred': 0.10,    # 10% - Preferred skills bonus
            'role': 0.10         # 10% - Role relevance
        }
    
    def analyze_candidate(self, candidate: Dict[str, Any], job_description: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze a candidate against job requirements"""
        self.logger.info(f"Analyzing candidate: {candidate.get('name', 'Unknown')}")
        
        # Calculate match score
        match_score = self._calculate_match_score(candidate, job_description)
        
        # Analyze strengths and concerns
        strengths, concerns = self._analyze_strengths_concerns(candidate, job_description)
        
        # Generate summary
        summary = self._generate_summary(candidate, match_score, strengths, concerns)
        
        # Add analysis results to candidate data
        analyzed_candidate = candidate.copy()
        analyzed_candidate.update({
            'match_score': match_score,
            'strengths': strengths,
            'concerns': concerns,
            'summary': summary,
            'analysis_details': self._get_detailed_analysis(candidate, job_description)
        })
        
        return analyzed_candidate
    
    def _calculate_match_score(self, candidate: Dict[str, Any], job_description: Dict[str, Any]) -> int:
        """Calculate overall match score for candidate"""
        total_score = 0
        
        # Skills matching (40%)
        skills_score = self._calculate_skills_score(candidate, job_description)
        total_score += skills_score * self.weights['skills']
        
        # Experience matching (25%)
        experience_score = self._calculate_experience_score(candidate, job_description)
        total_score += experience_score * self.weights['experience']
        
        # Education relevance (15%)
        education_score = self._calculate_education_score(candidate, job_description)
        total_score += education_score * self.weights['education']
        
        # Preferred skills bonus (10%)
        preferred_score = self._calculate_preferred_skills_score(candidate, job_description)
        total_score += preferred_score * self.weights['preferred']
        
        # Role relevance (10%)
        role_score = self._calculate_role_relevance_score(candidate, job_description)
        total_score += role_score * self.weights['role']
        
        return min(100, max(0, int(total_score)))
    
    def _calculate_skills_score(self, candidate: Dict[str, Any], job_description: Dict[str, Any]) -> float:
        """Calculate skills matching score (0-100)"""
        required_skills = [skill.lower().strip() for skill in job_description.get('requirements', [])]
        candidate_skills = [skill.lower() for skill in candidate.get('skills', [])]
        candidate_text = candidate.get('raw_text', '').lower()
        
        if not required_skills:
            return 50  # Neutral score if no requirements specified
        
        matched_skills = 0
        for req_skill in required_skills:
            # Check direct skill match
            skill_matched = any(req_skill in cand_skill or cand_skill in req_skill 
                              for cand_skill in candidate_skills)
            
            # Check if skill mentioned in resume text
            if not skill_matched:
                skill_matched = req_skill in candidate_text
            
            if skill_matched:
                matched_skills += 1
        
        return (matched_skills / len(required_skills)) * 100
    
    def _calculate_experience_score(self, candidate: Dict[str, Any], job_description: Dict[str, Any]) -> float:
        """Calculate experience matching score (0-100)"""
        required_exp = job_description.get('experience', 0)
        candidate_exp = candidate.get('experience', 0)
        
        if required_exp == 0:
            return 75  # Neutral score if no experience requirement
        
        if candidate_exp is None:
            return 25  # Low score if experience not found
        
        if candidate_exp >= required_exp:
            # Bonus for exceeding requirements, but cap at 100
            return min(100, 100 + (candidate_exp - required_exp) * 5)
        else:
            # Penalty for insufficient experience
            ratio = candidate_exp / required_exp
            if ratio >= 0.8:
                return 80
            elif ratio >= 0.6:
                return 60
            elif ratio >= 0.4:
                return 40
            else:
                return 20
    
    def _calculate_education_score(self, candidate: Dict[str, Any], job_description: Dict[str, Any]) -> float:
        """Calculate education relevance score (0-100)"""
        education = candidate.get('education', '').lower()
        
        if not education:
            return 50  # Neutral score if education not found
        
        # Check for relevant education
        relevant_keywords = [
            'computer science', 'software engineering', 'information technology',
            'computer engineering', 'electrical engineering', 'mathematics',
            'data science', 'cybersecurity'
        ]
        
        if any(keyword in education for keyword in relevant_keywords):
            if 'master' in education or 'phd' in education or 'doctorate' in education:
                return 100
            elif 'bachelor' in education:
                return 85
            else:
                return 70
        elif 'bachelor' in education or 'master' in education or 'degree' in education:
            return 60
        else:
            return 40
    
    def _calculate_preferred_skills_score(self, candidate: Dict[str, Any], job_description: Dict[str, Any]) -> float:
        """Calculate preferred skills bonus score (0-100)"""
        preferred_skills = job_description.get('preferredSkills', [])
        if not preferred_skills:
            return 0  # No bonus if no preferred skills
        
        candidate_skills = [skill.lower() for skill in candidate.get('skills', [])]
        candidate_text = candidate.get('raw_text', '').lower()
        
        matched_preferred = 0
        for pref_skill in preferred_skills:
            pref_skill_lower = pref_skill.lower().strip()
            
            # Check direct skill match
            skill_matched = any(pref_skill_lower in cand_skill or cand_skill in pref_skill_lower 
                              for cand_skill in candidate_skills)
            
            # Check if skill mentioned in resume text
            if not skill_matched:
                skill_matched = pref_skill_lower in candidate_text
            
            if skill_matched:
                matched_preferred += 1
        
        return (matched_preferred / len(preferred_skills)) * 100
    
    def _calculate_role_relevance_score(self, candidate: Dict[str, Any], job_description: Dict[str, Any]) -> float:
        """Calculate role relevance score (0-100)"""
        job_title = job_description.get('title', '').lower()
        current_role = candidate.get('current_role', '').lower()
        previous_roles = [role.lower() for role in candidate.get('previous_roles', [])]
        
        if not job_title:
            return 50  # Neutral score if no job title
        
        # Extract key words from job title
        job_keywords = [word for word in job_title.split() 
                       if word not in ['senior', 'junior', 'lead', 'principal', 'staff']]
        
        # Check current role relevance
        if current_role:
            if any(keyword in current_role for keyword in job_keywords):
                return 100
            elif any(keyword in current_role for keyword in ['developer', 'engineer', 'programmer']):
                return 75
        
        # Check previous roles
        for role in previous_roles:
            if any(keyword in role for keyword in job_keywords):
                return 80
            elif any(keyword in role for keyword in ['developer', 'engineer', 'programmer']):
                return 60
        
        return 30  # Low score if no relevant roles found
    
    def _analyze_strengths_concerns(self, candidate: Dict[str, Any], job_description: Dict[str, Any]) -> tuple:
        """Analyze candidate strengths and concerns"""
        strengths = []
        concerns = []
        
        # Analyze skills
        required_skills = job_description.get('requirements', [])
        candidate_skills = candidate.get('skills', [])
        
        skills_score = self._calculate_skills_score(candidate, job_description)
        if skills_score >= 80:
            strengths.append("Excellent technical skill alignment with job requirements")
        elif skills_score >= 60:
            strengths.append("Good match with most required technical skills")
        elif skills_score < 40:
            concerns.append("Limited match with required technical skills")
        
        # Analyze experience
        required_exp = job_description.get('experience', 0)
        candidate_exp = candidate.get('experience', 0)
        
        if candidate_exp and required_exp:
            if candidate_exp >= required_exp * 1.2:
                strengths.append("Exceeds required experience level")
            elif candidate_exp >= required_exp:
                strengths.append("Meets required experience level")
            elif candidate_exp < required_exp * 0.7:
                concerns.append(f"May lack sufficient experience ({candidate_exp} vs {required_exp} years required)")
        
        # Analyze education
        education = candidate.get('education', '').lower()
        if education:
            if any(keyword in education for keyword in ['computer', 'software', 'engineering']):
                strengths.append("Relevant educational background in technology")
        
        # Analyze preferred skills
        preferred_skills = job_description.get('preferredSkills', [])
        if preferred_skills:
            preferred_score = self._calculate_preferred_skills_score(candidate, job_description)
            if preferred_score > 50:
                matched_count = int((preferred_score / 100) * len(preferred_skills))
                strengths.append(f"Strong in {matched_count} preferred skill areas")
        
        # Check for missing information
        if not candidate.get('email'):
            concerns.append("Contact email not found in resume")
        if not candidate.get('phone'):
            concerns.append("Phone number not found in resume")
        if not candidate_skills:
            concerns.append("No technical skills clearly identified in resume")
        
        return strengths, concerns
    
    def _generate_summary(self, candidate: Dict[str, Any], match_score: int, 
                         strengths: List[str], concerns: List[str]) -> str:
        """Generate candidate summary"""
        grade = "Excellent" if match_score >= 80 else \
                "Good" if match_score >= 60 else \
                "Fair" if match_score >= 40 else "Limited"
        
        name = candidate.get('name', 'Candidate')
        experience = candidate.get('experience', 0)
        current_role = candidate.get('current_role', 'professional')
        
        summary = f"{grade} candidate"
        
        if experience:
            summary += f" with {experience} years of experience"
        
        if current_role and current_role != 'professional':
            summary += f" currently working as {current_role}"
        
        summary += ". "
        
        if strengths:
            summary += f"Key strengths include {strengths[0].lower()}. "
        
        if concerns:
            summary += f"Areas for consideration: {concerns[0].lower()}."
        else:
            summary += "Strong overall fit for the position."
        
        return summary
    
    def _get_detailed_analysis(self, candidate: Dict[str, Any], job_description: Dict[str, Any]) -> Dict[str, Any]:
        """Get detailed scoring breakdown"""
        return {
            'skills_score': self._calculate_skills_score(candidate, job_description),
            'experience_score': self._calculate_experience_score(candidate, job_description),
            'education_score': self._calculate_education_score(candidate, job_description),
            'preferred_skills_score': self._calculate_preferred_skills_score(candidate, job_description),
            'role_relevance_score': self._calculate_role_relevance_score(candidate, job_description),
            'weights_used': self.weights
        }