export type EmotionKey =
  | "happy"
  | "calm"
  | "grateful"
  | "neutral"
  | "sad"
  | "anxious"
  | "tired"
  | "overwhelmed"
  | "angry"
  | "confused"
  | "hopeful"
  | "excited"
  | "lonely"
  | "other";

export type TopicKey =
  | "money"
  | "work_school"
  | "relationship"
  | "family"
  | "health"
  | "faith"
  | "self_esteem"
  | "grief_loss"
  | "other";

export type Suggestion = {
  id: string;
  type: "breathing" | "grounding" | "reframe" | "action" | "reflection" | "gratitude";
  title: string;
  body: string;
};

export type EmotionDefinition = {
  key: EmotionKey;
  label: string;
  description: string;
  baseSuggestions: Suggestion[];
};

export type TopicDefinition = {
  key: TopicKey;
  label: string;
  description: string;
  suggestions: Suggestion[];
};

export type ComboRule = {
  emotions: EmotionKey[];
  label: string;
  description: string;
  extraSuggestions: Suggestion[];
};

export const emotions: Record<EmotionKey, EmotionDefinition> = {
  happy: {
    key: "happy",
    label: "Happy",
    description:
      "You're feeling good, light, or content. There may be something worth celebrating or remembering.",
    baseSuggestions: [
      {
        id: "happy-reflect-win",
        type: "reflection",
        title: "Capture what went well",
        body: "Write or say one thing that went well and why it mattered to you. Future-you will be glad you remembered this moment."
      },
      {
        id: "happy-gratitude",
        type: "gratitude",
        title: "Simple gratitude check",
        body: "List three small things you're grateful for right now—people, moments, or even tiny comforts."
      },
      {
        id: "happy-action",
        type: "action",
        title: "Build on the momentum",
        body: "Pick one small action that keeps this positive momentum going—like sending a kind message, tidying a small space, or planning tomorrow."
      }
    ]
  },

  calm: {
    key: "calm",
    label: "Calm",
    description:
      "You feel steady or at ease. This is a good moment to anchor healthy habits or reflect with a clear mind.",
    baseSuggestions: [
      {
        id: "calm-reflection",
        type: "reflection",
        title: "Notice what supports your calm",
        body: "What helped you feel calmer today—something you did, someone you spoke to, or an environment you were in?"
      },
      {
        id: "calm-action",
        type: "action",
        title: "Protect your peace",
        body: "Choose one small boundary or habit that can help you keep this calm feeling later in the day."
      },
      {
        id: "calm-gratitude",
        type: "gratitude",
        title: "Thank your present self",
        body: "Write a short note to yourself thanking you for one choice you made that supported your peace today."
      }
    ]
  },

  grateful: {
    key: "grateful",
    label: "Grateful",
    description:
      "You're noticing blessings, support, or good things—even if life is not perfect.",
    baseSuggestions: [
      {
        id: "grateful-list",
        type: "gratitude",
        title: "Gratitude list",
        body: "Write or say three people or moments you appreciate right now and what they mean to you."
      },
      {
        id: "grateful-share",
        type: "action",
        title: "Share one thank-you",
        body: "Send a quick message or prayer of appreciation to someone who helped you recently."
      },
      {
        id: "grateful-anchor",
        type: "reflection",
        title: "Anchor this feeling",
        body: "Describe this grateful moment in a sentence so you can come back to it on harder days."
      }
    ]
  },

  neutral: {
    key: "neutral",
    label: "Neutral",
    description:
      "You feel okay—not high, not low. This can be a stable place to check in gently.",
    baseSuggestions: [
      {
        id: "neutral-scan",
        type: "reflection",
        title: "Body & mind scan",
        body: "Take 30 seconds to notice your body from head to toe. Is there any quiet tension or comfort you hadn't noticed?"
      },
      {
        id: "neutral-plan",
        type: "action",
        title: "One gentle next step",
        body: "Choose one small, realistic next step for today that would make things a bit easier for you."
      },
      {
        id: "neutral-gratitude",
        type: "gratitude",
        title: "Tiny good thing",
        body: "Name one small, ordinary thing that is quietly okay or good right now."
      }
    ]
  },

  sad: {
    key: "sad",
    label: "Sad",
    description:
      "You might feel low, hurt, disappointed, or heavy. It's okay to be here. This is a place for softness.",
    baseSuggestions: [
      {
        id: "sad-breath",
        type: "breathing",
        title: "Slow comforting breaths",
        body: "Inhale gently through your nose for 4 counts, hold for 2, exhale through your mouth for 6. Repeat 5 times."
      },
      {
        id: "sad-validate",
        type: "reframe",
        title: "Give yourself permission",
        body: 'Complete this sentence: "It makes sense that I feel sad because…" There\'s nothing weak about feeling this.'
      },
      {
        id: "sad-small-action",
        type: "action",
        title: "The tiniest step",
        body: "Choose one compassionate action—drink water, stand up and stretch, or message someone safe."
      }
    ]
  },

  anxious: {
    key: "anxious",
    label: "Anxious",
    description:
      "Your mind may be racing, worrying, or expecting the worst. Let's help your body and thoughts slow down.",
    baseSuggestions: [
      {
        id: "anxious-breath",
        type: "breathing",
        title: "4-6 grounding breath",
        body: "Inhale slowly for 4 counts, exhale for 6 counts. Focus only on counting. Repeat for 1–2 minutes."
      },
      {
        id: "anxious-ground",
        type: "grounding",
        title: "5-4-3-2-1 grounding",
        body: "Notice 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste."
      },
      {
        id: "anxious-reframe",
        type: "reframe",
        title: "Name the worry, soften the story",
        body: 'Write the worried thought, then add: "One other possible outcome is…" even if it feels small.'
      }
    ]
  },

  tired: {
    key: "tired",
    label: "Tired",
    description:
      "You're low on energy—physically, emotionally, or both. This is a nudge to rest, not to push harder.",
    baseSuggestions: [
      {
        id: "tired-body",
        type: "action",
        title: "Quick body kindness",
        body: "Can you give yourself 5 minutes to lie down, close your eyes, or at least stretch your neck and shoulders?"
      },
      {
        id: "tired-priorities",
        type: "reflection",
        title: "Reduce today's load",
        body: "List today's tasks and gently mark one thing you can delay, delegate, or do more lightly."
      },
      {
        id: "tired-breath",
        type: "breathing",
        title: "Soft exhale focus",
        body: "Take three slow breaths where the exhale is longer than the inhale. Imagine tension leaving on each exhale."
      }
    ]
  },

  overwhelmed: {
    key: "overwhelmed",
    label: "Overwhelmed",
    description:
      'There\'s a lot on your mind or plate. Everything may feel "too much" right now.',
    baseSuggestions: [
      {
        id: "overw-breakdown",
        type: "action",
        title: "Shrink the mountain",
        body: "Pick one situation and break it into 3 tiny steps. Focus only on step 1 for now."
      },
      {
        id: "overw-breath",
        type: "breathing",
        title: "Box breathing",
        body: "Inhale for 4, hold for 4, exhale for 4, hold for 4. Repeat this calm square 4 times."
      },
      {
        id: "overw-reframe",
        type: "reframe",
        title: "You're one person",
        body: 'Write or say: "I am one human being. It\'s okay if everything doesn\'t happen today."'
      }
    ]
  },

  angry: {
    key: "angry",
    label: "Angry",
    description:
      "You may feel wronged, disrespected, or deeply frustrated. Anger is a signal—let's help it move safely.",
    baseSuggestions: [
      {
        id: "angry-move",
        type: "action",
        title: "Move the energy",
        body: "If you can, do 30 seconds of safe movement—shake your arms, walk briskly, or squeeze a pillow."
      },
      {
        id: "angry-delay",
        type: "reflection",
        title: "Pause the reaction",
        body: "Write what you wish you could shout. Then wait 10 minutes before deciding what to actually say or do."
      },
      {
        id: "angry-breath",
        type: "breathing",
        title: "Cooling breath",
        body: "Inhale through your nose, exhale with a sigh through your mouth. Repeat slowly 5–8 times."
      }
    ]
  },

  confused: {
    key: "confused",
    label: "Confused",
    description:
      "You're unsure what to think, feel, or decide. That's okay; confusion is part of processing.",
    baseSuggestions: [
      {
        id: "confused-clarify",
        type: "reflection",
        title: "Name the question",
        body: 'Write or say the exact question on your mind beginning with "I don\'t know whether…"'
      },
      {
        id: "confused-options",
        type: "action",
        title: "Two possible paths",
        body: "List two possible next steps, even if neither feels perfect. Ask: what would future-me thank me for?"
      },
      {
        id: "confused-breath",
        type: "breathing",
        title: "Gentle pause",
        body: "Take three slow breaths before you try to decide anything. You don't have to solve everything right now."
      }
    ]
  },

  hopeful: {
    key: "hopeful",
    label: "Hopeful",
    description:
      "You sense possibility or light ahead, even if things are not fully okay yet.",
    baseSuggestions: [
      {
        id: "hopeful-plan",
        type: "action",
        title: "Nurture the hope",
        body: "Write one small step that supports what you're hopeful about, and one person or resource that could help."
      },
      {
        id: "hopeful-reflect",
        type: "reflection",
        title: "Where did this hope come from?",
        body: "Notice what shifted to create this hope—a conversation, a thought, a sign, a change."
      },
      {
        id: "hopeful-gratitude",
        type: "gratitude",
        title: "Thank your resilience",
        body: "Write a short sentence appreciating yourself for still being open to better days."
      }
    ]
  },

  excited: {
    key: "excited",
    label: "Excited",
    description:
      "You feel energized, eager, or lit up about something coming or happening now.",
    baseSuggestions: [
      {
        id: "excited-channel",
        type: "action",
        title: "Channel the energy",
        body: "Use this energy for one meaningful task—planning, preparing, or creating something important to you."
      },
      {
        id: "excited-reflect",
        type: "reflection",
        title: "Name the joy",
        body: "Describe what you're excited about in one sentence. Naming joy helps it land in your memory."
      },
      {
        id: "excited-ground",
        type: "grounding",
        title: "Stay steady",
        body: "Take three slow breaths so the excitement feels grounding, not overwhelming."
      }
    ]
  },

  lonely: {
    key: "lonely",
    label: "Lonely",
    description:
      "You feel disconnected, unseen, or like you're carrying things alone. That hurts—and it matters.",
    baseSuggestions: [
      {
        id: "lonely-reach-out",
        type: "action",
        title: "One tiny reach-out",
        body: 'Send a message, emoji, or voice note to someone you trust, even if it just says "Thinking of you."'
      },
      {
        id: "lonely-self-kindness",
        type: "reflection",
        title: "Offer yourself kindness",
        body: "Write or say one kind sentence to yourself that you wish someone else would say to you right now."
      },
      {
        id: "lonely-ground",
        type: "grounding",
        title: "You are here",
        body: "Look around and name 3 things that remind you you're still here, still breathing, still worthy of connection."
      }
    ]
  },
  other: {
    key: "other",
    label: "Other",
    description:
      "Your feeling is unique or hard to name—and that's okay. Let's explore it together.",
    baseSuggestions: [
      {
        id: "other-name-it",
        type: "reflection",
        title: "Try to name it",
        body: "Take a moment to describe what you're feeling in your own words. Don't worry about getting it perfect—just try to capture it."
      },
      {
        id: "other-body-check",
        type: "grounding",
        title: "Notice your body",
        body: "Where do you feel this emotion in your body? Chest, stomach, shoulders? Just notice without judgment."
      },
      {
        id: "other-express",
        type: "action",
        title: "Express it freely",
        body: "Write, draw, or talk about what you're experiencing. Sometimes just getting it out helps us understand it better."
      }
    ]
  }
};

