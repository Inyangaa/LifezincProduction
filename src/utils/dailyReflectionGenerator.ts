const reflections = [
  "You are growing in ways you can't see yet.",
  "Your mind deserves rest as much as your body.",
  "One small step today is enough.",
  "Your presence is needed in this world.",
  "You're allowed to slow down. Clarity will follow.",
  "Even difficult emotions are teachers.",
  "Progress isn't always visible, but it's happening.",
  "Be gentle with yourself today.",
  "Your story isn't finished yet.",
  "Small acts of self-care create big changes.",
  "It's okay to not have all the answers right now.",
  "You're doing better than you think.",
  "Healing isn't linear, and that's perfectly normal.",
  "Your feelings are valid, even the uncomfortable ones.",
  "Tomorrow is a new opportunity to try again.",
  "You don't have to be perfect to be worthy.",
  "Rest is productive. You deserve it.",
  "Your journey is uniquely yours.",
  "Difficult days don't erase your progress.",
  "You have the strength to face today.",
  "Self-compassion is a form of courage.",
  "Every breath is a new beginning.",
  "You are more resilient than you realize.",
  "It's okay to ask for help when you need it.",
  "Your worth isn't measured by your productivity.",
  "Peace starts with being kind to yourself.",
  "You're learning and that's what matters.",
  "Today, you are exactly where you need to be.",
  "Your emotions are messengers, not monsters.",
  "Growth happens in the quiet moments too.",
  "You are worthy of love and belonging.",
  "Taking care of yourself isn't selfish.",
  "Your mental health matters just as much as physical health.",
  "It's okay to have bad days and still be okay.",
  "You're writing your story one day at a time.",
];

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

export function getDailyReflection(dateString: string): string {
  const hash = simpleHash(dateString);
  const index = hash % reflections.length;
  return reflections[index];
}

export function getTodaysReflection(): string {
  const today = new Date().toISOString().split('T')[0];
  return getDailyReflection(today);
}
