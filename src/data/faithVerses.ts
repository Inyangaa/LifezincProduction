export type FaithKey = "christian" | "muslim" | "jewish" | "general";
export type EmotionKey =
  | "anxiety"
  | "fear"
  | "sadness"
  | "guilt"
  | "loneliness"
  | "anger"
  | "hopelessness";

export interface VerseEntry {
  emotion: EmotionKey;
  text: string;
  reference: string;
  reflection?: string;
}

export const faithVerses: Record<FaithKey, VerseEntry[]> = {
  christian: [
    {
      emotion: "anxiety",
      text:
        "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.",
      reference: "Philippians 4:6"
    },
    {
      emotion: "fear",
      text:
        "For God has not given us a spirit of fear, but of power and of love and of a sound mind.",
      reference: "2 Timothy 1:7"
    },
    {
      emotion: "sadness",
      text: "The Lord is close to the brokenhearted.",
      reference: "Psalm 34:18"
    },
    {
      emotion: "guilt",
      text:
        "If we confess our sins, he is faithful and just to forgive us our sins and to cleanse us from all unrighteousness.",
      reference: "1 John 1:9"
    },
    {
      emotion: "loneliness",
      text:
        "I am with you always, even to the end of the age.",
      reference: "Matthew 28:20"
    },
    {
      emotion: "anger",
      text:
        "Everyone should be quick to listen, slow to speak and slow to become angry.",
      reference: "James 1:19"
    },
    {
      emotion: "hopelessness",
      text:
        "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.",
      reference: "Jeremiah 29:11"
    }
  ],
  muslim: [
    {
      emotion: "anxiety",
      text:
        "Verily, in the remembrance of Allah do hearts find rest.",
      reference: "Qur'an 13:28"
    },
    {
      emotion: "fear",
      text:
        "Do not be afraid; surely I am with you both, hearing and seeing.",
      reference: "Qur'an 20:46"
    },
    {
      emotion: "sadness",
      text:
        "So truly with hardship comes ease.",
      reference: "Qur'an 94:6"
    },
    {
      emotion: "guilt",
      text:
        "Say, 'O My servants who have transgressed against themselves, do not despair of the mercy of Allah.'",
      reference: "Qur'an 39:53"
    },
    {
      emotion: "loneliness",
      text:
        "He is with you wherever you are.",
      reference: "Qur'an 57:4"
    },
    {
      emotion: "anger",
      text:
        "And hasten to forgiveness from your Lord and a garden as wide as the heavens and earth, prepared for the righteous, who restrain anger and pardon the people.",
      reference: "Qur'an 3:133–134"
    },
    {
      emotion: "hopelessness",
      text:
        "Indeed, with hardship [will be] ease.",
      reference: "Qur'an 94:5"
    }
  ],
  jewish: [
    {
      emotion: "anxiety",
      text:
        "Cast your burden upon the Lord, and He will sustain you; He shall never let the righteous falter.",
      reference: "Psalm 55:23"
    },
    {
      emotion: "fear",
      text:
        "The Lord is my light and my salvation; whom shall I fear? The Lord is the strength of my life; of whom shall I be afraid?",
      reference: "Psalm 27:1"
    },
    {
      emotion: "sadness",
      text:
        "Weeping may tarry for the night, but joy comes in the morning.",
      reference: "Psalm 30:6"
    },
    {
      emotion: "guilt",
      text:
        "Let the wicked forsake his way, and the unrighteous man his thoughts; let him return to the Lord, that He may have compassion on him.",
      reference: "Isaiah 55:7"
    },
    {
      emotion: "loneliness",
      text:
        "The Lord your God is in your midst, a Mighty One who will save; He will rejoice over you with gladness.",
      reference: "Zephaniah 3:17"
    },
    {
      emotion: "anger",
      text:
        "Be not quick in your spirit to become angry, for anger lodges in the heart of fools.",
      reference: "Ecclesiastes 7:9"
    },
    {
      emotion: "hopelessness",
      text:
        "For I know the thoughts that I think toward you, says the Lord, thoughts of peace and not of evil, to give you a future and a hope.",
      reference: "Jeremiah 29:11"
    }
  ],
  general: [
    {
      emotion: "anxiety",
      text:
        "Breathe deeply. This moment is temporary. You have the strength to move through this with grace.",
      reference: "Universal Wisdom"
    },
    {
      emotion: "fear",
      text:
        "Courage is not the absence of fear, but the decision that something else is more important than fear.",
      reference: "Inner Strength"
    },
    {
      emotion: "sadness",
      text:
        "Like the moon, you will go through phases. Some will be full of light, others darker. Both are necessary.",
      reference: "Natural Rhythm"
    },
    {
      emotion: "guilt",
      text:
        "You are allowed to be both a masterpiece and a work in progress simultaneously.",
      reference: "Self-Compassion"
    },
    {
      emotion: "loneliness",
      text:
        "You are connected to all of life. The sun warms your skin, the earth supports your steps. You are never truly alone.",
      reference: "Universal Connection"
    },
    {
      emotion: "anger",
      text:
        "Like a wave, anger will rise and fall. Observe it without judgment, and let it pass through you.",
      reference: "Mindful Awareness"
    },
    {
      emotion: "hopelessness",
      text:
        "Even the darkest night will end and the sun will rise. This is a promise nature makes every single day.",
      reference: "Eternal Hope"
    }
  ]
};

