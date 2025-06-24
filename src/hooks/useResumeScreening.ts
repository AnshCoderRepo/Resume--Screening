import { useState, useCallback } from 'react';
import { Candidate, JobDescription, ScreeningResult } from '../types';
import { parseResumeFromFile } from '../utils/pdfParser';
import { analyzeParsedResume } from '../utils/resumeAnalyzer';

export const useResumeScreening = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<ScreeningResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const processResumes = useCallback(async (
    jobDescription: JobDescription,
    resumeFiles: File[]
  ) => {
    setIsProcessing(true);
    setProgress(0);
    setError(null);

    try {
      const candidates: Candidate[] = [];
      const totalFiles = resumeFiles.length;
      
      for (let i = 0; i < totalFiles; i++) {
        const file = resumeFiles[i];
        
        try {
          // Update progress for parsing phase
          setProgress(((i * 2) / (totalFiles * 2)) * 100);
          
          // Parse the PDF resume
          const parsedData = await parseResumeFromFile(file);
          
          // Update progress for analysis phase
          setProgress(((i * 2 + 1) / (totalFiles * 2)) * 100);
          
          // Analyze the parsed resume against job description
          const candidate = analyzeParsedResume(
            parsedData, 
            jobDescription, 
            `candidate-${i + 1}`
          );
          
          candidates.push(candidate);
          
        } catch (fileError) {
          console.error(`Error processing ${file.name}:`, fileError);
          // Continue with other files, but log the error
          setError(`Warning: Could not process ${file.name}. Continuing with other files.`);
        }
      }
      
      // Sort candidates by match score
      const sortedCandidates = candidates.sort((a, b) => b.matchScore - a.matchScore);
      
      // Final progress update
      setProgress(100);
      
      const result: ScreeningResult = {
        jobId: `job-${Date.now()}`,
        candidates: sortedCandidates,
        topMatches: sortedCandidates.slice(0, 3),
        processingTime: Math.round((Date.now() % 10000) / 1000), // Simulated processing time
        totalResumes: candidates.length,
        analysisDate: new Date()
      };

      setResults(result);
      
      if (candidates.length === 0) {
        setError('No resumes could be processed successfully. Please check that you uploaded valid PDF files.');
      }
      
    } catch (err) {
      console.error('Processing error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during processing');
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResults(null);
    setError(null);
    setProgress(0);
    setIsProcessing(false);
  }, []);

  return {
    isProcessing,
    progress,
    results,
    error,
    processResumes,
    reset
  };
};