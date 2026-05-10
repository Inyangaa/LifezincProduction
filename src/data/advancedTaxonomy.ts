import type {
  AdvancedCategory,
  AdvancedState,
  AdvancedCategoryId,
  AdvancedStateId,
  RiskLevel,
} from '../types/advancedTaxonomy';

// ADVANCED EMOTION TAXONOMY
// Phase 1: Complete reference framework

export const advancedCategories: Record<AdvancedCategoryId, AdvancedCategory> = {
  'dysregulated': {
    id: "dysregulated",
    label: "Dysregulated",
    description: "Emotional systems overwhelmed or shut down",
    emoji: "🌀",
    baseRiskLevel: "high",
    states: [
      'numb-disconnected',
      'overwhelmed-spiraling',
      'rage-destructive',
      'manic-impulsive',
      'dissociated',
    ],
  },
  'stress-response': {
    id: "stress-response",
    label: "Stress Response",
    description: "Fight-flight-freeze activation",
    emoji: "⚡",
    baseRiskLevel: "medium",
    states: [
      'anxious-vigilant',
      'panicked',
      'shutdown-avoidant',
      'irritable-reactive',
      'exhausted-depleted',
    ],
  },
  'relational': {
    id: "relational",
    label: "Relational",
    description: "Connection and belonging challenges",
    emoji: "💔",
    baseRiskLevel: "medium",
    states: [
      'abandoned-rejected',
      'betrayed-distrustful',
      'envious-resentful',
      'codependent-enmeshed',
      'isolated-disconnected',
      'loneliness',
    ],
  },
  'identity': {
    id: "identity",
    label: "Identity",
    description: "Self-concept and purpose struggles",
    emoji: "🪞",
    baseRiskLevel: "medium",
    states: [
      'shame-inadequate',
      'confused-lost',
      'fraudulent-impostor',
      'empty-purposeless',
      'conflicted-torn',
    ],
  },
  'existential': {
    id: "existential",
    label: "Existential",
    description: "Meaning, mortality, and deep loss",
    emoji: "🌑",
    baseRiskLevel: "high",
    states: [
      'grief-mourning',
      'dread-doom',
      'despair-hopeless',
      'regret-guilt',
      'meaningless',
    ],
  },
  'growth-oriented': {
    id: "growth-oriented",
    label: "Growth-Oriented",
    description: "Positive and expanding states",
    emoji: "🌱",
    baseRiskLevel: "low",
    states: [
      'hopeful-motivated',
      'curious-exploring',
      'confident-empowered',
      'grateful-content',
      'peaceful-aligned',
    ],
  },
};

