import React, { useState } from 'react';
import { Candidate } from '../types';
import { 
  User, Mail, Phone, MapPin, Briefcase, GraduationCap, 
  Star, ChevronDown, ChevronUp, Award, AlertTriangle 
} from 'lucide-react';

interface CandidateCardProps {
  candidate: Candidate;
  rank: number;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({ candidate, rank }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Award className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Award className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-gray-600">#{rank}</span>;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4 flex-1">
            <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
              {candidate.name.split(' ').map(n => n[0]).join('')}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{candidate.name}</h3>
                <div className="flex items-center space-x-1">
                  {getRankIcon(rank)}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600 mb-4">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>{candidate.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>{candidate.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>{candidate.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Briefcase className="w-4 h-4" />
                  <span>{candidate.experience} years experience</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {candidate.skills.slice(0, 5).map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-full border border-primary-200"
                  >
                    {skill}
                  </span>
                ))}
                {candidate.skills.length > 5 && (
                  <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-full">
                    +{candidate.skills.length - 5} more
                  </span>
                )}
              </div>

              <p className="text-sm text-gray-700 line-clamp-2">{candidate.summary}</p>
            </div>
          </div>
          
          <div className="flex flex-col items-end space-y-3">
            <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getScoreColor(candidate.matchScore)}`}>
              {candidate.matchScore}% Match
            </div>
            
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center space-x-1 text-sm text-primary-600 hover:text-primary-700"
            >
              <span>{isExpanded ? 'Less' : 'More'} Details</span>
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                <Briefcase className="w-4 h-4 mr-2" />
                Professional Background
              </h4>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm font-medium text-gray-900 mb-1">Current Role</p>
                <p className="text-sm text-gray-700">{candidate.currentRole}</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                <GraduationCap className="w-4 h-4 mr-2" />
                Education
              </h4>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-700">{candidate.education}</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                <Star className="w-4 h-4 mr-2" />
                Key Strengths
              </h4>
              <div className="space-y-2">
                {candidate.strengths.map((strength, index) => (
                  <div key={index} className="flex items-start space-x-2 text-sm">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-700">{strength}</span>
                  </div>
                ))}
              </div>
            </div>

            {candidate.concerns.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Areas for Consideration
                </h4>
                <div className="space-y-2">
                  {candidate.concerns.map((concern, index) => (
                    <div key={index} className="flex items-start space-x-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-700">{concern}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h4 className="font-medium text-gray-900 mb-2">All Skills</h4>
              <div className="flex flex-wrap gap-2">
                {candidate.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};