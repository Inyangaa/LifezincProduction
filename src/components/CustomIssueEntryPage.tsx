import { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { VoiceInput } from './VoiceInput';
import { generateCustomSuggestions } from '../utils/customSuggestionEngine';
import { assessRiskFromJournal } from '../utils/riskAssessment';

interface CustomIssueEntryPageProps {
  onBack: () => void;
  onNext: (customTopic: string, suggestions: any) => void;
  onSafetyIntervention?: (flowId: string) => void;
}

export function CustomIssueEntryPage({ onBack, onNext, onSafetyIntervention }: CustomIssueEntryPageProps) {
  const [customTopic, setCustomTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleNext = async () => {
    if (customTopic.trim()) {
      setIsGenerating(true);
      try {
        const { riskLevel, flowId } = assessRiskFromJournal(customTopic);

        if (riskLevel >= 2) {
          if (onSafetyIntervention) {
            onSafetyIntervention(flowId);
          }
          setIsGenerating(false);
          return;
        }

        const suggestions = await generateCustomSuggestions(customTopic);
        onNext(customTopic, suggestions);
      } catch (error) {
        console.error('Error generating suggestions:', error);
        setIsGenerating(false);
      }
    }
  };

  const handleVoiceTranscript = (transcript: string) => {
    setCustomTopic(transcript);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-rose-50">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Tell LifeZinc what's going on
          </h1>
          <p className="text-gray-600 mb-6">
            Tell LifeZinc what's going on, in your own words.
          </p>

          <div className="space-y-6">
            <div>
              <div className="relative">
                <textarea
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  placeholder="Type what's on your mind..."
                  className="w-full min-h-[200px] p-4 pr-16 border-2 border-gray-200 rounded-2xl focus:border-teal-400 focus:outline-none resize-none text-base leading-relaxed"
                  disabled={isGenerating}
                />
                <div className="absolute bottom-4 right-4">
                  <VoiceInput onTranscript={handleVoiceTranscript} />
                </div>
              </div>
            </div>

            <div className="bg-teal-50 rounded-xl p-4 border border-teal-200">
              <p className="text-sm text-gray-700">
                <strong>Examples:</strong> "I'm worried about my grades", "Having trouble with my parents", "Feeling stressed about the future"
              </p>
            </div>

            <button
              onClick={handleNext}
              disabled={!customTopic.trim() || isGenerating}
              className="w-full py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white hover:from-teal-600 hover:to-teal-700"
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Generating suggestions...
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
