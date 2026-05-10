export interface EmojiSuggestion {
  type: 'breathing' | 'reframe' | 'action' | 'support';
  title: string;
  description: string;
}

export interface EmojiData {
  emoji: string;
  value: string;
  label: string;
  meaning: string;
  category: 'positive' | 'neutral' | 'negative' | 'complex';
  suggestions: EmojiSuggestion[];
}

export const emojiDatabase: Record<string, EmojiData> = {
  happy: {
    emoji: '😊',
    value: 'happy',
    label: 'Happy',
    meaning: 'Feeling joy, contentment, and positive energy',
    category: 'positive',
    suggestions: [
      { type: 'action', title: 'Capture this moment', description: 'Write down what\'s making you happy to remember it later' },
      { type: 'reframe', title: 'Spread positivity', description: 'Share your good mood with someone who might need it' },
      { type: 'action', title: 'Build on this energy', description: 'Use this positive momentum to start something you\'ve been putting off' },
    ],
  },
  sad: {
    emoji: '😔',
    value: 'sad',
    label: 'Sad',
    meaning: 'Feeling down, melancholy, or experiencing low mood',
    category: 'negative',
    suggestions: [
      { type: 'breathing', title: 'Gentle breathing', description: 'Take slow, calming breaths to soothe your nervous system' },
      { type: 'reframe', title: 'This will pass', description: 'Sadness is temporary; you won\'t feel this way forever' },
      { type: 'support', title: 'Reach out', description: 'Connect with someone who cares about you' },
      { type: 'action', title: 'One small comfort', description: 'Do something gentle that usually brings you peace' },
    ],
  },
  anxious: {
    emoji: '😰',
    value: 'anxious',
    label: 'Anxious',
    meaning: 'Feeling worried, nervous, or experiencing racing thoughts',
    category: 'negative',
    suggestions: [
      { type: 'breathing', title: 'Box breathing', description: 'Breathe in 4, hold 4, out 4, hold 4 - calm your nervous system' },
      { type: 'reframe', title: 'Ground in the present', description: 'Anxiety is about the future; what\'s true RIGHT NOW?' },
      { type: 'action', title: '5-4-3-2-1 technique', description: 'Name 5 things you see, 4 you feel, 3 you hear, 2 you smell, 1 you taste' },
      { type: 'support', title: 'Write your worries', description: 'Get anxious thoughts out of your head and onto paper' },
    ],
  },
  frustrated: {
    emoji: '😤',
    value: 'frustrated',
    label: 'Frustrated',
    meaning: 'Feeling stuck, blocked, or unable to make progress',
    category: 'negative',
    suggestions: [
      { type: 'breathing', title: 'Release tension', description: 'Exhale forcefully to release built-up frustration' },
      { type: 'reframe', title: 'Frustration shows you care', description: 'You\'re frustrated because this matters to you' },
      { type: 'action', title: 'Change your approach', description: 'Step back and try a different angle' },
      { type: 'support', title: 'Take a strategic break', description: 'Walk away for 10 minutes, then return with fresh eyes' },
    ],
  },
  tired: {
    emoji: '😴',
    value: 'tired',
    label: 'Tired',
    meaning: 'Feeling exhausted, drained, or lacking energy',
    category: 'negative',
    suggestions: [
      { type: 'breathing', title: 'Energy restore breath', description: 'Slow, deep breaths to give your body rest' },
      { type: 'reframe', title: 'Rest is productive', description: 'Your body and mind need recovery time' },
      { type: 'action', title: 'Micro-rest', description: 'Take a 10-minute power rest or close your eyes' },
      { type: 'support', title: 'Lower expectations today', description: 'Do the bare minimum; rest is your priority' },
    ],
  },
  confused: {
    emoji: '🤔',
    value: 'confused',
    label: 'Confused',
    meaning: 'Feeling uncertain, unclear, or unable to understand the situation',
    category: 'neutral',
    suggestions: [
      { type: 'reframe', title: 'Confusion precedes clarity', description: 'Not knowing is the first step to understanding' },
      { type: 'action', title: 'Write down the questions', description: 'List what confuses you to make it concrete' },
      { type: 'support', title: 'Ask for perspective', description: 'Talk it through with someone who might see it differently' },
      { type: 'action', title: 'Break it into pieces', description: 'Divide the confusing situation into smaller parts' },
    ],
  },
  loved: {
    emoji: '😍',
    value: 'loved',
    label: 'Loved',
    meaning: 'Feeling cherished, appreciated, or deeply connected to someone',
    category: 'positive',
    suggestions: [
      { type: 'action', title: 'Express gratitude', description: 'Tell the person how much they mean to you' },
      { type: 'reframe', title: 'Savor this connection', description: 'Take a moment to fully feel and appreciate this love' },
      { type: 'action', title: 'Show love back', description: 'Do something thoughtful for the person who makes you feel loved' },
    ],
  },
  angry: {
    emoji: '😡',
    value: 'angry',
    label: 'Angry',
    meaning: 'Feeling intense frustration, rage, or boundary violations',
    category: 'negative',
    suggestions: [
      { type: 'breathing', title: 'Cooling breath', description: 'Breathe out slowly to release the heat of anger' },
      { type: 'reframe', title: 'Anger is information', description: 'Your anger is telling you a boundary was crossed' },
      { type: 'action', title: 'Physical release', description: 'Move your body - walk, jump, or exercise to process anger' },
      { type: 'support', title: 'Write before speaking', description: 'Get your angry thoughts on paper before responding' },
    ],
  },
  hurt: {
    emoji: '😢',
    value: 'hurt',
    label: 'Hurt',
    meaning: 'Feeling emotional pain, wounded, or rejected',
    category: 'negative',
    suggestions: [
      { type: 'breathing', title: 'Healing breath', description: 'Breathe slowly and imagine healing with each breath' },
      { type: 'reframe', title: 'Your pain is valid', description: 'You don\'t need to minimize or hide your hurt' },
      { type: 'support', title: 'Self-compassion', description: 'Treat yourself with the kindness you\'d give a hurting friend' },
      { type: 'action', title: 'Honor your feelings', description: 'Let yourself cry, journal, or express the hurt' },
    ],
  },
  peaceful: {
    emoji: '😌',
    value: 'peaceful',
    label: 'Peaceful',
    meaning: 'Feeling calm, serene, and at ease',
    category: 'positive',
    suggestions: [
      { type: 'breathing', title: 'Deepen the calm', description: 'Breathe slowly to extend and savor this peace' },
      { type: 'reframe', title: 'Anchor this feeling', description: 'Remember what peace feels like for difficult times' },
      { type: 'action', title: 'Mindful moment', description: 'Sit quietly and fully experience this tranquility' },
    ],
  },
  worried: {
    emoji: '😟',
    value: 'worried',
    label: 'Worried',
    meaning: 'Feeling concerned, uneasy, or anticipating problems',
    category: 'negative',
    suggestions: [
      { type: 'breathing', title: 'Worry release breath', description: 'Exhale your worries with each out-breath' },
      { type: 'reframe', title: 'Worry vs. reality', description: 'Is this happening now, or are you imagining future problems?' },
      { type: 'action', title: 'Action plan', description: 'If you can do something about it, make a plan; if not, let it go' },
      { type: 'support', title: 'Reality check', description: 'Ask yourself: what\'s the most likely outcome?' },
    ],
  },
  vulnerable: {
    emoji: '🥺',
    value: 'vulnerable',
    label: 'Vulnerable',
    meaning: 'Feeling exposed, tender, or emotionally open',
    category: 'complex',
    suggestions: [
      { type: 'reframe', title: 'Vulnerability is strength', description: 'Being open takes tremendous courage' },
      { type: 'support', title: 'Safe space', description: 'Choose carefully who you share vulnerability with' },
      { type: 'action', title: 'Self-protection', description: 'It\'s okay to protect yourself while being authentic' },
      { type: 'breathing', title: 'Gentle self-care', description: 'Be extra kind to yourself when feeling vulnerable' },
    ],
  },
  disappointed: {
    emoji: '😞',
    value: 'disappointed',
    label: 'Disappointed',
    meaning: 'Feeling let down when expectations aren\'t met',
    category: 'negative',
    suggestions: [
      { type: 'reframe', title: 'Expectations vs. reality', description: 'Disappointment shows you had hope - that\'s not weakness' },
      { type: 'breathing', title: 'Release disappointment', description: 'Breathe out what didn\'t happen, breathe in acceptance' },
      { type: 'action', title: 'Adjust expectations', description: 'What can you realistically hope for now?' },
      { type: 'support', title: 'Honor your feelings', description: 'It\'s okay to feel disappointed; you don\'t have to be fine' },
    ],
  },
  content: {
    emoji: '🙂',
    value: 'content',
    label: 'Content',
    meaning: 'Feeling satisfied and at peace with how things are',
    category: 'positive',
    suggestions: [
      { type: 'reframe', title: 'Appreciate contentment', description: 'Contentment is underrated - savor this steady state' },
      { type: 'action', title: 'Gratitude reflection', description: 'Think about what\'s contributing to this contentment' },
      { type: 'breathing', title: 'Rest in this moment', description: 'Simply be present with this feeling of okayness' },
    ],
  },
  stressed: {
    emoji: '😣',
    value: 'stressed',
    label: 'Stressed',
    meaning: 'Feeling pressure, tension, or overwhelmed by demands',
    category: 'negative',
    suggestions: [
      { type: 'breathing', title: 'Stress-relief breath', description: 'Deep breathing activates your relaxation response' },
      { type: 'reframe', title: 'You can\'t do everything', description: 'What can you drop or delegate?' },
      { type: 'action', title: 'One thing at a time', description: 'Pick the most important task and ignore the rest for now' },
      { type: 'support', title: 'Ask for help', description: 'Stress is a signal you need support' },
    ],
  },
  grateful: {
    emoji: '🤗',
    value: 'grateful',
    label: 'Grateful',
    meaning: 'Feeling thankful and appreciative',
    category: 'positive',
    suggestions: [
      { type: 'action', title: 'Express gratitude', description: 'Tell someone or write about what you\'re thankful for' },
      { type: 'reframe', title: 'Gratitude amplifies good', description: 'Appreciating what you have increases wellbeing' },
      { type: 'action', title: 'Pay it forward', description: 'Do something kind for someone else' },
    ],
  },
  overwhelmed: {
    emoji: '😩',
    value: 'overwhelmed',
    label: 'Overwhelmed',
    meaning: 'Feeling like there\'s too much to handle',
    category: 'negative',
    suggestions: [
      { type: 'breathing', title: 'Grounding breath', description: 'Come back to your body with slow, deep breaths' },
      { type: 'reframe', title: 'You only need to do the next thing', description: 'Not everything, just the next small step' },
      { type: 'action', title: 'Brain dump', description: 'Write down everything overwhelming you, then pick ONE thing' },
      { type: 'support', title: 'Emergency self-care', description: 'What do you need to survive the next hour? Do that.' },
    ],
  },
  numb: {
    emoji: '😐',
    value: 'numb',
    label: 'Numb',
    meaning: 'Feeling disconnected, emotionally flat, or shut down',
    category: 'complex',
    suggestions: [
      { type: 'reframe', title: 'Numbness is protection', description: 'Your mind is protecting you from feeling too much' },
      { type: 'breathing', title: 'Body scan', description: 'Slowly notice sensations in your body to reconnect' },
      { type: 'action', title: 'Sensory engagement', description: 'Touch something textured, listen to music, or move your body' },
      { type: 'support', title: 'Professional support', description: 'If numbness persists, consider talking to a therapist' },
    ],
  },
  hopeful: {
    emoji: '🥰',
    value: 'hopeful',
    label: 'Hopeful',
    meaning: 'Feeling optimistic about the future',
    category: 'positive',
    suggestions: [
      { type: 'action', title: 'Set an intention', description: 'What do you hope for? Write it down' },
      { type: 'reframe', title: 'Hope is powerful', description: 'Hope helps you see possibilities' },
      { type: 'action', title: 'Take one small step', description: 'Move toward what you hope for with one tiny action' },
    ],
  },
  guilty: {
    emoji: '😖',
    value: 'guilty',
    label: 'Guilty',
    meaning: 'Feeling remorse or responsibility for something wrong',
    category: 'negative',
    suggestions: [
      { type: 'reframe', title: 'Guilt shows conscience', description: 'Feeling guilty means you have values' },
      { type: 'action', title: 'Make amends if possible', description: 'If you can make it right, do so; if not, forgive yourself' },
      { type: 'support', title: 'Self-forgiveness', description: 'Learn from this and move forward with compassion' },
      { type: 'breathing', title: 'Release guilt', description: 'Breathe out shame, breathe in self-compassion' },
    ],
  },
  embarrassed: {
    emoji: '😳',
    value: 'embarrassed',
    label: 'Embarrassed',
    meaning: 'Feeling self-conscious or ashamed about something',
    category: 'negative',
    suggestions: [
      { type: 'reframe', title: 'Everyone has embarrassing moments', description: 'This will fade faster than you think' },
      { type: 'breathing', title: 'Cool the blush', description: 'Breathe slowly to calm your nervous system' },
      { type: 'action', title: 'Humor helps', description: 'If you can laugh at yourself, others will move on faster' },
      { type: 'support', title: 'Perspective', description: 'Will this matter in a year? Probably not.' },
    ],
  },
  skeptical: {
    emoji: '🤨',
    value: 'skeptical',
    label: 'Skeptical',
    meaning: 'Feeling doubtful or questioning',
    category: 'neutral',
    suggestions: [
      { type: 'reframe', title: 'Skepticism is wisdom', description: 'Questioning things shows critical thinking' },
      { type: 'action', title: 'Gather information', description: 'Look for evidence before deciding' },
      { type: 'support', title: 'Trust your gut', description: 'Your skepticism might be protecting you' },
    ],
  },
  relieved: {
    emoji: '😌',
    value: 'relieved',
    label: 'Relieved',
    meaning: 'Feeling release from stress or worry',
    category: 'positive',
    suggestions: [
      { type: 'breathing', title: 'Sigh of relief', description: 'Take a big exhale to release the tension' },
      { type: 'reframe', title: 'Notice what passed', description: 'Relief shows you were carrying something heavy' },
      { type: 'action', title: 'Rest now', description: 'Give yourself permission to recover from the stress' },
    ],
  },
  uncertain: {
    emoji: '😕',
    value: 'uncertain',
    label: 'Uncertain',
    meaning: 'Feeling unsure or lacking clarity about what to do',
    category: 'neutral',
    suggestions: [
      { type: 'reframe', title: 'Uncertainty is normal', description: 'You don\'t have to know everything right now' },
      { type: 'action', title: 'Gather information', description: 'What do you need to know to feel more certain?' },
      { type: 'support', title: 'One small step', description: 'Do one tiny thing to move forward, even in uncertainty' },
      { type: 'breathing', title: 'Breathe through discomfort', description: 'Uncertainty is uncomfortable, but you can handle it' },
    ],
  },
};

