import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { EmotionEngine } from './EmotionEngine';
import { emotionConfigs, EmotionId } from '../data/emotionConfigs';

interface EmotionSelectionPageProps {
  onBack: () => void;
}

export function EmotionSelectionPage({ onBack }: EmotionSelectionPageProps) {
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionId | null>(null);

  if (selectedEmotion) {
    return (
      <EmotionEngine
        emotionId={selectedEmotion}
        onClose={() => setSelectedEmotion(null)}
      />
    );
  }

  const emotions = Object.values(emotionConfigs);

  const emotionsByCategory = {
    challenging: emotions.filter(e =>
      ['tired', 'sad', 'angry', 'anxious', 'overwhelmed', 'lonely', 'guilty', 'numb'].includes(e.id)
    ),
    neutral: emotions.filter(e => e.id === 'okay'),
    positive: emotions.filter(e =>
      ['grateful', 'excited', 'calm', 'proud'].includes(e.id)
    )
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3">How are you feeling?</h1>
          <p className="text-xl text-slate-400">
            Choose the emotion that resonates most right now
          </p>
        </div>

        <div className="space-y-12">
          <div>
            <h2 className="text-sm uppercase tracking-wider text-slate-500 font-medium mb-4">
              Challenging Emotions
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {emotionsByCategory.challenging.map((emotion) => (
                <button
                  key={emotion.id}
                  onClick={() => setSelectedEmotion(emotion.id)}
                  className="group p-6 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 hover:border-emerald-500 rounded-2xl transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/20"
                >
                  <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">
                    {emotion.emoji}
                  </div>
                  <div className="text-lg font-semibold group-hover:text-emerald-400 transition">
                    {emotion.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-sm uppercase tracking-wider text-slate-500 font-medium mb-4">
              Neutral
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {emotionsByCategory.neutral.map((emotion) => (
                <button
                  key={emotion.id}
                  onClick={() => setSelectedEmotion(emotion.id)}
                  className="group p-6 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 hover:border-emerald-500 rounded-2xl transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/20"
                >
                  <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">
                    {emotion.emoji}
                  </div>
                  <div className="text-lg font-semibold group-hover:text-emerald-400 transition">
                    {emotion.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-sm uppercase tracking-wider text-slate-500 font-medium mb-4">
              Positive Emotions
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {emotionsByCategory.positive.map((emotion) => (
                <button
                  key={emotion.id}
                  onClick={() => setSelectedEmotion(emotion.id)}
                  className="group p-6 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 hover:border-emerald-500 rounded-2xl transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/20"
                >
                  <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">
                    {emotion.emoji}
                  </div>
                  <div className="text-lg font-semibold group-hover:text-emerald-400 transition">
                    {emotion.label}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 p-6 bg-slate-800/30 border border-slate-700 rounded-2xl text-center">
          <p className="text-slate-400">
            Not sure? Pick the closest one. There's no wrong choice—we'll guide you from there.
          </p>
        </div>
      </div>
    </div>
  );
}
