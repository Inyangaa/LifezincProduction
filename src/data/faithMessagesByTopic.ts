export type FaithSource = 'christian' | 'muslim' | 'jewish' | 'general';
export type Topic = 'marriage' | 'family' | 'fear' | 'stress' | 'hope' | 'loneliness' | 'gratitude' | 'anxiety' | 'anger' | 'sadness' | 'guilt';

export interface FaithMessage {
  text: string;
  reference: string;
}

export const faithMessagesByTopic: Record<FaithSource, Record<Topic, FaithMessage[]>> = {
  christian: {
    marriage: [
      {
        text: "Therefore what God has joined together, let no one separate. A strong marriage is built on faith, love, and mutual respect.",
        reference: "Mark 10:9 (Bible)"
      },
      {
        text: "Love is patient, love is kind. It does not envy, it does not boast, it is not proud.",
        reference: "1 Corinthians 13:4 (Bible)"
      },
      {
        text: "Husbands, love your wives, just as Christ loved the church and gave himself up for her.",
        reference: "Ephesians 5:25 (Bible)"
      }
    ],
    family: [
      {
        text: "Honor your father and your mother, so that you may live long in the land the Lord your God is giving you.",
        reference: "Exodus 20:12 (Bible)"
      },
      {
        text: "But as for me and my household, we will serve the Lord.",
        reference: "Joshua 24:15 (Bible)"
      },
      {
        text: "Children are a heritage from the Lord, offspring a reward from him.",
        reference: "Psalm 127:3 (Bible)"
      }
    ],
    fear: [
      {
        text: "For God has not given us a spirit of fear, but of power and of love and of a sound mind.",
        reference: "2 Timothy 1:7 (Bible)"
      },
      {
        text: "When I am afraid, I put my trust in you.",
        reference: "Psalm 56:3 (Bible)"
      },
      {
        text: "Do not fear, for I am with you; do not be dismayed, for I am your God.",
        reference: "Isaiah 41:10 (Bible)"
      }
    ],
    stress: [
      {
        text: "Come to me, all you who are weary and burdened, and I will give you rest.",
        reference: "Matthew 11:28 (Bible)"
      },
      {
        text: "Cast all your anxiety on him because he cares for you.",
        reference: "1 Peter 5:7 (Bible)"
      },
      {
        text: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.",
        reference: "Philippians 4:6 (Bible)"
      }
    ],
    hope: [
      {
        text: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.",
        reference: "Jeremiah 29:11 (Bible)"
      },
      {
        text: "May the God of hope fill you with all joy and peace as you trust in him.",
        reference: "Romans 15:13 (Bible)"
      },
      {
        text: "Be strong and take heart, all you who hope in the Lord.",
        reference: "Psalm 31:24 (Bible)"
      }
    ],
    loneliness: [
      {
        text: "I am with you always, even to the end of the age.",
        reference: "Matthew 28:20 (Bible)"
      },
      {
        text: "The Lord is close to the brokenhearted and saves those who are crushed in spirit.",
        reference: "Psalm 34:18 (Bible)"
      },
      {
        text: "Never will I leave you; never will I forsake you.",
        reference: "Hebrews 13:5 (Bible)"
      }
    ],
    gratitude: [
      {
        text: "Give thanks in all circumstances; for this is God's will for you in Christ Jesus.",
        reference: "1 Thessalonians 5:18 (Bible)"
      },
      {
        text: "Enter his gates with thanksgiving and his courts with praise; give thanks to him and praise his name.",
        reference: "Psalm 100:4 (Bible)"
      },
      {
        text: "Let them give thanks to the Lord for his unfailing love and his wonderful deeds for mankind.",
        reference: "Psalm 107:8 (Bible)"
      }
    ],
    anxiety: [
      {
        text: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.",
        reference: "Philippians 4:6 (Bible)"
      },
      {
        text: "Peace I leave with you; my peace I give you. Do not let your hearts be troubled and do not be afraid.",
        reference: "John 14:27 (Bible)"
      },
      {
        text: "Cast all your anxiety on him because he cares for you.",
        reference: "1 Peter 5:7 (Bible)"
      }
    ],
    anger: [
      {
        text: "Everyone should be quick to listen, slow to speak and slow to become angry.",
        reference: "James 1:19 (Bible)"
      },
      {
        text: "In your anger do not sin: Do not let the sun go down while you are still angry.",
        reference: "Ephesians 4:26 (Bible)"
      },
      {
        text: "A gentle answer turns away wrath, but a harsh word stirs up anger.",
        reference: "Proverbs 15:1 (Bible)"
      }
    ],
    sadness: [
      {
        text: "The Lord is close to the brokenhearted and saves those who are crushed in spirit.",
        reference: "Psalm 34:18 (Bible)"
      },
      {
        text: "He heals the brokenhearted and binds up their wounds.",
        reference: "Psalm 147:3 (Bible)"
      },
      {
        text: "Weeping may stay for the night, but rejoicing comes in the morning.",
        reference: "Psalm 30:5 (Bible)"
      }
    ],
    guilt: [
      {
        text: "If we confess our sins, he is faithful and just to forgive us our sins and to cleanse us from all unrighteousness.",
        reference: "1 John 1:9 (Bible)"
      },
      {
        text: "As far as the east is from the west, so far has he removed our transgressions from us.",
        reference: "Psalm 103:12 (Bible)"
      },
      {
        text: "Therefore, there is now no condemnation for those who are in Christ Jesus.",
        reference: "Romans 8:1 (Bible)"
      }
    ]
  },
  muslim: {
    marriage: [
      {
        text: "And among His signs is that He created for you mates from among yourselves that you may dwell in tranquility with them, and He placed between you affection and mercy.",
        reference: "Qur'an 30:21"
      },
      {
        text: "They are clothing for you and you are clothing for them.",
        reference: "Qur'an 2:187"
      },
      {
        text: "The best of you are those who are best to their wives.",
        reference: "Hadith - At-Tirmidhi"
      }
    ],
    family: [
      {
        text: "And We have enjoined upon man care for his parents. His mother carried him with hardship and gave birth to him with hardship.",
        reference: "Qur'an 46:15"
      },
      {
        text: "And lower to them the wing of humility out of mercy and say, 'My Lord, have mercy upon them as they brought me up when I was small.'",
        reference: "Qur'an 17:24"
      },
      {
        text: "Wealth and children are the adornment of the worldly life.",
        reference: "Qur'an 18:46"
      }
    ],
    fear: [
      {
        text: "Do not be afraid; surely I am with you both, hearing and seeing.",
        reference: "Qur'an 20:46"
      },
      {
        text: "So do not fear them but fear Me, if you are truly believers.",
        reference: "Qur'an 3:175"
      },
      {
        text: "Those who believe and whose hearts find comfort in the remembrance of Allah. Surely in the remembrance of Allah do hearts find comfort.",
        reference: "Qur'an 13:28"
      }
    ],
    stress: [
      {
        text: "So truly with hardship comes ease. Truly with hardship comes ease.",
        reference: "Qur'an 94:5-6"
      },
      {
        text: "Allah does not burden a soul beyond that it can bear.",
        reference: "Qur'an 2:286"
      },
      {
        text: "Verily, in the remembrance of Allah do hearts find rest.",
        reference: "Qur'an 13:28"
      }
    ],
    hope: [
      {
        text: "Indeed, with hardship comes ease.",
        reference: "Qur'an 94:5"
      },
      {
        text: "So do not weaken and do not grieve, and you will be superior if you are true believers.",
        reference: "Qur'an 3:139"
      },
      {
        text: "And whoever relies upon Allah - then He is sufficient for him.",
        reference: "Qur'an 65:3"
      }
    ],
    loneliness: [
      {
        text: "He is with you wherever you are.",
        reference: "Qur'an 57:4"
      },
      {
        text: "And when My servants ask you concerning Me, indeed I am near. I respond to the invocation of the supplicant when he calls upon Me.",
        reference: "Qur'an 2:186"
      },
      {
        text: "We are closer to him than his jugular vein.",
        reference: "Qur'an 50:16"
      }
    ],
    gratitude: [
      {
        text: "If you are grateful, I will surely increase you in favor.",
        reference: "Qur'an 14:7"
      },
      {
        text: "And remember when your Lord proclaimed: If you give thanks, I will give you more.",
        reference: "Qur'an 14:7"
      },
      {
        text: "So remember Me; I will remember you. And be grateful to Me and do not deny Me.",
        reference: "Qur'an 2:152"
      }
    ],
    anxiety: [
      {
        text: "Verily, in the remembrance of Allah do hearts find rest.",
        reference: "Qur'an 13:28"
      },
      {
        text: "Allah does not burden a soul beyond that it can bear.",
        reference: "Qur'an 2:286"
      },
      {
        text: "And seek help through patience and prayer, and indeed, it is difficult except for the humbly submissive to Allah.",
        reference: "Qur'an 2:45"
      }
    ],
    anger: [
      {
        text: "And hasten to forgiveness from your Lord and a garden as wide as the heavens and earth, prepared for the righteous, who restrain anger and pardon the people.",
        reference: "Qur'an 3:133-134"
      },
      {
        text: "The strong person is not he who can overpower others. Rather, the strong person is he who controls himself when he is angry.",
        reference: "Hadith - Al-Bukhari"
      },
      {
        text: "Repel evil with that which is better; and thereupon the one whom between you and him is enmity will become as though he was a devoted friend.",
        reference: "Qur'an 41:34"
      }
    ],
    sadness: [
      {
        text: "So truly with hardship comes ease.",
        reference: "Qur'an 94:6"
      },
      {
        text: "And We will surely test you with something of fear and hunger and a loss of wealth and lives and fruits, but give good tidings to the patient.",
        reference: "Qur'an 2:155"
      },
      {
        text: "Do not lose hope, nor be sad.",
        reference: "Qur'an 3:139"
      }
    ],
    guilt: [
      {
        text: "Say, 'O My servants who have transgressed against themselves, do not despair of the mercy of Allah. Indeed, Allah forgives all sins.'",
        reference: "Qur'an 39:53"
      },
      {
        text: "And whoever does a wrong or wrongs himself but then seeks forgiveness of Allah will find Allah Forgiving and Merciful.",
        reference: "Qur'an 4:110"
      },
      {
        text: "Indeed, Allah loves those who are constantly repentant and loves those who purify themselves.",
        reference: "Qur'an 2:222"
      }
    ]
  },
  jewish: {
    marriage: [
      {
        text: "He who finds a wife finds a good thing and obtains favor from the Lord.",
        reference: "Proverbs 18:22 (Torah)"
      },
      {
        text: "Therefore a man shall leave his father and his mother and hold fast to his wife, and they shall become one flesh.",
        reference: "Genesis 2:24 (Torah)"
      },
      {
        text: "A wife of noble character is her husband's crown.",
        reference: "Proverbs 12:4 (Torah)"
      }
    ],
    family: [
      {
        text: "Honor your father and your mother, that your days may be long in the land that the Lord your God is giving you.",
        reference: "Exodus 20:12 (Torah)"
      },
      {
        text: "Train up a child in the way he should go; even when he is old he will not depart from it.",
        reference: "Proverbs 22:6 (Torah)"
      },
      {
        text: "Children's children are the crown of old men, and the glory of children is their fathers.",
        reference: "Proverbs 17:6 (Torah)"
      }
    ],
    fear: [
      {
        text: "The Lord is my light and my salvation; whom shall I fear? The Lord is the strength of my life; of whom shall I be afraid?",
        reference: "Psalm 27:1 (Torah)"
      },
      {
        text: "Be strong and courageous. Do not be afraid or terrified because of them, for the Lord your God goes with you.",
        reference: "Deuteronomy 31:6 (Torah)"
      },
      {
        text: "Even though I walk through the valley of the shadow of death, I will fear no evil, for you are with me.",
        reference: "Psalm 23:4 (Torah)"
      }
    ],
    stress: [
      {
        text: "Cast your burden upon the Lord, and He will sustain you; He shall never let the righteous falter.",
        reference: "Psalm 55:23 (Torah)"
      },
      {
        text: "Come and see what God has done, His awesome deeds for mankind!",
        reference: "Psalm 66:5 (Torah)"
      },
      {
        text: "The Lord is near to all who call on Him, to all who call on Him in truth.",
        reference: "Psalm 145:18 (Torah)"
      }
    ],
    hope: [
      {
        text: "For I know the thoughts that I think toward you, says the Lord, thoughts of peace and not of evil, to give you a future and a hope.",
        reference: "Jeremiah 29:11 (Torah)"
      },
      {
        text: "But those who hope in the Lord will renew their strength. They will soar on wings like eagles.",
        reference: "Isaiah 40:31 (Torah)"
      },
      {
        text: "The Lord is good, a refuge in times of trouble. He cares for those who trust in him.",
        reference: "Nahum 1:7 (Torah)"
      }
    ],
    loneliness: [
      {
        text: "The Lord your God is in your midst, a Mighty One who will save; He will rejoice over you with gladness.",
        reference: "Zephaniah 3:17 (Torah)"
      },
      {
        text: "I have set the Lord always before me; because He is at my right hand, I shall not be shaken.",
        reference: "Psalm 16:8 (Torah)"
      },
      {
        text: "Turn to me and be gracious to me, for I am lonely and afflicted.",
        reference: "Psalm 25:16 (Torah)"
      }
    ],
    gratitude: [
      {
        text: "Give thanks to the Lord, for He is good; His love endures forever.",
        reference: "Psalm 107:1 (Torah)"
      },
      {
        text: "It is good to give thanks to the Lord and to sing praises to Your name, O Most High.",
        reference: "Psalm 92:1 (Torah)"
      },
      {
        text: "I will give thanks to You, Lord, with all my heart; I will tell of all Your wonderful deeds.",
        reference: "Psalm 9:1 (Torah)"
      }
    ],
    anxiety: [
      {
        text: "Cast your burden upon the Lord, and He will sustain you; He shall never let the righteous falter.",
        reference: "Psalm 55:23 (Torah)"
      },
      {
        text: "When anxiety was great within me, your consolation brought me joy.",
        reference: "Psalm 94:19 (Torah)"
      },
      {
        text: "Do not worry about tomorrow, for tomorrow will worry about itself.",
        reference: "Jewish Wisdom"
      }
    ],
    anger: [
      {
        text: "Be not quick in your spirit to become angry, for anger lodges in the heart of fools.",
        reference: "Ecclesiastes 7:9 (Torah)"
      },
      {
        text: "A soft answer turns away wrath, but a harsh word stirs up anger.",
        reference: "Proverbs 15:1 (Torah)"
      },
      {
        text: "Whoever is slow to anger is better than the mighty, and he who rules his spirit than he who takes a city.",
        reference: "Proverbs 16:32 (Torah)"
      }
    ],
    sadness: [
      {
        text: "Weeping may tarry for the night, but joy comes in the morning.",
        reference: "Psalm 30:6 (Torah)"
      },
      {
        text: "The Lord is close to the brokenhearted and saves those who are crushed in spirit.",
        reference: "Psalm 34:18 (Torah)"
      },
      {
        text: "He heals the brokenhearted and binds up their wounds.",
        reference: "Psalm 147:3 (Torah)"
      }
    ],
    guilt: [
      {
        text: "Let the wicked forsake his way, and the unrighteous man his thoughts; let him return to the Lord, that He may have compassion on him.",
        reference: "Isaiah 55:7 (Torah)"
      },
      {
        text: "If we return to the Eternal, He will have mercy on us and will abundantly pardon.",
        reference: "Isaiah 55:7 (Torah)"
      },
      {
        text: "For I will forgive their wickedness and will remember their sins no more.",
        reference: "Jeremiah 31:34 (Torah)"
      }
    ]
  },
  general: {
    marriage: [
      {
        text: "A successful marriage requires falling in love many times, always with the same person. (General inspiration about nurturing lasting love)",
        reference: "Universal Wisdom"
      },
      {
        text: "In marriage, two imperfect people come together to create something beautiful through patience, understanding, and commitment.",
        reference: "Relationship Wisdom"
      },
      {
        text: "The greatest marriages are built on teamwork, mutual respect, trust, and a healthy dose of forgiveness.",
        reference: "Partnership Principles"
      }
    ],
    family: [
      {
        text: "Family is not about blood. It's about who is willing to hold your hand when you need it most.",
        reference: "Connection Wisdom"
      },
      {
        text: "The love of a family is life's greatest blessing. Cherish those who stand by you through all seasons.",
        reference: "Family Bond"
      },
      {
        text: "In family life, love is the oil that eases friction, the cement that binds closer together.",
        reference: "Family Harmony"
      }
    ],
    fear: [
      {
        text: "Courage is not the absence of fear, but the decision that something else is more important than fear.",
        reference: "Inner Strength"
      },
      {
        text: "Feel the fear and do it anyway. Your dreams are waiting on the other side of your courage.",
        reference: "Brave Heart"
      },
      {
        text: "Fear is temporary. Regret is forever. Choose courage.",
        reference: "Life Wisdom"
      }
    ],
    stress: [
      {
        text: "Breathe deeply. This moment is temporary. You have the strength to move through this with grace.",
        reference: "Mindful Peace"
      },
      {
        text: "Stress is caused by being here but wanting to be there. Find peace in the present moment.",
        reference: "Present Moment"
      },
      {
        text: "You don't have to see the whole staircase. Just take the first step.",
        reference: "One Step at a Time"
      }
    ],
    hope: [
      {
        text: "Even the darkest night will end and the sun will rise. This is a promise nature makes every single day.",
        reference: "Eternal Hope"
      },
      {
        text: "Hope is being able to see that there is light despite all of the darkness.",
        reference: "Light Within"
      },
      {
        text: "When you have lost all hope, remember: You are stronger than you think, braver than you believe, and loved more than you know.",
        reference: "Inner Power"
      }
    ],
    loneliness: [
      {
        text: "You are connected to all of life. The sun warms your skin, the earth supports your steps. You are never truly alone.",
        reference: "Universal Connection"
      },
      {
        text: "Loneliness is the poverty of self; solitude is richness of self. Learn to enjoy your own company.",
        reference: "Self-Companionship"
      },
      {
        text: "The greatest thing in the world is to know how to belong to yourself.",
        reference: "Self-Discovery"
      }
    ],
    gratitude: [
      {
        text: "Gratitude turns what we have into enough, and more. It turns denial into acceptance, chaos into order.",
        reference: "Grateful Heart"
      },
      {
        text: "When you focus on the good, the good gets better. Gratitude is the secret to abundance.",
        reference: "Abundance Mindset"
      },
      {
        text: "The more grateful you are, the more beauty you see. Gratitude unlocks the fullness of life.",
        reference: "Life's Beauty"
      }
    ],
    anxiety: [
      {
        text: "Breathe deeply. This moment is temporary. You have the strength to move through this with grace.",
        reference: "Calm Presence"
      },
      {
        text: "Anxiety is simply a mismatch between your thoughts and your breath. Return to your breathing.",
        reference: "Breath Awareness"
      },
      {
        text: "You are not your anxiety. You are the sky. Your anxiety is just the weather passing through.",
        reference: "Mindful Observer"
      }
    ],
    anger: [
      {
        text: "Like a wave, anger will rise and fall. Observe it without judgment, and let it pass through you.",
        reference: "Mindful Awareness"
      },
      {
        text: "Holding onto anger is like drinking poison and expecting the other person to die.",
        reference: "Release & Heal"
      },
      {
        text: "Between stimulus and response there is a space. In that space is your power to choose your response.",
        reference: "Conscious Choice"
      }
    ],
    sadness: [
      {
        text: "Like the moon, you will go through phases. Some will be full of light, others darker. Both are necessary.",
        reference: "Natural Rhythm"
      },
      {
        text: "Sadness is part of being human. Allow yourself to feel it fully, and it will eventually pass.",
        reference: "Emotional Wisdom"
      },
      {
        text: "The wound is the place where the Light enters you. Your sadness is making space for joy.",
        reference: "Transformation"
      }
    ],
    guilt: [
      {
        text: "You are allowed to be both a masterpiece and a work in progress simultaneously.",
        reference: "Self-Compassion"
      },
      {
        text: "Guilt is useful only as long as it motivates positive change. Then it must be released.",
        reference: "Healthy Growth"
      },
      {
        text: "Forgive yourself for not knowing what you didn't know before you learned it.",
        reference: "Self-Forgiveness"
      }
    ]
  }
};

