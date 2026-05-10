import { EmojiSuggestion } from './emojiSuggestions';

export interface TopicData {
  value: string;
  label: string;
  emoji: string;
  description: string;
  suggestions: EmojiSuggestion[];
}

export const topicDatabase: Record<string, TopicData> = {
  school: {
    value: 'school',
    label: 'School / Academics',
    emoji: '📚',
    description: 'Academic pressures, studying, grades, or school relationships',
    suggestions: [
      { type: 'action', title: 'Study for 20 minutes only', description: 'Start small to build momentum' },
      { type: 'support', title: 'Reach out for academic help', description: 'Talk to a teacher, tutor, or counselor' },
      { type: 'reframe', title: 'Learning takes time', description: 'Struggling doesn\'t mean failing' },
    ],
  },
  family: {
    value: 'family',
    label: 'Family',
    emoji: '👨‍👩‍👧‍👦',
    description: 'Family dynamics, conflicts, or relationships',
    suggestions: [
      { type: 'breathing', title: 'Family stress relief', description: 'Take space to calm down before engaging' },
      { type: 'action', title: 'Set a boundary', description: 'It\'s okay to protect your peace' },
      { type: 'support', title: 'Talk to someone outside the family', description: 'Get perspective from a neutral person' },
    ],
  },
  friends: {
    value: 'friends',
    label: 'Friends / Social',
    emoji: '🤝',
    description: 'Friendships, social anxiety, or peer relationships',
    suggestions: [
      { type: 'action', title: 'Reach out to one friend', description: 'Send a simple message to connect' },
      { type: 'reframe', title: 'Quality over quantity', description: 'You don\'t need many friends, just real ones' },
      { type: 'support', title: 'Social rest is okay', description: 'It\'s fine to take a break from socializing' },
    ],
  },
  self_esteem: {
    value: 'self_esteem',
    label: 'Self-Esteem',
    emoji: '🧠',
    description: 'How you see yourself, confidence, or self-worth',
    suggestions: [
      { type: 'reframe', title: 'You are enough', description: 'Your worth isn\'t based on achievement or approval' },
      { type: 'action', title: 'List 3 things you like about yourself', description: 'Even small things count' },
      { type: 'support', title: 'Self-compassion practice', description: 'Talk to yourself like you would a good friend' },
    ],
  },
  relationships: {
    value: 'relationships',
    label: 'Relationships',
    emoji: '💛',
    description: 'Romantic relationships, dating, or relationship challenges',
    suggestions: [
      { type: 'breathing', title: 'Relationship calm', description: 'Breathe before responding in conflict' },
      { type: 'action', title: 'Communicate clearly', description: 'Express your needs without blame' },
      { type: 'reframe', title: 'Healthy relationships take work', description: 'Conflict doesn\'t mean failure' },
    ],
  },
  work: {
    value: 'work',
    label: 'Work / Goals',
    emoji: '💼',
    description: 'Job stress, career, or professional goals',
    suggestions: [
      { type: 'action', title: 'Prioritize one task', description: 'What\'s the most important thing right now?' },
      { type: 'breathing', title: 'Work stress release', description: 'Take a 5-minute break to reset' },
      { type: 'reframe', title: 'Your job isn\'t your identity', description: 'Work struggles don\'t define your worth' },
    ],
  },
  money: {
    value: 'money',
    label: 'Money / Stress',
    emoji: '💸',
    description: 'Financial worries, money management, or economic stress',
    suggestions: [
      { type: 'breathing', title: 'Financial anxiety relief', description: 'Money stress activates fear - calm your nervous system' },
      { type: 'action', title: 'One small financial step', description: 'What\'s ONE tiny thing you can do about this?' },
      { type: 'reframe', title: 'Money problems are solvable', description: 'This situation is temporary' },
    ],
  },
  health: {
    value: 'health',
    label: 'Health / Physical',
    emoji: '🏥',
    description: 'Physical health, illness, or body concerns',
    suggestions: [
      { type: 'breathing', title: 'Body-focused calm', description: 'Breathe slowly to support your physical wellbeing' },
      { type: 'action', title: 'One gentle self-care act', description: 'Do something nurturing for your body' },
      { type: 'reframe', title: 'Your body is doing its best', description: 'Health challenges are hard; be compassionate' },
    ],
  },
  other: {
    value: 'other',
    label: 'Other',
    emoji: '❓',
    description: 'Other situations not listed above',
    suggestions: [
      { type: 'action', title: 'Name what\'s bothering you', description: 'Sometimes just identifying it helps' },
      { type: 'breathing', title: 'General calming breath', description: 'Whatever it is, start with breathing' },
      { type: 'support', title: 'Reach out', description: 'Talk to someone you trust' },
    ],
  },
};

export function getTopicData(topicValue: string): TopicData | null {
  return topicDatabase[topicValue] || null;
}
