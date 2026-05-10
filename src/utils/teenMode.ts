interface TeenCoachingResponse {
  message: string;
  reflectionQuestion?: string;
  copingTechnique?: {
    title: string;
    description: string;
    steps: string[];
  };
}

const teenPositiveResponses = [
  "That's awesome that you're noticing these positive vibes!",
  "Love that you're taking time to reflect on what's going well.",
  "You're doing something really important by checking in with yourself.",
  "That's actually really cool that you can recognize these feelings.",
];

const teenSupportiveResponses = [
  "That sounds really tough. Thanks for being real about it.",
  "I hear you. What you're feeling totally makes sense.",
  "It takes guts to be honest about feeling this way.",
  "That's a lot to deal with. You're not alone in this.",
];

const teenReflectionQuestions = [
  "If your best friend felt this way, what would you tell them?",
  "How do you think you'll feel about this next week?",
  "What's one small thing that might make this a little easier?",
  "What part of this can you actually control?",
  "What have you learned about yourself from dealing with this?",
  "How would you take care of a friend going through this?",
];

const teenCategoryReflections: Record<string, string[]> = {
  school: [
    "What help or resources could make school less stressful?",
    "How could you break this big thing into smaller, easier steps?",
    "What's something you've already figured out or gotten through at school?",
  ],
  family: [
    "What boundaries might help you feel more respected at home?",
    "How can you take care of yourself while dealing with family stuff?",
    "What would the wisest version of you do in this family situation?",
  ],
  friends: [
    "What do you actually want in your friendships?",
    "Could talking it out help fix this friendship situation?",
    "What kind of friend do you want to be, no matter what others do?",
  ],
  self_esteem: [
    "What would you say to someone you care about if they were being harsh on themselves?",
    "What are three things you actually like about yourself?",
    "How can you be nicer to yourself right now?",
  ],
  relationships: [
    "What do you really need and want in this relationship?",
    "Could being honest about how you feel change things?",
    "What does a healthy relationship actually look like?",
  ],
  work: [
    "What would success look like if you got to define it yourself?",
    "How can you create better balance between work and everything else?",
    "What are you learning about yourself through this work situation?",
  ],
  money: [
    "What's one small money-related thing you could do today?",
    "Who could you talk to for help with this money stress?",
    "What strengths have helped you deal with money stuff before?",
  ],
};

const teenCopingTechniques = [
  {
    title: "4-7-8 Breathing",
    description: "Quick way to calm down when you're stressed",
    steps: [
      "Breathe in through your nose for 4 counts",
      "Hold it for 7 counts",
      "Breathe out through your mouth for 8 counts",
      "Do this 3-4 times",
      "Notice how you feel calmer",
    ],
  },
  {
    title: "5-4-3-2-1 Grounding",
    description: "Stops panic and brings you back to now",
    steps: [
      "Name 5 things you can see around you",
      "Name 4 things you can physically touch",
      "Name 3 things you can hear right now",
      "Name 2 things you can smell",
      "Name 1 thing you can taste",
    ],
  },
  {
    title: "Body Scan",
    description: "Release tension from your body",
    steps: [
      "Start at your feet - tense them for 5 seconds",
      "Let go and feel the relaxation",
      "Move up to your legs, then stomach",
      "Keep going up through your whole body",
      "Notice how much lighter you feel",
    ],
  },
  {
    title: "Quick Journal",
    description: "Get your thoughts out",
    steps: [
      "Set a timer for 5 minutes",
      "Write whatever comes to mind - don't edit",
      "Focus on what you're feeling right now",
      "End with one thing you're grateful for",
    ],
  },
  {
    title: "Self-Kindness Break",
    description: "Be nicer to yourself",
    steps: [
      "Put your hand on your heart",
      "Say: 'This is really hard right now'",
      "Say: 'Everyone struggles sometimes'",
      "Say: 'I'm gonna be kind to myself'",
      "Take three deep breaths",
    ],
  },
];