// Emoji combination rules
export interface CombinationRule {
  emojis: string[];
  interpretation: string;
  suggestions: EmojiSuggestion[];
}

export const emojiCombinations: CombinationRule[] = [
  {
    emojis: ['sad', 'stressed'],
    interpretation: 'Feeling sad and under pressure - you need both emotional support and stress relief',
    suggestions: [
      { type: 'breathing', title: 'Calming + grounding breath', description: 'Slow breaths to calm both sadness and stress' },
      { type: 'support', title: 'Reach out for support', description: 'You\'re carrying a lot - connect with someone' },
      { type: 'action', title: 'One tiny task only', description: 'Do the smallest possible thing, then rest' },
    ],
  },
  {
    emojis: ['happy', 'tired'],
    interpretation: 'Feeling good but exhausted - mixed emotions need balanced support',
    suggestions: [
      { type: 'reframe', title: 'Joy and exhaustion can coexist', description: 'You can be happy AND need rest' },
      { type: 'action', title: 'Celebrate, then rest', description: 'Honor your happiness, but also honor your tiredness' },
      { type: 'breathing', title: 'Energizing rest', description: 'Breathe to restore energy while maintaining positivity' },
    ],
  },
  {
    emojis: ['angry', 'worried'],
    interpretation: 'Feeling anger and anxiety - you need emotional regulation and grounding',
    suggestions: [
      { type: 'breathing', title: 'Cooling + grounding breath', description: 'Release anger while anchoring to the present' },
      { type: 'reframe', title: 'Both feelings are valid', description: 'Anger and worry can happen together' },
      { type: 'action', title: 'Physical release first', description: 'Move your body to process anger, then address worries' },
      { type: 'support', title: 'Write it all out', description: 'Journal both the anger and the worry' },
    ],
  },
  {
    emojis: ['sad', 'anxious'],
    interpretation: 'Feeling sad and anxious - you need soothing and grounding support',
    suggestions: [
      { type: 'breathing', title: 'Gentle, grounding breath', description: 'Calm both the sadness and the anxiety' },
      { type: 'support', title: 'Connect with safety', description: 'Reach out to someone who makes you feel safe' },
      { type: 'action', title: 'Comfort first, problem-solving later', description: 'Focus on soothing yourself before anything else' },
    ],
  },
  {
    emojis: ['frustrated', 'tired'],
    interpretation: 'Feeling frustrated and exhausted - lower expectations and rest',
    suggestions: [
      { type: 'reframe', title: 'It\'s okay to stop trying right now', description: 'Frustration + exhaustion = time to pause' },
      { type: 'action', title: 'Drop everything non-essential', description: 'What can you just... not do today?' },
      { type: 'breathing', title: 'Release + restore', description: 'Let go of frustration and breathe in rest' },
    ],
  },
  {
    emojis: ['grateful', 'sad'],
    interpretation: 'Mixed feelings of gratitude and sadness - both are valid',
    suggestions: [
      { type: 'reframe', title: 'You can feel both', description: 'Gratitude and sadness often coexist in meaningful moments' },
      { type: 'action', title: 'Honor both feelings', description: 'Write about what you\'re grateful for AND what hurts' },
      { type: 'breathing', title: 'Breathe with complexity', description: 'Allow yourself to feel the full range' },
    ],
  },
  {
    emojis: ['overwhelmed', 'anxious'],
    interpretation: 'Feeling overwhelmed and anxious - you need immediate grounding',
    suggestions: [
      { type: 'breathing', title: 'Emergency grounding', description: 'Box breathing: 4-4-4-4 to calm your system' },
      { type: 'action', title: 'Stop everything', description: 'Put down all tasks. Just breathe for 2 minutes.' },
      { type: 'support', title: 'One thing at a time', description: 'List everything, then do ONLY the most urgent thing' },
    ],
  },
  {
    emojis: ['stressed', 'worried'],
    interpretation: 'Feeling stressed and worried - high anxiety state needs calming',
    suggestions: [
      { type: 'breathing', title: 'Extended exhale breath', description: 'Breathe out longer than in to calm your nervous system' },
      { type: 'reframe', title: 'Worry + stress = over-activated mind', description: 'Your nervous system needs soothing' },
      { type: 'action', title: 'Physical grounding', description: 'Put your feet on the floor, feel your body, return to now' },
    ],
  },
];

