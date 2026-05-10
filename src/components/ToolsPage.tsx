import { useState } from 'react';
import { ArrowLeft, Wind, Heart, Sparkles, Timer, Play } from 'lucide-react';
import { MeditationTimer } from './MeditationTimer';

interface ToolsPageProps {
  onBack: () => void;
}

type Tool = 'breathing' | 'affirmations' | 'grounding' | 'meditation' | null;

const affirmations = [
  "I am worthy of love and respect.",
  "My feelings are valid and important.",
  "I choose to focus on what I can control.",
  "I am growing stronger every day.",
  "It's okay to ask for help when I need it.",
  "I deserve peace and happiness.",
  "My journey is unique and valuable.",
  "I trust myself to make good decisions.",
  "I am resilient and capable.",
  "Today, I choose kindness toward myself.",
  "I release what I cannot change.",
  "I am doing the best I can.",
  "My emotions do not define me.",
  "I am enough, just as I am.",
  "I celebrate my progress, no matter how small.",
];

const groundingSteps = [
  "Name 5 things you can see around you",
  "Identify 4 things you can touch",
  "Notice 3 things you can hear",
  "Find 2 things you can smell",
  "Acknowledge 1 thing you can taste",
];

const tools = [
  {
    id: 'breathing' as Tool,
    name: 'Box Breathing',
    description: 'Calm your nervous system',
    icon: Wind,
    gradient: 'from-teal-500 to-cyan-500',
    bgGradient: 'from-teal-50 to-cyan-50',
  },
  {
    id: 'affirmations' as Tool,
    name: 'Daily Affirmations',
    description: 'Boost your mindset',
    icon: Heart,
    gradient: 'from-rose-500 to-pink-500',
    bgGradient: 'from-rose-50 to-pink-50',
  },
  {
    id: 'grounding' as Tool,
    name: '5-4-3-2-1 Method',
    description: 'Ground in the present',
    icon: Sparkles,
    gradient: 'from-emerald-500 to-teal-500',
    bgGradient: 'from-emerald-50 to-teal-50',
  },
  {
    id: 'meditation' as Tool,
    name: 'Meditation Timer',
    description: 'Guided mindfulness',
    icon: Timer,
    gradient: 'from-amber-500 to-orange-500',
    bgGradient: 'from-amber-50 to-orange-50',
  },
];

