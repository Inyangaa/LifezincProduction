import { EmojiSuggestion, getEmojiData, getMultiEmojiInterpretation } from '../data/emojiSuggestions';
import { getTopicData } from '../data/topicSuggestions';
import { generateEngineBasedSuggestions, Suggestion } from './emotionEngineAdapter';

export interface IntelligentSuggestionResult {
  interpretation: string;
  suggestions: EmojiSuggestion[];
  isFallback: boolean;
  isMultiEmotion: boolean;
  emotionLabels: string[];
  topicLabel?: string;
}

/**
 * Generate intelligent suggestions based on emoji(s) and optional topic
 * This is the main engine that combines emotion + topic context
 * Now powered by emotionEngine.ts for more comprehensive, emotion-specific guidance
 */
export function generateIntelligentSuggestions(
  emojiValues: string[],
  topicValue?: string | null
): IntelligentSuggestionResult {
  // Use the new emotionEngine-based system
  const engineResult = generateEngineBasedSuggestions(emojiValues, topicValue);

  // Convert Suggestion[] from emotionEngine to EmojiSuggestion[] format
  const convertedSuggestions: EmojiSuggestion[] = engineResult.suggestions.map(s => ({
    type: mapSuggestionType(s.type),
    title: s.title,
    description: s.body,
  }));

  return {
    interpretation: engineResult.interpretation,
    suggestions: convertedSuggestions,
    isFallback: engineResult.isFallback,
    isMultiEmotion: engineResult.isMultiEmotion,
    emotionLabels: engineResult.emotionLabels,
    topicLabel: engineResult.topicLabel,
  };
}

/**
 * Map emotionEngine suggestion types to EmojiSuggestion types
 */
function mapSuggestionType(engineType: Suggestion['type']): EmojiSuggestion['type'] {
  const mapping: Record<Suggestion['type'], EmojiSuggestion['type']> = {
    breathing: 'breathing',
    grounding: 'breathing',
    reframe: 'reframe',
    action: 'action',
    reflection: 'support',
    gratitude: 'support',
  };
  return mapping[engineType] || 'action';
}

/**
 * Merge emotion and topic suggestions intelligently
 * Prioritizes emotion suggestions first, then adds relevant topic suggestions
 */
function mergeEmotionTopicSuggestions(
  emotionSuggestions: EmojiSuggestion[],
  topicSuggestions: EmojiSuggestion[]
): EmojiSuggestion[] {
  const merged: EmojiSuggestion[] = [];
  const seenTitles = new Set<string>();

  // Add emotion suggestions first (priority)
  for (const suggestion of emotionSuggestions) {
    if (!seenTitles.has(suggestion.title)) {
      merged.push(suggestion);
      seenTitles.add(suggestion.title);
    }
  }

  // Add topic suggestions that don't duplicate
  for (const suggestion of topicSuggestions) {
    if (!seenTitles.has(suggestion.title) && merged.length < 5) {
      merged.push(suggestion);
      seenTitles.add(suggestion.title);
    }
  }

  // Ensure we have at least 3 suggestions
  if (merged.length < 3) {
    const fallbackSuggestions: EmojiSuggestion[] = [
      { type: 'breathing', title: 'Take a moment to breathe', description: 'Slow, calming breaths can help' },
      { type: 'action', title: 'One small step', description: 'Do one tiny thing to care for yourself' },
      { type: 'support', title: 'Reach out', description: 'Connect with someone who cares' },
    ];

    for (const suggestion of fallbackSuggestions) {
      if (!seenTitles.has(suggestion.title) && merged.length < 3) {
        merged.push(suggestion);
        seenTitles.add(suggestion.title);
      }
    }
  }

  return merged.slice(0, 5); // Max 5 suggestions
}

/**
 * Get a user-friendly description of the suggestion type
 */
export function getSuggestionTypeLabel(type: EmojiSuggestion['type']): string {
  const labels = {
    breathing: '🫁 Breathing Exercise',
    reframe: '💭 Perspective Shift',
    action: '✨ Action Step',
    support: '🤝 Support Tool',
  };
  return labels[type] || type;
}

/**
 * Get color styling for suggestion type
 */
export function getSuggestionTypeColor(type: EmojiSuggestion['type']): {
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
    support: {
      bg: 'from-amber-50 to-orange-50',
      border: 'border-amber-200',
      text: 'text-amber-700',
    },
  };
  return colors[type] || colors.action;
}
