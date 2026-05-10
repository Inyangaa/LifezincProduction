import { mapMoodToEmotionKey, generateEngineBasedSuggestions, Suggestion } from './emotionEngineAdapter';
import { UserProfile, filterSuggestions } from './profileFiltering';
import {
  ageFilteredEmotionRecycle,
  topicModifiers,
  AgeGroup,
  EmotionKey as AgeFilteredEmotionKey,
  TopicKey as AgeFilteredTopicKey
} from '../data/ageFilteredRecycle';

export interface EmotionalRecycleResult {
  emotionalReflection: string;
  emotionInterpretation: string;
  recycledEmotion: {
    title: string;
    description: string;
    icon: string;
  };
  actionSteps: Suggestion[];
  originalEmotions: string[];
  recycledTo: string;
  topicContext?: string;
  grounding?: string;
  faithHint?: string;
  ageSpecificGuidance?: string;
}

function mapProfileAgeToAgeGroup(profileAge: string): AgeGroup {
  if (profileAge === '13-15' || profileAge === '16-17') return 'teen';
  if (profileAge === '18-24') return 'youngAdult';
  if (profileAge === '25-40') return 'adult';
  if (profileAge === '40+') return 'mature';
  return 'adult'; // default
}

function mapMoodToAgeFilteredEmotion(mood: string): AgeFilteredEmotionKey | null {
  const mapping: Record<string, AgeFilteredEmotionKey> = {
    sad: 'sad',
    anxious: 'anxious',
    worried: 'worried',
    tired: 'exhausted',
    exhausted: 'exhausted',
    angry: 'angry',
    frustrated: 'frustrated',
    lonely: 'lonely',
    confused: 'confused',
    overwhelmed: 'overwhelmed',
    happy: 'motivated',
    hopeful: 'motivated',
    excited: 'motivated',
    grateful: 'grateful',
    embarrassed: 'embarrassed',
    guilty: 'ashamed',
    ashamed: 'ashamed',
    hurt: 'heartbroken',
    heartbroken: 'heartbroken',
    disappointed: 'heartbroken'
  };

  const lowerMood = mood.toLowerCase();
  return mapping[lowerMood] || null;
}

function mapTopicToAgeFilteredTopic(topic: string | null): AgeFilteredTopicKey | null {
  if (!topic) return null;

  const mapping: Record<string, AgeFilteredTopicKey> = {
    money: 'money',
    work: 'work_school',
    school: 'work_school',
    work_school: 'work_school',
    relationship: 'relationship',
    relationships: 'relationship',
    friends: 'relationship',
    family: 'family',
    health: 'health',
    faith: 'faith',
    spiritual: 'faith',
    self_esteem: 'self_esteem',
    grief: 'grief_loss',
    loss: 'grief_loss',
    grief_loss: 'grief_loss',
    other: 'other'
  };

  return mapping[topic.toLowerCase()] || 'other';
}

