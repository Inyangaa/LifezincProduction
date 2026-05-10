import { useState } from 'react';
import { CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { emotionConfigs, EmotionId, ContextConfig, SuggestionGroup } from '../data/emotionConfigs';
import { EmotionToolRenderer } from './EmotionToolRenderer';

type FlowStep = 'intro' | 'context' | 'suggestions' | 'tool' | 'feedback' | 'complete';

interface EmotionEngineProps {
  emotionId: EmotionId;
  onClose: () => void;
}

export function EmotionEngine({ emotionId, onClose }: EmotionEngineProps) {
  const [step, setStep] = useState<FlowStep>('intro');
  const [selectedContext, setSelectedContext] = useState<ContextConfig | null>(null);
  const [selectedSuggestion, setSelectedSuggestion] = useState<SuggestionGroup | null>(null);
  const [showAffirmation, setShowAffirmation] = useState(false);

  const config = emotionConfigs[emotionId];

  const handleContextSelect = (context: ContextConfig) => {
    setSelectedContext(context);
    setStep('suggestions');
  };

  const handleSuggestionSelect = (suggestion: SuggestionGroup) => {
    setSelectedSuggestion(suggestion);
    setStep('tool');
  };

  const handleToolComplete = () => {
    setStep('feedback');
  };

  const handleFeedbackYes = () => {
    setShowAffirmation(true);
    setTimeout(() => {
      setStep('complete');
      setTimeout(() => {
        onClose();
      }, 2000);
    }, 2000);
  };

  const handleFeedbackNo = () => {
    setSelectedSuggestion(null);
    setStep('suggestions');
  };

  const handleBack = () => {
    if (step === 'suggestions') {
      setSelectedContext(null);
      setStep('context');
    } else if (step === 'tool') {
      setSelectedSuggestion(null);
      setStep('suggestions');
    } else if (step === 'context') {
      setStep('intro');
    }
  };

  const getSuggestionTypeColor = (type: string) => {
    const colors = {
      rest: 'from-blue-500 to-blue-600',
      process: 'from-purple-500 to-purple-600',
      mindset: 'from-yellow-500 to-yellow-600',
      practical: 'from-green-500 to-green-600',
      connection: 'from-pink-500 to-pink-600',
      safety: 'from-red-500 to-red-600'
    };
    return colors[type as keyof typeof colors] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {step !== 'intro' && step !== 'complete' && (
        <button
          onClick={handleBack}
          className="fixed top-4 left-4 p-2 rounded-full bg-slate-700/50 hover:bg-slate-600/50 transition z-50"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      )}

      <button
        onClick={onClose}
        className="fixed top-4 right-4 p-2 rounded-full bg-slate-700/50 hover:bg-slate-600/50 transition z-50"
      >
        <XCircle className="w-5 h-5" />
      </button>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {step === 'intro' && (
          <div className="text-center space-y-8 animate-fade-in">
            <div className="text-8xl mb-4">{config.emoji}</div>
            <h1 className="text-4xl font-bold">{config.label}</h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              {config.introMessage}
            </p>
            <button
              onClick={() => setStep('context')}
              className="mt-8 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl text-lg font-semibold hover:from-emerald-400 hover:to-teal-400 transition-all transform hover:scale-105"
            >
              Continue
            </button>
          </div>
        )}

        {step === 'context' && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">{config.emoji}</div>
              <h2 className="text-3xl font-bold mb-2">What's going on?</h2>
              <p className="text-slate-400">Choose what feels closest to your situation</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {config.contexts.map((context) => (
                <button
                  key={context.id}
                  onClick={() => handleContextSelect(context)}
                  className="group p-6 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 hover:border-emerald-500 rounded-xl text-left transition-all transform hover:scale-105"
                >
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-emerald-400 transition">
                    {context.label}
                  </h3>
                  <p className="text-slate-400 text-sm">{context.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'suggestions' && selectedContext && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <div className="text-5xl mb-3">{config.emoji}</div>
              <h2 className="text-2xl font-bold mb-1">{selectedContext.label}</h2>
              <p className="text-slate-400 text-sm">{selectedContext.description}</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-center text-slate-300 mb-6">
                What would help right now?
              </h3>
              {selectedContext.suggestionGroups.map((suggestion) => (
                <button
                  key={suggestion.id}
                  onClick={() => handleSuggestionSelect(suggestion)}
                  className="group w-full p-6 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 hover:border-emerald-500 rounded-xl text-left transition-all transform hover:scale-102"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${getSuggestionTypeColor(suggestion.type)} mt-2 flex-shrink-0`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs uppercase tracking-wider text-slate-500 font-medium">
                          {suggestion.type}
                        </span>
                      </div>
                      <h4 className="text-lg font-semibold mb-1 group-hover:text-emerald-400 transition">
                        {suggestion.title}
                      </h4>
                      <p className="text-slate-400 text-sm">{suggestion.subtitle}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'tool' && selectedSuggestion && (
          <div className="animate-fade-in">
            <EmotionToolRenderer
              toolId={selectedSuggestion.toolId}
              onComplete={handleToolComplete}
            />
          </div>
        )}

        {step === 'feedback' && !showAffirmation && (
          <div className="text-center space-y-8 animate-fade-in">
            <div className="text-6xl mb-4">{config.emoji}</div>
            <h2 className="text-3xl font-bold">Did that help?</h2>
            <p className="text-slate-400">Let us know so we can guide you better</p>

            <div className="flex gap-4 justify-center">
              <button
                onClick={handleFeedbackYes}
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl text-lg font-semibold hover:from-green-400 hover:to-emerald-400 transition-all transform hover:scale-105 flex items-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Yes, it helped
              </button>
              <button
                onClick={handleFeedbackNo}
                className="px-8 py-4 bg-slate-700 hover:bg-slate-600 rounded-xl text-lg font-semibold transition-all transform hover:scale-105"
              >
                Try something else
              </button>
            </div>
          </div>
        )}

        {showAffirmation && (
          <div className="text-center space-y-6 animate-fade-in">
            <div className="w-20 h-20 mx-auto bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-bold">Beautiful work</h2>
            <p className="text-xl text-slate-300">
              You showed up for yourself today. That takes courage.
            </p>
          </div>
        )}

        {step === 'complete' && (
          <div className="text-center space-y-6 animate-fade-in">
            <div className="text-6xl mb-4">{config.emoji}</div>
            <h2 className="text-2xl font-bold">You've got this</h2>
            <p className="text-slate-400">Come back anytime you need support</p>
          </div>
        )}
      </div>
    </div>
  );
}
