import {
  EmotionKey,
  TopicKey,
  Suggestion,
  emotions,
  topics,
  comboRules,
} from '../data/emotionEngine';

// Re-export Suggestion type for convenience
export type { Suggestion } from '../data/emotionEngine';

/**
 * Maps current app mood values to EmotionKey from emotionEngine
 */
export function mapMoodToEmotionKey(mood: string): EmotionKey {
  const mapping: Record<string, EmotionKey> = {
    happy: 'happy',
    sad: 'sad',
    anxious: 'anxious',
    frustrated: 'angry',
    tired: 'tired',
    confused: 'confused',
    loved: 'happy',
    angry: 'angry',
    hurt: 'sad',
    peaceful: 'calm',
    worried: 'anxious',
    vulnerable: 'sad',
    disappointed: 'sad',
    content: 'calm',
    stressed: 'anxious',
    grateful: 'grateful',
    overwhelmed: 'overwhelmed',
    numb: 'neutral',
    hopeful: 'hopeful',
    guilty: 'sad',
    embarrassed: 'confused',
    skeptical: 'neutral',
    relieved: 'calm',
    uncertain: 'confused',
    excited: 'excited',
    lonely: 'lonely',
    calm: 'calm',
    neutral: 'neutral',
  };

  return mapping[mood.toLowerCase()] || 'neutral';
}

/**
 * Maps current app topic values to TopicKey from emotionEngine
 */
export function mapTopicToTopicKey(topic: string): TopicKey | null {
  const mapping: Record<string, TopicKey> = {
    school: 'work_school',
    work: 'work_school',
    family: 'family',
    friends: 'relationship',
    self_esteem: 'self_esteem',
    relationships: 'relationship',
    relationship: 'relationship',
    money: 'money',
    health: 'health',
    faith: 'faith',
    spiritual: 'faith',
    grief: 'grief_loss',
    loss: 'grief_loss',
    other: 'other',
  };

  if (!topic) return null;
  return mapping[topic.toLowerCase()] || 'other';
}

/**
 * Generate suggestions using the emotionEngine
 */