const emotionRecycleMap: Record<string, {
  reflection: string;
  interpretation: string;
  recycledTitle: string;
  recycledDescription: string;
  recycledTo: string;
  icon: string;
}> = {
  sad: {
    reflection: "You're carrying heaviness, hurt, or disappointment. This weight feels real.",
    interpretation: "Sadness signals loss or unmet needs. It asks for gentleness, not productivity.",
    recycledTitle: "Moving Toward Lightness",
    recycledDescription: "Your sadness is being acknowledged and transformed into self-compassion. You're learning to hold space for pain while believing in brighter days.",
    recycledTo: "Self-Compassion & Hope",
    icon: "🌤️"
  },
  anxious: {
    reflection: "Your mind is racing, anticipating threats, or preparing for the worst.",
    interpretation: "Anxiety is your brain's alarm system working overtime. It means you care deeply about what happens next.",
    recycledTitle: "Breaking Down the Worry",
    recycledDescription: "Your anxiety is being separated into what you can control and what you can't. You're moving from overwhelm to clarity, one breath at a time.",
    recycledTo: "Grounded Clarity",
    icon: "🧭"
  },
  worried: {
    reflection: "You're caught in 'what if' thinking, anticipating problems before they arrive.",
    interpretation: "Worry shows you care about outcomes. But it often magnifies unlikely scenarios.",
    recycledTitle: "From What-If to What-Is",
    recycledDescription: "Your worry is being redirected toward what you can actually influence right now. You're building a plan instead of spinning in fear.",
    recycledTo: "Present Control",
    icon: "⚖️"
  },
  overwhelmed: {
    reflection: "Everything feels like too much. Your capacity is maxed out.",
    interpretation: "Overwhelm happens when demands exceed your current resources. It's a signal to pause, not push.",
    recycledTitle: "Grounding First",
    recycledDescription: "You're putting down the mental load, even for a moment. One breath. One task. One step. That's enough.",
    recycledTo: "Manageable Steps",
    icon: "🪨"
  },
  angry: {
    reflection: "You feel heated, reactive, or like boundaries have been crossed.",
    interpretation: "Anger protects your values and limits. It points to something that matters deeply.",
    recycledTitle: "Anger as Information",
    recycledDescription: "Your anger is revealing the boundary that was crossed and the need underneath. You're transforming reaction into clear communication.",
    recycledTo: "Boundary Clarity",
    icon: "🎯"
  },
  frustrated: {
    reflection: "You're stuck, blocked, or repeatedly hitting the same obstacle.",
    interpretation: "Frustration signals misalignment between expectation and reality.",
    recycledTitle: "Finding the Opening",
    recycledDescription: "Your frustration is showing you where adjustment is needed. You're shifting from forcing to flowing.",
    recycledTo: "Adaptive Strategy",
    icon: "🔓"
  },
  confused: {
    reflection: "Nothing feels clear. You don't know which way to turn.",
    interpretation: "Confusion is often a transition state—you're between old understanding and new clarity.",
    recycledTitle: "Clarity Through Inquiry",
    recycledDescription: "Your confusion is being met with curiosity, not judgment. You're asking better questions instead of demanding instant answers.",
    recycledTo: "Patient Discovery",
    icon: "🔍"
  },
  lonely: {
    reflection: "You feel unseen, disconnected, or like you're on the outside looking in.",
    interpretation: "Loneliness is your need for connection calling out. It's human and valid.",
    recycledTitle: "Reconnection Path",
    recycledDescription: "Your loneliness is being transformed into intentional connection. One text. One call. One small reach toward others.",
    recycledTo: "Belonging",
    icon: "🌉"
  },
  tired: {
    reflection: "You're running on empty—physically, mentally, or emotionally.",
    interpretation: "Exhaustion is your body's loud request for rest. It's not weakness; it's wisdom.",
    recycledTitle: "Permission to Pause",
    recycledDescription: "Your fatigue is being honored as a signal, not ignored as inconvenience. Rest is productive when it's needed.",
    recycledTo: "Restored Energy",
    icon: "🛌"
  },
  hopeful: {
    reflection: "You sense possibility, even if uncertainty remains.",
    interpretation: "Hope is the bridge between where you are and where you want to be.",
    recycledTitle: "Hope Into Action",
    recycledDescription: "Your hope is being channeled into concrete next steps. You're not just wishing—you're planning.",
    recycledTo: "Forward Momentum",
    icon: "🚀"
  },
  happy: {
    reflection: "You're feeling light, content, or genuinely good right now.",
    interpretation: "Happiness is a gift worth capturing. It reminds you what's working.",
    recycledTitle: "Anchoring Joy",
    recycledDescription: "You're noting what went well so you can return to it. This moment matters.",
    recycledTo: "Sustained Positivity",
    icon: "✨"
  },
  grateful: {
    reflection: "You're noticing blessings, support, or small wins.",
    interpretation: "Gratitude shifts focus from scarcity to abundance, even in hard times.",
    recycledTitle: "Gratitude as Fuel",
    recycledDescription: "You're using appreciation to strengthen resilience and deepen connection.",
    recycledTo: "Abundance Mindset",
    icon: "🙏"
  },
  calm: {
    reflection: "You feel steady, grounded, or at ease.",
    interpretation: "Calm is a resource. This is a moment to notice what supports your peace.",
    recycledTitle: "Protecting Your Calm",
    recycledDescription: "You're identifying what created this peace so you can return to it later.",
    recycledTo: "Sustained Stability",
    icon: "🧘"
  },
  neutral: {
    reflection: "You feel okay—not high, not low. Just steady.",
    interpretation: "Neutral is not boring—it's a stable place to check in gently.",
    recycledTitle: "Mindful Presence",
    recycledDescription: "You're using this steady moment to notice what's quietly okay and what needs gentle attention.",
    recycledTo: "Balanced Awareness",
    icon: "⚖️"
  },
  stressed: {
    reflection: "You're under pressure, juggling too much, or feeling squeezed.",
    interpretation: "Stress is demand exceeding your current coping capacity.",
    recycledTitle: "Reducing the Load",
    recycledDescription: "You're identifying what can be delayed, delegated, or done differently.",
    recycledTo: "Sustainable Pace",
    icon: "🎈"
  },
  hurt: {
    reflection: "Someone's words or actions have wounded you.",
    interpretation: "Hurt signals that trust or care was broken. Your pain is valid.",
    recycledTitle: "Healing from Within",
    recycledDescription: "You're acknowledging the wound while deciding how much power to give it.",
    recycledTo: "Protected Heart",
    icon: "💚"
  },
  guilty: {
    reflection: "You regret something you did or didn't do.",
    interpretation: "Guilt shows you have a conscience and values. That's actually healthy.",
    recycledTitle: "From Guilt to Growth",
    recycledDescription: "You're learning from this experience without being defined by it.",
    recycledTo: "Self-Forgiveness",
    icon: "🌱"
  },
  embarrassed: {
    reflection: "You feel exposed, judged, or like you made a fool of yourself.",
    interpretation: "Embarrassment is temporary discomfort, not permanent damage.",
    recycledTitle: "Rewriting the Narrative",
    recycledDescription: "You're separating the event from your worth. One awkward moment doesn't define you.",
    recycledTo: "Self-Acceptance",
    icon: "🌟"
  },
  disappointed: {
    reflection: "Something you hoped for didn't happen, and it hurts.",
    interpretation: "Disappointment shows you cared. That's not weakness—it's investment.",
    recycledTitle: "Redirecting Hope",
    recycledDescription: "You're adjusting expectations while keeping hope alive in realistic ways.",
    recycledTo: "Resilient Optimism",
    icon: "🔄"
  },
  excited: {
    reflection: "You're energized, anticipating something good.",
    interpretation: "Excitement is positive anticipation. Let yourself feel it fully.",
    recycledTitle: "Channeling Energy",
    recycledDescription: "You're using this momentum to move forward with purpose.",
    recycledTo: "Focused Enthusiasm",
    icon: "⚡"
  }
};

