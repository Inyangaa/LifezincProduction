export type AgeGroup = "teen" | "youngAdult" | "adult" | "mature";

export type EmotionKey =
  | "sad"
  | "anxious"
  | "worried"
  | "exhausted"
  | "angry"
  | "frustrated"
  | "lonely"
  | "confused"
  | "overwhelmed"
  | "motivated"
  | "grateful"
  | "embarrassed"
  | "ashamed"
  | "heartbroken";

export type RecycleEntry = {
  meaning: string;
  interpretation: string;
  recycledOutcome: string;
  guidanceByAge: Record<AgeGroup, string>;
  grounding: string;
  faithHint: string;
};

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

export type TopicModifier = {
  descriptionByAge: Record<AgeGroup, string>;
};

export const ageFilteredEmotionRecycle: Record<EmotionKey, RecycleEntry> = {
  sad: {
    meaning: "Sadness is emotional heaviness, hurt, or disappointment. It signals that something matters to you.",
    interpretation: "Sadness signals loss, unmet needs, or a gap between what you hoped for and what happened. It asks for gentleness, not productivity.",
    recycledOutcome: "Your sadness becomes clarity about what needs comfort, care, or boundaries. You're learning to hold space for pain while believing in lighter days.",
    guidanceByAge: {
      teen: "This sadness is real. You don't have to fix it right away. Let yourself feel it for a bit. Can you name one small thing that might bring even a tiny bit of comfort? Maybe talking to someone safe, listening to a song you love, or just resting. You're not alone in this.",
      youngAdult: "Sadness doesn't mean you're weak or failing. It means something mattered to you. Give yourself permission to sit with this feeling without rushing to 'fix' it. What would you tell a friend who felt this way? Can you offer yourself that same kindness?",
      adult: "Your sadness is valid, even if others don't fully understand it. This feeling carries information about what you value and what needs attention. You can acknowledge the pain while also taking one small step toward self-compassion. What boundary or comfort do you need right now?",
      mature: "Sadness at this stage often carries wisdom—it reflects depth, not weakness. You've weathered difficult seasons before. This moment asks for self-compassion and patience. What have you learned in the past about holding space for grief while still moving forward gently?"
    },
    grounding: "Inhale slowly for 4 counts, hold for 2, exhale gently for 6. Repeat 5 times.",
    faithHint: "Choose a verse, prayer, or truth that reminds you that you're held, even in sadness."
  },

  anxious: {
    meaning: "Anxiety is your mind racing, anticipating threats, or preparing for the worst. It feels like constant alert.",
    interpretation: "Anxiety is your brain's alarm system working overtime. It means you care deeply about what happens next, but it often overestimates danger.",
    recycledOutcome: "Your anxiety is being separated into what you can control and what you can't. You're moving from spinning thoughts to grounded clarity, one breath at a time.",
    guidanceByAge: {
      teen: "Your anxious thoughts are loud, but they're not always true. Your brain is trying to protect you, but it might be overreacting. Can you name the worry out loud or write it down? Sometimes just seeing it on paper helps. You're safe right now in this moment.",
      youngAdult: "Anxiety often makes everything feel urgent and catastrophic. But you've gotten through hard things before. Can you separate the thought from the fact? Ask yourself: What's actually happening right now versus what I'm afraid might happen? You have more control than anxiety wants you to believe.",
      adult: "Anxiety can feel like drowning in 'what ifs.' But you can choose to anchor yourself in what is. Name 3 things you can see, 2 you can touch, 1 you can hear. This interrupts the spiral. What's one small step you can take to address the real concern underneath the worry?",
      mature: "You've lived long enough to know that most of what we worry about never happens. Anxiety at this stage often reflects accumulated stress or life transitions. What tool has worked for you in the past? Can you return to that practice now? Your experience is a resource."
    },
    grounding: "Breathe in for 4 counts, out for 6 counts. Focus only on counting. Repeat for 2 minutes.",
    faithHint: "Speak or recall a truth that reminds you that you're not in control of everything—and that's okay."
  },

  worried: {
    meaning: "Worry is being caught in 'what if' thinking, anticipating problems before they arrive.",
    interpretation: "Worry shows you care about outcomes. But it often magnifies unlikely scenarios and keeps you stuck in your head.",
    recycledOutcome: "Your worry is being redirected toward what you can actually influence right now. You're building a plan instead of spinning in fear.",
    guidanceByAge: {
      teen: "When you're worried, your brain keeps replaying the bad things that might happen. But most of those things won't actually happen. Can you write down your biggest worry and then write one other way it could turn out? You have more power than worry tells you.",
      youngAdult: "Worry keeps you in your head, imagining the worst. But what if you redirected that energy? Make a simple list: What can I control? What can't I control? For the things you can't control, practice letting them go. For the things you can, take one small action.",
      adult: "Worry is often a disguised need for control. But you can't control everything, and that's actually freeing. What's the real fear underneath the worry? If the worst happened, what would you do? Often, realizing you'd handle it takes away worry's power.",
      mature: "Worry at this stage may feel familiar—you've worried before and survived. But worry steals your peace without adding value. What practices have helped you release worry in the past? Can you trust that you'll handle what comes, as you always have?"
    },
    grounding: "Place one hand on your chest, one on your belly. Breathe deeply and feel both hands rise and fall. Do this for 1 minute.",
    faithHint: "Pray or reflect on surrendering what you can't control. Trust is a practice, not a feeling."
  },

  exhausted: {
    meaning: "Exhaustion is running on empty—physically, mentally, or emotionally. It's your body's loud request for rest.",
    interpretation: "Exhaustion is not laziness. It's a signal that you've been giving more than you've been receiving. It's wisdom, not weakness.",
    recycledOutcome: "Your fatigue is being honored as a signal to pause, not ignored as inconvenience. Rest becomes productive when it's needed.",
    guidanceByAge: {
      teen: "You're tired for a reason. Maybe school is intense, or you're dealing with a lot emotionally. That's real. You don't have to push through everything. Can you give yourself 10 minutes to just rest—no phone, no pressure? You deserve that.",
      youngAdult: "Exhaustion at this stage often comes from trying to do everything perfectly. But you're human, not a machine. What's one thing you can delay, delegate, or do more lightly today? Rest isn't something you earn—it's something you need.",
      adult: "You've been carrying a heavy load. Exhaustion is your body saying it can't keep this pace. What would it look like to protect your energy like you protect your time? Can you say no to one thing this week to create space for rest?",
      mature: "Exhaustion may come from years of pushing, or from life transitions that demand extra energy. Your body needs rest differently now than it did before. What does restoration look like for you at this stage? Honor that need without guilt."
    },
    grounding: "Lie down or sit comfortably. Close your eyes. Take 3 slow breaths. Let your body fully rest for 5 minutes.",
    faithHint: "Rest is sacred. Reflect on the truth that even God rested. You are allowed to do the same."
  },

  angry: {
    meaning: "Anger is heat, reactivity, or the feeling that boundaries have been crossed. It's powerful and protective.",
    interpretation: "Anger protects your values and limits. It points to something that matters deeply—often a boundary that was violated.",
    recycledOutcome: "Your anger is revealing the boundary that was crossed and the need underneath. You're transforming reaction into clear communication.",
    guidanceByAge: {
      teen: "Anger is trying to tell you something. Maybe someone wasn't fair, or you feel unheard. That's valid. But how you express it matters. Can you pause before you react? Try saying: 'I'm angry because...' to someone safe. You're allowed to have boundaries.",
      youngAdult: "Your anger is information. It's showing you where a line was crossed or where you need to speak up. Instead of exploding or stuffing it down, can you name the boundary? 'I'm upset because X happened, and I need Y.' That's how anger becomes clarity.",
      adult: "Anger often masks hurt, fear, or unmet needs. What's underneath the anger? Once you name that, you can communicate it clearly. You're allowed to be firm without being destructive. What boundary do you need to set, and how can you say it with strength and respect?",
      mature: "Anger at this stage may feel different—less explosive, more focused. You've learned that unchecked anger damages relationships. But suppressed anger damages you. What's the wise way to honor this feeling while protecting what matters? Clarity is your tool."
    },
    grounding: "Take 10 deep breaths. With each exhale, imagine releasing the heat. Count slowly. This creates space between feeling and action.",
    faithHint: "Anger is not sin, but what you do with it matters. Pray for wisdom to express it justly and clearly."
  },

  frustrated: {
    meaning: "Frustration is feeling stuck, blocked, or repeatedly hitting the same obstacle. It's exhausting and demoralizing.",
    interpretation: "Frustration signals misalignment between expectation and reality. Something isn't working the way you thought it would.",
    recycledOutcome: "Your frustration is showing you where adjustment is needed. You're shifting from forcing to flowing, from rigidity to adaptability.",
    guidanceByAge: {
      teen: "When things don't go your way, it's easy to feel stuck or annoyed. That's frustration. It usually means you're trying really hard but not seeing results. Can you take a break and come back to it? Sometimes stepping away helps you see a new way forward.",
      youngAdult: "Frustration often comes from trying the same thing over and over. But what if you tried a different approach? Can you ask for help, change your strategy, or adjust your expectations? You're not failing—you're learning what doesn't work so you can find what does.",
      adult: "Frustration is feedback. It's telling you that the current path isn't working. Instead of pushing harder, can you pause and reassess? What assumption are you making that might be wrong? What would a completely different approach look like?",
      mature: "You've experienced frustration before and found your way through. What did you learn then that applies now? Frustration at this stage often invites wisdom over force. Can you release the need to control the outcome and focus on what you can influence?"
    },
    grounding: "Unclench your jaw. Drop your shoulders. Shake out your hands. Take 3 deep breaths. Release physical tension.",
    faithHint: "Ask for patience and the humility to see what you might be missing. Surrender the outcome."
  },

  lonely: {
    meaning: "Loneliness is feeling unseen, disconnected, or like you're on the outside looking in. It aches.",
    interpretation: "Loneliness is your need for connection calling out. It's human and valid, not a sign of weakness.",
    recycledOutcome: "Your loneliness is being transformed into intentional connection. One text. One call. One small reach toward others.",
    guidanceByAge: {
      teen: "Feeling lonely is one of the hardest things, especially when it seems like everyone else is fine. But you're not the only one who feels this way. Can you reach out to one person—even just to say hi? Sometimes connection starts with a small, brave step. You matter.",
      youngAdult: "Loneliness can feel overwhelming, especially in a world full of people. But connection requires vulnerability. Can you reach out to someone you trust? Or find a group or community where you belong? You don't have to do this alone, even though it feels that way right now.",
      adult: "Loneliness at this stage often comes from life transitions or feeling misunderstood. But connection is still possible. Who in your life can you reach out to with honesty? What community could you engage with? Meaningful connection takes courage, but it's worth it.",
      mature: "Loneliness may feel different now—perhaps tied to loss, life changes, or distance from loved ones. But you still need connection. Who can you reach out to? What relationships can you invest in, even in small ways? You have much to offer and much to receive."
    },
    grounding: "Place your hand on your heart. Breathe deeply. Remind yourself: I am here. I am enough. I am worthy of connection.",
    faithHint: "You are never truly alone. Reflect on the truth that you are seen, known, and loved—even when it doesn't feel like it."
  },

  confused: {
    meaning: "Confusion is not knowing which way to turn, feeling unclear or stuck in uncertainty.",
    interpretation: "Confusion is often a transition state—you're between old understanding and new clarity. It's uncomfortable but not permanent.",
    recycledOutcome: "Your confusion is being met with curiosity, not judgment. You're asking better questions instead of demanding instant answers.",
    guidanceByAge: {
      teen: "When you're confused, everything can feel foggy. That's okay—you don't have to have it all figured out right now. Can you write down what's confusing you? Sometimes seeing it on paper helps. You're allowed to not know. You'll figure it out step by step.",
      youngAdult: "Confusion often comes when you're facing new decisions or unclear paths. But uncertainty is part of growth. Can you give yourself permission to explore without having all the answers? What's one small question you can answer today, even if the big picture is still unclear?",
      adult: "Confusion can be frustrating, especially when you feel like you should know better. But not knowing is okay. What information do you need? Who can you talk to? Sometimes clarity comes through conversation, not just internal processing. Trust the process.",
      mature: "Confusion at this stage may feel unexpected—you've lived enough to feel like you should have answers. But life still surprises us. What wisdom have you gained from past confusion? Can you trust that clarity will come, as it has before, in its own time?"
    },
    grounding: "Sit quietly. Breathe deeply. Say to yourself: 'I don't need to know everything right now. I can take one step at a time.'",
    faithHint: "Pray for wisdom and trust that the next right step will be revealed when you need it."
  },

  overwhelmed: {
    meaning: "Overwhelm is when everything feels like too much. Your capacity is maxed out and your mind is spinning.",
    interpretation: "Overwhelm happens when demands exceed your current resources. It's a signal to pause, not push harder.",
    recycledOutcome: "You're putting down the mental load, even for a moment. One breath. One task. One step. That's enough right now.",
    guidanceByAge: {
      teen: "When everything feels like too much, your brain goes into overdrive. It's scary and exhausting. But you don't have to do it all right now. Can you pick just one thing to focus on? Put everything else aside for a bit. You're doing better than you think.",
      youngAdult: "Overwhelm is your sign that you're carrying too much. It's okay to say no, to ask for help, or to scale back. What's one thing you can let go of today? What's one thing you can delegate? You're not supposed to handle everything perfectly.",
      adult: "Overwhelm is not a personal failure—it's a sign that your load is unsustainable. What can you delay? What can you delegate? What can you do more lightly? You have permission to reduce the pressure. Start with one small step.",
      mature: "Overwhelm at this stage may reflect accumulated responsibilities or life transitions. You've managed heavy loads before, but this one might require a different strategy. What would lightening the load look like? Can you ask for support without guilt?"
    },
    grounding: "Stop. Breathe. Focus only on this moment. Not the next hour, not tomorrow. Just this breath. Repeat for 2 minutes.",
    faithHint: "You were not made to carry everything. Surrender what's too heavy. Trust that you're not alone in this."
  },

  motivated: {
    meaning: "Motivation is energy, drive, and forward momentum. You feel ready to take action and make progress.",
    interpretation: "Motivation is a gift—it's your inner fuel saying 'yes' to something that matters. Use it wisely while it lasts.",
    recycledOutcome: "Your motivation is being channeled into purposeful action. You're turning energy into meaningful steps that align with your goals.",
    guidanceByAge: {
      teen: "When you feel motivated, it's like having superpowers. Use this energy! Pick one thing you've been wanting to do and take a step toward it. Even a small action counts. This feeling won't last forever, so make it count while it's here.",
      youngAdult: "Motivation comes in waves—use it while you have it. But also build habits so you don't rely on motivation alone. What's one action you can take today that future-you will thank you for? Start small, but start now.",
      adult: "Motivation is momentum. Channel it into the priorities that matter most. But also set up systems so you can keep going even when motivation fades. What's the most important thing you can do with this energy? Do that first.",
      mature: "Motivation at this stage often comes with clarity about what truly matters. You know your time and energy are precious. What's worth investing in? Use this drive to make progress on what aligns with your values and long-term vision."
    },
    grounding: "Channel this energy intentionally. Take 3 deep breaths. Ask yourself: What's the most important thing I can do right now?",
    faithHint: "Thank God for this energy. Ask for wisdom to use it well and for the work you do to reflect your purpose."
  },

  grateful: {
    meaning: "Gratitude is noticing blessings, support, or small wins. It shifts your focus from scarcity to abundance.",
    interpretation: "Gratitude is a powerful perspective shift. It doesn't deny hard things, but it reminds you of what's still good.",
    recycledOutcome: "You're using appreciation to strengthen resilience and deepen connection. Gratitude becomes fuel for hope.",
    guidanceByAge: {
      teen: "When you notice something good, hold onto it. Gratitude is like collecting little bits of light. Write down 3 things you're thankful for today—even if they're tiny. It trains your brain to see more good, even when things are hard.",
      youngAdult: "Gratitude doesn't mean ignoring problems—it means noticing what's working alongside what's hard. Can you name 3 people or things you're grateful for right now? Share that gratitude with someone. It strengthens connection and lifts both of you.",
      adult: "Gratitude is a practice, not just a feeling. When you intentionally notice the good, you build resilience. What are you grateful for today? Can you express that gratitude to someone? Appreciation, when spoken, multiplies.",
      mature: "Gratitude at this stage often comes with perspective. You've lived long enough to know what truly matters. What are you most grateful for in this season? How can you honor that gratitude through action or words?"
    },
    grounding: "Place your hand on your heart. Think of 3 specific things you're grateful for. Breathe deeply and feel the warmth of appreciation.",
    faithHint: "Give thanks. Gratitude is worship. Acknowledge the good gifts you've been given, even in hard seasons."
  },

  embarrassed: {
    meaning: "Embarrassment is feeling exposed, judged, or like you made a fool of yourself. It's acutely uncomfortable.",
    interpretation: "Embarrassment is temporary discomfort, not permanent damage. Most people are too focused on themselves to remember your moment for long.",
    recycledOutcome: "You're separating the event from your worth. One awkward moment doesn't define you. You're learning self-compassion.",
    guidanceByAge: {
      teen: "Embarrassing moments feel HUGE when they happen. But most people forget about them way faster than you think. What would you tell a friend who felt embarrassed? Can you say that to yourself? You're more than this one moment.",
      youngAdult: "Embarrassment stings, but it's part of being human. Everyone has awkward moments—you're not alone. Can you laugh at it eventually? What lesson can you take from it without replaying it over and over? Let it go gently.",
      adult: "Embarrassment often comes from caring about others' opinions. But most people are focused on their own lives, not your mishap. What's the worst that actually happened? Can you put it in perspective and move forward with grace?",
      mature: "Embarrassment may feel less intense now—you've lived long enough to know that most awkward moments fade. Can you extend yourself the same grace you'd offer someone else? You're human. It's okay."
    },
    grounding: "Take 3 deep breaths. Remind yourself: This feeling will pass. I am more than this moment. I am okay.",
    faithHint: "You are fully known and fully loved, even in your most awkward moments. That's grace."
  },

  ashamed: {
    meaning: "Shame is the crushing feeling that you are bad, not just that you did something bad. It attacks your worth.",
    interpretation: "Shame is different from guilt. Guilt says 'I did something bad.' Shame says 'I am bad.' Shame lies.",
    recycledOutcome: "You're separating behavior from identity. You can learn from mistakes without being defined by them. Self-forgiveness is possible.",
    guidanceByAge: {
      teen: "Shame tells you that you're not good enough or that you're broken. But that's not true. You're worthy of love and belonging, even when you mess up. Can you tell someone safe what you're feeling? Shame loses power when it's brought into the light.",
      youngAdult: "Shame thrives in secrecy. The antidote is vulnerability with someone you trust. You're not alone in feeling this way. What happened doesn't define who you are. Can you separate the action from your identity? You are more than your worst moment.",
      adult: "Shame is corrosive—it tells you that you're fundamentally flawed. But that's not true. You're human, and humans make mistakes. What do you need to make right? Once you've done that, can you release the shame? You deserve to move forward.",
      mature: "Shame may carry old stories—things you've carried for years. But you don't have to carry them anymore. What would it look like to forgive yourself? You've lived long enough to know that everyone has regrets. Yours don't define you."
    },
    grounding: "Place both hands on your chest. Breathe slowly. Say out loud: 'I am worthy of love. I am more than my mistakes.'",
    faithHint: "Shame says you're too far gone. Grace says you're not. Receive the truth that you are forgiven and loved."
  },

  heartbroken: {
    meaning: "Heartbreak is deep emotional pain from loss, rejection, or the end of something that mattered deeply.",
    interpretation: "Heartbreak signals that you loved, invested, or cared deeply. That capacity is beautiful, even when the loss hurts.",
    recycledOutcome: "Your heartbreak is being acknowledged as real, valid pain. You're learning to grieve while believing in eventual healing.",
    guidanceByAge: {
      teen: "Heartbreak feels like the end of the world. The pain is real, and it's okay to cry and feel sad. You're not overreacting. Healing takes time, but it will come. Can you talk to someone safe about how you're feeling? You don't have to go through this alone.",
      youngAdult: "Heartbreak cuts deep because you gave your heart fully. That wasn't a mistake—it was courage. Healing won't happen overnight, but it will happen. What do you need right now? Rest? Support? Give yourself permission to grieve without rushing to 'get over it.'",
      adult: "Heartbreak at this stage may feel different—it carries weight of time, investment, and hope. Grieve what was lost. But also know that your capacity to love and be loved is not diminished by this loss. What would gentle healing look like for you?",
      mature: "Heartbreak may be familiar by now—you've loved and lost before. But each loss is unique. Honor this grief. You know that time helps, but you also know it's okay to feel the full weight of this. What has helped you heal in the past?"
    },
    grounding: "Sit with the pain. Don't rush it. Breathe slowly. Cry if you need to. Place your hand on your heart and whisper: 'I will be okay.'",
    faithHint: "God holds your broken heart. Healing is promised, even when it feels impossible. You are not alone in this grief."
  }
};