export const advancedStates: Record<AdvancedStateId, AdvancedState> = {
  // DYSREGULATED STATES
  'numb-disconnected': {
    id: "numb-disconnected",
    label: "Numb / Disconnected",
    description: "Feeling emotionally flat, detached from yourself or reality",
    categoryId: "dysregulated",
    baseRiskLevel: "high",
    relatedBasicEmotions: ['numb', 'tired', 'lonely'],
    signals: [
      { id: "cant-feel", label: "Can't feel anything" },
      { id: "autopilot", label: "Going through motions" },
      { id: "dissociated", label: "Feeling unreal", riskIndicator: true },
      { id: "self-harm-urges", label: "Urges to hurt yourself", riskIndicator: true },
      { id: "emotionally-flat", label: "No emotional response" },
    ],
    prompts: [
      {
        id: "when-started",
        text: "When did you first notice feeling disconnected?",
        purpose: "explore",
      },
      {
        id: "body-check",
        text: "Can you feel your body right now? Try pressing your feet into the ground.",
        purpose: "ground",
      },
    ],
    actions: [
      {
        id: "sensory-grounding",
        type: "immediate",
        title: "5-4-3-2-1 Sensory Grounding",
        description: "Reconnect to your body and surroundings",
        priority: 1,
        steps: [
          'Name 5 things you can see',
          'Name 4 things you can touch',
          'Name 3 things you can hear',
          'Name 2 things you can smell',
          'Name 1 thing you can taste',
        ],
      },
      {
        id: "cold-water",
        type: "grounding",
        title: "Cold Water Splash",
        description: "Activate your nervous system gently",
        priority: 2,
        steps: ["Splash cold water on your face', 'Hold ice cube in your hand', 'Take slow breaths"],
      },
      {
        id: "reach-out",
        type: "support",
        title: "Connect with Someone Safe",
        description: "Break isolation with trusted support",
        priority: 3,
      },
    ],
  },

  "overwhelmed-spiraling": {
    id: "overwhelmed-spiraling",
    label: "Overwhelmed / Spiraling",
    description: "Too much to process, thoughts racing, everything feels like too much",
    categoryId: "dysregulated",
    baseRiskLevel: "high",
    relatedBasicEmotions: ['overwhelmed', 'anxious', 'tired'],
    signals: [
      { id: "racing-thoughts", label: "Racing thoughts" },
      { id: "cant-prioritize", label: "Can't prioritize what to do" },
      { id: "physical-panic", label: "Physical panic symptoms", riskIndicator: true },
      { id: "shutdown-imminent", label: "About to shut down", riskIndicator: true },
    ],
    prompts: [
      {
        id: "most-urgent",
        text: "What feels most urgent right now?",
        purpose: "clarify",
      },
      {
        id: "safe-space",
        text: "Can you find a quiet space for the next 5 minutes?",
        purpose: "ground",
      },
    ],
    actions: [
      {
        id: "box-breathing",
        type: "immediate",
        title: "Box Breathing",
        description: "Slow your nervous system",
        priority: 1,
        steps: [
          'Breathe in for 4 counts',
          'Hold for 4 counts',
          'Breathe out for 4 counts',
          'Hold for 4 counts',
          'Repeat 4 times',
        ],
      },
      {
        id: "brain-dump",
        type: "processing",
        title: "Brain Dump",
        description: "Get thoughts out of your head",
        priority: 2,
        steps: [
          'Write everything down without organizing',
          'Circle only what needs action TODAY',
          'Put everything else aside for later',
        ],
      },
      {
        id: "one-thing",
        type: "immediate",
        title: "Pick ONE Thing",
        description: "Do just one small thing right now",
        priority: 3,
      },
    ],
  },

  "rage-destructive": {
    id: "rage-destructive",
    label: "Rage / Destructive Urges",
    description: "Intense anger, urge to break things or lash out",
    categoryId: "dysregulated",
    baseRiskLevel: "high",
    relatedBasicEmotions: ['angry', 'overwhelmed'],
    signals: [
      { id: "want-to-break", label: "Want to break things", riskIndicator: true },
      { id: "violent-thoughts", label: "Violent thoughts", riskIndicator: true },
      { id: "harm-others", label: "Thoughts of harming someone", riskIndicator: true },
      { id: "hot-body", label: "Body feels hot and tense" },
      { id: "losing-control", label: "Feel like losing control", riskIndicator: true },
    ],
    prompts: [
      {
        id: "safety-check",
        text: "Are you safe right now? Is anyone else at risk?",
        purpose: "clarify",
      },
      {
        id: "trigger",
        text: "What just happened before this feeling?",
        purpose: "explore",
      },
    ],
    actions: [
      {
        id: "physical-release",
        type: "immediate",
        title: "Safe Physical Release",
        description: "Release energy without harm",
        priority: 1,
        steps: [
          'Punch a pillow or mattress',
          'Do jumping jacks or run in place',
          'Scream into a pillow',
          'Rip up paper',
        ],
      },
      {
        id: "cold-shower",
        type: "grounding",
        title: "Cold Shower",
        description: "Reset your nervous system",
        priority: 2,
      },
      {
        id: "crisis-contact",
        type: "professional",
        title: "Crisis Support",
        description: "Talk to someone trained RIGHT NOW",
        priority: 1,
      },
    ],
  },

  "manic-impulsive": {
    id: "manic-impulsive",
    label: "Manic / Impulsive",
    description: "Hyper energy, risky decisions, everything feels possible",
    categoryId: "dysregulated",
    baseRiskLevel: "high",
    relatedBasicEmotions: ['excited', 'overwhelmed'],
    signals: [
      { id: "racing-ideas", label: "Racing ideas and plans" },
      { id: "risky-urges", label: "Urge to do risky things", riskIndicator: true },
      { id: "no-sleep", label: "Don't need sleep", riskIndicator: true },
      { id: "unstoppable", label: "Feel unstoppable or invincible" },
    ],
    prompts: [
      {
        id: "sleep-check",
        text: "How many hours have you slept in the last 48 hours?",
        purpose: "clarify",
      },
      {
        id: "grounding-check",
        text: "Can you pause for 5 minutes before acting on any big decisions?",
        purpose: "ground",
      },
    ],
    actions: [
      {
        id: "pause-protocol",
        type: "immediate",
        title: "24-Hour Pause Rule",
        description: "Delay major decisions",
        priority: 1,
        steps: [
          'Write down the decision',
          'Set a timer for 24 hours',
          'Revisit tomorrow before acting',
        ],
      },
      {
        id: "trusted-check",
        type: "support",
        title: "Reality Check with Trusted Person",
        description: "Get outside perspective",
        priority: 2,
      },
      {
        id: "sleep-priority",
        type: "immediate",
        title: "Sleep Hygiene NOW",
        description: "Prioritize rest immediately",
        priority: 1,
      },
    ],
  },

  "dissociated": {
    id: "dissociated",
    label: "Dissociated",
    description: "Feeling outside your body, watching yourself, unreal",
    categoryId: "dysregulated",
    baseRiskLevel: "high",
    relatedBasicEmotions: ['numb', 'anxious', 'overwhelmed'],
    signals: [
      { id: "outside-body", label: "Feel outside your body", riskIndicator: true },
      { id: "dream-like", label: "Everything feels dream-like", riskIndicator: true },
      { id: "time-distortion", label: "Lost track of time" },
      { id: "derealization", label: "World seems fake", riskIndicator: true },
    ],
    prompts: [
      {
        id: "safe-now",
        text: "Are you physically safe right now?",
        purpose: "ground",
      },
      {
        id: "orient",
        text: "Can you name where you are and what day it is?",
        purpose: "ground",
      },
    ],
    actions: [
      {
        id: "grounding-intensive",
        type: "immediate",
        title: "Intensive Grounding",
        description: "Anchor back to your body",
        priority: 1,
        steps: [
          'Stomp your feet',
          'Squeeze ice or hold something cold',
          'Say your name and age out loud',
          'Name 3 objects around you',
        ],
      },
      {
        id: "trauma-informed-breathing",
        type: "grounding",
        title: "Orienting Breath",
        description: "Gentle return to present",
        priority: 2,
        steps: ["Long exhale (count to 6)', 'Normal inhale', 'Repeat 5 times slowly"],
      },
      {
        id: "professional-now",
        type: "professional",
        title: "Contact Therapist or Crisis Line",
        description: "This needs professional support",
        priority: 1,
      },
    ],
  },

  // STRESS RESPONSE STATES
  "anxious-vigilant": {
    id: "anxious-vigilant",
    label: "Anxious / Vigilant",
    description: "On edge, scanning for threats, hard to relax",
    categoryId: "stress-response",
    baseRiskLevel: "medium",
    relatedBasicEmotions: ['anxious', 'overwhelmed'],
    signals: [
      { id: "cant-relax", label: "Can't relax or settle" },
      { id: "scanning", label: "Scanning for danger" },
      { id: "startled", label: "Easily startled" },
      { id: "tight-body", label: "Body feels tight" },
    ],
    prompts: [
      {
        id: "real-threat",
        text: "Is there a real threat right now, or is your body remembering past danger?",
        purpose: "clarify",
      },
    ],
    actions: [
      {
        id: "vagal-tone",
        type: "grounding",
        title: "Vagal Nerve Activation",
        description: "Signal safety to your nervous system",
        priority: 1,
        steps: ["Hum or sing', 'Gargle water', 'Gentle neck stretches"],
      },
      {
        id: "progressive-relaxation",
        type: "grounding",
        title: "Progressive Muscle Relaxation",
        description: "Release physical tension",
        priority: 2,
        toolId: "muscle-relaxation",
      },
    ],
  },

  "panicked": {
    id: "panicked",
    label: "Panicked",
    description: "Heart racing, can't breathe, something terrible is happening",
    categoryId: "stress-response",
    baseRiskLevel: "high",
    relatedBasicEmotions: ['anxious', 'overwhelmed'],
    signals: [
      { id: "heart-racing", label: "Heart racing", riskIndicator: true },
      { id: "cant-breathe", label: "Can't catch breath", riskIndicator: true },
      { id: "going-to-die", label: "Feel like you\"re going to die", riskIndicator: true },
      { id: "dizzy", label: "Dizzy or lightheaded" },
    ],
    prompts: [
      {
        id: "panic-before",
        text: "Have you had panic attacks before?",
        purpose: "clarify",
      },
      {
        id: "safe-person",
        text: "Is there someone nearby who can sit with you?",
        purpose: "ground",
      },
    ],
    actions: [
      {
        id: "panic-breathing",
        type: "immediate",
        title: "Panic Attack Breathing",
        description: "Stop hyperventilation",
        priority: 1,
        steps: [
          'Breathe in through nose (4 counts)',
          'Hold (2 counts)',
          'Breathe out through mouth (6 counts)',
          'Repeat until heart rate slows',
        ],
      },
      {
        id: "cold-water-face",
        type: "immediate",
        title: "Dive Reflex",
        description: "Hold cold water on face for 30 seconds",
        priority: 1,
      },
      {
        id: "crisis-text",
        type: "professional",
        title: "Text Crisis Line",
        description: "Text HOME to 741741",
        priority: 2,
      },
    ],
  },

  "shutdown-avoidant": {
    id: "shutdown-avoidant",
    label: "Shutdown / Avoidant",
    description: "Withdrawing, hiding, can\"t face things",
    categoryId: "stress-response",
    baseRiskLevel: "medium",
    relatedBasicEmotions: ['tired', 'overwhelmed', 'anxious'],
    signals: [
      { id: "hiding", label: "Wanting to hide in bed" },
      { id: "avoiding-all", label: "Avoiding everyone and everything" },
      { id: "no-energy", label: "No energy to cope" },
      { id: "shutting-down", label: "Shutting down emotionally" },
    ],
    prompts: [
      {
        id: "what-avoiding",
        text: "What are you most avoiding right now?",
        purpose: "explore",
      },
      {
        id: "smallest-step",
        text: "What\"s the smallest possible step you could take?",
        purpose: "clarify",
      },
    ],
    actions: [
      {
        id: "micro-step",
        type: "immediate",
        title: "Micro-Step Protocol",
        description: "Do something tiny",
        priority: 1,
        steps: [
          'Sit up in bed',
          'Drink water',
          'Open curtains',
          "That's enough for now",
        ],
      },
      {
        id: "compassionate-check",
        type: "processing",
        title: "Self-Compassion Check",
        description: "Acknowledge you're struggling",
        priority: 2,
      },
    ],
  },

  "irritable-reactive": {
    id: "irritable-reactive",
    label: "Irritable / Reactive",
    description: "Short fuse, snapping at people, everything annoys you",
    categoryId: "stress-response",
    baseRiskLevel: "medium",
    relatedBasicEmotions: ['angry', 'tired', 'overwhelmed'],
    signals: [
      { id: "short-fuse", label: "Very short fuse" },
      { id: "snapping", label: "Snapping at people" },
      { id: "everything-annoys", label: "Everything annoys you" },
      { id: "regret-reactions", label: "Regretting reactions" },
    ],
    prompts: [
      {
        id: "stress-buildup",
        text: "What stress has been building up?",
        purpose: "explore",
      },
    ],
    actions: [
      {
        id: "timeout",
        type: "immediate",
        title: "Take a Timeout",
        description: "Remove yourself before reacting",
        priority: 1,
        steps: [
          'Say "I need a minute"',
          'Walk away if possible',
          'Breathe for 2 minutes',
          'Return when calmer',
        ],
      },
      {
        id: "stress-audit",
        type: "processing",
        title: "Stress Audit",
        description: "Identify what needs to change",
        priority: 2,
      },
    ],
  },

  "exhausted-depleted": {
    id: "exhausted-depleted",
    label: "Exhausted / Depleted",
    description: "Running on empty, nothing left to give",
    categoryId: "stress-response",
    baseRiskLevel: "medium",
    relatedBasicEmotions: ['tired', 'overwhelmed', 'numb'],
    signals: [
      { id: "no-energy", label: "Absolutely no energy" },
      { id: "cant-function", label: "Can't function normally" },
      { id: "burnout", label: "Complete burnout" },
      { id: "nothing-left", label: "Nothing left to give" },
    ],
    prompts: [
      {
        id: "rest-last",
        text: "When did you last truly rest?",
        purpose: "explore",
      },
    ],
    actions: [
      {
        id: "rest-permission",
        type: "immediate",
        title: "Permission to Rest",
        description: "Rest is productive",
        priority: 1,
        steps: [
          'Cancel one thing today',
          'Lie down for 20 minutes',
          'Do absolutely nothing',
        ],
      },
      {
        id: "energy-audit",
        type: "processing",
        title: "Energy Audit",
        description: "What's draining you?",
        priority: 2,
      },
    ],
  },

  // RELATIONAL STATES
  "abandoned-rejected": {
    id: "abandoned-rejected",
    label: "Abandoned / Rejected",
    description: "Left behind, not chosen, not wanted",
    categoryId: "relational",
    baseRiskLevel: "medium",
    relatedBasicEmotions: ['sad', 'lonely', 'anxious'],
    signals: [
      { id: "left-out", label: "Feel left out" },
      { id: "not-wanted", label: "Feel unwanted" },
      { id: "abandoned", label: "Someone left you" },
      { id: "rejected", label: "Feeling rejected" },
    ],
    prompts: [
      {
        id: "what-happened",
        text: "What happened that triggered this feeling?",
        purpose: "explore",
      },
      {
        id: "old-wound",
        text: "Does this remind you of past rejection?",
        purpose: "explore",
      },
    ],
    actions: [
      {
        id: "self-soothing",
        type: "immediate",
        title: "Self-Soothing",
        description: "Comfort yourself",
        priority: 1,
        steps: [
          'Wrap yourself in a blanket',
          'Place hand on heart',
          'Say: "I am here for me"',
        ],
      },
      {
        id: "reach-safe-person",
        type: "support",
        title: "Reach Out to Safe Person",
        description: "Connect with someone who cares",
        priority: 2,
      },
    ],
  },

  "betrayed-distrustful": {
    id: "betrayed-distrustful",
    label: "Betrayed / Distrustful",
    description: "Trust was broken, hard to trust anyone",
    categoryId: "relational",
    baseRiskLevel: "medium",
    relatedBasicEmotions: ['angry', 'sad', 'anxious'],
    signals: [
      { id: "trust-broken", label: "Trust was broken" },
      { id: "cant-trust", label: "Can't trust anyone" },
      { id: "questioning-all", label: "Questioning all relationships" },
      { id: "walls-up", label: "Putting walls up" },
    ],
    prompts: [
      {
        id: "betrayal-story",
        text: "What happened?",
        purpose: "explore",
      },
    ],
    actions: [
      {
        id: "validate-betrayal",
        type: "processing",
        title: "Validate Your Feelings",
        description: "Betrayal is real and painful",
        priority: 1,
      },
      {
        id: "safe-trust",
        type: "processing",
        title: "Identify Who IS Safe",
        description: "Not everyone betrays",
        priority: 2,
      },
    ],
  },

  "envious-resentful": {
    id: "envious-resentful",
    label: "Envious / Resentful",
    description: "Others have what you want, feels unfair",
    categoryId: "relational",
    baseRiskLevel: "low",
    relatedBasicEmotions: ['angry', 'sad'],
    signals: [
      { id: "comparing", label: "Constantly comparing" },
      { id: "not-fair", label: "Life feels unfair" },
      { id: "bitter", label: "Feeling bitter" },
      { id: "want-what-they-have", label: "Want what others have" },
    ],
    prompts: [
      {
        id: "what-want",
        text: "What do you really want for yourself?",
        purpose: "clarify",
      },
    ],
    actions: [
      {
        id: "envy-as-data",
        type: "processing",
        title: "Envy as Information",
        description: "What is it telling you about your desires?",
        priority: 1,
      },
      {
        id: "gratitude-shift",
        type: "processing",
        title: "Gratitude List",
        description: "What do you have?",
        priority: 2,
      },
    ],
  },

  "codependent-enmeshed": {
    id: "codependent-enmeshed",
    label: "Codependent / Enmeshed",
    description: "Can't tell where you end and others begin",
    categoryId: "relational",
    baseRiskLevel: "medium",
    relatedBasicEmotions: ['anxious', 'overwhelmed', 'guilty'],
    signals: [
      { id: "their-feelings", label: "Taking on their feelings" },
      { id: "cant-say-no", label: "Can't say no" },
      { id: "lose-self", label: "Losing yourself in relationships" },
      { id: "responsible-for-them", label: "Feel responsible for their happiness" },
    ],
    prompts: [
      {
        id: "your-needs",
        text: "What do YOU need right now?",
        purpose: "clarify",
      },
    ],
    actions: [
      {
        id: "boundary-practice",
        type: "processing",
        title: "Practice Boundaries",
        description: 'Start with one small "no"',
        priority: 1,
      },
      {
        id: "differentiation",
        type: "processing",
        title: "Their Feelings ≠ Your Responsibility",
        description: "Separate yourself",
        priority: 2,
      },
    ],
  },

  "isolated-disconnected": {
    id: "isolated-disconnected",
    label: "Isolated / Disconnected",
    description: "Alone, no one understands, cut off",
    categoryId: "relational",
    baseRiskLevel: "medium",
    relatedBasicEmotions: ['lonely', 'sad', 'numb'],
    signals: [
      { id: "totally-alone", label: "Feel totally alone" },
      { id: "no-one-gets-it", label: "No one understands" },
      { id: "cut-off", label: "Cut off from everyone" },
      { id: "invisible", label: "Feel invisible" },
    ],
    prompts: [
      {
        id: "when-connected",
        text: "When did you last feel connected?",
        purpose: "explore",
      },
    ],
    actions: [
      {
        id: "small-connection",
        type: "support",
        title: "One Small Connection",
        description: "Text one person",
        priority: 1,
      },
      {
        id: "community-find",
        type: "support",
        title: "Find Your People",
        description: "Look for communities that get you",
        priority: 2,
      },
    ],
  },

  "loneliness": {
    id: "loneliness",
    label: "Loneliness",
    description: "Deep longing for connection and companionship",
    categoryId: "relational",
    baseRiskLevel: "medium",
    relatedBasicEmotions: ['sad', 'anxious', 'lonely'],
    signals: [
      { id: "aching-alone", label: "Aching feeling of being alone" },
      { id: "no-one-reach", label: "No one to reach out to" },
      { id: "forgotten", label: "Feel forgotten" },
      { id: "craving-connection", label: "Craving human connection" },
    ],
    prompts: [
      {
        id: "who-helps",
        text: "Who in your life might understand?",
        purpose: "clarify",
      },
    ],
    actions: [
      {
        id: "reach-out",
        type: "support",
        title: "Reach Out",
        description: "Send a message to someone you trust",
        priority: 1,
      },
      {
        id: "self-compassion",
        type: "processing",
        title: "Self-Compassion",
        description: "Be kind to yourself in this moment",
        priority: 2,
      },
    ],
  },

  // IDENTITY STATES
  "shame-inadequate": {
    id: "shame-inadequate",
    label: "Shame / Inadequate",
    description: "Not good enough, fundamentally flawed",
    categoryId: "identity",
    baseRiskLevel: "medium",
    relatedBasicEmotions: ['guilty', 'sad', 'anxious'],
    signals: [
      { id: "not-enough", label: "Not good enough" },
      { id: "fundamentally-flawed", label: "Fundamentally broken" },
      { id: "hide-self", label: "Want to hide who you are" },
      { id: "toxic-shame", label: "Pervasive shame" },
    ],
    prompts: [
      {
        id: "shame-voice",
        text: "What is the shame voice saying?",
        purpose: "explore",
      },
      {
        id: "whose-voice",
        text: "Whose voice does that sound like?",
        purpose: "explore",
      },
    ],
    actions: [
      {
        id: "shame-resilience",
        type: "processing",
        title: "Shame Resilience",
        description: "Name the shame out loud",
        priority: 1,
        steps: [
          'Say: "I\'m feeling shame"',
          'Identify the trigger',
          'Talk to someone safe about it',
        ],
      },
      {
        id: "self-compassion",
        type: "processing",
        title: "Self-Compassion Practice",
        description: "What would you tell a friend?",
        priority: 2,
      },
    ],
  },

  "confused-lost": {
    id: "confused-lost",
    label: "Confused / Lost",
    description: "Don\"t know who you are or what you want",
    categoryId: "identity",
    baseRiskLevel: "medium",
    relatedBasicEmotions: ['anxious', 'overwhelmed', 'sad'],
    signals: [
      { id: "no-direction", label: "No sense of direction" },
      { id: "who-am-i", label: "Don't know who you are" },
      { id: "lost-path", label: "Lost your path" },
      { id: "identity-crisis", label: "Identity crisis" },
    ],
    prompts: [
      {
        id: "what-lost",
        text: "What feels most confusing right now?",
        purpose: "clarify",
      },
    ],
    actions: [
      {
        id: "values-clarification",
        type: "processing",
        title: "Values Clarification",
        description: "What matters to you?",
        priority: 1,
      },
      {
        id: "experiment",
        type: "processing",
        title: "Try Things",
        description: "You learn by doing",
        priority: 2,
      },
    ],
  },

  "fraudulent-impostor": {
    id: "fraudulent-impostor",
    label: "Fraudulent / Impostor",
    description: "Faking it, will be exposed as fraud",
    categoryId: "identity",
    baseRiskLevel: "low",
    relatedBasicEmotions: ['anxious', 'guilty'],
    signals: [
      { id: "not-qualified", label: "Don't deserve success" },
      { id: "fooling-everyone", label: "Fooling everyone" },
      { id: "exposed-soon", label: "Will be exposed" },
      { id: "luck-not-skill", label: "Success is just luck" },
    ],
    prompts: [
      {
        id: "evidence",
        text: "What evidence do you have that you earned this?",
        purpose: "clarify",
      },
    ],
    actions: [
      {
        id: "impostor-normalize",
        type: "processing",
        title: "Normalize Impostor Feelings",
        description: "70% of people feel this",
        priority: 1,
      },
      {
        id: "track-wins",
        type: "processing",
        title: "Track Your Wins",
        description: "Keep evidence of competence",
        priority: 2,
      },
    ],
  },

  "empty-purposeless": {
    id: "empty-purposeless",
    label: "Empty / Purposeless",
    description: "Life has no meaning, nothing matters",
    categoryId: "identity",
    baseRiskLevel: "high",
    relatedBasicEmotions: ['numb', 'sad', 'lonely'],
    signals: [
      { id: "no-meaning", label: "Life feels meaningless", riskIndicator: true },
      { id: "hollow", label: "Feel hollow inside" },
      { id: "no-purpose", label: "No sense of purpose" },
      { id: "why-bother", label: "Why bother?", riskIndicator: true },
    ],
    prompts: [
      {
        id: "when-felt-meaning",
        text: "When did life last feel meaningful?",
        purpose: "explore",
      },
    ],
    actions: [
      {
        id: "small-purpose",
        type: "immediate",
        title: "Find One Small Purpose Today",
        description: "Help someone, create something",
        priority: 1,
      },
      {
        id: "therapy-meaning",
        type: "professional",
        title: "Existential Therapy",
        description: "This needs deeper work",
        priority: 1,
      },
    ],
  },

  "conflicted-torn": {
    id: "conflicted-torn",
    label: "Conflicted / Torn",
    description: "Pulled in different directions, can\"t reconcile",
    categoryId: "identity",
    baseRiskLevel: "low",
    relatedBasicEmotions: ['anxious', 'overwhelmed'],
    signals: [
      { id: "opposing-desires", label: "Opposing desires" },
      { id: "cant-choose", label: "Can't choose" },
      { id: "identity-conflict", label: "Parts of you conflict" },
      { id: "paralyzed", label: "Paralyzed by choice" },
    ],
    prompts: [
      {
        id: "two-sides",
        text: "What are the two sides pulling at you?",
        purpose: "clarify",
      },
    ],
    actions: [
      {
        id: "parts-work",
        type: "processing",
        title: "Parts Work",
        description: "Listen to each part",
        priority: 1,
      },
      {
        id: "values-decision",
        type: "processing",
        title: "Values-Based Decision",
        description: "What aligns with your values?",
        priority: 2,
      },
    ],
  },

  // EXISTENTIAL STATES
  "grief-mourning": {
    id: "grief-mourning",
    label: "Grief / Mourning",
    description: "Processing loss, deep sadness",
    categoryId: "existential",
    baseRiskLevel: "high",
    relatedBasicEmotions: ['sad', 'lonely', 'overwhelmed'],
    signals: [
      { id: "profound-loss", label: "Profound loss" },
      { id: "waves-sadness", label: "Waves of sadness" },
      { id: "missing-them", label: "Missing someone/something deeply" },
      { id: "cant-accept", label: "Can't accept the loss" },
    ],
    prompts: [
      {
        id: "what-lost",
        text: "What or who did you lose?",
        purpose: "validate",
      },
    ],
    actions: [
      {
        id: "grief-permission",
        type: "processing",
        title: "Permission to Grieve",
        description: "Grief is love with nowhere to go",
        priority: 1,
      },
      {
        id: "ritual",
        type: "processing",
        title: "Create a Ritual",
        description: "Honor what was lost",
        priority: 2,
      },
      {
        id: "grief-support",
        type: "support",
        title: "Grief Support Group",
        description: "Be with others who understand",
        priority: 2,
      },
    ],
  },

  "dread-doom": {
    id: "dread-doom",
    label: "Dread / Doom",
    description: "Something terrible is coming, can\"t escape",
    categoryId: "existential",
    baseRiskLevel: "high",
    relatedBasicEmotions: ['anxious', 'overwhelmed'],
    signals: [
      { id: "impending-doom", label: "Sense of impending doom", riskIndicator: true },
      { id: "catastrophe-coming", label: "Catastrophe is coming" },
      { id: "cant-escape", label: "Can't escape", riskIndicator: true },
      { id: "existential-dread", label: "Deep existential dread" },
    ],
    prompts: [
      {
        id: "dread-specific",
        text: "What specifically do you dread?",
        purpose: "clarify",
      },
    ],
    actions: [
      {
        id: "reality-test",
        type: "processing",
        title: "Reality Test",
        description: "What is actually happening right now?",
        priority: 1,
      },
      {
        id: "ground-present",
        type: "grounding",
        title: "Ground in Present",
        description: "Dread lives in future",
        priority: 1,
      },
      {
        id: "crisis-support-dread",
        type: "professional",
        title: "Crisis Support",
        description: "This level of dread needs help",
        priority: 1,
      },
    ],
  },

  "despair-hopeless": {
    id: "despair-hopeless",
    label: "Despair / Hopeless",
    description: "No hope, nothing will get better",
    categoryId: "existential",
    baseRiskLevel: "high",
    relatedBasicEmotions: ['sad', 'numb', 'overwhelmed'],
    signals: [
      { id: "no-hope", label: "No hope", riskIndicator: true },
      { id: "never-better", label: "Things will never get better", riskIndicator: true },
      { id: "giving-up", label: "Giving up", riskIndicator: true },
      { id: "no-reason-live", label: "No reason to live", riskIndicator: true },
      { id: "suicidal-thoughts", label: "Thoughts of ending life", riskIndicator: true },
    ],
    prompts: [
      {
        id: "safety-plan",
        text: "Do you have thoughts of hurting yourself?",
        purpose: "clarify",
      },
    ],
    actions: [
      {
        id: "crisis-now",
        type: "professional",
        title: "Call Crisis Line NOW",
        description: "988 Suicide & Crisis Lifeline",
        priority: 1,
      },
      {
        id: "safety-plan-activate",
        type: "immediate",
        title: "Activate Safety Plan",
        description: "Call your emergency contact",
        priority: 1,
      },
      {
        id: "er-option",
        type: "professional",
        title: "Go to Emergency Room",
        description: "You need immediate support",
        priority: 1,
      },
    ],
  },

  "regret-guilt": {
    id: "regret-guilt",
    label: "Regret / Guilt",
    description: "Should have done differently, hurt someone",
    categoryId: "existential",
    baseRiskLevel: "medium",
    relatedBasicEmotions: ['guilty', 'sad'],
    signals: [
      { id: "cant-forgive-self", label: "Can't forgive yourself" },
      { id: "replay-mistake", label: "Replaying the mistake" },
      { id: "hurt-someone", label: "Hurt someone you care about" },
      { id: "wish-undo", label: "Wish you could undo it" },
    ],
    prompts: [
      {
        id: "what-happened",
        text: "What happened?",
        purpose: "explore",
      },
      {
        id: "amends",
        text: "Is there a way to make amends?",
        purpose: "clarify",
      },
    ],
    actions: [
      {
        id: "repair-action",
        type: "immediate",
        title: "Take Repair Action",
        description: "Apologize, make amends",
        priority: 1,
      },
      {
        id: "self-forgiveness",
        type: "processing",
        title: "Self-Forgiveness Work",
        description: "You are human",
        priority: 2,
      },
    ],
  },

  "meaningless": {
    id: "meaningless",
    label: "Meaningless",
    description: "Nothing matters, existence is absurd",
    categoryId: "existential",
    baseRiskLevel: "high",
    relatedBasicEmotions: ['numb', 'sad'],
    signals: [
      { id: "nothing-matters", label: "Nothing matters", riskIndicator: true },
      { id: "absurd", label: "Life feels absurd" },
      { id: "no-significance", label: "No significance to anything" },
      { id: "existential-void", label: "Staring into void" },
    ],
    prompts: [
      {
        id: "meaning-before",
        text: "What gave your life meaning before?",
        purpose: "explore",
      },
    ],
    actions: [
      {
        id: "create-meaning",
        type: "processing",
        title: "Create Meaning",
        description: "Meaning is made, not found",
        priority: 1,
      },
      {
        id: "contribution",
        type: "processing",
        title: "Contribute Something",
        description: "Meaning comes from giving",
        priority: 2,
      },
      {
        id: "existential-therapy",
        type: "professional",
        title: "Existential Therapy",
        description: "Work with meaning-focused therapist",
        priority: 1,
      },
    ],
  },

  // GROWTH-ORIENTED STATES
  "hopeful-motivated": {
    id: "hopeful-motivated",
    label: "Hopeful / Motivated",
    description: "Things can get better, ready to try",
    categoryId: "growth-oriented",
    baseRiskLevel: "low",
    relatedBasicEmotions: ['excited', 'grateful'],
    signals: [
      { id: "see-possibility", label: "See possibility" },
      { id: "ready-to-act", label: "Ready to take action" },
      { id: "optimistic", label: "Feeling optimistic" },
      { id: "future-looks-better", label: "Future looks brighter" },
    ],
    prompts: [
      {
        id: "what-hoping-for",
        text: "What are you hoping for?",
        purpose: "explore",
      },
    ],
    actions: [
      {
        id: "goal-setting",
        type: "processing",
        title: "Set Clear Goals",
        description: "Channel motivation into action",
        priority: 1,
      },
      {
        id: "first-step",
        type: "immediate",
        title: "Take First Step",
        description: "What's one thing you can do today?",
        priority: 1,
      },
    ],
  },

  "curious-exploring": {
    id: "curious-exploring",
    label: "Curious / Exploring",
    description: "Open to new experiences, learning",
    categoryId: "growth-oriented",
    baseRiskLevel: "low",
    relatedBasicEmotions: ['excited', 'calm'],
    signals: [
      { id: "open-minded", label: "Open-minded" },
      { id: "want-to-learn", label: "Want to learn" },
      { id: "exploring", label: "Exploring new things" },
      { id: "engaged", label: "Feeling engaged" },
    ],
    prompts: [
      {
        id: "exploring-what",
        text: "What are you curious about?",
        purpose: "explore",
      },
    ],
    actions: [
      {
        id: "follow-curiosity",
        type: "immediate",
        title: "Follow Your Curiosity",
        description: "Try something new",
        priority: 1,
      },
      {
        id: "learn-something",
        type: "processing",
        title: "Learn Something Today",
        description: "Feed your curiosity",
        priority: 2,
      },
    ],
  },

  "confident-empowered": {
    id: "confident-empowered",
    label: "Confident / Empowered",
    description: "Capable, strong, can handle this",
    categoryId: "growth-oriented",
    baseRiskLevel: "low",
    relatedBasicEmotions: ['proud', 'excited'],
    signals: [
      { id: "feel-capable", label: "Feel capable" },
      { id: "trust-yourself", label: "Trust yourself" },
      { id: "empowered", label: "Feeling empowered" },
      { id: "strong", label: "Feeling strong" },
    ],
    prompts: [
      {
        id: "what-built-confidence",
        text: "What built this confidence?",
        purpose: "validate",
      },
    ],
    actions: [
      {
        id: "celebrate-strength",
        type: "processing",
        title: "Celebrate Your Strength",
        description: "Acknowledge your growth",
        priority: 1,
      },
      {
        id: "use-strength",
        type: "immediate",
        title: "Use This Energy",
        description: "What can you tackle now?",
        priority: 2,
      },
    ],
  },

  "grateful-content": {
    id: "grateful-content",
    label: "Grateful / Content",
    description: "Appreciating what is, feeling satisfied",
    categoryId: "growth-oriented",
    baseRiskLevel: "low",
    relatedBasicEmotions: ['grateful', 'calm'],
    signals: [
      { id: "appreciating-life", label: "Appreciating life" },
      { id: "satisfied", label: "Feeling satisfied" },
      { id: "present", label: "Present in the moment" },
      { id: "enough", label: "This is enough" },
    ],
    prompts: [
      {
        id: "grateful-for",
        text: "What are you grateful for?",
        purpose: "validate",
      },
    ],
    actions: [
      {
        id: "gratitude-practice",
        type: "processing",
        title: "Gratitude Practice",
        description: "Deepen appreciation",
        priority: 1,
      },
      {
        id: "share-gratitude",
        type: "support",
        title: "Share Your Gratitude",
        description: "Tell someone you appreciate them",
        priority: 2,
      },
    ],
  },

  "peaceful-aligned": {
    id: "peaceful-aligned",
    label: "Peaceful / Aligned",
    description: "In harmony with yourself and life",
    categoryId: "growth-oriented",
    baseRiskLevel: "low",
    relatedBasicEmotions: ['calm', 'grateful'],
    signals: [
      { id: "inner-peace", label: "Inner peace" },
      { id: "aligned-values", label: "Aligned with values" },
      { id: "flow", label: "In flow" },
      { id: "harmony", label: "Feeling harmony" },
    ],
    prompts: [
      {
        id: "what-created-peace",
        text: "What created this peace?",
        purpose: "validate",
      },
    ],
    actions: [
      {
        id: "savor-moment",
        type: "immediate",
        title: "Savor This Moment",
        description: "Let it sink in",
        priority: 1,
      },
      {
        id: "note-what-works",
        type: "processing",
        title: "Note What Works",
        description: "Remember what created this",
        priority: 2,
      },
    ],
  },
};