export function generateEmotionalRecycle(
  moodValues: string[],
  topicValue?: string | null,
  userProfile?: UserProfile | null
): EmotionalRecycleResult {
  if (moodValues.length === 0) {
    return {
      emotionalReflection: "Let's start by identifying how you're feeling.",
      emotionInterpretation: "Your emotions are valid information about your experience.",
      recycledEmotion: {
        title: "Awareness",
        description: "Simply noticing your emotional state is a powerful first step.",
        icon: "🎯"
      },
      actionSteps: [
        {
          id: 'fallback-1',
          type: 'reflection',
          title: 'Check in with yourself',
          body: 'Take a moment to notice what you\'re feeling right now'
        }
      ],
      originalEmotions: [],
      recycledTo: "Self-Awareness"
    };
  }

  const ageGroup = userProfile ? mapProfileAgeToAgeGroup(userProfile.age_group) : 'adult';
  const supportStyle = userProfile?.support_style || 'Balanced';
  const crisisSensitivity = userProfile?.crisis_sensitivity || 'Medium';

  const primaryMood = moodValues[0].toLowerCase();
  const ageFilteredEmotion = mapMoodToAgeFilteredEmotion(primaryMood);

  let emotionalReflection: string;
  let emotionInterpretation: string;
  let recycledTitle: string;
  let recycledDescription: string;
  let recycledTo: string;
  let grounding: string | undefined;
  let faithHint: string | undefined;
  let ageSpecificGuidance: string | undefined;

  if (ageFilteredEmotion && ageFilteredEmotionRecycle[ageFilteredEmotion]) {
    const entry = ageFilteredEmotionRecycle[ageFilteredEmotion];

    emotionalReflection = entry.meaning;
    emotionInterpretation = entry.interpretation;
    recycledTitle = ageFilteredEmotion.charAt(0).toUpperCase() + ageFilteredEmotion.slice(1) + " Transformed";
    recycledDescription = entry.recycledOutcome;
    recycledTo = entry.recycledOutcome;
    grounding = entry.grounding;
    ageSpecificGuidance = entry.guidanceByAge[ageGroup];

    if (supportStyle === 'Faith-based' || supportStyle === 'Balanced') {
      faithHint = entry.faithHint;
    }
  } else {
    const fallbackData = emotionRecycleMap[primaryMood] || emotionRecycleMap.neutral || emotionRecycleMap.sad;
    emotionalReflection = fallbackData.reflection;
    emotionInterpretation = fallbackData.interpretation;
    recycledTitle = fallbackData.recycledTitle;
    recycledDescription = fallbackData.recycledDescription;
    recycledTo = fallbackData.recycledTo;
  }

  if (moodValues.length > 1) {
    const emotionLabels = moodValues.map(m => {
      const ageEmotion = mapMoodToAgeFilteredEmotion(m);
      if (ageEmotion && ageFilteredEmotionRecycle[ageEmotion]) {
        return ageFilteredEmotionRecycle[ageEmotion].recycledOutcome;
      }
      return m;
    });

    emotionalReflection = `You're feeling multiple emotions at once: ${moodValues.join(', ')}. That's completely normal.`;
    emotionInterpretation = "Complex emotions often coexist. Each one carries important information.";
    recycledTitle = "Integration of Feelings";
    recycledDescription = `You're learning to hold space for ${moodValues.join(' and ')} simultaneously. You don't have to pick just one.`;
    recycledTo = emotionLabels.slice(0, 2).join(' + ');
  }

  const engineSuggestions = generateEngineBasedSuggestions(moodValues, topicValue);

  let topicContext: string | undefined;
  const mappedTopic = mapTopicToAgeFilteredTopic(topicValue ?? null);

  if (mappedTopic && topicModifiers[mappedTopic]) {
    const topicDesc = topicModifiers[mappedTopic].descriptionByAge[ageGroup];
    topicContext = topicDesc || undefined;
  } else if (topicValue && engineSuggestions.topicLabel) {
    topicContext = `This is about ${engineSuggestions.topicLabel.toLowerCase()}.`;
  }

  let actionSteps = engineSuggestions.suggestions;

  if (crisisSensitivity === 'High') {
    actionSteps = actionSteps.filter(s =>
      s.type === 'breathing' || s.type === 'grounding'
    ).slice(0, 3);

    if (actionSteps.length === 0) {
      actionSteps = [{
        id: 'crisis-grounding',
        type: 'breathing',
        title: 'Ground yourself right now',
        body: grounding || 'Take slow, deep breaths. You are safe in this moment.'
      }];
    }
  }

  const filteredSuggestions = userProfile
    ? filterSuggestions(actionSteps, userProfile)
    : actionSteps;

  return {
    emotionalReflection,
    emotionInterpretation,
    recycledEmotion: {
      title: recycledTitle,
      description: recycledDescription,
      icon: getIconForEmotion(ageFilteredEmotion || 'sad')
    },
    actionSteps: filteredSuggestions,
    originalEmotions: moodValues,
    recycledTo,
    topicContext,
    grounding,
    faithHint,
    ageSpecificGuidance
  };
}

function getIconForEmotion(emotion: AgeFilteredEmotionKey): string {
  const icons: Record<AgeFilteredEmotionKey, string> = {
    sad: '🌤️',
    anxious: '🧭',
    worried: '⚖️',
    exhausted: '🛌',
    angry: '🎯',
    frustrated: '🔓',
    lonely: '🌉',
    confused: '🔍',
    overwhelmed: '🪨',
    motivated: '🚀',
    grateful: '🙏',
    embarrassed: '🌟',
    ashamed: '🌱',
    heartbroken: '💚'
  };
  return icons[emotion] || '✨';
}