export function generateTeenCoachingResponse(
  mood: string,
  originalText: string,
  reframedText: string,
  category?: string | null
): TeenCoachingResponse {
  const positiveMoods = ['happy', 'loved', 'peaceful', 'content', 'grateful', 'hopeful', 'relieved'];
  const challengingMoods = ['sad', 'anxious', 'frustrated', 'angry', 'hurt', 'worried', 'stressed', 'overwhelmed', 'guilty'];

  const isPositive = positiveMoods.includes(mood);
  const isChallenging = challengingMoods.includes(mood);

  let message: string;
  let reflectionQuestion: string | undefined;
  let copingTechnique: TeenCoachingResponse['copingTechnique'];

  if (isPositive) {
    message = teenPositiveResponses[Math.floor(Math.random() * teenPositiveResponses.length)];
    reflectionQuestion = "How can you keep this positive energy going?";
  } else if (isChallenging) {
    message = teenSupportiveResponses[Math.floor(Math.random() * teenSupportiveResponses.length)];

    const hasAnxietyWords = originalText.toLowerCase().match(/anxious|anxiety|worried|panic|nervous|scared/);
    const hasAngerWords = originalText.toLowerCase().match(/angry|frustrated|annoyed|irritated|mad|furious/);
    const hasSadWords = originalText.toLowerCase().match(/sad|depressed|down|hopeless|empty|lonely/);
    const hasOverwhelmWords = originalText.toLowerCase().match(/overwhelm|too much|can't handle|drowning|stressed/);

    if (hasAnxietyWords || mood === 'anxious' || mood === 'worried') {
      copingTechnique = teenCopingTechniques[0];
      if (category && teenCategoryReflections[category]) {
        reflectionQuestion = teenCategoryReflections[category][Math.floor(Math.random() * teenCategoryReflections[category].length)];
      } else {
        reflectionQuestion = "What's one worry you could let go of for the next hour?";
      }
    } else if (hasOverwhelmWords || mood === 'overwhelmed' || mood === 'stressed') {
      copingTechnique = teenCopingTechniques[1];
      if (category && teenCategoryReflections[category]) {
        reflectionQuestion = teenCategoryReflections[category][Math.floor(Math.random() * teenCategoryReflections[category].length)];
      } else {
        reflectionQuestion = "What's the smallest thing you could focus on right now?";
      }
    } else if (hasAngerWords || mood === 'angry' || mood === 'frustrated') {
      copingTechnique = teenCopingTechniques[2];
      if (category && teenCategoryReflections[category]) {
        reflectionQuestion = teenCategoryReflections[category][Math.floor(Math.random() * teenCategoryReflections[category].length)];
      } else {
        reflectionQuestion = "What boundary do you need to set to protect your peace?";
      }
    } else if (hasSadWords || mood === 'sad' || mood === 'hurt') {
      copingTechnique = teenCopingTechniques[4];
      if (category && teenCategoryReflections[category]) {
        reflectionQuestion = teenCategoryReflections[category][Math.floor(Math.random() * teenCategoryReflections[category].length)];
      } else {
        reflectionQuestion = "What would make you feel a little better right now?";
      }
    } else {
      copingTechnique = teenCopingTechniques[Math.floor(Math.random() * teenCopingTechniques.length)];
      if (category && teenCategoryReflections[category]) {
        reflectionQuestion = teenCategoryReflections[category][Math.floor(Math.random() * teenCategoryReflections[category].length)];
      } else {
        reflectionQuestion = teenReflectionQuestions[Math.floor(Math.random() * teenReflectionQuestions.length)];
      }
    }
  } else {
    message = "Thanks for taking time to check in with yourself today.";
    reflectionQuestion = teenReflectionQuestions[Math.floor(Math.random() * teenReflectionQuestions.length)];
  }

  return {
    message,
    reflectionQuestion,
    copingTechnique,
  };
}

export const teenReframeMessages = [
  "Every feeling teaches you something. What's this one trying to show you?",
  "You're feeling this because you care. That's actually a strength.",
  "Feelings come and go. This moment will pass, and you'll be stronger for it.",
  "By being real about your emotions, you're already being brave.",
  "Your feelings are valid. They're part of what makes you, you.",
  "This emotion is info, not your identity. You're way bigger than this moment.",
  "You've dealt with hard stuff before and made it through. You will again.",
  "Being honest about your emotions is self-care.",
  "Every feeling you work through makes room for more good stuff.",
  "You're turning pain into growth. That's actually really powerful.",
  "This emotion shows you're alive and present. That's beautiful.",
  "By naming how you feel, you're taking the first step to freedom.",
  "Your emotional honesty is a gift to yourself.",
  "Hard feelings often come right before big breakthroughs.",
  "You're not stuck in this. You're moving through it.",
];

export const teenCategoryReframes: Record<string, string[]> = {
  school: [
    "School challenges help you figure out how you learn best.",
    "Every student struggles. This doesn't define how smart you are.",
    "Learning is a journey, not a race. You're exactly where you need to be.",
    "Academic pressure is real, and so is your ability to handle it.",
  ],
  family: [
    "Family stuff is complicated. Your feelings about it are totally valid.",
    "You're doing your best in a tough situation. That takes strength.",
    "Setting boundaries with family isn't selfish - it's self-care.",
    "Family challenges don't define your worth or your future.",
  ],
  friends: [
    "Friendships change and grow. This challenge might be bringing clarity.",
    "Your social struggles show you care about connection. That's valuable.",
    "Not every friendship lasts forever, and that's actually okay.",
    "Real friends will understand when you need to be real with them.",
  ],
  self_esteem: [
    "Your worth isn't about grades, looks, or what others think. You're valuable just as you are.",
    "Self-doubt is part of growing up. You're brave for facing these feelings.",
    "You're allowed to take up space and have needs. Period.",
    "Comparison is toxic. Your journey is your own.",
  ],
  relationships: [
    "Relationships are learning experiences. Every one teaches you something.",
    "Your feelings in relationships deserve respect - from yourself too.",
    "Healthy relationships start with how you treat yourself.",
    "It's okay to walk away from situations that hurt you.",
  ],
  work: [
    "Your path doesn't have to be straight. Detours can lead somewhere amazing.",
    "Work struggles don't define your value or potential.",
    "It's okay to put your wellbeing before productivity.",
    "You're allowed to change your mind about what you want to do.",
  ],
  money: [
    "Money stress is real. You're doing the best you can with what you have.",
    "Financial challenges are temporary. Your resourcefulness will get you through.",
    "Your worth as a person has nothing to do with money.",
    "It's okay to ask for help with money stuff.",
  ],
  other: teenReframeMessages,
};

export function getTeenReframe(category?: string | null): string {
  if (category && teenCategoryReframes[category]) {
    const messages = teenCategoryReframes[category];
    return messages[Math.floor(Math.random() * messages.length)];
  }
  return teenReframeMessages[Math.floor(Math.random() * teenReframeMessages.length)];
}

export const teenCrisisResources = [
  {
    name: "Crisis Text Line",
    description: "Text for 24/7 support with a trained counselor",
    action: "Text HOME to 741741",
    link: "https://www.crisistextline.org/",
  },
  {
    name: "Teen Line",
    description: "Teens helping teens (6pm-10pm PST)",
    action: "Call: 1-800-852-8336 or Text TEEN to 839863",
    link: "https://teenlineonline.org/",
  },
  {
    name: "National Suicide Prevention Lifeline",
    description: "24/7 crisis support for any reason",
    action: "Call or text 988",
    link: "https://988lifeline.org/",
  },
  {
    name: "The Trevor Project",
    description: "24/7 support for LGBTQ+ youth",
    action: "Call: 1-866-488-7386 or Text START to 678678",
    link: "https://www.thetrevorproject.org/",
  },
  {
    name: "Boys Town National Hotline",
    description: "24/7 crisis, resource and referral line",
    action: "Call or text: 1-800-448-3836",
    link: "https://www.boystown.org/hotline",
  },
  {
    name: "RAINN (Sexual Assault Hotline)",
    description: "24/7 support for sexual assault survivors",
    action: "Call: 1-800-656-4673",
    link: "https://www.rainn.org/",
  },
  {
    name: "StopBullying.gov",
    description: "Resources for dealing with bullying",
    action: "Visit website for help",
    link: "https://www.stopbullying.gov/",
  },
  {
    name: "School Counselor",
    description: "Talk to your school counselor during school hours",
    action: "Visit your school's counseling office",
    link: null,
  },
];
