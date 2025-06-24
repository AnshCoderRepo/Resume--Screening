import React, { useState } from 'react';
import { Briefcase, MapPin, Clock, DollarSign } from 'lucide-react';
import { JobDescription } from '../types';

interface JobDescriptionFormProps {
  onSubmit: (jobDescription: JobDescription) => void;
}

export const JobDescriptionForm: React.FC<JobDescriptionFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<Partial<JobDescription>>({
    title: 'Senior Full Stack Developer',
    company: 'Onelogica',
    location: 'San Francisco, CA',
    type: 'full-time',
    level: 'senior',
    description: 'We are looking for an experienced Full Stack Developer to join our growing team. You will be responsible for developing and maintaining web applications using modern technologies.',
    requirements: [
      'React.js and modern JavaScript frameworks',
      'Node.js and Express.js',
      'Database design (PostgreSQL/MongoDB)',
      'RESTful API development',
      'Git version control',
      '5+ years of web development experience'
    ],
    preferredSkills: [
      'TypeScript',
      'AWS or cloud platforms',
      'Docker and containerization',
      'GraphQL',
      'Agile/Scrum methodologies'
    ],
    experience: 5,
    salary: {
      min: 120000,
      max: 180000,
      currency: 'USD'
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title && formData.description && formData.requirements) {
      onSubmit(formData as JobDescription);
    }
  };

  const addRequirement = () => {
    setFormData(prev => ({
      ...prev,
      requirements: [...(prev.requirements || []), '']
    }));
  };

  const updateRequirement = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements?.map((req, i) => i === index ? value : req) || []
    }));
  };

  const removeRequirement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements?.filter((_, i) => i !== index) || []
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
          <Briefcase className="w-5 h-5 text-primary-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Job Description</h2>
          <p className="text-gray-600">Define the role you're hiring for</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Title
            </label>
            <input
              type="text"
              value={formData.title || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="e.g., Senior Full Stack Developer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company
            </label>
            <input
              type="text"
              value={formData.company || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Company name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              Location
            </label>
            <input
              type="text"
              value={formData.location || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="e.g., San Francisco, CA"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="w-4 h-4 inline mr-1" />
              Employment Type
            </label>
            <select
              value={formData.type || 'full-time'}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="remote">Remote</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Description
          </label>
          <textarea
            value={formData.description || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Describe the role, responsibilities, and what makes this position exciting..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Required Skills & Experience
          </label>
          <div className="space-y-2">
            {formData.requirements?.map((requirement, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={requirement}
                  onChange={(e) => updateRequirement(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter a requirement..."
                />
                <button
                  type="button"
                  onClick={() => removeRequirement(index)}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addRequirement}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              + Add Requirement
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Years of Experience
            </label>
            <input
              type="number"
              value={formData.experience || 0}
              onChange={(e) => setFormData(prev => ({ ...prev, experience: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="5"
              min="0"
              max="20"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <DollarSign className="w-4 h-4 inline mr-1" />
              Salary Range (USD)
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={formData.salary?.min || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  salary: { ...prev.salary, min: parseInt(e.target.value), max: prev.salary?.max || 0, currency: 'USD' }
                }))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="120,000"
              />
              <span className="text-gray-500">to</span>
              <input
                type="number"
                value={formData.salary?.max || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  salary: { ...prev.salary, min: prev.salary?.min || 0, max: parseInt(e.target.value), currency: 'USD' }
                }))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="180,000"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-medium rounded-lg hover:from-primary-700 hover:to-secondary-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Save Job Description
          </button>
        </div>
      </form>
    </div>
  );
};