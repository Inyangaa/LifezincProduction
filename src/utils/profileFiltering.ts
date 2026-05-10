import { Suggestion } from './emotionEngineAdapter';

export interface UserProfile {
  age_group: string;
  life_stage?: string;
  support_style: string;
  crisis_sensitivity: string;
  goal_focus: string[];
  nickname?: string;
}

export function isTeen(ageGroup: string): boolean {
  return ageGroup === '13-15' || ageGroup === '16-17';
}

export function isYoungAdult(ageGroup: string): boolean {
  return ageGroup === '18-24';
}

export function isAdult(ageGroup: string): boolean {
  return ageGroup === '25-40' || ageGroup === '40+';
}

const TEEN_UNSAFE_KEYWORDS = [
  'divorce', 'marriage', 'spouse', 'partner',
  'mortgage', 'taxes', 'career change',
  'trauma therapy', 'deep trauma',
  'professional counseling', 'clinical',
  'adult relationship', 'sexual',
  'financial independence'
];

const HIGH_CRISIS_ONLY_TYPES: Suggestion['type'][] = ['breathing', 'grounding'];

export function filterSuggestionsByAge(
  suggestions: Suggestion[],
  ageGroup: string
): Suggestion[] {
  if (isTeen(ageGroup)) {
    return suggestions.filter(suggestion => {
      const combinedText = `${suggestion.title} ${suggestion.body}`.toLowerCase();

      return !TEEN_UNSAFE_KEYWORDS.some(keyword =>
        combinedText.includes(keyword)
      );
    }).map(suggestion => ({
      ...suggestion,
      body: adjustToneForTeens(suggestion.body)
    }));
  }

  if (isYoungAdult(ageGroup)) {
    return suggestions.map(suggestion => ({
      ...suggestion,
      body: adjustToneForYoungAdults(suggestion.body)
    }));
  }

  return suggestions;
}

export function filterSuggestionsByCrisisSensitivity(
  suggestions: Suggestion[],
  crisisSensitivity: string
): Suggestion[] {
  if (crisisSensitivity === 'High') {
    return suggestions
      .filter(s => HIGH_CRISIS_ONLY_TYPES.includes(s.type))
      .slice(0, 3);
  }

  if (crisisSensitivity === 'Medium') {
    return suggestions.map(suggestion => ({
      ...suggestion,
      body: softenIntenseLanguage(suggestion.body)
    }));
  }

  return suggestions;
}

export function adjustToneForSupportStyle(
  suggestions: Suggestion[],
  supportStyle: string
): Suggestion[] {
  switch (supportStyle) {
    case 'Soft':
      return suggestions.map(s => ({
        ...s,
        body: makeSoftTone(s.body)
      }));

    case 'Direct':
      return suggestions.map(s => ({
        ...s,
        body: makeDirectTone(s.body)
      }));

    case 'Faith-based':
      return suggestions.map(s => ({
        ...s,
        body: addFaithPerspective(s.body)
      }));

    case 'Scientific':
      return suggestions.map(s => ({
        ...s,
        body: addScientificFraming(s.body)
      }));

    case 'Balanced':
    default:
      return suggestions;
  }
}

export function filterSuggestions(
  suggestions: Suggestion[],
  userProfile: UserProfile | null
): Suggestion[] {
  if (!userProfile) {
    return suggestions;
  }

  let filtered = [...suggestions];

  filtered = filterSuggestionsByAge(filtered, userProfile.age_group);

  filtered = filterSuggestionsByCrisisSensitivity(filtered, userProfile.crisis_sensitivity);

  filtered = adjustToneForSupportStyle(filtered, userProfile.support_style);

  return filtered;
}

function adjustToneForTeens(text: string): string {
  return text
    .replace(/You're /g, "You're ")
    .replace(/you'll /g, "you'll ")
    .replace(/Can you /g, "Can you ")
    .replace(/Try /g, "You could try ");
}

function adjustToneForYoungAdults(text: string): string {
  return text
    .replace(/sweetie|honey|dear/gi, '')
    .trim();
}

function softenIntenseLanguage(text: string): string {
  return text
    .replace(/must|should/gi, 'might')
    .replace(/need to/gi, 'could')
    .replace(/have to/gi, 'can')
    .replace(/trauma/gi, 'difficult experience')
    .replace(/crisis/gi, 'hard moment');
}

function makeSoftTone(text: string): string {
  if (text.includes('Take ') && !text.includes('gently')) {
    text = text.replace('Take ', 'Gently take ');
  }

  if (!text.includes('It\'s okay')) {
    text = 'It\'s okay. ' + text;
  }

  return text;
}

function makeDirectTone(text: string): string {
  return text
    .replace(/maybe|perhaps|might want to/gi, 'should')
    .replace(/consider /gi, '')
    .replace(/It\'s okay. /gi, '')
    .replace(/gently /gi, '');
}

function addFaithPerspective(text: string): string {
  if (text.includes('breathe') || text.includes('breath')) {
    return text + ' You might also find comfort in prayer or reflection.';
  }

  if (text.includes('gratitude') || text.includes('thankful')) {
    return text + ' Give thanks for the strength you\'re being given.';
  }

  return text;
}

function addScientificFraming(text: string): string {
  if (text.includes('anxious') || text.includes('worry')) {
    return text + ' (This activates your parasympathetic nervous system.)';
  }

  if (text.includes('breath') || text.includes('breathing')) {
    return text + ' (Deep breathing reduces cortisol and activates the vagus nerve.)';
  }

  return text;
}

export function getGreeting(userProfile: UserProfile | null): string {
  if (!userProfile) {
    return 'Welcome';
  }

  const name = userProfile.nickname || 'there';

  const hour = new Date().getHours();
  let timeGreeting = 'Hello';
  if (hour < 12) timeGreeting = 'Good morning';
  else if (hour < 18) timeGreeting = 'Good afternoon';
  else timeGreeting = 'Good evening';

  return `${timeGreeting}, ${name}`;
}
