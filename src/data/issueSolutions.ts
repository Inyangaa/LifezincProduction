export type IssueKey =
  | "money"
  | "relationship"
  | "depression"
  | "anxiety"
  | "anger"
  | "work"
  | "school"
  | "family"
  | "grief"
  | "loneliness"
  | "confidence"
  | "health"
  | "addiction"
  | "overwhelm";

export type SolutionType =
  | "immediate_action"
  | "emotional_tool"
  | "practical_step"
  | "external_resource";

export interface IssueSolution {
  type: SolutionType;
  title: string;
  description: string;
  linkLabel?: string;
  linkUrl?: string;
}

export interface IssueDefinition {
  key: IssueKey;
  label: string;
  emoji: string;
  intro: string;
  solutions: IssueSolution[];
}

export const ISSUE_SOLUTIONS: IssueDefinition[] = [

  {
    key: "money",
    label: "Money & Financial Stress",
    emoji: "💸",
    intro:
      "Money worries can feel heavy and urgent. You are not alone, and there are both emotional tools and real-world supports you can use.",
    solutions: [
      {
        type: "immediate_action",
        title: "3-minute Financial Calm Reset",
        description:
          "Take 6 slow breaths (inhale 4, hold 2, exhale 6). Then write down ONE money problem you will focus on today."
      },
      {
        type: "practical_step",
        title: "Check government benefits in your state",
        description:
          "You may qualify for SNAP, TANF, LIHEAP, Medicaid/CHIP, childcare subsidies, or rental assistance.",
        linkLabel: "Explore benefits",
        linkUrl: "https://www.benefits.gov"
      },
      {
        type: "external_resource",
        title: "Free credit counseling (NFCC)",
        description:
          "NFCC offers free or low-cost debt counseling, budgeting help, and repayment plans.",
        linkLabel: "Visit NFCC",
        linkUrl: "https://www.nfcc.org"
      },
      {
        type: "practical_step",
        title: "Hardship support from your bank",
        description:
          "Ask your bank for 'hardship assistance'—many offer payment pauses, reduced rates, or fee waivers."
      },
      {
        type: "practical_step",
        title: " browse jobs and flexible work",
        description: "Small income boosts reduce stress.",
        linkLabel: "Search jobs",
        linkUrl: "https://www.indeed.com"
      }
    ]
  },

  {
    key: "relationship",
    label: "Relationship Stress",
    emoji: "❤️",
    intro:
      "Relationship pain can touch every part of your day. It's okay to need support with this.",
    solutions: [
      {
        type: "emotional_tool",
        title: "The Unsent Letter",
        description:
          "Write everything you feel in a letter you won't send. This helps release emotional tension safely."
      },
      {
        type: "immediate_action",
        title: "90-second pause before responding",
        description:
          "Step away for 90 seconds before texting or responding to reduce emotional reactivity."
      },
      {
        type: "practical_step",
        title: "Identify the need under the conflict",
        description:
          "Conflict often hides needs like safety, clarity, or reassurance. Naming the need changes the tone."
      },
      {
        type: "external_resource",
        title: "Affordable relationship counseling",
        description:
          "Use low-cost counseling platforms if deeper support is needed.",
        linkLabel: "Open Path Collective",
        linkUrl: "https://openpathcollective.org"
      }
    ]
  },

  {
    key: "depression",
    label: "Low Mood / Emotional Fatigue",
    emoji: "🫥",
    intro:
      "Feeling low, heavy, or empty can make everything harder. Small steps still count.",
    solutions: [
      {
        type: "immediate_action",
        title: "Tiny Activation: Move for 3 minutes",
        description:
          "Walk or stretch for 3 minutes. This activates your nervous system."
      },
      {
        type: "emotional_tool",
        title: "Name 3 feelings",
        description:
          "Instead of 'I'm sad', name three emotions. This reduces emotional intensity."
      },
      {
        type: "practical_step",
        title: "Break your day into tiny tasks",
        description: "Choose 1–3 tiny tasks: shower, drink water, message one person."
      },
      {
        type: "external_resource",
        title: "Need crisis support?",
        description: "Reach out if you feel unsafe.",
        linkLabel: "Call or text 988",
        linkUrl: "https://988lifeline.org"
      }
    ]
  },

  {
    key: "anxiety",
    label: "Anxiety & Overthinking",
    emoji: "😰",
    intro:
      "Anxiety makes everything feel urgent and dangerous. You deserve tools that help your body and thoughts calm down.",
    solutions: [
      {
        type: "immediate_action",
        title: "5-4-3-2-1 grounding",
        description:
          "Look around and name: 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste."
      },
      {
        type: "emotional_tool",
        title: "'Now' vs 'Later' worry sorting",
        description:
          "Write your worries and label each as NOW or LATER. Only act on NOW worries."
      },
      {
        type: "practical_step",
        title: "Schedule a worry time",
        description: "Choose 10 minutes later in the day to think intentionally about worries."
      }
    ]
  },

  {
    key: "anger",
    label: "Anger & Frustration",
    emoji: "😡",
    intro:
      "Anger often protects something important—your boundaries, safety, or values.",
    solutions: [
      {
        type: "immediate_action",
        title: "Step away for 90 seconds",
        description:
          "Anger chemically peaks for 90 seconds. Step aside before replying."
      },
      {
        type: "emotional_tool",
        title: "What is anger protecting?",
        description:
          "Often anger hides hurt or fear. Write: 'My anger is trying to protect me from…'"
      },
      {
        type: "practical_step",
        title: "Move your body",
        description:
          "A brisk walk or wall push helps metabolize adrenaline."
      }
    ]
  },

  {
    key: "work",
    label: "Work Stress & Burnout",
    emoji: "💼",
    intro:
      "Work stress drains your energy. You're allowed to set limits and protect your mental health.",
    solutions: [
      {
        type: "practical_step",
        title: "Pick today's Top 3 tasks",
        description:
          "Focus on only three priorities. Everything else is a bonus."
      },
      {
        type: "emotional_tool",
        title: "Boundary script",
        description:
          "'I'm at capacity right now. I can do X today and Y this week. Which is more important?'"
      },
      {
        type: "external_resource",
        title: "Check workplace support",
        description:
          "Ask HR if your company has an Employee Assistance Program (EAP)."
      }
    ]
  },

  {
    key: "school",
    label: "School & Academic Pressure",
    emoji: "📚",
    intro:
      "School pressure can feel overwhelming. You deserve tools and help.",
    solutions: [
      {
        type: "practical_step",
        title: "25-minute focus timer",
        description: "Work for 25 minutes, break for 5."
      },
      {
        type: "emotional_tool",
        title: "Release perfection",
        description:
          "'Progress, not perfection' is enough. Small steps count."
      },
      {
        type: "practical_step",
        title: "Ask for support early",
        description:
          "Message a teacher or counselor with one question. Don't wait until it's too late."
      }
    ]
  },

  {
    key: "family",
    label: "Family Conflict & Parenting Stress",
    emoji: "👪",
    intro:
      "Family dynamics are intense because these are your closest bonds. You deserve support.",
    solutions: [
      {
        type: "immediate_action",
        title: "Pause before reacting",
        description:
          "Say: 'I need a moment to think before I respond.'"
      },
      {
        type: "emotional_tool",
        title: "Needs over blame",
        description: "Say: 'I need to feel heard' instead of 'You never listen.'"
      },
      {
        type: "practical_step",
        title: "Set a small boundary",
        description:
          "'I can talk about this for 10 minutes, then I need a break.'"
      }
    ]
  },

  {
    key: "grief",
    label: "Grief & Loss",
    emoji: "🕯️",
    intro:
      "Grief is heavy because love was real. It's okay to move slowly.",
    solutions: [
      {
        type: "emotional_tool",
        title: "Name the loss and meaning",
        description:
          "Write: 'I lost…' and 'This meant…'"
      },
      {
        type: "immediate_action",
        title: "Schedule grief moments",
        description:
          "Allow yourself a short time to remember or cry without judgment."
      },
      {
        type: "external_resource",
        title: "Find grief support",
        description:
          "Local grief groups can help you feel less alone."
      }
    ]
  },

  {
    key: "loneliness",
    label: "Loneliness & Isolation",
    emoji: "🧍‍♀️",
    intro:
      "Feeling alone doesn't mean you're unworthy. It means you're craving connection.",
    solutions: [
      {
        type: "practical_step",
        title: "Reach out to one person",
        description:
          "Send: 'Thinking of you today.' You don't need to explain everything."
      },
      {
        type: "emotional_tool",
        title: "Separate feelings from facts",
        description: "'Alone right now' is not the same as 'unlovable.'"
      },
      {
        type: "external_resource",
        title: "Find safe spaces",
        description:
          "Join local groups or online communities."
      }
    ]
  },

  {
    key: "confidence",
    label: "Low Confidence",
    emoji: "🌱",
    intro:
      "Confidence grows through small proof, not perfection.",
    solutions: [
      {
        type: "emotional_tool",
        title: "Past wins list",
        description:
          "Write 5 times you handled something hard. Reread during doubt."
      },
      {
        type: "practical_step",
        title: "Do one brave action today",
        description:
          "Send the message, apply, speak up. Courage creates confidence."
      }
    ]
  },

  {
    key: "health",
    label: "Health Worries",
    emoji: "🏥",
    intro:
      "Health anxiety is common. Let's separate fear from fact.",
    solutions: [
      {
        type: "practical_step",
        title: "Separate facts from fears",
        description:
          "Make two lists: 'What I know' vs 'What I fear.'"
      },
      {
        type: "practical_step",
        title: "Book a check-in",
        description:
          "A scheduled appointment lowers anxiety."
      },
      {
        type: "emotional_tool",
        title: "Calm before Googling",
        description:
          "Take 5 slow breaths before searching symptoms."
      }
    ]
  },

  {
    key: "addiction",
    label: "Urges & Addiction Concerns",
    emoji: "🧪",
    intro:
      "Urges are your brain seeking relief. You deserve support.",
    solutions: [
      {
        type: "immediate_action",
        title: "Ride the urge wave",
        description:
          "Urges peak then fall in 10–20 minutes. Use grounding until it passes."
      },
      {
        type: "practical_step",
        title: "Identify triggers",
        description:
          "Write: 'Urges rise most when…'"
      },
      {
        type: "external_resource",
        title: "Reach out for structured support",
        description:
          "Look up local or online recovery groups."
      }
    ]
  },

  {
    key: "overwhelm",
    label: "General Overwhelm",
    emoji: "🌊",
    intro:
      "You don't have to fix your whole life today. Start small.",
    solutions: [
      {
        type: "practical_step",
        title: "Brain dump → sort",
        description:
          "Write everything down. Label: Today / This Week / Later."
      },
      {
        type: "immediate_action",
        title: "One-square-meter method",
        description:
          "Tidy or organize one small area to regain control."
      },
      {
        type: "emotional_tool",
        title: "Talk to yourself like a friend",
        description:
          "Ask: 'What would I tell a friend who felt like this?'"
      }
    ]
  }
];
