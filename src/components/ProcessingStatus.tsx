import React from 'react';
import { Brain, Loader2, CheckCircle, FileText, Search, BarChart3 } from 'lucide-react';

interface ProcessingStatusProps {
  isProcessing: boolean;
  progress: number;
  totalFiles: number;
}

export const ProcessingStatus: React.FC<ProcessingStatusProps> = ({
  isProcessing,
  progress,
  totalFiles
}) => {
  if (!isProcessing && progress === 0) return null;

  const isComplete = progress >= 100;
  
  const getProcessingStage = (progress: number) => {
    if (progress < 30) return { icon: FileText, text: 'Parsing PDF resumes...' };
    if (progress < 60) return { icon: Search, text: 'Extracting candidate information...' };
    if (progress < 90) return { icon: Brain, text: 'Analyzing against job requirements...' };
    return { icon: BarChart3, text: 'Ranking candidates...' };
  };

  const currentStage = getProcessingStage(progress);
  const StageIcon = currentStage.icon;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          isComplete ? 'bg-green-100' : 'bg-primary-100'
        }`}>
          {isComplete ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <Brain className="w-5 h-5 text-primary-600" />
          )}
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {isComplete ? 'Resume Analysis Complete' : 'AI Resume Analysis'}
          </h2>
          <p className="text-gray-600">
            {isComplete 
              ? `Successfully analyzed ${totalFiles} resume${totalFiles !== 1 ? 's' : ''}`
              : `Processing ${totalFiles} PDF resume${totalFiles !== 1 ? 's' : ''}...`
            }
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Analysis Progress</span>
          <span className="text-sm font-medium text-primary-600">{Math.round(progress)}%</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              isComplete 
                ? 'bg-gradient-to-r from-green-500 to-green-600' 
                : 'bg-gradient-to-r from-primary-500 to-secondary-500'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>

        {isProcessing && (
          <div className="flex items-center space-x-3 text-gray-600">
            <div className="flex items-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <StageIcon className="w-4 h-4" />
            </div>
            <span className="text-sm">
              {currentStage.text}
            </span>
          </div>
        )}

        {isComplete && (
          <div className="flex items-center space-x-3 text-green-600">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm font-medium">
              Resume analysis complete - candidates ranked by compatibility
            </span>
          </div>
        )}

        {isProcessing && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-800">
              <strong>Real-time Analysis:</strong> Extracting text from PDFs, identifying skills and experience, 
              matching against job requirements, and calculating compatibility scores.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};