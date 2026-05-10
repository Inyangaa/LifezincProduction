import { supabase } from '../lib/supabase';

export interface UserDemographics {
  age_range: string;
  gender: string;
  location?: string;
  interests?: string[];
  completed_at?: string;
}

export async function getUserDemographics(userId: string | undefined): Promise<UserDemographics | null> {
  if (!userId) {
    return null;
  }

  const { data } = await supabase
    .from('user_demographics')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  return data;
}

export function isChild(ageRange: string): boolean {
  return ageRange === 'Child (<13)';
}

export function isTeen(ageRange: string): boolean {
  return ageRange === 'Teen (13-17)';
}

export function isYoungAdult(ageRange: string): boolean {
  return ageRange === 'Young Adult (18-25)';
}

export function isAdult(ageRange: string): boolean {
  return ageRange === 'Adult (26-64)';
}

export function isSenior(ageRange: string): boolean {
  return ageRange === 'Senior (65+)';
}

export function getAgeAppropriateLanguage(ageRange: string): {
  tone: 'simple' | 'relatable' | 'mature' | 'professional';
  complexityLevel: 'basic' | 'intermediate' | 'advanced';
} {
  if (isChild(ageRange)) {
    return { tone: 'simple', complexityLevel: 'basic' };
  }
  if (isTeen(ageRange)) {
    return { tone: 'relatable', complexityLevel: 'intermediate' };
  }
  if (isYoungAdult(ageRange)) {
    return { tone: 'relatable', complexityLevel: 'intermediate' };
  }
  if (isSenior(ageRange)) {
    return { tone: 'professional', complexityLevel: 'intermediate' };
  }
  return { tone: 'mature', complexityLevel: 'advanced' };
}

export function getLocationBasedResources(location: string | undefined): {
  showFinancialHelp: boolean;
  showGovernmentResources: boolean;
  region?: string;
} {
  if (!location) {
    return {
      showFinancialHelp: true,
      showGovernmentResources: false
    };
  }

  const lowerLocation = location.toLowerCase();

  const usStates = ['california', 'new york', 'texas', 'florida', 'illinois', 'usa', 'united states'];
  const isUS = usStates.some(state => lowerLocation.includes(state));

  return {
    showFinancialHelp: true,
    showGovernmentResources: isUS,
    region: isUS ? 'US' : 'International'
  };
}

export function getInterestBasedActivities(interests: string[] | undefined): string[] {
  if (!interests || interests.length === 0) {
    return [
      'Take a short walk outside',
      'Practice deep breathing for 5 minutes',
      'Listen to calming music',
      'Write in a journal'
    ];
  }

  const activities: string[] = [];

  if (interests.includes('Sports & Fitness')) {
    activities.push('Go for a run or workout', 'Try a new fitness class', 'Practice yoga or stretching');
  }
  if (interests.includes('Arts & Creativity')) {
    activities.push('Draw or paint your feelings', 'Try a creative craft project', 'Create art as a form of expression');
  }
  if (interests.includes('Music')) {
    activities.push('Play an instrument', 'Create a mood-based playlist', 'Attend a live music event');
  }
  if (interests.includes('Reading & Writing')) {
    activities.push('Write in a journal', 'Read a uplifting book', 'Write a letter to yourself');
  }
  if (interests.includes('Gaming')) {
    activities.push('Play a calming game', 'Take a gaming break with friends', 'Try a mindfulness gaming app');
  }
  if (interests.includes('Nature & Outdoors')) {
    activities.push('Take a walk in nature', 'Spend time in a park', 'Practice outdoor meditation');
  }
  if (interests.includes('Technology')) {
    activities.push('Use a mental health app', 'Listen to a helpful podcast', 'Try a guided meditation app');
  }
  if (interests.includes('Social Activities')) {
    activities.push('Connect with a friend', 'Join a support group', 'Attend a community event');
  }
  if (interests.includes('Spirituality & Faith')) {
    activities.push('Pray or meditate', 'Read spiritual texts', 'Attend a faith service');
  }
  if (interests.includes('Volunteering')) {
    activities.push('Volunteer for a cause', 'Help someone in need', 'Join a community service project');
  }

  return activities.length > 0 ? activities : [
    'Take a short walk outside',
    'Practice deep breathing for 5 minutes',
    'Listen to calming music',
    'Write in a journal'
  ];
}