// Helper functions
export function getCategoryById(id: AdvancedCategoryId): AdvancedCategory {
  return advancedCategories[id];
}

export function getStateById(id: AdvancedStateId): AdvancedState {
  return advancedStates[id];
}

export function getStatesByCategory(categoryId: AdvancedCategoryId): AdvancedState[] {
  const category = advancedCategories[categoryId];
  return category.states.map(stateId => advancedStates[stateId]);
}

/**
 * RISK CALCULATION - HARD-LOCKED RULES
 *
 * This function implements the official risk escalation protocol.
 * See src/utils/riskEscalation.ts for complete documentation.
 *
 * Formula:
 * RiskScore = baseRiskNumeric + intensityModifier + dangerSignalModifier
 *
 * Where:
 * - baseRiskNumeric: low=1, medium=2, high=3
 * - intensityModifier: +1 if intensity >= 7, else 0
 * - dangerSignalModifier: +2 if danger signal present, else 0
 *
 * DO NOT MODIFY without clinical review.
 */
export function calculateRiskLevel(
  baseRisk: RiskLevel,
  intensity: number,
  hasRiskSignals: boolean
): RiskLevel {
  // Convert base risk to numeric: low=1, medium=2, high=3
  const baseRiskNumeric = baseRisk === 'high' ? 3 : baseRisk === 'medium' ? 2 : 1;

  // Intensity modifier: +1 if intensity >= 7
  const intensityModifier = intensity >= 7 ? 1 : 0;

  // Danger signal modifier: +2 if risk signals present
  // Note: hasRiskSignals indicates presence of danger signals
  const dangerSignalModifier = hasRiskSignals ? 2 : 0;

  // Calculate final risk score (1-6 range)
  const riskScore = baseRiskNumeric + intensityModifier + dangerSignalModifier;

  // Convert score to risk level
  // 5-6: high
  // 3-4: medium
  // 1-2: low
  if (riskScore >= 5) return 'high';
  if (riskScore >= 3) return 'medium';
  return 'low';
}

export function getBasicEmotionMapping(stateId: AdvancedStateId): string[] {
  return advancedStates[stateId].relatedBasicEmotions;
}

export function findStatesByBasicEmotion(basicEmotion: string): AdvancedState[] {
  return Object.values(advancedStates).filter(state =>
    state.relatedBasicEmotions.includes(basicEmotion)
  );
}
