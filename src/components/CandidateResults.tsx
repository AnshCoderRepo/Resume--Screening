import React from 'react';
import { ScreeningResult } from '../types';
import { CandidateCard } from './CandidateCard';
import { Trophy, Users, Clock, Download } from 'lucide-react';

interface CandidateResultsProps {
  results: ScreeningResult;
  onExport?: () => void;
}

export const CandidateResults: React.FC<CandidateResultsProps> = ({ results, onExport }) => {
  const { topMatches, totalResumes, processingTime, analysisDate } = results;

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-accent-500 to-accent-600 rounded-lg flex items-center justify-center">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Top Candidates</h2>
              <p className="text-gray-600">AI-powered screening results</p>
            </div>
          </div>
          
          {onExport && (
            <button
              onClick={onExport}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export Report</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-primary-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Users className="w-5 h-5 text-primary-600" />
              <div>
                <p className="text-2xl font-bold text-primary-900">{totalResumes}</p>
                <p className="text-sm text-primary-700">Resumes Analyzed</p>
              </div>
            </div>
          </div>
          
          <div className="bg-secondary-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Trophy className="w-5 h-5 text-secondary-600" />
              <div>
                <p className="text-2xl font-bold text-secondary-900">{topMatches.length}</p>
                <p className="text-sm text-secondary-700">Top Matches</p>
              </div>
            </div>
          </div>
          
          <div className="bg-accent-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-accent-600" />
              <div>
                <p className="text-2xl font-bold text-accent-900">{processingTime}s</p>
                <p className="text-sm text-accent-700">Processing Time</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 text-xs text-gray-500">
          Analysis completed on {analysisDate.toLocaleString()}
        </div>
      </div>

      {/* Top Candidates */}
      <div className="space-y-4">
        {topMatches.map((candidate, index) => (
          <CandidateCard
            key={candidate.id}
            candidate={candidate}
            rank={index + 1}
          />
        ))}
      </div>

      {topMatches.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Candidates Found</h3>
          <p className="text-gray-600">
            No suitable candidates were found based on the job requirements. 
            Consider adjusting the job criteria or uploading more resumes.
          </p>
        </div>
      )}
    </div>
  );
};