#!/usr/bin/env python3
"""
Autonomous Resume-Screening Agent for HR Teams
Main application entry point
"""

import os
import sys
import json
from pathlib import Path
from typing import List, Dict, Any
import argparse
from datetime import datetime

from resume_parser import ResumeParser
from job_analyzer import JobAnalyzer
from candidate_ranker import CandidateRanker
from email_sender import EmailSender
from utils import setup_logging, load_config

def main():
    """Main application entry point"""
    parser = argparse.ArgumentParser(description='AI Resume Screening Agent')
    parser.add_argument('--job-file', required=True, help='Path to job description JSON file')
    parser.add_argument('--resume-folder', required=True, help='Path to folder containing resume PDFs')
    parser.add_argument('--output-folder', default='./output', help='Output folder for results')
    parser.add_argument('--send-email', action='store_true', help='Send email with results')
    parser.add_argument('--config', default='config.json', help='Configuration file path')
    
    args = parser.parse_args()
    
    # Setup logging
    logger = setup_logging()
    logger.info("Starting Resume Screening Agent")
    
    try:
        # Load configuration
        config = load_config(args.config)
        
        # Initialize components
        resume_parser = ResumeParser(config)
        job_analyzer = JobAnalyzer(config)
        candidate_ranker = CandidateRanker(config)
        email_sender = EmailSender(config) if args.send_email else None
        
        # Load job description
        logger.info(f"Loading job description from {args.job_file}")
        with open(args.job_file, 'r') as f:
            job_description = json.load(f)
        
        # Process resumes
        logger.info(f"Processing resumes from {args.resume_folder}")
        resume_folder = Path(args.resume_folder)
        pdf_files = list(resume_folder.glob("*.pdf"))
        
        if not pdf_files:
            logger.error("No PDF files found in resume folder")
            sys.exit(1)
        
        logger.info(f"Found {len(pdf_files)} resume files")
        
        # Parse all resumes
        candidates = []
        for i, pdf_file in enumerate(pdf_files, 1):
            logger.info(f"Processing resume {i}/{len(pdf_files)}: {pdf_file.name}")
            try:
                candidate_data = resume_parser.parse_resume(pdf_file)
                candidate_data['resume_file'] = str(pdf_file)
                candidates.append(candidate_data)
            except Exception as e:
                logger.error(f"Failed to process {pdf_file.name}: {str(e)}")
                continue
        
        if not candidates:
            logger.error("No resumes could be processed successfully")
            sys.exit(1)
        
        logger.info(f"Successfully processed {len(candidates)} resumes")
        
        # Analyze candidates against job requirements
        logger.info("Analyzing candidates against job requirements")
        analyzed_candidates = []
        for candidate in candidates:
            analysis = job_analyzer.analyze_candidate(candidate, job_description)
            analyzed_candidates.append(analysis)
        
        # Rank candidates
        logger.info("Ranking candidates")
        ranked_results = candidate_ranker.rank_candidates(analyzed_candidates, job_description)
        
        # Generate output
        output_folder = Path(args.output_folder)
        output_folder.mkdir(exist_ok=True)
        
        # Save detailed results
        results_file = output_folder / f"screening_results_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(results_file, 'w') as f:
            json.dump(ranked_results, f, indent=2, default=str)
        
        # Generate summary report
        summary_file = output_folder / f"summary_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt"
        generate_summary_report(ranked_results, job_description, summary_file)
        
        logger.info(f"Results saved to {results_file}")
        logger.info(f"Summary report saved to {summary_file}")
        
        # Print top 3 candidates to console
        print_top_candidates(ranked_results)
        
        # Send email if requested
        if email_sender and args.send_email:
            logger.info("Sending email with results")
            email_sender.send_results_email(ranked_results, job_description)
        
        logger.info("Resume screening completed successfully")
        
    except Exception as e:
        logger.error(f"Application error: {str(e)}")
        sys.exit(1)

def generate_summary_report(results: Dict[str, Any], job_description: Dict[str, Any], output_file: Path):
    """Generate a human-readable summary report"""
    with open(output_file, 'w') as f:
        f.write("=" * 80 + "\n")
        f.write("AUTONOMOUS RESUME SCREENING AGENT - ANALYSIS REPORT\n")
        f.write("=" * 80 + "\n\n")
        
        f.write(f"Job Position: {job_description.get('title', 'N/A')}\n")
        f.write(f"Company: {job_description.get('company', 'N/A')}\n")
        f.write(f"Analysis Date: {results['analysis_date']}\n")
        f.write(f"Total Resumes Processed: {results['total_resumes']}\n")
        f.write(f"Processing Time: {results['processing_time']:.2f} seconds\n\n")
        
        f.write("TOP 3 CANDIDATES:\n")
        f.write("-" * 50 + "\n\n")
        
        for i, candidate in enumerate(results['top_matches'][:3], 1):
            f.write(f"#{i} - {candidate['name']} ({candidate['match_score']}% Match)\n")
            f.write(f"Email: {candidate.get('email', 'N/A')}\n")
            f.write(f"Phone: {candidate.get('phone', 'N/A')}\n")
            f.write(f"Experience: {candidate.get('experience', 'N/A')} years\n")
            f.write(f"Current Role: {candidate.get('current_role', 'N/A')}\n\n")
            
            f.write("Key Strengths:\n")
            for strength in candidate.get('strengths', []):
                f.write(f"  • {strength}\n")
            
            if candidate.get('concerns'):
                f.write("\nAreas for Consideration:\n")
                for concern in candidate.get('concerns', []):
                    f.write(f"  • {concern}\n")
            
            f.write(f"\nSummary: {candidate.get('summary', 'N/A')}\n")
            f.write("\n" + "-" * 50 + "\n\n")
        
        f.write("AGENT REASONING:\n")
        f.write("-" * 20 + "\n")
        f.write("The autonomous agent processed each resume through the following steps:\n")
        f.write("1. PDF text extraction and parsing\n")
        f.write("2. Information extraction using NLP patterns\n")
        f.write("3. Skill matching against job requirements\n")
        f.write("4. Experience level analysis\n")
        f.write("5. Multi-factor scoring calculation\n")
        f.write("6. Candidate ranking and selection\n")
        f.write("7. Detailed analysis and summary generation\n\n")
        
        f.write(f"The agent autonomously completed this analysis in {results['processing_time']:.2f} seconds,\n")
        f.write("providing HR teams with actionable insights for hiring decisions.\n")

def print_top_candidates(results: Dict[str, Any]):
    """Print top candidates to console"""
    print("\n" + "=" * 80)
    print("TOP 3 CANDIDATES - SCREENING RESULTS")
    print("=" * 80)
    
    for i, candidate in enumerate(results['top_matches'][:3], 1):
        print(f"\n#{i} - {candidate['name']} ({candidate['match_score']}% Match)")
        print(f"Contact: {candidate.get('email', 'N/A')} | {candidate.get('phone', 'N/A')}")
        print(f"Experience: {candidate.get('experience', 'N/A')} years")
        print(f"Summary: {candidate.get('summary', 'N/A')}")
        
        if candidate.get('strengths'):
            print("Strengths:", ", ".join(candidate['strengths'][:2]))
        
        if candidate.get('concerns'):
            print("Concerns:", candidate['concerns'][0])
        
        print("-" * 80)

if __name__ == "__main__":
    main()