export function getEmojiData(emojiValue: string): EmojiData | null {
  return emojiDatabase[emojiValue] || null;
}

export function getMultiEmojiInterpretation(emojiValues: string[]): {
  interpretation: string;
  suggestions: EmojiSuggestion[];
  isCombination: boolean;
} {
  if (emojiValues.length === 0) {
    return {
      interpretation: '',
      suggestions: [],
      isCombination: false,
    };
  }

  if (emojiValues.length === 1) {
    const emojiData = getEmojiData(emojiValues[0]);
    return {
      interpretation: emojiData?.meaning || '',
      suggestions: emojiData?.suggestions || [],
      isCombination: false,
    };
  }

  // Check for exact combination match
  const sortedEmojis = [...emojiValues].sort();
  for (const combo of emojiCombinations) {
    const sortedComboEmojis = [...combo.emojis].sort();
    if (JSON.stringify(sortedEmojis) === JSON.stringify(sortedComboEmojis)) {
      return {
        interpretation: combo.interpretation,
        suggestions: combo.suggestions,
        isCombination: true,
      };
    }
  }

  // Fallback: blend suggestions from all selected emojis
  const allSuggestions: EmojiSuggestion[] = [];
  const meanings: string[] = [];

  emojiValues.forEach(value => {
    const emojiData = getEmojiData(value);
    if (emojiData) {
      meanings.push(emojiData.label.toLowerCase());
      allSuggestions.push(...emojiData.suggestions);
    }
  });

  // Remove duplicates
  const uniqueSuggestions = allSuggestions.filter((suggestion, index, self) =>
    index === self.findIndex((s) => s.title === suggestion.title)
  );

  return {
    interpretation: `Feeling ${meanings.join(' and ')} - you\'re experiencing multiple emotions at once`,
    suggestions: uniqueSuggestions.slice(0, 4), // Limit to 4 suggestions
    isCombination: true,
  };
}
