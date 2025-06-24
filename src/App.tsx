import React, { useState } from 'react';
import { Header } from './components/Header';
import { JobDescriptionForm } from './components/JobDescriptionForm';
import { ResumeUpload } from './components/ResumeUpload';
import { ProcessingStatus } from './components/ProcessingStatus';
import { CandidateResults } from './components/CandidateResults';
import { EmailSimulation } from './components/EmailSimulation';
import { useResumeScreening } from './hooks/useResumeScreening';
import { JobDescription } from './types';
import { Play, RotateCcw } from 'lucide-react';

function App() {
  const [currentView, setCurrentView] = useState('screening');
  const [jobDescription, setJobDescription] = useState<JobDescription | null>(null);
  const [resumeFiles, setResumeFiles] = useState<File[]>([]);
  
  const { isProcessing, progress, results, error, processResumes, reset } = useResumeScreening();

  const handleStartScreening = async () => {
    if (jobDescription && resumeFiles.length > 0) {
      await processResumes(jobDescription, resumeFiles);
    }
  };

  const handleReset = () => {
    reset();
    setResumeFiles([]);
    setJobDescription(null);
  };

  const canStartScreening = jobDescription && resumeFiles.length > 0 && !isProcessing;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentView={currentView} onViewChange={setCurrentView} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'screening' && (
          <div className="space-y-8">
            {/* Action Buttons */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AI Resume Screening</h1>
                <p className="text-gray-600">Define job requirements and upload resumes for intelligent analysis</p>
              </div>
              
              <div className="flex space-x-4">
                {results && (
                  <button
                    onClick={handleReset}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>New Analysis</span>
                  </button>
                )}
                
                <button
                  onClick={handleStartScreening}
                  disabled={!canStartScreening}
                  className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                    canStartScreening
                      ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white hover:from-primary-700 hover:to-secondary-700 shadow-lg hover:shadow-xl'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Play className="w-4 h-4" />
                  <span>Start AI Screening</span>
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-8">
                <JobDescriptionForm onSubmit={setJobDescription} />
                <ProcessingStatus 
                  isProcessing={isProcessing} 
                  progress={progress} 
                  totalFiles={resumeFiles.length} 
                />
              </div>
              
              <div>
                <ResumeUpload 
                  onFilesSelect={setResumeFiles} 
                  disabled={isProcessing}
                />
              </div>
            </div>

            {results && (
              <div className="mt-8 space-y-8">
                <CandidateResults results={results} />
                <EmailSimulation 
                  results={results} 
                  jobTitle={jobDescription?.title || 'Position'} 
                />
              </div>
            )}
          </div>
        )}

        {currentView === 'candidates' && results && (
          <div>
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">All Candidates</h1>
              <p className="text-gray-600">Complete list of analyzed candidates</p>
            </div>
            
            <div className="space-y-4">
              {results.candidates.map((candidate, index) => (
                <div key={candidate.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{candidate.name}</h3>
                      <p className="text-gray-600">{candidate.currentRole}</p>
                      <p className="text-sm text-gray-500 mt-1">{candidate.summary}</p>
                    </div>
                    <div className="text-right">
                      <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        candidate.matchScore >= 80 ? 'text-green-600 bg-green-100' :
                        candidate.matchScore >= 60 ? 'text-yellow-600 bg-yellow-100' :
                        'text-red-600 bg-red-100'
                      }`}>
                        {candidate.matchScore}% Match
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Rank #{index + 1}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;