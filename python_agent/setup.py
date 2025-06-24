#!/usr/bin/env python3
"""
Setup script for Resume Screening Agent
"""

import subprocess
import sys
import os

def install_requirements():
    """Install Python requirements"""
    print("Installing Python requirements...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])

def download_spacy_model():
    """Download spaCy English model"""
    print("Downloading spaCy English model...")
    try:
        subprocess.check_call([sys.executable, "-m", "spacy", "download", "en_core_web_sm"])
    except subprocess.CalledProcessError:
        print("Warning: Could not download spaCy model. Some NLP features may be limited.")

def create_directories():
    """Create necessary directories"""
    directories = ["output", "resumes", "logs"]
    for directory in directories:
        os.makedirs(directory, exist_ok=True)
        print(f"Created directory: {directory}")

def main():
    """Main setup function"""
    print("Setting up Resume Screening Agent...")
    
    try:
        install_requirements()
        download_spacy_model()
        create_directories()
        
        print("\n" + "="*50)
        print("Setup completed successfully!")
        print("="*50)
        print("\nTo run the agent:")
        print("python main.py --job-file sample_job.json --resume-folder ./resumes")
        print("\nTo send email results:")
        print("python main.py --job-file sample_job.json --resume-folder ./resumes --send-email")
        
    except Exception as e:
        print(f"Setup failed: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()