# Resume Screening Agent - Architecture Diagram

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    RESUME SCREENING AGENT                       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   USER INPUT    │    │  FILE UPLOAD    │    │   PROCESSING    │
│                 │    │                 │    │                 │
│ Job Description │───▶│ Resume PDFs     │───▶│ Analysis Engine │
│ Requirements    │    │ Validation      │    │ Ranking System  │
│ Preferences     │    │ Error Handling  │    │ Report Gen.     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                        CORE COMPONENTS                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │ JOB DESCRIPTION │  │ RESUME PARSER   │  │ AI ANALYZER     │ │
│  │ PROCESSOR       │  │                 │  │                 │ │
│  │                 │  │ • PDF.js        │  │ • Skill Match   │ │
│  │ • Validation    │  │ • Text Extract  │  │ • Experience    │ │
│  │ • Structure     │  │ • Info Parse    │  │ • Education     │ │
│  │ • Storage       │  │ • Skill Detect  │  │ • Scoring       │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
│           │                     │                     │        │
│           └─────────────────────┼─────────────────────┘        │
│                                 ▼                              │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              MATCHING ENGINE                            │   │
│  │                                                         │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │   │
│  │  │   SKILLS    │  │ EXPERIENCE  │  │ EDUCATION   │    │   │
│  │  │ MATCHING    │  │ ANALYSIS    │  │ RELEVANCE   │    │   │
│  │  │   (40%)     │  │   (25%)     │  │   (15%)     │    │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘    │   │
│  │                                                         │   │
│  │  ┌─────────────┐  ┌─────────────┐                     │   │
│  │  │ PREFERRED   │  │    ROLE     │                     │   │
│  │  │  SKILLS     │  │ RELEVANCE   │                     │   │
│  │  │   (10%)     │  │   (10%)     │                     │   │
│  │  └─────────────┘  └─────────────┘                     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                 │                              │
│                                 ▼                              │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              RANKING SYSTEM                             │   │
│  │                                                         │   │
│  │ • Score Calculation    • Strength Analysis             │   │
│  │ • Candidate Sorting    • Concern Identification        │   │
│  │ • Top 3 Selection      • Summary Generation            │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                        OUTPUT SYSTEM                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │ CANDIDATE CARDS │  │ DETAILED VIEWS  │  │ EXPORT OPTIONS  │ │
│  │                 │  │                 │  │                 │ │
│  │ • Match Score   │  │ • Full Analysis │  │ • PDF Reports   │ │
│  │ • Key Info      │  │ • Strengths     │  │ • CSV Data      │ │
│  │ • Quick View    │  │ • Concerns      │  │ • Email Ready   │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘

## Component Responsibilities

### 1. Job Description Processor
- **Input**: Raw job requirements from HR form
- **Process**: Validates, structures, and stores job criteria
- **Output**: Structured job object for matching engine

### 2. Resume Parser
- **Input**: PDF resume files
- **Process**: 
  - Extracts text using PDF.js
  - Parses contact information
  - Identifies skills and experience
  - Structures candidate data
- **Output**: Structured candidate objects

### 3. AI Analyzer
- **Input**: Candidate data + Job requirements
- **Process**:
  - Multi-factor scoring algorithm
  - Strength/weakness analysis
  - Summary generation
- **Output**: Scored and analyzed candidates

### 4. Matching Engine
- **Input**: All candidate analyses
- **Process**:
  - Weighted scoring calculation
  - Comparative ranking
  - Top candidate selection
- **Output**: Ranked candidate list

### 5. Output System
- **Input**: Ranked candidates with analysis
- **Process**: 
  - UI rendering
  - Report generation
  - Export formatting
- **Output**: User-friendly results display

## Data Flow Sequence

1. **Job Input** → Validation → Storage
2. **Resume Upload** → PDF Parsing → Information Extraction
3. **Analysis Trigger** → Matching Engine → Scoring
4. **Ranking** → Top Selection → Results Display
5. **Export** → Report Generation → Delivery

## Autonomous Agent Behavior

The system operates autonomously by:
- **Auto-processing** uploaded files without manual intervention
- **Intelligent parsing** that adapts to different resume formats
- **Self-scoring** using predefined algorithms
- **Automatic ranking** and top candidate selection
- **Real-time reporting** with detailed reasoning

This architecture ensures scalable, reliable, and intelligent resume screening for HR teams.