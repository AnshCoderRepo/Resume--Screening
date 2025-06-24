"""
Utility functions for the Resume Screening Agent
"""

import logging
import json
from pathlib import Path
from typing import Dict, Any

def setup_logging(log_level: str = "INFO") -> logging.Logger:
    """Setup logging configuration"""
    logging.basicConfig(
        level=getattr(logging, log_level.upper()),
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler('resume_screening.log'),
            logging.StreamHandler()
        ]
    )
    
    return logging.getLogger(__name__)

def load_config(config_path: str) -> Dict[str, Any]:
    """Load configuration from JSON file"""
    config_file = Path(config_path)
    
    if not config_file.exists():
        # Create default config if it doesn't exist
        default_config = {
            "email": {
                "simulation_mode": True,
                "smtp_server": "smtp.gmail.com",
                "smtp_port": 587,
                "sender_email": "ai-agent@onelogica.com",
                "sender_password": "",
                "recipient_email": "hr-manager@onelogica.com"
            },
            "scoring": {
                "skills_weight": 0.40,
                "experience_weight": 0.25,
                "education_weight": 0.15,
                "preferred_weight": 0.10,
                "role_weight": 0.10
            },
            "processing": {
                "max_resume_size_mb": 10,
                "supported_formats": ["pdf"],
                "max_candidates": 100
            }
        }
        
        with open(config_file, 'w') as f:
            json.dump(default_config, f, indent=2)
        
        print(f"Created default configuration file: {config_path}")
    
    with open(config_file, 'r') as f:
        return json.load(f)

def validate_job_description(job_data: Dict[str, Any]) -> bool:
    """Validate job description data"""
    required_fields = ['title', 'requirements']
    
    for field in required_fields:
        if field not in job_data or not job_data[field]:
            raise ValueError(f"Missing required field: {field}")
    
    return True

def format_duration(seconds: float) -> str:
    """Format duration in human-readable format"""
    if seconds < 60:
        return f"{seconds:.1f} seconds"
    elif seconds < 3600:
        minutes = seconds / 60
        return f"{minutes:.1f} minutes"
    else:
        hours = seconds / 3600
        return f"{hours:.1f} hours"