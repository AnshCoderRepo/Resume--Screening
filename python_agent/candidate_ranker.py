"""
Candidate Ranker Module
Ranks candidates and generates final results
"""

import logging
from typing import Dict, List, Any
from datetime import datetime
import time

class CandidateRanker:
    """Ranks candidates and generates screening results"""
    
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.logger = logging.getLogger(__name__)
        self.start_time = time.time()
    
    def rank_candidates(self, candidates: List[Dict[str, Any]], job_description: Dict[str, Any]) -> Dict[str, Any]:
        """Rank candidates and generate final results"""
        self.logger.info(f"Ranking {len(candidates)} candidates")
        
        # Sort candidates by match score (descending)
        ranked_candidates = sorted(candidates, key=lambda x: x.get('match_score', 0), reverse=True)
        
        # Get top matches (top 3 or all if less than 3)
        top_matches = ranked_candidates[:3]
        
        # Calculate processing time
        processing_time = time.time() - self.start_time
        
        # Generate results summary
        results = {
            'job_id': f"job_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            'job_title': job_description.get('title', 'Unknown Position'),
            'company': job_description.get('company', 'Unknown Company'),
            'analysis_date': datetime.now().isoformat(),
            'processing_time': processing_time,
            'total_resumes': len(candidates),
            'candidates': ranked_candidates,
            'top_matches': top_matches,
            'statistics': self._generate_statistics(ranked_candidates),
            'agent_reasoning': self._generate_agent_reasoning(ranked_candidates, job_description)
        }
        
        self.logger.info(f"Ranking completed. Top candidate: {top_matches[0]['name'] if top_matches else 'None'}")
        
        return results
    
    def _generate_statistics(self, candidates: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Generate statistical analysis of candidates"""
        if not candidates:
            return {}
        
        match_scores = [c.get('match_score', 0) for c in candidates]
        
        return {
            'average_match_score': sum(match_scores) / len(match_scores),
            'highest_match_score': max(match_scores),
            'lowest_match_score': min(match_scores),
            'candidates_above_80': len([s for s in match_scores if s >= 80]),
            'candidates_above_60': len([s for s in match_scores if s >= 60]),
            'candidates_below_40': len([s for s in match_scores if s < 40]),
            'total_skills_identified': sum(len(c.get('skills', [])) for c in candidates),
            'average_experience': sum(c.get('experience', 0) for c in candidates if c.get('experience')) / 
                                len([c for c in candidates if c.get('experience')])
        }
    
    def _generate_agent_reasoning(self, candidates: List[Dict[str, Any]], job_description: Dict[str, Any]) -> Dict[str, Any]:
        """Generate explanation of agent's reasoning process"""
        return {
            'process_steps': [
                "PDF text extraction and parsing",
                "Information extraction using NLP patterns",
                "Skill matching against job requirements",
                "Experience level analysis and scoring",
                "Education relevance assessment",
                "Preferred skills bonus calculation",
                "Role relevance evaluation",
                "Multi-factor weighted scoring",
                "Candidate ranking and selection",
                "Strength and concern identification",
                "Summary generation and reporting"
            ],
            'scoring_methodology': {
                'skills_matching': "40% weight - Direct matching of candidate skills with job requirements",
                'experience_level': "25% weight - Years of experience compared to job requirements",
                'education_relevance': "15% weight - Educational background alignment with role",
                'preferred_skills': "10% weight - Bonus points for preferred qualifications",
                'role_relevance': "10% weight - Current/previous role similarity to target position"
            },
            'decision_factors': [
                "Technical skill alignment with job requirements",
                "Professional experience level and relevance",
                "Educational background in relevant fields",
                "Demonstrated expertise in preferred technologies",
                "Career progression and role relevance",
                "Contact information completeness",
                "Resume quality and information clarity"
            ],
            'autonomous_features': [
                "Automatic PDF parsing and text extraction",
                "Intelligent information extraction without manual input",
                "Self-scoring using predefined algorithms",
                "Automatic candidate ranking and selection",
                "Real-time analysis and reporting",
                "Adaptive parsing for different resume formats"
            ]
        }