export function findVerse(
  faith: FaithKey,
  emotion: EmotionKey,
  category?: string | null
): VerseEntry | undefined {
  const verse = faithVerses[faith].find(v => v.emotion === emotion);

  if (verse && category) {
    const categoryReflections: Record<string, Record<string, string>> = {
      school: {
        anxiety: 'How might this wisdom help you navigate academic pressures?',
        fear: 'What courage can you find for your educational journey?',
        sadness: 'How can this comfort support you through academic struggles?',
        guilt: 'What grace can you extend to yourself as a learner?',
        loneliness: 'Remember you are not alone in your academic journey.',
        anger: 'How can patience transform your relationship with learning?',
        hopelessness: 'What hope can you find for your educational path?',
      },
      family: {
        anxiety: 'How might this peace apply to your family relationships?',
        fear: 'What strength can you find for family challenges?',
        sadness: 'How can this comfort support you through family pain?',
        guilt: 'What forgiveness can heal family wounds?',
        loneliness: 'Remember you are valued beyond family circumstances.',
        anger: 'How can love transform difficult family dynamics?',
        hopelessness: 'What hope exists for family healing?',
      },
      friends: {
        anxiety: 'How might this wisdom guide your friendships?',
        fear: 'What courage can you bring to social situations?',
        sadness: 'How can this comfort help with friendship loss?',
        guilt: 'What reconciliation might be possible in friendships?',
        loneliness: 'Remember your worth is not defined by social connections.',
        anger: 'How can understanding transform friendship conflicts?',
        hopelessness: 'What hope exists for meaningful connections?',
      },
      self_esteem: {
        anxiety: 'How does this truth affirm your inherent worth?',
        fear: 'What confidence comes from knowing your true value?',
        sadness: 'How can this comfort remind you of your worth?',
        guilt: 'How does forgiveness restore your sense of self?',
        loneliness: 'Remember you are never truly alone in your worth.',
        anger: 'How can self-compassion heal inner wounds?',
        hopelessness: 'What hope exists for self-acceptance?',
      },
      relationships: {
        anxiety: 'How might this peace bring clarity to your relationship?',
        fear: 'What courage can vulnerability bring to love?',
        sadness: 'How can this comfort support you through heartache?',
        guilt: 'What healing can forgiveness bring to relationships?',
        loneliness: 'Remember your worth beyond any relationship.',
        anger: 'How can love and boundaries coexist?',
        hopelessness: 'What hope exists for love and connection?',
      },
      work: {
        anxiety: 'How might this wisdom apply to your career path?',
        fear: 'What confidence can you bring to professional challenges?',
        sadness: 'How can this comfort support career struggles?',
        guilt: 'What grace exists for professional mistakes?',
        loneliness: 'Remember your value beyond professional achievement.',
        anger: 'How can patience transform workplace frustrations?',
        hopelessness: 'What hope exists for your career journey?',
      },
      money: {
        anxiety: 'How might this peace calm financial worries?',
        fear: 'What trust can you have beyond material security?',
        sadness: 'How can this comfort support financial stress?',
        guilt: 'What grace exists for financial mistakes?',
        loneliness: 'Remember your worth is not your wealth.',
        anger: 'How can perspective transform money frustrations?',
        hopelessness: 'What hope exists beyond financial circumstances?',
      },
    };

    if (categoryReflections[category]?.[emotion]) {
      return {
        ...verse,
        reflection: categoryReflections[category][emotion],
      };
    }
  }

  return verse;
}