export function normalizeAndMapTopic(input: string): Topic | null {
  const normalized = input.toLowerCase().trim();

  const topicMap: Record<string, Topic> = {
    'marriage': 'marriage',
    'wedding': 'marriage',
    'spouse': 'marriage',
    'husband': 'marriage',
    'wife': 'marriage',
    'married': 'marriage',

    'family': 'family',
    'parents': 'family',
    'children': 'family',
    'kids': 'family',
    'mom': 'family',
    'dad': 'family',
    'mother': 'family',
    'father': 'family',

    'fear': 'fear',
    'afraid': 'fear',
    'scared': 'fear',
    'frightened': 'fear',
    'terror': 'fear',

    'stress': 'stress',
    'stressed': 'stress',
    'overwhelmed': 'stress',
    'pressure': 'stress',
    'burden': 'stress',

    'anxiety': 'anxiety',
    'anxious': 'anxiety',
    'worry': 'anxiety',
    'worried': 'anxiety',
    'nervous': 'anxiety',

    'hope': 'hope',
    'hopeful': 'hope',
    'optimism': 'hope',
    'future': 'hope',

    'loneliness': 'loneliness',
    'lonely': 'loneliness',
    'alone': 'loneliness',
    'isolated': 'loneliness',
    'isolation': 'loneliness',

    'gratitude': 'gratitude',
    'grateful': 'gratitude',
    'thankful': 'gratitude',
    'thanks': 'gratitude',
    'appreciation': 'gratitude',

    'anger': 'anger',
    'angry': 'anger',
    'mad': 'anger',
    'frustrated': 'anger',
    'rage': 'anger',
    'irritated': 'anger',

    'sadness': 'sadness',
    'sad': 'sadness',
    'depressed': 'sadness',
    'down': 'sadness',
    'unhappy': 'sadness',
    'grief': 'sadness',

    'guilt': 'guilt',
    'guilty': 'guilt',
    'shame': 'guilt',
    'ashamed': 'guilt',
    'regret': 'guilt'
  };

  for (const [key, topic] of Object.entries(topicMap)) {
    if (normalized.includes(key)) {
      return topic;
    }
  }

  return null;
}

