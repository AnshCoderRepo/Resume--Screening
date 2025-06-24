"""
Email Sender Module
Handles automated email delivery of screening results
"""

import smtplib
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Dict, List, Any
from datetime import datetime

class EmailSender:
    """Handles automated email delivery of screening results"""
    
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.logger = logging.getLogger(__name__)
        
        # Email configuration
        self.smtp_server = config.get('email', {}).get('smtp_server', 'smtp.gmail.com')
        self.smtp_port = config.get('email', {}).get('smtp_port', 587)
        self.sender_email = config.get('email', {}).get('sender_email', 'ai-agent@onelogica.com')
        self.sender_password = config.get('email', {}).get('sender_password', '')
        self.recipient_email = config.get('email', {}).get('recipient_email', 'hr-manager@onelogica.com')
    
    def send_results_email(self, results: Dict[str, Any], job_description: Dict[str, Any]) -> bool:
        """Send screening results via email"""
        try:
            self.logger.info("Preparing to send results email")
            
            # Generate email content
            subject = f"Resume Screening Results - {results.get('job_title', 'Position')}"
            body = self._generate_email_body(results, job_description)
            
            # Create email message
            message = MIMEMultipart()
            message["From"] = self.sender_email
            message["To"] = self.recipient_email
            message["Subject"] = subject
            
            # Add body to email
            message.attach(MIMEText(body, "plain"))
            
            # Send email (simulation mode for demo)
            if self.config.get('email', {}).get('simulation_mode', True):
                self._simulate_email_send(subject, body)
                return True
            else:
                return self._send_actual_email(message)
                
        except Exception as e:
            self.logger.error(f"Failed to send email: {str(e)}")
            return False
    
    def _simulate_email_send(self, subject: str, body: str):
        """Simulate email sending for demo purposes"""
        self.logger.info("=== EMAIL SIMULATION ===")
        self.logger.info(f"To: {self.recipient_email}")
        self.logger.info(f"From: {self.sender_email}")
        self.logger.info(f"Subject: {subject}")
        self.logger.info("Email content:")
        self.logger.info("-" * 50)
        self.logger.info(body)
        self.logger.info("-" * 50)
        self.logger.info("Email sent successfully (simulated)")
    
    def _send_actual_email(self, message: MIMEMultipart) -> bool:
        """Send actual email via SMTP"""
        try:
            # Create SMTP session
            server = smtplib.SMTP(self.smtp_server, self.smtp_port)
            server.starttls()  # Enable security
            server.login(self.sender_email, self.sender_password)
            
            # Send email
            text = message.as_string()
            server.sendmail(self.sender_email, self.recipient_email, text)
            server.quit()
            
            self.logger.info("Email sent successfully")
            return True
            
        except Exception as e:
            self.logger.error(f"SMTP error: {str(e)}")
            return False
    
    def _generate_email_body(self, results: Dict[str, Any], job_description: Dict[str, Any]) -> str:
        """Generate email body content"""
        top_candidate = results['top_matches'][0] if results['top_matches'] else None
        analysis_date = datetime.fromisoformat(results['analysis_date']).strftime('%B %d, %Y at %I:%M %p')
        
        body = f"""Subject: Resume Screening Results - {results.get('job_title', 'Position')}

Dear Hiring Manager,

Our AI Resume Screening Agent has completed the analysis for the {results.get('job_title', 'Position')} position at {results.get('company', 'your company')}. Here are the key findings:

📊 ANALYSIS SUMMARY
• Total Resumes Processed: {results['total_resumes']}
• Processing Time: {results['processing_time']:.2f} seconds
• Analysis Date: {analysis_date}
• Top Matches Identified: {len(results['top_matches'])}

"""

        if top_candidate:
            body += f"""🏆 TOP CANDIDATE RECOMMENDATION

{top_candidate['name']} - {top_candidate['match_score']}% Match
• Email: {top_candidate.get('email', 'N/A')}
• Phone: {top_candidate.get('phone', 'N/A')}
• Experience: {top_candidate.get('experience', 'N/A')} years
• Current Role: {top_candidate.get('current_role', 'N/A')}

Key Strengths:
"""
            for strength in top_candidate.get('strengths', []):
                body += f"• {strength}\n"
            
            if top_candidate.get('concerns'):
                body += f"\nAreas for Consideration:\n"
                for concern in top_candidate.get('concerns', []):
                    body += f"• {concern}\n"
        
        body += f"""
📋 COMPLETE RANKINGS
"""
        for i, candidate in enumerate(results['top_matches'], 1):
            body += f"{i}. {candidate['name']} - {candidate['match_score']}% Match\n"
        
        if top_candidate:
            body += f"""
🎯 RECOMMENDATION
Based on our AI analysis, {top_candidate['name']} is the strongest candidate for this position with a {top_candidate['match_score']}% compatibility match. We recommend scheduling an interview to discuss their qualifications further.

"""
        
        body += f"""🤖 AGENT ANALYSIS PROCESS
The autonomous agent processed each resume through the following steps:
1. PDF text extraction and parsing
2. Information extraction using NLP patterns  
3. Skill matching against job requirements
4. Experience level analysis and scoring
5. Multi-factor weighted scoring calculation
6. Candidate ranking and top selection
7. Detailed analysis and summary generation

The agent autonomously completed this analysis in {results['processing_time']:.2f} seconds, providing HR teams with actionable insights for hiring decisions.

📈 SCORING METHODOLOGY
• Skills Matching (40%): Technical skill alignment with job requirements
• Experience Level (25%): Years of experience vs. requirements  
• Education Relevance (15%): Educational background alignment
• Preferred Skills (10%): Bonus for preferred qualifications
• Role Relevance (10%): Current role similarity to target position

The complete candidate profiles and detailed analysis are available in the screening dashboard.

Best regards,
Onelogica AI Resume Screening Agent

---
This email was generated automatically by our AI system.
For questions, contact your HR technology team.
"""
        
        return body