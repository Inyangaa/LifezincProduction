import { useState } from 'react';
import { X, Sparkles, Heart, CheckCircle } from 'lucide-react';
import { VoiceInput } from './VoiceInput';

interface QuickJournalFlowProps {
  onComplete: (data: { mood: string; text: string; emoji: string; label: string }) => void;
  onClose: () => void;
  onSwitchToAdvanced?: () => void;
}

export function QuickJournalFlow({ onComplete, onClose, onSwitchToAdvanced }: QuickJournalFlowProps) {
  const [step, setStep] = useState<'emotion' | 'journal' | 'done'>('emotion');
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [selectedEmoji, setSelectedEmoji] = useState<string>('');
  const [selectedLabel, setSelectedLabel] = useState<string>('');
  const [journalText, setJournalText] = useState('');

  const basicEmotions = [
    { mood: 'happy', emoji: '😊', label: 'Happy', color: 'from-yellow-400 to-amber-400' },
    { mood: 'calm', emoji: '😌', label: 'Calm', color: 'from-blue-400 to-cyan-400' },
    { mood: 'excited', emoji: '🤩', label: 'Excited', color: 'from-orange-400 to-pink-400' },
    { mood: 'grateful', emoji: '🙏', label: 'Grateful', color: 'from-purple-400 to-pink-400' },
    { mood: 'sad', emoji: '😢', label: 'Sad', color: 'from-blue-500 to-indigo-500' },
    { mood: 'anxious', emoji: '😰', label: 'Anxious', color: 'from-yellow-500 to-orange-500' },
    { mood: 'angry', emoji: '😠', label: 'Angry', color: 'from-red-500 to-orange-500' },
    { mood: 'overwhelmed', emoji: '😵', label: 'Overwhelmed', color: 'from-gray-500 to-slate-500' },
    { mood: 'tired', emoji: '😴', label: 'Tired', color: 'from-indigo-400 to-purple-400' },
    { mood: 'confused', emoji: '😕', label: 'Confused', color: 'from-teal-400 to-cyan-400' },
  ];

  const handleEmotionSelect = (mood: string, emoji: string, label: string) => {
    setSelectedMood(mood);
    setSelectedEmoji(emoji);
    setSelectedLabel(label);
    setStep('journal');
  };

  const handleSkipJournal = () => {
    onComplete({
      mood: selectedMood,
      text: '',
      emoji: selectedEmoji,
      label: selectedLabel,
    });
    setStep('done');
  };

  const handleSaveJournal = () => {
    onComplete({
      mood: selectedMood,
      text: journalText,
      emoji: selectedEmoji,
      label: selectedLabel,
    });
    setStep('done');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm overflow-hidden">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl max-w-lg w-full max-h-[95vh] sm:max-h-[90vh] flex flex-col overflow-hidden">
        {/* Step 1: Select Emotion */}
        {step === 'emotion' && (
          <div className="flex flex-col h-full overflow-hidden">
            <div className="p-4 sm:p-6 flex-shrink-0">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                    How are you feeling?
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Pick the emotion that matches your mood right now
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-4">
              <div className="grid grid-cols-2 gap-3">
                {basicEmotions.map((emotion) => (
                  <button
                    key={emotion.mood}
                    onClick={() => handleEmotionSelect(emotion.mood, emotion.emoji, emotion.label)}
                    className="min-h-[88px] p-4 rounded-xl border-2 border-gray-200 hover:border-emerald-400 hover:bg-emerald-50 active:scale-95 transition-all group text-left touch-manipulation"
                  >
                    <div className="text-4xl mb-2">{emotion.emoji}</div>
                    <div className="text-sm font-semibold text-gray-900 group-hover:text-emerald-700">
                      {emotion.label}
                    </div>
                  </button>
                ))}
              </div>

              {onSwitchToAdvanced && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={onSwitchToAdvanced}
                    className="w-full p-4 rounded-xl border-2 border-gray-300 hover:border-emerald-500 hover:bg-emerald-50 transition-all text-center group"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Sparkles className="w-5 h-5 text-emerald-600" />
                      <span className="text-sm font-semibold text-gray-700 group-hover:text-emerald-700">
                        Use Advanced Emotion Flow
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Track nuanced emotions and body sensations
                    </p>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Optional Journal */}
        {step === 'journal' && (
          <div className="flex flex-col h-full overflow-hidden">
            <div className="p-4 sm:p-6 flex-shrink-0">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="text-4xl sm:text-5xl mb-3 text-center">{selectedEmoji}</div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-2">
                    {selectedLabel}
                  </h2>
                  <p className="text-gray-600 text-sm text-center">
                    Want to add a quick note? (Optional)
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 sm:px-6">
              <div className="space-y-4 pb-24">
                <div className="relative">
                  <textarea
                    value={journalText}
                    onChange={(e) => setJournalText(e.target.value)}
                    placeholder="What's on your mind? (1-3 lines)"
                    className="w-full min-h-[140px] p-4 pr-16 border-2 border-gray-200 rounded-xl focus:border-emerald-400 focus:outline-none resize-none text-base sm:text-lg"
                    style={{ fontSize: '16px' }}
                    maxLength={300}
                  />
                  <div className="absolute top-3 right-3">
                    <VoiceInput
                      onTranscript={(text) => setJournalText(text)}
                    />
                  </div>
                </div>

                {journalText && (
                  <div className="text-xs text-gray-500 text-right">
                    {journalText.length}/300 characters
                  </div>
                )}
              </div>
            </div>

            {/* Sticky bottom buttons */}
            <div className="sticky bottom-0 left-0 right-0 p-4 sm:p-6 bg-white border-t border-gray-200 flex-shrink-0 shadow-lg">
              <div className="flex gap-3">
                <button
                  onClick={handleSkipJournal}
                  className="flex-1 min-h-[48px] px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 active:scale-95 transition-all touch-manipulation"
                >
                  Skip
                </button>
                <button
                  onClick={handleSaveJournal}
                  className="flex-1 min-h-[48px] px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-600 active:scale-95 transition-all shadow-lg hover:shadow-xl touch-manipulation"
                >
                  Save Entry
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Done */}
        {step === 'done' && (
          <div className="flex flex-col h-full overflow-hidden">
            <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
              <div className="text-center w-full">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-emerald-600" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  Entry Saved!
                </h2>
                <p className="text-gray-600 mb-6">
                  Your {selectedLabel.toLowerCase()} mood has been recorded
                </p>
              </div>
            </div>

            <div className="sticky bottom-0 left-0 right-0 p-4 sm:p-6 bg-white border-t border-gray-200 flex-shrink-0">
              <button
                onClick={onClose}
                className="w-full min-h-[48px] px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-600 active:scale-95 transition-all shadow-lg touch-manipulation"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