export const topicModifiers: Record<TopicKey, TopicModifier> = {
  money: {
    descriptionByAge: {
      teen: "when it's about money or school costs or feeling pressure about finances",
      youngAdult: "when it's about student finances, bills, entry-level jobs, or money stress",
      adult: "when it's about budgeting, bills, family financial responsibilities, or career income",
      mature: "when it's about financial stability, long-term planning, or managing resources"
    }
  },

  work_school: {
    descriptionByAge: {
      teen: "when it's about school stress, grades, teachers, or friend drama at school",
      youngAdult: "when it's about college pressure, internships, early career stress, or academic performance",
      adult: "when it's about work deadlines, job performance, career decisions, or workplace relationships",
      mature: "when it's about career transitions, work-life balance, or navigating workplace dynamics"
    }
  },

  relationship: {
    descriptionByAge: {
      teen: "when it's about friendships, crushes, dating, or feeling left out",
      youngAdult: "when it's about dating relationships, friend conflicts, or navigating early adult relationships",
      adult: "when it's about romantic partnerships, communication challenges, or relationship dynamics",
      mature: "when it's about long-term partnerships, rekindling connection, or navigating relationship changes"
    }
  },

  family: {
    descriptionByAge: {
      teen: "when it's about parents, siblings, or family conflict at home",
      youngAdult: "when it's about family expectations, finding independence, or navigating changing family roles",
      adult: "when it's about parenting, caring for aging parents, or managing family responsibilities",
      mature: "when it's about adult children, grandparenting, or shifts in family dynamics"
    }
  },

  health: {
    descriptionByAge: {
      teen: "when it's about body image, physical health, or taking care of yourself",
      youngAdult: "when it's about health habits, mental health awareness, or building healthy routines",
      adult: "when it's about health management, medical concerns, or balancing wellness with responsibilities",
      mature: "when it's about maintaining health, navigating age-related changes, or medical care"
    }
  },

  faith: {
    descriptionByAge: {
      teen: "when it's about spiritual questions, doubt, or what you believe",
      youngAdult: "when it's about exploring faith, spiritual community, or forming personal beliefs",
      adult: "when it's about deepening faith, spiritual practices, or living out your beliefs",
      mature: "when it's about legacy, deeper spiritual reflection, or faith through life's seasons"
    }
  },

  self_esteem: {
    descriptionByAge: {
      teen: "when it's about how you see yourself, confidence, or feeling like you're not enough",
      youngAdult: "when it's about identity, self-worth, or comparing yourself to others",
      adult: "when it's about self-acceptance, personal growth, or challenging negative self-talk",
      mature: "when it's about self-compassion, accepting yourself fully, or honoring your journey"
    }
  },

  grief_loss: {
    descriptionByAge: {
      teen: "when it's about losing someone or something important, or dealing with change",
      youngAdult: "when it's about processing loss, grief, or navigating life transitions",
      adult: "when it's about grieving loss, honoring what was, or moving forward through pain",
      mature: "when it's about accumulated loss, legacy, or finding meaning through grief"
    }
  },

  other: {
    descriptionByAge: {
      teen: "when it's about something else weighing on you",
      youngAdult: "when it's about something else you're navigating",
      adult: "when it's about something else that matters to you",
      mature: "when it's about something else you're working through"
    }
  }
};
