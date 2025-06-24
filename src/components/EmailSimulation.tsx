import React, { useState } from 'react';
import { Mail, Send, Clock, CheckCircle } from 'lucide-react';
import { ScreeningResult } from '../types';

interface EmailSimulationProps {
  results: ScreeningResult;
  jobTitle: string;
}

export const EmailSimulation: React.FC<EmailSimulationProps> = ({ results, jobTitle }) => {
  const [emailSent, setEmailSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendEmail = async () => {
    setIsLoading(true);
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    setEmailSent(true);
    setIsLoading(false);
  };

  const generateEmailContent = () => {
    const topCandidate = results.topMatches[0];
    const analysisDate = results.analysisDate.toLocaleDateString();
    
    return `Subject: Resume Screening Results - ${jobTitle} Position

Dear Hiring Manager,

Our AI Resume Screening Agent has completed the analysis for the ${jobTitle} position. Here are the key findings:

📊 ANALYSIS SUMMARY
• Total Resumes Processed: ${results.totalResumes}
• Processing Time: ${results.processingTime} seconds
• Analysis Date: ${analysisDate}
• Top Matches Identified: ${results.topMatches.length}

🏆 TOP CANDIDATE RECOMMENDATION

${topCandidate.name} - ${topCandidate.matchScore}% Match
• Email: ${topCandidate.email}
• Phone: ${topCandidate.phone}
• Experience: ${topCandidate.experience} years
• Current Role: ${topCandidate.currentRole}

Key Strengths:
${topCandidate.strengths.map(strength => `• ${strength}`).join('\n')}

${topCandidate.concerns.length > 0 ? `
Areas for Consideration:
${topCandidate.concerns.map(concern => `• ${concern}`).join('\n')}
` : ''}

📋 COMPLETE RANKINGS
${results.topMatches.map((candidate, index) => 
  `${index + 1}. ${candidate.name} - ${candidate.matchScore}% Match`
).join('\n')}

🎯 RECOMMENDATION
Based on our AI analysis, ${topCandidate.name} is the strongest candidate for this position. We recommend scheduling an interview to discuss their qualifications further.

The complete candidate profiles and detailed analysis are available in the screening dashboard.

Best regards,
Onelogica AI Resume Screening Agent

---
This email was generated automatically by our AI system.
For questions, contact your HR technology team.`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <Mail className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Email Simulation</h2>
          <p className="text-gray-600">Automated screening results delivery</p>
        </div>
      </div>

      {!emailSent ? (
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Email Preview</h3>
            <div className="bg-white border rounded-lg p-4 max-h-96 overflow-y-auto">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                {generateEmailContent()}
              </pre>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <p><strong>To:</strong> hr-manager@onelogica.com</p>
              <p><strong>From:</strong> ai-agent@onelogica.com</p>
              <p><strong>Subject:</strong> Resume Screening Results - {jobTitle} Position</p>
            </div>
            
            <button
              onClick={handleSendEmail}
              disabled={isLoading}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                isLoading
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
              }`}
            >
              {isLoading ? (
                <>
                  <Clock className="w-4 h-4 animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Email Report</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Sent Successfully!</h3>
          <p className="text-gray-600 mb-4">
            The screening results have been delivered to the hiring manager.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800">
              <strong>Delivery Confirmation:</strong> Email sent to hr-manager@onelogica.com at {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};