export function ToolsPage({ onBack }: ToolsPageProps) {
  const [activeTool, setActiveTool] = useState<Tool>(null);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [currentAffirmation, setCurrentAffirmation] = useState(0);
  const [groundingStep, setGroundingStep] = useState(0);
  const [showMeditation, setShowMeditation] = useState(false);

  const startBreathing = () => {
    setActiveTool('breathing');
    setBreathingPhase('inhale');
  };

  const nextAffirmation = () => {
    setCurrentAffirmation((prev) => (prev + 1) % affirmations.length);
  };

  const nextGroundingStep = () => {
    if (groundingStep < groundingSteps.length - 1) {
      setGroundingStep(groundingStep + 1);
    } else {
      setGroundingStep(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-rose-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        {!activeTool ? (
          <div>
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Wellness Tools</h1>
              <p className="text-gray-600">Quick exercises to help you feel better</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <button
                    key={tool.id}
                    onClick={() => {
                      if (tool.id === 'meditation') {
                        setShowMeditation(true);
                      } else if (tool.id === 'breathing') {
                        startBreathing();
                      } else {
                        setActiveTool(tool.id);
                      }
                    }}
                    className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 text-left overflow-hidden"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${tool.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                    <div className="relative">
                      <div className={`w-16 h-16 bg-gradient-to-br ${tool.gradient} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>

                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{tool.name}</h3>
                      <p className="text-gray-600">{tool.description}</p>

                      <div className="mt-4 flex items-center gap-2 text-teal-600 font-medium">
                        <Play className="w-4 h-4" />
                        <span>Start</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : activeTool === 'breathing' ? (
          <div className="bg-white rounded-3xl shadow-xl p-12">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Box Breathing</h2>

              <div className="mb-12">
                <div
                  className={`w-40 h-40 mx-auto rounded-full transition-all duration-[4000ms] ${
                    breathingPhase === 'inhale'
                      ? 'bg-gradient-to-br from-teal-400 to-cyan-400 scale-150'
                      : breathingPhase === 'hold'
                      ? 'bg-gradient-to-br from-emerald-400 to-teal-400 scale-150'
                      : 'bg-gradient-to-br from-cyan-400 to-blue-400 scale-100'
                  }`}
                />
              </div>

              <h3 className="text-3xl font-bold text-gray-900 mb-3">
                {breathingPhase === 'inhale' && 'Breathe In'}
                {breathingPhase === 'hold' && 'Hold'}
                {breathingPhase === 'exhale' && 'Breathe Out'}
              </h3>

              <p className="text-lg text-gray-600 mb-12">
                {breathingPhase === 'inhale' && 'Inhale deeply through your nose'}
                {breathingPhase === 'hold' && 'Hold your breath gently'}
                {breathingPhase === 'exhale' && 'Exhale slowly through your mouth'}
              </p>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => {
                    const phases: Array<'inhale' | 'hold' | 'exhale'> = ['inhale', 'hold', 'exhale'];
                    const currentIndex = phases.indexOf(breathingPhase);
                    setBreathingPhase(phases[(currentIndex + 1) % phases.length]);
                  }}
                  className="px-8 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-full hover:from-teal-600 hover:to-teal-700 transition-all font-semibold shadow-lg"
                >
                  Next Phase
                </button>
                <button
                  onClick={() => setActiveTool(null)}
                  className="px-8 py-3 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-all font-semibold"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        ) : activeTool === 'affirmations' ? (
          <div className="bg-white rounded-3xl shadow-xl p-12">
            <div className="max-w-3xl mx-auto text-center">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-rose-500 to-pink-500 rounded-full flex items-center justify-center mb-8 shadow-lg">
                <Heart className="w-10 h-10 text-white" />
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-12">Daily Affirmation</h2>

              <div className="mb-12 p-8 bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl">
                <p className="text-3xl font-semibold text-gray-900 leading-relaxed">
                  {affirmations[currentAffirmation]}
                </p>
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={nextAffirmation}
                  className="px-8 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full hover:from-rose-600 hover:to-pink-600 transition-all font-semibold shadow-lg"
                >
                  Next
                </button>
                <button
                  onClick={() => setActiveTool(null)}
                  className="px-8 py-3 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-all font-semibold"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        ) : activeTool === 'grounding' ? (
          <div className="bg-white rounded-3xl shadow-xl p-12">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">5-4-3-2-1 Grounding</h2>
                <p className="text-gray-600">Use your senses to ground yourself</p>
              </div>

              <div className="space-y-4 mb-12">
                {groundingSteps.map((step, index) => (
                  <div
                    key={index}
                    className={`p-6 rounded-2xl transition-all ${
                      index === groundingStep
                        ? 'bg-gradient-to-r from-emerald-100 to-teal-100 border-2 border-emerald-400 shadow-lg scale-105'
                        : index < groundingStep
                        ? 'bg-gray-50 opacity-50'
                        : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                        index === groundingStep
                          ? 'bg-emerald-500 text-white'
                          : index < groundingStep
                          ? 'bg-gray-400 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {index + 1}
                      </div>
                      <p className="text-lg font-medium text-gray-900">{step}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={nextGroundingStep}
                  className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full hover:from-emerald-600 hover:to-teal-600 transition-all font-semibold shadow-lg"
                >
                  {groundingStep < groundingSteps.length - 1 ? 'Next Step' : 'Start Over'}
                </button>
                <button
                  onClick={() => {
                    setActiveTool(null);
                    setGroundingStep(0);
                  }}
                  className="px-8 py-3 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-all font-semibold"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {showMeditation && (
          <MeditationTimer onClose={() => setShowMeditation(false)} />
        )}
      </div>
    </div>
  );
}
