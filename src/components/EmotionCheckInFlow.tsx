import { useState } from 'react';
import { X, Mic, Square, CheckCircle, Sparkles } from 'lucide-react';
import { VoiceInput } from './VoiceInput';

interface EmotionCheckInFlowProps {
  selectedEmoji: string;
  selectedMoodLabel: string;
  onComplete: (data: { text: string; voiceTranscript?: string }) => void;
  onClose: () => void;
  onChangeFeeling: () => void;
  onBackToHome?: () => void;
}

type Stage = 'confirm' | 'express' | 'suggestions' | 'summary';
type SuggestionType = 'breathing' | 'reframe' | 'action' | null;

export function EmotionCheckInFlow({
  selectedEmoji,
  selectedMoodLabel,
  onComplete,
  onClose,
  onChangeFeeling,
  onBackToHome,
}: EmotionCheckInFlowProps) {
  const [stage, setStage] = useState<Stage>('confirm');
  const [textInput, setTextInput] = useState('');
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<SuggestionType>(null);
  const [completedData, setCompletedData] = useState<{ text: string; voiceTranscript?: string } | null>(null);

  const handleContinueFromConfirm = () => {
    setStage('express');
  };

  const handleExpressSubmit = () => {
    const data = {
      text: textInput || voiceTranscript,
      voiceTranscript: voiceTranscript || undefined,
    };
    setCompletedData(data);
    setStage('suggestions');
  };

  const handleSkipExpress = () => {
    const data = { text: '' };
    setCompletedData(data);
    setStage('suggestions');
  };

  const handleSuggestionSelect = (type: SuggestionType) => {
    setSelectedSuggestion(type);
  };

  const handleCloseSuggestion = () => {
    setSelectedSuggestion(null);
  };

  const handleNotNow = () => {
    setStage('summary');
  };

  const handleBackToHome = () => {
    if (completedData) {
      onComplete(completedData);
    }
    if (onBackToHome) {
      onBackToHome();
    } else {
      onClose();
    }
  };

  const handleNewCheckIn = () => {
    setStage('confirm');
    setTextInput('');
    setVoiceTranscript('');
    setSelectedSuggestion(null);
    setCompletedData(null);
  };

  const handleVoiceRecordingComplete = (transcript: string) => {
    setVoiceTranscript(transcript);
    setIsRecording(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {stage === 'confirm' && (
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
                <div className="text-6xl mb-4 text-center">{selectedEmoji}</div>
                <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
                  You picked {selectedMoodLabel}
                </h2>
                <p className="text-gray-600 text-center">
                  Let's check in for a minute.
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleContinueFromConfirm}
                className="w-full py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl font-semibold hover:from-teal-600 hover:to-teal-700 transition-all"
              >
                Continue
              </button>
              <button
                onClick={onChangeFeeling}
                className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
              >
                Choose another feeling
              </button>
            </div>
          </div>
        )}

        {stage === 'express' && (
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                What's going on?
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Write your thoughts
                </label>
                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Tell us what's on your mind..."
                  className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                  rows={4}
                />
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Speak your thoughts
                </label>
                <VoiceInput
                  onTranscript={handleVoiceRecordingComplete}
                />
                {voiceTranscript && (
                  <div className="mt-3 p-4 bg-teal-50 rounded-xl border border-teal-200">
                    <p className="text-sm text-gray-700 mb-2">{voiceTranscript}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setTextInput(voiceTranscript);
                          setVoiceTranscript('');
                        }}
                        className="text-sm text-teal-600 hover:text-teal-700 font-medium"
                      >
                        Use this
                      </button>
                      <button
                        onClick={() => setVoiceTranscript('')}
                        className="text-sm text-gray-600 hover:text-gray-700 font-medium"
                      >
                        Record again
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleExpressSubmit}
                disabled={!textInput && !voiceTranscript}
                className="w-full py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl font-semibold hover:from-teal-600 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
              <button
                onClick={handleSkipExpress}
                className="w-full py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                Skip
              </button>
            </div>
          </div>
        )}

        {stage === 'suggestions' && !selectedSuggestion && (
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                A few things that might help
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-3 mb-6">
              <button
                onClick={() => handleSuggestionSelect('breathing')}
                className="w-full p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl hover:from-blue-100 hover:to-cyan-100 transition-all text-left border border-blue-200"
              >
                <h3 className="font-semibold text-gray-900 mb-1">
                  2-minute breathing exercise
                </h3>
                <p className="text-sm text-gray-600">
                  Calm your nervous system with simple breathwork
                </p>
              </button>

              <button
                onClick={() => handleSuggestionSelect('reframe')}
                className="w-full p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl hover:from-purple-100 hover:to-pink-100 transition-all text-left border border-purple-200"
              >
                <h3 className="font-semibold text-gray-900 mb-1">
                  Quick reframing thought
                </h3>
                <p className="text-sm text-gray-600">
                  See your situation from a different perspective
                </p>
              </button>

              <button
                onClick={() => handleSuggestionSelect('action')}
                className="w-full p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl hover:from-emerald-100 hover:to-teal-100 transition-all text-left border border-emerald-200"
              >
                <h3 className="font-semibold text-gray-900 mb-1">
                  One small action
                </h3>
                <p className="text-sm text-gray-600">
                  A tiny step you can take right now
                </p>
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleNotNow}
                className="flex-1 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                Not now
              </button>
              <button
                onClick={() => setStage('summary')}
                className="flex-1 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl font-semibold hover:from-teal-600 hover:to-teal-700 transition-all"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {stage === 'suggestions' && selectedSuggestion === 'breathing' && (
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                2-Minute Breathing Exercise
              </h2>
              <button
                onClick={handleCloseSuggestion}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 mb-6">
              <div className="text-center mb-6">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center animate-pulse">
                  <span className="text-3xl text-white">🫁</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Box Breathing
                </h3>
                <p className="text-sm text-gray-600">
                  Follow this simple pattern
                </p>
              </div>

              <div className="space-y-3 text-gray-700">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">1</span>
                  <p className="text-sm">Breathe in through your nose for 4 counts</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">2</span>
                  <p className="text-sm">Hold your breath for 4 counts</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">3</span>
                  <p className="text-sm">Breathe out through your mouth for 4 counts</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">4</span>
                  <p className="text-sm">Hold for 4 counts, then repeat</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setStage('summary')}
              className="w-full py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl font-semibold hover:from-teal-600 hover:to-teal-700 transition-all"
            >
              Done
            </button>
          </div>
        )}

        {stage === 'suggestions' && selectedSuggestion === 'reframe' && (
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Reframing Thought
              </h2>
              <button
                onClick={handleCloseSuggestion}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 mb-6">
              <div className="text-center mb-4">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-2">Instead of thinking:</p>
                  <p className="text-gray-900 font-medium">"This feeling will never go away"</p>
                </div>
                <div className="flex justify-center">
                  <div className="text-purple-600">↓</div>
                </div>
                <div className="bg-white rounded-lg p-4 border-2 border-purple-300">
                  <p className="text-sm text-gray-500 mb-2">Try thinking:</p>
                  <p className="text-gray-900 font-medium">"Feelings are temporary. I've felt better before, and I will again."</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setStage('summary')}
              className="w-full py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl font-semibold hover:from-teal-600 hover:to-teal-700 transition-all"
            >
              Done
            </button>
          </div>
        )}

        {stage === 'suggestions' && selectedSuggestion === 'action' && (
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                One Small Action
              </h2>
              <button
                onClick={handleCloseSuggestion}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 mb-6">
              <div className="text-center mb-4">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Right now, you can:</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-teal-600 mt-1">•</span>
                      <span className="text-sm">Drink a glass of water</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal-600 mt-1">•</span>
                      <span className="text-sm">Step outside for 2 minutes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal-600 mt-1">•</span>
                      <span className="text-sm">Text someone you care about</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal-600 mt-1">•</span>
                      <span className="text-sm">Stretch your arms above your head</span>
                    </li>
                  </ul>
                </div>
                <p className="text-sm text-gray-600 text-center">
                  Small actions can shift your state
                </p>
              </div>
            </div>

            <button
              onClick={() => setStage('summary')}
              className="w-full py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl font-semibold hover:from-teal-600 hover:to-teal-700 transition-all"
            >
              Done
            </button>
          </div>
        )}

        {stage === 'summary' && (
          <div className="p-6">
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-teal-400 to-emerald-400 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Your check-in has been saved
              </h2>
              <div className="text-4xl mb-3">{selectedEmoji}</div>
              <p className="text-gray-600 mb-2">
                You were feeling <span className="font-semibold">{selectedMoodLabel}</span>.
              </p>
              <p className="text-lg font-medium text-teal-600 mb-6">
                You're doing better than you think.
              </p>
              <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl p-4 border border-teal-200">
                <p className="text-sm text-gray-700">
                  Your thoughts and feelings have been recorded. Take your time to explore more tools or return when you're ready.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleBackToHome}
                className="w-full py-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl font-semibold hover:from-teal-600 hover:to-teal-700 transition-all shadow-lg"
              >
                Back to Home
              </button>
              <button
                onClick={handleNewCheckIn}
                className="w-full py-4 bg-white border-2 border-teal-500 text-teal-600 rounded-xl font-semibold hover:bg-teal-50 transition-all"
              >
                Do Another Check-In
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
