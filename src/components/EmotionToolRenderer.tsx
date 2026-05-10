import { useState } from 'react';
import { Clock, BookOpen, Lightbulb, CheckCircle, Users, Shield } from 'lucide-react';
import { MeditationTimer } from './MeditationTimer';
import ReachOutFlow from './ReachOutFlow';

interface EmotionToolRendererProps {
  toolId: string;
  onComplete: () => void;
}

export function EmotionToolRenderer({ toolId, onComplete }: EmotionToolRendererProps) {
  const [journalText, setJournalText] = useState('');
  const [breathingComplete, setBreathingComplete] = useState(false);

  const toolMetadata: Record<string, { icon: any; title: string; category: string }> = {
    breathing_2min: { icon: Clock, title: '2-Minute Breathing Reset', category: 'rest' },
    breathing_calm: { icon: Clock, title: 'Calming Breath Practice', category: 'rest' },
    breathing_box: { icon: Clock, title: 'Box Breathing', category: 'rest' },
    journal_job_discouragement: { icon: BookOpen, title: 'Job Search Journal', category: 'process' },
    journal_disappointment: { icon: BookOpen, title: 'Disappointment Processing', category: 'process' },
    journal_anger_release: { icon: BookOpen, title: 'Anger Release Journal', category: 'process' },
    reframe_rejection: { icon: Lightbulb, title: 'Reframe: Rejection → Redirection', category: 'mindset' },
    grounding_54321: { icon: Shield, title: '5-4-3-2-1 Grounding', category: 'safety' },
    connection_reachout_planner: { icon: Users, title: 'Connection Planner', category: 'connection' }
  };

  const metadata = toolMetadata[toolId] || {
    icon: CheckCircle,
    title: 'Tool',
    category: 'general'
  };

  const IconComponent = metadata.icon;

  const renderBreathingTool = () => {
    if (breathingComplete) {
      return (
        <div className="text-center space-y-6 py-8">
          <div className="w-16 h-16 mx-auto bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold">Nice work</h3>
          <p className="text-slate-400">You took time to reset your nervous system</p>
          <button
            onClick={onComplete}
            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 rounded-lg font-medium transition"
          >
            Continue
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <IconComponent className="w-12 h-12 mx-auto mb-4 text-emerald-400" />
          <h3 className="text-2xl font-bold mb-2">{metadata.title}</h3>
          <p className="text-slate-400">Follow the breathing pattern to calm your nervous system</p>
        </div>

        <MeditationTimer
          onClose={() => {
            setBreathingComplete(true);
          }}
        />
      </div>
    );
  };

  const renderJournalTool = () => {
    const prompts: Record<string, string[]> = {
      journal_job_discouragement: [
        "What's the hardest part about this job search right now?",
        "What have you accomplished, even if it feels small?",
        "What would you tell a friend going through the same thing?"
      ],
      journal_disappointment: [
        "What happened, and how does it feel in your body?",
        "What were you hoping for?",
        "What do you need right now to move forward?"
      ],
      journal_anger_release: [
        "What am I angry about? Let it all out uncensored.",
        "What does this situation remind me of from the past?",
        "What boundary or need is being violated here?"
      ],
      journal_grief_gentle: [
        "What are you missing most right now?",
        "If you could say anything to them/it, what would you say?",
        "What small thing would honor your grief today?"
      ],
      journal_loneliness: [
        "What kind of connection am I craving?",
        "When have I felt truly seen and understood?",
        "What's one small step toward connection I could take?"
      ]
    };

    const toolPrompts = prompts[toolId] || [
      'What are you feeling right now?',
      'What do you need in this moment?',
      'What would help you move forward?'
    ];

    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <IconComponent className="w-12 h-12 mx-auto mb-4 text-purple-400" />
          <h3 className="text-2xl font-bold mb-2">{metadata.title}</h3>
          <p className="text-slate-400">Take your time. There are no wrong answers.</p>
        </div>

        <div className="space-y-6">
          {toolPrompts.map((prompt, index) => (
            <div key={index} className="space-y-3">
              <label className="block text-sm font-medium text-slate-300">
                {index + 1}. {prompt}
              </label>
              <textarea
                value={journalText}
                onChange={(e) => setJournalText(e.target.value)}
                className="w-full h-32 bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Write freely..."
              />
            </div>
          ))}
        </div>

        <button
          onClick={onComplete}
          className="w-full px-6 py-3 bg-emerald-500 hover:bg-emerald-400 rounded-lg font-medium transition"
        >
          I'm done reflecting
        </button>
      </div>
    );
  };

  const renderGroundingTool = () => {
    const [currentStep, setCurrentStep] = useState(0);

    const steps = [
      { sense: 'See', instruction: 'Name 5 things you can see around you', count: 5 },
      { sense: 'Touch', instruction: 'Name 4 things you can touch', count: 4 },
      { sense: 'Hear', instruction: 'Name 3 things you can hear', count: 3 },
      { sense: 'Smell', instruction: 'Name 2 things you can smell', count: 2 },
      { sense: 'Taste', instruction: 'Name 1 thing you can taste', count: 1 }
    ];

    if (currentStep >= steps.length) {
      return (
        <div className="text-center space-y-6 py-8">
          <div className="w-16 h-16 mx-auto bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold">You're present</h3>
          <p className="text-slate-400">You brought yourself back to the here and now</p>
          <button
            onClick={onComplete}
            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 rounded-lg font-medium transition"
          >
            Continue
          </button>
        </div>
      );
    }

    const step = steps[currentStep];

    return (
      <div className="space-y-8">
        <div className="text-center mb-8">
          <IconComponent className="w-12 h-12 mx-auto mb-4 text-red-400" />
          <h3 className="text-2xl font-bold mb-2">{metadata.title}</h3>
          <p className="text-slate-400">Bring yourself back to the present moment</p>
        </div>

        <div className="text-center space-y-4">
          <div className="text-6xl font-bold text-emerald-400">{step.count}</div>
          <h4 className="text-xl font-semibold">{step.sense}</h4>
          <p className="text-lg text-slate-300">{step.instruction}</p>
        </div>

        <div className="flex gap-2 justify-center">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full ${
                index === currentStep
                  ? 'bg-emerald-500'
                  : index < currentStep
                  ? 'bg-emerald-500/50'
                  : 'bg-slate-700'
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => setCurrentStep(currentStep + 1)}
          className="w-full px-6 py-3 bg-emerald-500 hover:bg-emerald-400 rounded-lg font-medium transition"
        >
          Next
        </button>
      </div>
    );
  };

  const renderReframeTool = () => {
    const reframes: Record<string, { old: string; new: string; explanation: string }[]> = {
      reframe_rejection: [
        {
          old: "I got rejected because I'm not good enough",
          new: "This wasn't the right fit, and that's okay",
          explanation: "Rejection doesn't mean you lack value. It means the match wasn't right—and that frees you to find what is."
        },
        {
          old: "I'll never get what I want",
          new: "This is one path closing so another can open",
          explanation: "Sometimes what looks like a dead end is actually a redirection toward something better aligned with you."
        }
      ],
      reframe_rest_permission: [
        {
          old: "Resting is lazy",
          new: "Rest is required for sustainable performance",
          explanation: "You can't pour from an empty cup. Rest isn't optional—it's how you refuel."
        }
      ]
    };

    const toolReframes = reframes[toolId] || reframes.reframe_rejection;

    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <IconComponent className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
          <h3 className="text-2xl font-bold mb-2">{metadata.title}</h3>
          <p className="text-slate-400">Try on a new perspective</p>
        </div>

        <div className="space-y-6">
          {toolReframes.map((reframe, index) => (
            <div key={index} className="p-6 bg-slate-800/50 border border-slate-700 rounded-xl space-y-4">
              <div className="space-y-2">
                <div className="text-xs uppercase tracking-wider text-slate-500 font-medium">
                  Old story
                </div>
                <div className="text-slate-400 italic">"{reframe.old}"</div>
              </div>
              <div className="h-px bg-slate-700" />
              <div className="space-y-2">
                <div className="text-xs uppercase tracking-wider text-emerald-500 font-medium">
                  New story
                </div>
                <div className="text-white font-medium">"{reframe.new}"</div>
              </div>
              <div className="text-sm text-slate-300 leading-relaxed">
                {reframe.explanation}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onComplete}
          className="w-full px-6 py-3 bg-emerald-500 hover:bg-emerald-400 rounded-lg font-medium transition"
        >
          Continue
        </button>
      </div>
    );
  };

  const renderConnectionTool = () => {
    const [selectedPerson, setSelectedPerson] = useState('');
    const [message, setMessage] = useState('');

    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <IconComponent className="w-12 h-12 mx-auto mb-4 text-pink-400" />
          <h3 className="text-2xl font-bold mb-2">{metadata.title}</h3>
          <p className="text-slate-400">Plan one meaningful reach-out</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Who could you reach out to?
            </label>
            <input
              type="text"
              value={selectedPerson}
              onChange={(e) => setSelectedPerson(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Friend, family member, therapist..."
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              What would you want to say or ask for?
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full h-32 bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="e.g., 'I'm struggling and could use someone to talk to' or 'Want to grab coffee this week?'"
            />
          </div>

          <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
            <p className="text-sm text-blue-300">
              💡 Tip: You don't have to send this right now. Just having a plan can help.
            </p>
          </div>
        </div>

        <button
          onClick={onComplete}
          className="w-full px-6 py-3 bg-emerald-500 hover:bg-emerald-400 rounded-lg font-medium transition"
        >
          I have my plan
        </button>
      </div>
    );
  };

  const renderDefaultTool = () => {
    return (
      <div className="text-center space-y-6 py-8">
        <IconComponent className="w-16 h-16 mx-auto text-emerald-400" />
        <h3 className="text-2xl font-bold">{metadata.title}</h3>
        <p className="text-slate-400">This tool is coming soon</p>
        <button
          onClick={onComplete}
          className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 rounded-lg font-medium transition"
        >
          Continue
        </button>
      </div>
    );
  };

  if (toolId.startsWith('breathing_') || toolId.includes('_breath') || toolId.includes('relaxation')) {
    return renderBreathingTool();
  }

  if (toolId.startsWith('journal_')) {
    return renderJournalTool();
  }

  if (toolId === 'grounding_54321') {
    return renderGroundingTool();
  }

  if (toolId.startsWith('reframe_')) {
    return renderReframeTool();
  }

  if (toolId === 'reach-out') {
    return <ReachOutFlow onComplete={onComplete} />;
  }

  if (toolId.includes('connection') || toolId.includes('reachout')) {
    return renderConnectionTool();
  }

  return renderDefaultTool();
}
