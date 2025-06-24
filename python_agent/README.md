# Python Resume Screening Agent

## Overview
A complete Python implementation of an autonomous resume screening agent that processes PDF resumes, analyzes candidates against job requirements, and provides ranked recommendations with detailed reasoning.

## Features
- **Autonomous Processing**: Automatically processes PDF resumes without manual intervention
- **Advanced PDF Parsing**: Extracts text and structured data from PDF resumes using PyPDF2
- **NLP Analysis**: Uses spaCy for intelligent information extraction
- **Multi-factor Scoring**: Weighted algorithm considering skills, experience, education, and role relevance
- **Email Automation**: Sends detailed results via email
- **Comprehensive Reporting**: Generates detailed analysis reports and summaries

## Installation

### Prerequisites
- Python 3.8+
- pip package manager

### Quick Setup
```bash
# Clone or download the project
cd python_agent

# Run setup script (installs dependencies and downloads models)
python setup.py

# Or install manually:
pip install -r requirements.txt
python -m spacy download en_core_web_sm
```

## Usage

### Basic Usage
```bash
# Analyze resumes with job description
python main.py --job-file sample_job.json --resume-folder ./resumes

# Include email delivery
python main.py --job-file sample_job.json --resume-folder ./resumes --send-email

# Specify custom output folder
python main.py --job-file sample_job.json --resume-folder ./resumes --output-folder ./results
```

### Directory Structure
```
python_agent/
├── main.py                 # Main application entry point
├── resume_parser.py        # PDF parsing and information extraction
├── job_analyzer.py         # Candidate analysis and scoring
├── candidate_ranker.py     # Ranking and results generation
├── email_sender.py         # Email automation
├── utils.py               # Utility functions
├── config.json            # Configuration settings
├── sample_job.json        # Sample job description
├── requirements.txt       # Python dependencies
├── setup.py              # Setup script
├── resumes/              # Place PDF resumes here
├── output/               # Generated reports and results
└── logs/                 # Application logs
```

## Job Description Format

Create a JSON file with job requirements:

```json
{
  "title": "Senior Full Stack Developer",
  "company": "Onelogica",
  "location": "San Francisco, CA",
  "requirements": [
    "React.js and modern JavaScript frameworks",
    "Node.js and Express.js",
    "Database design (PostgreSQL/MongoDB)",
    "RESTful API development",
    "Git version control",
    "5+ years of web development experience"
  ],
  "preferredSkills": [
    "TypeScript",
    "AWS or cloud platforms",
    "Docker and containerization"
  ],
  "experience": 5
}
```

## Scoring Algorithm

The agent uses a weighted scoring system:

- **Skills Matching (40%)**: Direct alignment with required technical skills
- **Experience Level (25%)**: Years of experience vs. job requirements
- **Education Relevance (15%)**: Educational background alignment
- **Preferred Skills (10%)**: Bonus for preferred qualifications
- **Role Relevance (10%)**: Current/previous role similarity

## Output Files

The agent generates several output files:

1. **screening_results_[timestamp].json**: Complete analysis data
2. **summary_report_[timestamp].txt**: Human-readable summary
3. **resume_screening.log**: Processing logs

## Email Configuration

Edit `config.json` to configure email settings:

```json
{
  "email": {
    "simulation_mode": true,
    "smtp_server": "smtp.gmail.com",
    "smtp_port": 587,
    "sender_email": "ai-agent@company.com",
    "recipient_email": "hr-manager@company.com"
  }
}
```

Set `simulation_mode: false` for actual email delivery.

## Example Output

```
================================================================================
TOP 3 CANDIDATES - SCREENING RESULTS
================================================================================

#1 - Sarah Chen (92% Match)
Contact: sarah.chen@email.com | (555) 123-4567
Experience: 7 years
Summary: Excellent candidate with 7 years of experience currently working as Senior Full Stack Developer.
Strengths: Excellent technical skill alignment with job requirements, Exceeds required experience level
--------------------------------------------------------------------------------

#2 - Marcus Johnson (78% Match)
Contact: marcus.johnson@email.com | (555) 234-5678
Experience: 5 years
Summary: Good candidate with 5 years of experience as Full Stack Developer.
Strengths: Meets required experience level, Good match with most required technical skills
--------------------------------------------------------------------------------

#3 - Elena Rodriguez (65% Match)
Contact: elena.rodriguez@email.com | (555) 345-6789
Experience: 3 years
Summary: Fair candidate with solid fundamentals but limited experience level.
Concerns: May lack sufficient experience (3 vs 5 years required)
--------------------------------------------------------------------------------
```

## Architecture

### Component Overview
- **ResumeParser**: PDF text extraction and information parsing
- **JobAnalyzer**: Candidate analysis and match scoring
- **CandidateRanker**: Ranking algorithm and results generation
- **EmailSender**: Automated email delivery
- **Utils**: Configuration and logging utilities

### Processing Flow
1. Load job description and configuration
2. Discover and validate PDF resume files
3. Parse each resume (text extraction + information extraction)
4. Analyze each candidate against job requirements
5. Calculate weighted match scores
6. Rank candidates and select top matches
7. Generate detailed reports and summaries
8. Send email notifications (optional)

## Autonomous Agent Features

The system operates autonomously by:
- **Auto-discovery**: Automatically finds PDF files in specified folder
- **Intelligent parsing**: Adapts to different resume formats and layouts
- **Self-scoring**: Uses predefined algorithms without manual intervention
- **Error handling**: Continues processing even if individual resumes fail
- **Automatic reporting**: Generates comprehensive results without user input
- **Email automation**: Delivers results to stakeholders automatically

## Troubleshooting

### Common Issues

1. **spaCy model not found**
   ```bash
   python -m spacy download en_core_web_sm
   ```

2. **PDF parsing errors**
   - Ensure PDFs are text-based (not scanned images)
   - Check file permissions and corruption

3. **Email delivery issues**
   - Verify SMTP settings in config.json
   - Use simulation mode for testing

### Logs
Check `resume_screening.log` for detailed processing information and error messages.

## Extending the Agent

### Adding New Skills
Edit the `common_skills` list in `resume_parser.py` to include domain-specific skills.

### Custom Scoring Weights
Modify the `weights` dictionary in `job_analyzer.py` to adjust scoring priorities.

### Additional Output Formats
Extend the output generation in `candidate_ranker.py` to support CSV, Excel, or other formats.

## License
MIT License - see LICENSE file for details.

## Support
For questions or issues, contact the development team or check the logs for detailed error information.