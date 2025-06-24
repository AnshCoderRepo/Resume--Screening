# Autonomous Resume-Screening Agent for HR Teams
Deployed Link<:-https://shiny-truffle-467bc8.netlify.app/
## Overview
An intelligent AI-powered resume screening system that autonomously processes job descriptions, analyzes candidate resumes, and provides ranked recommendations with detailed reasoning.

## Features
- **Autonomous Processing**: Automatically loops through resumes and provides intelligent analysis
- **PDF Resume Parsing**: Extracts text and structured data from PDF resumes
- **Intelligent Matching**: Uses advanced algorithms to match candidates with job requirements
- **Detailed Scoring**: Provides match scores with comprehensive reasoning
- **Real-time Processing**: Shows live progress during analysis
- **Modern UI**: Clean, professional interface for HR teams

## Architecture

### System Components
1. **Job Description Input Module**
   - Captures comprehensive job requirements
   - Validates and structures job criteria
   - Stores requirements for matching algorithm

2. **Resume Processing Engine**
   - PDF text extraction using PDF.js
   - Information parsing and structuring
   - Skill identification and categorization

3. **AI Analysis Engine**
   - Multi-factor scoring algorithm
   - Strength and concern identification
   - Intelligent summary generation

4. **Ranking & Reporting System**
   - Candidate ranking by compatibility
   - Detailed analysis reports
   - Export capabilities

### Data Flow
```
Job Description → Resume Upload → PDF Parsing → Information Extraction → 
AI Analysis → Scoring → Ranking → Results Display
```

## Scoring Algorithm

The system uses a weighted scoring approach:
- **Skills Matching (40%)**: Alignment with required technical skills
- **Experience Level (25%)**: Years of experience vs. requirements
- **Education Relevance (15%)**: Educational background alignment
- **Preferred Skills (10%)**: Bonus for preferred qualifications
- **Role Relevance (10%)**: Current role similarity to target position

## Installation & Setup

### Prerequisites
- Node.js 18+ 
- Modern web browser
- PDF resume files for testing

### Quick Start
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Usage

1. **Define Job Requirements**
   - Enter job title, company, and location
   - Add detailed job description
   - List required skills and experience
   - Set preferred qualifications

2. **Upload Resumes**
   - Drag and drop PDF files or click to browse
   - System validates file types and sizes
   - Multiple files supported

3. **Start Analysis**
   - Click "Start AI Screening"
   - Monitor real-time processing progress
   - View results as they're generated

4. **Review Results**
   - See top-ranked candidates
   - Review detailed analysis for each candidate
   - Export reports for further review

## Example Output

### Sample Job: Senior Full Stack Developer

**Top 3 Candidates:**

1. **Sarah Chen - 92% Match**
   - **Strengths**: Excellent technical skill alignment, exceeds experience requirements, strong in React/Node.js
   - **Concerns**: None identified
   - **Summary**: Excellent candidate with 7 years experience as Senior Developer. Perfect match for React/Node.js requirements.

2. **Marcus Johnson - 78% Match**
   - **Strengths**: Good skill match with most requirements, relevant educational background
   - **Concerns**: Limited experience with preferred technologies
   - **Summary**: Good candidate with 5 years experience. Strong technical foundation with room for growth.

3. **Elena Rodriguez - 65% Match**
   - **Strengths**: Strong educational background, good problem-solving skills
   - **Concerns**: May lack sufficient experience (3 vs 5 years required)
   - **Summary**: Fair candidate with solid fundamentals but limited experience level.

## Technical Implementation

### Frontend Stack
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Vite** for build tooling

### Core Libraries
- **PDF.js** for PDF text extraction
- **Custom parsing algorithms** for information extraction
- **Advanced scoring engine** for candidate ranking

### File Structure
```
src/
├── components/          # React components
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── types/              # TypeScript definitions
└── App.tsx            # Main application
```

## Future Enhancements

- **LLM Integration**: Add OpenAI/Claude for enhanced analysis
- **Vector Database**: Implement FAISS/Chroma for semantic search
- **Email Integration**: Automated candidate outreach
- **Batch Processing**: Handle large resume databases
- **Advanced Analytics**: Detailed hiring insights and trends

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For questions or support, contact the Onelogica development team.
