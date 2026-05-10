import { useState } from 'react';
import { ArrowLeft, Heart, Wind, Sparkles, X } from 'lucide-react';
import { SuggestionCard } from '../utils/customSuggestionEngine';
import { MeditationTimer } from './MeditationTimer';

interface CustomSuggestionsPageProps {
  customTopic: string;
  suggestions: SuggestionCard[];
  onBack: () => void;
  onFinish: () => void;
}

export function CustomSuggestionsPage({
  customTopic,
  suggestions,
  onBack,
  onFinish,
}: CustomSuggestionsPageProps) {
  const [selectedSuggestion, setSelectedSuggestion] = useState<SuggestionCard | null>(null);
  const [showBreathingExercise, setShowBreathingExercise] = useState(false);
  const [showActionSteps, setShowActionSteps] = useState(false);

  const getIcon = (index: number) => {
    if (index === 0) return <Heart className="w-8 h-8 text-rose-500" />;
    if (index === 1) return <Wind className="w-8 h-8 text-cyan-500" />;
    return <Sparkles className="w-8 h-8 text-amber-500" />;
  };

  const getGradient = (index: number) => {
    if (index === 0) return 'from-rose-50 to-pink-50';
    if (index === 1) return 'from-cyan-50 to-blue-50';
    return 'from-amber-50 to-yellow-50';
  };

  const handleSuggestionClick = (suggestion: SuggestionCard) => {
    setSelectedSuggestion(suggestion);

    if (suggestion.toolId === 'calming_breath') {
      setShowBreathingExercise(true);
    } else if (suggestion.toolId === 'tiny_action') {
      setShowActionSteps(true);
    }
  };

  const handleClose = () => {
    setSelectedSuggestion(null);
    setShowBreathingExercise(false);
    setShowActionSteps(false);
  };

  if (showBreathingExercise && selectedSuggestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <button
            onClick={handleClose}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Suggestions</span>
          </button>

          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Box Breathing</h1>
                <p className="text-gray-600">Follow this simple pattern to calm your mind</p>
              </div>
              <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-8 mb-8">
              <div className="text-center mb-8">
                <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-cyan-400 to-blue-400 flex items-center justify-center animate-pulse">
                  <Wind className="w-16 h-16 text-white" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4 bg-white/60 rounded-xl p-4">
                  <span className="flex-shrink-0 w-10 h-10 bg-cyan-500 text-white rounded-full flex items-center justify-center text-lg font-bold">1</span>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">Breathe in</p>
                    <p className="text-gray-600 text-sm">Through your nose for 4 counts</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 bg-white/60 rounded-xl p-4">
                  <span className="flex-shrink-0 w-10 h-10 bg-cyan-500 text-white rounded-full flex items-center justify-center text-lg font-bold">2</span>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">Hold</p>
                    <p className="text-gray-600 text-sm">Your breath for 4 counts</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 bg-white/60 rounded-xl p-4">
                  <span className="flex-shrink-0 w-10 h-10 bg-cyan-500 text-white rounded-full flex items-center justify-center text-lg font-bold">3</span>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">Breathe out</p>
                    <p className="text-gray-600 text-sm">Through your mouth for 4 counts</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 bg-white/60 rounded-xl p-4">
                  <span className="flex-shrink-0 w-10 h-10 bg-cyan-500 text-white rounded-full flex items-center justify-center text-lg font-bold">4</span>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">Hold again</p>
                    <p className="text-gray-600 text-sm">For 4 counts, then repeat</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">Repeat this cycle 3-5 times</p>
              </div>
            </div>

            <button
              onClick={onFinish}
              className="w-full py-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-full font-semibold hover:from-teal-600 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showActionSteps && selectedSuggestion) {
    const actionSteps = [
      "Write down one thing that's bothering you right now",
      "Break it into the smallest possible step you could take",
      "Do that one step, no matter how small",
      "Notice how you feel after taking action",
    ];

    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-yellow-50">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <button
            onClick={handleClose}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Suggestions</span>
          </button>

          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Take One Small Step</h1>
                <p className="text-gray-600">Small actions create momentum</p>
              </div>
              <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-8 mb-8">
              <div className="text-center mb-8">
                <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-amber-400 to-yellow-400 flex items-center justify-center">
                  <Sparkles className="w-16 h-16 text-white" />
                </div>
              </div>

              <div className="space-y-4">
                {actionSteps.map((step, index) => (
                  <div key={index} className="flex items-start gap-4 bg-white/60 rounded-xl p-4">
                    <span className="flex-shrink-0 w-10 h-10 bg-amber-500 text-white rounded-full flex items-center justify-center text-lg font-bold">
                      {index + 1}
                    </span>
                    <p className="text-gray-900 text-base pt-2">{step}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 bg-white/80 rounded-xl p-4 border-2 border-amber-200">
                <p className="text-sm text-gray-700 italic">
                  Remember: Progress isn't about perfection. It's about taking the next small step forward.
                </p>
              </div>
            </div>

            <button
              onClick={onFinish}
              className="w-full py-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-full font-semibold hover:from-teal-600 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-rose-50">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="bg-white rounded-3xl shadow-xl p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Here's what might help
            </h1>
            <div className="bg-teal-50 rounded-xl p-4 border border-teal-200">
              <p className="text-sm text-gray-600 mb-1">You mentioned:</p>
              <p className="text-gray-900 font-medium">{customTopic}</p>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className={`w-full p-6 rounded-2xl bg-gradient-to-r ${getGradient(index)} border-2 border-gray-200 hover:border-gray-400 shadow-sm hover:shadow-lg transition-all text-left transform hover:scale-[1.02]`}
              >
                <div className="flex items-start gap-4 mb-3">
                  <div className="flex-shrink-0 mt-1">{getIcon(index)}</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-2 text-xl">
                      {suggestion.title}
                    </h3>
                    <p className="text-gray-700 text-base leading-relaxed">
                      {suggestion.body}
                    </p>
                    {suggestion.toolId && (
                      <div className="mt-3 inline-flex items-center gap-2 text-sm text-gray-600 bg-white/70 rounded-full px-3 py-1">
                        <Sparkles className="w-4 h-4" />
                        <span className="font-medium">Click to explore</span>
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={onFinish}
            className="w-full py-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-full font-semibold hover:from-gray-600 hover:to-gray-700 transition-all shadow-lg hover:shadow-xl"
          >
            Skip for Now
          </button>
        </div>
      </div>
    </div>
  );
}