let lastShownMessage: { faith: FaithSource; topic: Topic; index: number } | null = null;

export function getMessageForTopic(faith: FaithSource, topic: Topic): FaithMessage | null {
  const messages = faithMessagesByTopic[faith]?.[topic];

  if (!messages || messages.length === 0) {
    return null;
  }

  if (messages.length === 1) {
    return messages[0];
  }

  let selectedIndex: number;

  if (lastShownMessage && lastShownMessage.faith === faith && lastShownMessage.topic === topic) {
    const availableIndices = messages.map((_, i) => i).filter(i => i !== lastShownMessage!.index);
    selectedIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
  } else {
    selectedIndex = Math.floor(Math.random() * messages.length);
  }

  lastShownMessage = { faith, topic, index: selectedIndex };

  return messages[selectedIndex];
}

export function getGeneralComfortMessage(faith: FaithSource): FaithMessage {
  const comfortMessages: Record<FaithSource, FaithMessage> = {
    christian: {
      text: "The Lord is close to the brokenhearted and saves those who are crushed in spirit.",
      reference: "Psalm 34:18 (Bible)"
    },
    muslim: {
      text: "Verily, in the remembrance of Allah do hearts find rest.",
      reference: "Qur'an 13:28"
    },
    jewish: {
      text: "The Lord is near to all who call on Him, to all who call on Him in truth.",
      reference: "Psalm 145:18 (Torah)"
    },
    general: {
      text: "This too shall pass. You are stronger than you know, and you are not alone in your journey.",
      reference: "Universal Comfort"
    }
  };

  return comfortMessages[faith];
}