export const topics: Record<TopicKey, TopicDefinition> = {
  money: {
    key: "money",
    label: "Money",
    description: "Stress, goals, or decisions about finances, bills, income, or savings.",
    suggestions: [
      {
        id: "money-clarify",
        type: "action",
        title: "Name the money issue",
        body: "Write one sentence about what feels hard or hopeful about money right now—keep it simple."
      },
      {
        id: "money-next-step",
        type: "action",
        title: "One practical next step",
        body: "Pick one tiny step: checking a balance, making a list, or setting a reminder to review things later."
      },
      {
        id: "money-reframe",
        type: "reframe",
        title: "Separate worth from numbers",
        body: 'Remind yourself: "My value as a person is not the same as my bank balance."'
      }
    ]
  },
  work_school: {
    key: "work_school",
    label: "Work / School",
    description: "Pressure, tasks, performance, deadlines, bosses, teachers, or grades.",
    suggestions: [
      {
        id: "work-prioritize",
        type: "action",
        title: "Pick today's top 1–3",
        body: 'List everything you feel you "should" do. Circle just 1–3 items that truly matter today.'
      },
      {
        id: "work-boundary",
        type: "reflection",
        title: "Set one boundary",
        body: "Write one sentence about what you will NOT do today in order to protect your energy."
      },
      {
        id: "work-breath",
        type: "breathing",
        title: "Micro break",
        body: "Close your eyes for 20 seconds and take three slow breaths before the next task."
      }
    ]
  },
  relationship: {
    key: "relationship",
    label: "Relationship",
    description: "Romantic partners, dating, conflict, connection, or distance.",
    suggestions: [
      {
        id: "rel-feelings",
        type: "reflection",
        title: "Name your feeling, not their flaw",
        body: 'Complete this: "Right now I feel…" instead of "They always…" This keeps the focus on your heart.'
      },
      {
        id: "rel-action",
        type: "action",
        title: "Gentle communication",
        body: "If safe, plan one gentle sentence you could say instead of holding everything inside or exploding."
      },
      {
        id: "rel-boundaries",
        type: "reframe",
        title: "Your needs matter",
        body: "Write one need you have in this relationship and why it's valid for you to have it."
      }
    ]
  },
  family: {
    key: "family",
    label: "Family",
    description: "Parents, children, relatives, expectations, or family history.",
    suggestions: [
      {
        id: "fam-role",
        type: "reflection",
        title: "Notice your role",
        body: "How do you usually show up in your family—helper, peacemaker, fixer, quiet one? How does that feel?"
      },
      {
        id: "fam-limit",
        type: "action",
        title: "One small limit",
        body: "Think of one small boundary that would make family interactions feel just a bit safer or calmer for you."
      },
      {
        id: "fam-kindness",
        type: "gratitude",
        title: "Find one small good",
        body: "Name one small positive or neutral thing from your family life, even if other parts are hard."
      }
    ]
  },
  health: {
    key: "health",
    label: "Health",
    description: "Physical health, mental health, illness, or energy changes.",
    suggestions: [
      {
        id: "health-body",
        type: "action",
        title: "Check in with your body",
        body: "Where in your body do you feel discomfort, pain, or tiredness? Acknowledge it without judgment."
      },
      {
        id: "health-support",
        type: "reflection",
        title: "You deserve support",
        body: "Is there a professional, clinic, or trusted person you could reach out to if things get heavier?"
      },
      {
        id: "health-rest",
        type: "action",
        title: "One kind choice",
        body: "Choose one kind choice for your body today—water, food, movement, or rest."
      }
    ]
  },
  faith: {
    key: "faith",
    label: "Faith / Spiritual",
    description: "Spiritual questions, practices, or comfort from your beliefs.",
    suggestions: [
      {
        id: "faith-reflect",
        type: "reflection",
        title: "Name your question or hope",
        body: "In one sentence, describe the prayer, question, or hope that's on your heart right now."
      },
      {
        id: "faith-action",
        type: "action",
        title: "Tiny spiritual practice",
        body: "Take one minute for a prayer, verse, quiet reflection, or grounding phrase that aligns with your beliefs."
      },
      {
        id: "faith-ground",
        type: "grounding",
        title: "Anchor phrase",
        body: 'Choose a short phrase that comforts you (for example, "I\'m not alone in this") and repeat it slowly 5 times.'
      }
    ]
  },
  self_esteem: {
    key: "self_esteem",
    label: "Self-esteem / Identity",
    description: "Confidence, self-worth, identity, and how you view yourself.",
    suggestions: [
      {
        id: "se-talk",
        type: "reframe",
        title: "Shift your self-talk",
        body: "Notice one harsh thing you're saying to yourself. Rewrite it as something kinder and more realistic."
      },
      {
        id: "se-strength",
        type: "reflection",
        title: "Name a strength",
        body: "Write down one quality or strength you have that has helped you get through hard times."
      },
      {
        id: "se-action",
        type: "action",
        title: "Act like you matter",
        body: 'Do one small act today that treats you as someone valuable—rest, good food, or a gentle "no."'
      }
    ]
  },
  grief_loss: {
    key: "grief_loss",
    label: "Grief / Loss",
    description: "Losing someone or something important, or fearing loss.",
    suggestions: [
      {
        id: "grief-name",
        type: "reflection",
        title: "Name what you miss",
        body: "Write or say what (or who) you're missing and one memory or detail that still matters to you."
      },
      {
        id: "grief-allow",
        type: "reframe",
        title: "Allow your grief",
        body: 'Remind yourself: "There is nothing wrong with me for grieving. This shows how deeply I cared."'
      },
      {
        id: "grief-care",
        type: "action",
        title: "Gentle comfort",
        body: "Do one small comforting thing: light a candle, hold a photo, or wrap yourself in something warm."
      }
    ]
  },
  other: {
    key: "other",
    label: "Other",
    description: "Anything that doesn't fit neat labels—your experience still matters.",
    suggestions: [
      {
        id: "other-name",
        type: "reflection",
        title: "Describe it in your own words",
        body: "Write one or two sentences about what this is about, however messy it sounds. It's your space."
      },
      {
        id: "other-ground",
        type: "grounding",
        title: "Stay with yourself",
        body: "Place a hand on your chest or stomach and take three slow breaths, feeling your body under your hand."
      }
    ]
  }
};

