interface CoachingResponse {
  message: string;
  reflectionQuestion?: string;
  copingTechnique?: {
    title: string;
    description: string;
    steps: string[];
  };
}

const positiveResponses = [
  "That's a wonderful perspective! You're showing real emotional awareness.",
  "It's beautiful to see you recognizing these positive feelings.",
  "You're doing great work processing these emotions.",
  "This kind of reflection is so valuable for your growth.",
];

const supportiveResponses = [
  "It sounds like you're dealing with something challenging.",
  "I hear you, and what you're feeling is completely valid.",
  "Thank you for sharing something so personal.",
  "It takes courage to acknowledge these feelings.",
];

const reflectionQuestions = [
  "What would you tell a friend going through the same situation?",
  "How might you view this situation a week from now?",
  "What's one small step you could take to care for yourself right now?",
  "What part of this situation is within your control?",
  "What have you learned about yourself through this experience?",
  "What would self-compassion look like in this moment?",
];

const categoryReflectionQuestions: Record<string, string[]> = {
  school: [
    "What support or resources could help you with this academic challenge?",
    "How can you break this larger goal into smaller, manageable steps?",
    "What have you successfully learned or overcome in the past?",
  ],
  family: [
    "What boundaries might help you feel safer and more respected?",
    "How can you honor both your family relationships and your own needs?",
    "What would the wisest version of yourself do in this family situation?",
  ],
  friends: [
    "What qualities do you value most in friendships?",
    "How might open communication help this friendship situation?",
    "What kind of friend do you want to be, regardless of others' actions?",
  ],
  self_esteem: [
    "What would you tell a loved one who was being hard on themselves?",
    "What are three things you appreciate about yourself today?",
    "How can you practice self-compassion in this moment?",
  ],
  relationships: [
    "What do you truly need and want in this relationship?",
    "How might honest communication change this situation?",
    "What does a healthy relationship look like to you?",
  ],
  work: [
    "What would success look like if you defined it on your own terms?",
    "How can you create better work-life balance?",
    "What are you learning about yourself through this work challenge?",
  ],
  money: [
    "What is one small financial action you can take today?",
    "How can you seek support or resources for this financial challenge?",
    "What strengths have helped you navigate money challenges before?",
  ],
};

const copingTechniques = [
  {
    title: "Box Breathing",
    description: "A calming technique used by Navy SEALs to reduce stress",
    steps: [
      "Breathe in slowly for 4 counts",
      "Hold your breath for 4 counts",
      "Exhale slowly for 4 counts",
      "Hold empty for 4 counts",
      "Repeat 4 times",
    ],
  },
  {
    title: "5-4-3-2-1 Grounding",
    description: "Bring yourself to the present moment",
    steps: [
      "Name 5 things you can see",
      "Name 4 things you can touch",
      "Name 3 things you can hear",
      "Name 2 things you can smell",
      "Name 1 thing you can taste",
    ],
  },
  {
    title: "Progressive Muscle Relaxation",
    description: "Release physical tension from your body",
    steps: [
      "Start with your toes, tense them for 5 seconds",
      "Release and notice the relaxation",
      "Move up to your calves, then thighs",
      "Continue through your body to your face",
      "End with a full body scan of relaxation",
    ],
  },
  {
    title: "Journaling Prompt",
    description: "Explore your thoughts deeper",
    steps: [
      "Set a timer for 5 minutes",
      "Write continuously without editing",
      "Focus on what you're feeling right now",
      "End by writing one thing you're grateful for",
    ],
  },
  {
    title: "Self-Compassion Break",
    description: "Treat yourself with kindness",
    steps: [
      "Place your hand on your heart",
      "Say: 'This is a moment of suffering'",
      "Say: 'Suffering is part of life'",
      "Say: 'May I be kind to myself'",
      "Take three deep breaths",
    ],
  },
];

export function generateCoachingResponse(
  mood: string,
  originalText: string,
  reframedText: string,
  category?: string | null
): CoachingResponse {
  const positiveMoods = ['happy', 'loved', 'peaceful', 'content', 'grateful', 'hopeful', 'relieved'];
  const challengingMoods = ['sad', 'anxious', 'frustrated', 'angry', 'hurt', 'worried', 'stressed', 'overwhelmed', 'guilty'];

  const isPositive = positiveMoods.includes(mood);
  const isChallenging = challengingMoods.includes(mood);

  let message: string;
  let reflectionQuestion: string | undefined;
  let copingTechnique: CoachingResponse['copingTechnique'];

  if (isPositive) {
    message = positiveResponses[Math.floor(Math.random() * positiveResponses.length)];
    reflectionQuestion = "How can you carry this positive energy into the rest of your day?";
  } else if (isChallenging) {
    message = supportiveResponses[Math.floor(Math.random() * supportiveResponses.length)];

    const hasAnxietyWords = originalText.toLowerCase().match(/anxious|anxiety|worried|panic|nervous/);
    const hasAngerWords = originalText.toLowerCase().match(/angry|frustrated|annoyed|irritated|mad/);
    const hasSadWords = originalText.toLowerCase().match(/sad|depressed|down|hopeless|empty/);
    const hasOverwhelmWords = originalText.toLowerCase().match(/overwhelm|too much|can't handle|drowning/);

    if (hasAnxietyWords || mood === 'anxious' || mood === 'worried') {
      copingTechnique = copingTechniques[0];
      if (category && categoryReflectionQuestions[category]) {
        reflectionQuestion = categoryReflectionQuestions[category][Math.floor(Math.random() * categoryReflectionQuestions[category].length)];
      } else {
        reflectionQuestion = "What's one worry you could set aside for just the next hour?";
      }
    } else if (hasOverwhelmWords || mood === 'overwhelmed' || mood === 'stressed') {
      copingTechnique = copingTechniques[1];
      if (category && categoryReflectionQuestions[category]) {
        reflectionQuestion = categoryReflectionQuestions[category][Math.floor(Math.random() * categoryReflectionQuestions[category].length)];
      } else {
        reflectionQuestion = "What's the smallest, most manageable task you could focus on right now?";
      }
    } else if (hasAngerWords || mood === 'angry' || mood === 'frustrated') {
      copingTechnique = copingTechniques[2];
      if (category && categoryReflectionQuestions[category]) {
        reflectionQuestion = categoryReflectionQuestions[category][Math.floor(Math.random() * categoryReflectionQuestions[category].length)];
      } else {
        reflectionQuestion = "What boundary might you need to set to protect your peace?";
      }
    } else if (hasSadWords || mood === 'sad' || mood === 'hurt') {
      copingTechnique = copingTechniques[4];
      if (category && categoryReflectionQuestions[category]) {
        reflectionQuestion = categoryReflectionQuestions[category][Math.floor(Math.random() * categoryReflectionQuestions[category].length)];
      } else {
        reflectionQuestion = "What would comfort look like for you right now?";
      }
    } else {
      copingTechnique = copingTechniques[Math.floor(Math.random() * copingTechniques.length)];
      if (category && categoryReflectionQuestions[category]) {
        reflectionQuestion = categoryReflectionQuestions[category][Math.floor(Math.random() * categoryReflectionQuestions[category].length)];
      } else {
        reflectionQuestion = reflectionQuestions[Math.floor(Math.random() * reflectionQuestions.length)];
      }
    }
  } else {
    message = "Thank you for taking time to reflect on your emotions today.";
    reflectionQuestion = reflectionQuestions[Math.floor(Math.random() * reflectionQuestions.length)];
  }

  return {
    message,
    reflectionQuestion,
    copingTechnique,
  };
}