export function generateEngineBasedSuggestions(
  moodValues: string[],
  topicValue?: string | null
): {
  interpretation: string;
  suggestions: Suggestion[];
  isFallback: boolean;
  isMultiEmotion: boolean;
  emotionLabels: string[];
  topicLabel?: string;
} {
  if (moodValues.length === 0) {
    return {
      interpretation: 'No emotion selected',
      suggestions: [
        {
          id: 'fallback-1',
          type: 'action',
          title: 'Check in with yourself',
          body: 'Take a moment to notice how you\'re feeling',
        },
        {
          id: 'fallback-2',
          type: 'breathing',
          title: 'Simple breathing',
          body: 'Take 3 slow, deep breaths',
        },
      ],
      isFallback: true,
      isMultiEmotion: false,
      emotionLabels: [],
    };
  }

  // Map mood values to EmotionKey
  const emotionKeys = moodValues.map(mapMoodToEmotionKey);
  const primaryEmotionKey = emotionKeys[0];
  const primaryEmotion = emotions[primaryEmotionKey];

  if (!primaryEmotion) {
    return {
      interpretation: 'Unable to interpret emotion',
      suggestions: [],
      isFallback: true,
      isMultiEmotion: false,
      emotionLabels: [],
    };
  }

  // Build suggestion list
  const allSuggestions: Suggestion[] = [];
  const seenIds = new Set<string>();

  // Step 1: Add base suggestions from primary emotion
  for (const suggestion of primaryEmotion.baseSuggestions) {
    if (!seenIds.has(suggestion.id)) {
      allSuggestions.push(suggestion);
      seenIds.add(suggestion.id);
    }
  }

  // Step 2: Check for combo rules if multiple emotions
  if (emotionKeys.length > 1) {
    const sortedKeys = [...emotionKeys].sort();

    for (const combo of comboRules) {
      const sortedComboKeys = [...combo.emotions].sort();

      // Check if the combo matches (order doesn't matter)
      if (JSON.stringify(sortedKeys) === JSON.stringify(sortedComboKeys)) {
        for (const suggestion of combo.extraSuggestions) {
          if (!seenIds.has(suggestion.id)) {
            allSuggestions.push(suggestion);
            seenIds.add(suggestion.id);
          }
        }
        break;
      }
    }
  }

  // Step 3: Add topic suggestions if topic is provided
  let topicLabel: string | undefined;
  if (topicValue) {
    const topicKey = mapTopicToTopicKey(topicValue);
    if (topicKey) {
      const topicData = topics[topicKey];
      topicLabel = topicData.label;

      for (const suggestion of topicData.suggestions) {
        if (!seenIds.has(suggestion.id) && allSuggestions.length < 7) {
          allSuggestions.push(suggestion);
          seenIds.add(suggestion.id);
        }
      }
    }
  }

  // Limit to 5-7 suggestions
  const finalSuggestions = allSuggestions.slice(0, 7);

  // Build interpretation
  const emotionLabels = emotionKeys.map(key => emotions[key]?.label || key);
  let interpretation: string;

  if (emotionKeys.length === 1) {
    interpretation = primaryEmotion.description;
    if (topicLabel) {
      interpretation += ` This is about ${topicLabel.toLowerCase()}.`;
    }
  } else {
    // Check if there's a combo rule description
    const sortedKeys = [...emotionKeys].sort();
    let comboDescription = null;

    for (const combo of comboRules) {
      const sortedComboKeys = [...combo.emotions].sort();
      if (JSON.stringify(sortedKeys) === JSON.stringify(sortedComboKeys)) {
        comboDescription = combo.description;
        break;
      }
    }

    if (comboDescription) {
      interpretation = comboDescription;
    } else {
      interpretation = `You're feeling ${emotionLabels.join(' and ').toLowerCase()}—multiple emotions at once.`;
    }

    if (topicLabel) {
      interpretation += ` This is about ${topicLabel.toLowerCase()}.`;
    }
  }

  // Check if we need fallback message
  const isFallback = finalSuggestions.length < 3;

  if (isFallback) {
    // Add fallback suggestions
    const fallbackSuggestions: Suggestion[] = [
      {
        id: 'fallback-breath',
        type: 'breathing',
        title: 'Take a moment to breathe',
        body: 'Slow, calming breaths can help',
      },
      {
        id: 'fallback-step',
        type: 'action',
        title: 'One small step',
        body: 'Do one tiny thing to care for yourself',
      },
      {
        id: 'fallback-reach',
        type: 'action',
        title: 'Reach out',
        body: 'Connect with someone who cares',
      },
    ];

    for (const suggestion of fallbackSuggestions) {
      if (!seenIds.has(suggestion.id) && finalSuggestions.length < 3) {
        finalSuggestions.push(suggestion);
        seenIds.add(suggestion.id);
      }
    }
  }

  return {
    interpretation,
    suggestions: finalSuggestions,
    isFallback,
    isMultiEmotion: emotionKeys.length > 1,
    emotionLabels,
    topicLabel,
  };
}

/**
 * Get suggestion type styling (for UI rendering)
 */
export function getSuggestionTypeIcon(type: Suggestion['type']): string {
  const icons = {
    breathing: '🫁',
    grounding: '🌍',
    reframe: '💭',
    action: '✨',
    reflection: '🪞',
    gratitude: '🙏',
  };
  return icons[type] || '✨';
}

/**
 * Get suggestion type label (for UI rendering)
 */
export function getSuggestionTypeLabel(type: Suggestion['type']): string {
  const labels = {
    breathing: 'Breathing Exercise',
    grounding: 'Grounding Tool',
    reframe: 'Perspective Shift',
    action: 'Action Step',
    reflection: 'Reflection',
    gratitude: 'Gratitude Practice',
  };
  return labels[type] || 'Suggestion';
}

/**
 * Get suggestion type color (for UI rendering)
 */
export function getSuggestionTypeColor(type: Suggestion['type']): {
  bg: string;
  border: string;
  text: string;
} {
  const colors = {
    breathing: {
      bg: 'from-blue-50 to-cyan-50',
      border: 'border-blue-200',
      text: 'text-blue-700',
    },
    grounding: {
      bg: 'from-green-50 to-emerald-50',
      border: 'border-green-200',
      text: 'text-green-700',
    },
    reframe: {
      bg: 'from-purple-50 to-pink-50',
      border: 'border-purple-200',
      text: 'text-purple-700',
    },
    action: {
      bg: 'from-emerald-50 to-teal-50',
      border: 'border-emerald-200',
      text: 'text-emerald-700',
    },
    reflection: {
      bg: 'from-indigo-50 to-blue-50',
      border: 'border-indigo-200',
      text: 'text-indigo-700',
    },
    gratitude: {
      bg: 'from-amber-50 to-orange-50',
      border: 'border-amber-200',
      text: 'text-amber-700',
    },
  };
  return colors[type] || colors.action;
}