export const comboRules: ComboRule[] = [
  {
    emotions: ["sad", "tired"],
    label: "Low and drained",
    description:
      "You're feeling emotionally low and physically or mentally drained. You need softness, not pressure.",
    extraSuggestions: [
      {
        id: "combo-sad-tired-rest",
        type: "action",
        title: "Permission to do less",
        body: "Decide one thing you can postpone or simplify today. Your energy is limited, and that's okay."
      }
    ]
  },
  {
    emotions: ["anxious", "overwhelmed"],
    label: "Worried and overloaded",
    description:
      "Your mind is racing and there's a lot on your plate. Let's shrink things into safer pieces.",
    extraSuggestions: [
      {
        id: "combo-anxious-overw",
        type: "grounding",
        title: "One thing at a time",
        body: "Write down everything in your head, then choose only ONE thing to focus on for the next 15 minutes."
      }
    ]
  },
  {
    emotions: ["happy", "tired"],
    label: "Good but worn out",
    description:
      "You're glad about something, but your body or mind is still tired. You can enjoy and rest at the same time.",
    extraSuggestions: [
      {
        id: "combo-happy-tired",
        type: "reflection",
        title: "Celebrate gently",
        body: 'Note the good thing that happened, then give yourself permission to rest without "earning" it further.'
      }
    ]
  },
  {
    emotions: ["angry", "anxious"],
    label: "Fired up and worried",
    description:
      "You're both upset and worried about what might happen. Let's slow down before reacting.",
    extraSuggestions: [
      {
        id: "combo-angry-anxious",
        type: "breathing",
        title: "Pause before response",
        body: "Take 10 slow breaths and, if you can, wait 20 minutes before sending that message or making that call."
      }
    ]
  }
];
