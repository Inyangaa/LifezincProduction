export interface CustomSuggestion {
  id: string;
  type: 'tool' | 'reframe' | 'action' | 'breathing';
  title: string;
  description: string;
  content?: string;
  icon: string;
}

export async function generateCustomSuggestions(userText: string): Promise<CustomSuggestion[]> {
  const lowerText = userText.toLowerCase();
  const suggestions: CustomSuggestion[] = [];

  const keywords = {
    stress: ['stress', 'stressed', 'overwhelm', 'pressure', 'anxiety', 'anxious', 'worry', 'worried'],
    sadness: ['sad', 'down', 'depressed', 'lonely', 'alone', 'empty', 'hopeless'],
    anger: ['angry', 'mad', 'frustrated', 'annoyed', 'irritated', 'upset'],
    fear: ['scared', 'afraid', 'fear', 'nervous', 'panic', 'terrified'],
    relationships: ['friend', 'parent', 'family', 'relationship', 'boyfriend', 'girlfriend', 'breakup'],
    school: ['school', 'homework', 'test', 'exam', 'grade', 'class', 'teacher', 'college'],
    work: ['work', 'job', 'boss', 'career', 'interview', 'coworker'],
    sleep: ['sleep', 'tired', 'exhausted', 'insomnia', 'cant sleep'],
    selfEsteem: ['confidence', 'self-esteem', 'worth', 'ugly', 'stupid', 'failure', 'not good enough'],
  };

  const hasKeyword = (category: string[]) => category.some(word => lowerText.includes(word));

  if (hasKeyword(keywords.stress)) {
    suggestions.push({
      id: 'breathing-stress',
      type: 'breathing',
      title: '5-Minute Calming Breath',
      description: 'Reduce stress with a simple breathing exercise',
      icon: '🫁',
    });

    suggestions.push({
      id: 'reframe-stress',
      type: 'reframe',
      title: 'Reframe Your Stress',
      description: 'See your situation from a calmer perspective',
      content: 'Instead of: "I can\'t handle all of this."\n\nTry: "I can handle this one step at a time. What\'s the next small thing I can do?"',
      icon: '✨',
    });
  }

  if (hasKeyword(keywords.sadness)) {
    suggestions.push({
      id: 'action-sadness',
      type: 'action',
      title: 'Small Steps Forward',
      description: 'Gentle actions to lift your mood',
      content: '• Go outside for 5 minutes\n• Text someone you trust\n• Listen to your favorite song\n• Write down one thing you\'re grateful for',
      icon: '🌱',
    });

    suggestions.push({
      id: 'reframe-sadness',
      type: 'reframe',
      title: 'Remember: This is Temporary',
      description: 'Feelings change, even when it doesn\'t feel like it',
      content: 'Instead of: "I\'ll always feel this way."\n\nTry: "This feeling is hard right now, but feelings pass. I\'ve felt better before, and I will again."',
      icon: '🌤️',
    });
  }

  if (hasKeyword(keywords.anger)) {
    suggestions.push({
      id: 'breathing-anger',
      type: 'breathing',
      title: 'Cool Down Breathing',
      description: 'Calm your nervous system when you\'re upset',
      icon: '❄️',
    });

    suggestions.push({
      id: 'action-anger',
      type: 'action',
      title: 'Release the Tension',
      description: 'Physical ways to let go of anger',
      content: '• Take a brisk walk\n• Do jumping jacks for 2 minutes\n• Write out everything you\'re feeling, then tear it up\n• Squeeze ice cubes in your hands',
      icon: '💪',
    });
  }

  if (hasKeyword(keywords.fear)) {
    suggestions.push({
      id: 'breathing-fear',
      type: 'breathing',
      title: 'Grounding Breath',
      description: 'Feel safer in your body with breathwork',
      icon: '🌿',
    });

    suggestions.push({
      id: 'reframe-fear',
      type: 'reframe',
      title: 'Challenge Your Fears',
      description: 'Question the thoughts that scare you',
      content: 'Instead of: "Something terrible is going to happen."\n\nTry: "My mind is trying to protect me, but I\'m safe right now. What evidence do I have that I\'m okay?"',
      icon: '🛡️',
    });
  }

  if (hasKeyword(keywords.school)) {
    suggestions.push({
      id: 'action-school',
      type: 'action',
      title: 'Break It Down',
      description: 'Make school stress more manageable',
      content: '• Pick ONE task to focus on right now\n• Study for just 15 minutes\n• Ask for help from a teacher or friend\n• Take a 5-minute break every 25 minutes',
      icon: '📚',
    });
  }

  if (hasKeyword(keywords.relationships)) {
    suggestions.push({
      id: 'reframe-relationships',
      type: 'reframe',
      title: 'See the Other Side',
      description: 'Consider different perspectives',
      content: 'Instead of: "They don\'t care about me."\n\nTry: "Maybe they\'re going through something too. What if I asked them directly how they\'re feeling?"',
      icon: '💬',
    });
  }

  if (hasKeyword(keywords.selfEsteem)) {
    suggestions.push({
      id: 'action-selfesteem',
      type: 'action',
      title: 'Build Yourself Up',
      description: 'Small ways to appreciate yourself',
      content: '• List 3 things you did well today\n• Text a friend what you appreciate about them\n• Do something you\'re good at\n• Treat yourself with the kindness you\'d show a friend',
      icon: '💛',
    });
  }

  if (suggestions.length === 0) {
    suggestions.push(
      {
        id: 'breathing-general',
        type: 'breathing',
        title: '3-Minute Reset',
        description: 'A quick breathing exercise to center yourself',
        icon: '🫁',
      },
      {
        id: 'reframe-general',
        type: 'reframe',
        title: 'Shift Your Perspective',
        description: 'See your situation differently',
        content: 'Instead of: "This is too hard."\n\nTry: "This is challenging, but I\'ve handled hard things before. What resources do I have right now?"',
        icon: '✨',
      },
      {
        id: 'action-general',
        type: 'action',
        title: 'Take One Small Step',
        description: 'Simple actions you can take right now',
        content: '• Drink a glass of water\n• Take 5 deep breaths\n• Stretch your body\n• Step outside for 2 minutes',
        icon: '🌟',
      }
    );
  }

  return suggestions.slice(0, 4);
}
