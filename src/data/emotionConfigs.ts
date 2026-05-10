export type EmotionId =
  | "tired"
  | "sad"
  | "angry"
  | "anxious"
  | "overwhelmed"
  | "lonely"
  | "guilty"
  | "numb"
  | "okay"
  | "grateful"
  | "excited"
  | "calm"
  | "proud";

export type SuggestionType =
  | "rest"
  | "process"
  | "mindset"
  | "practical"
  | "connection"
  | "safety";

export interface SuggestionGroup {
  id: string;
  type: SuggestionType;
  title: string;
  subtitle: string;
  toolId: string;
}

export interface ContextConfig {
  id: string;
  label: string;
  description: string;
  suggestionGroups: SuggestionGroup[];
}

export interface EmotionConfig {
  id: EmotionId;
  emoji: string;
  label: string;
  introMessage: string;
  contexts: ContextConfig[];
}

export const emotionConfigs: Record<EmotionId, EmotionConfig> = {
  tired: {
    id: "tired",
    emoji: "😩",
    label: "Tired",
    introMessage: "You've been carrying a lot. Let's take this gently and find what might help right now.",
    contexts: [
      {
        id: "job_search",
        label: "Job search / career",
        description: "Sending applications, not hearing back, interviews, work uncertainty.",
        suggestionGroups: [
          {
            id: "tired_job_rest",
            type: "rest",
            title: "Reset your energy",
            subtitle: "A short nervous-system reset before the next move.",
            toolId: "breathing_2min"
          },
          {
            id: "tired_job_process",
            type: "process",
            title: "Release some of the discouragement",
            subtitle: "Guided journaling to let out frustration safely.",
            toolId: "journal_job_discouragement"
          },
          {
            id: "tired_job_practical",
            type: "practical",
            title: "Boost your chances",
            subtitle: "Job boards, recruiters, and one small action to improve visibility.",
            toolId: "job_search_support_kit"
          },
          {
            id: "tired_job_connection",
            type: "connection",
            title: "Don't carry this alone",
            subtitle: "Plan one reach-out to someone who can support you.",
            toolId: "connection_reachout_planner"
          }
        ]
      },
      {
        id: "relationships",
        label: "Relationships",
        description: "Family tension, friendship struggles, or feeling drained by people.",
        suggestionGroups: [
          {
            id: "tired_rel_rest",
            type: "rest",
            title: "Give yourself permission to rest",
            subtitle: "Brief body scan to release tension.",
            toolId: "body_scan_5min"
          },
          {
            id: "tired_rel_process",
            type: "process",
            title: "Name what's draining you",
            subtitle: "Journal prompt to identify energy drains.",
            toolId: "journal_energy_drain"
          },
          {
            id: "tired_rel_practical",
            type: "practical",
            title: "Set one boundary",
            subtitle: "Script generator for saying 'no' kindly.",
            toolId: "boundary_script_helper"
          }
        ]
      },
      {
        id: "school_work",
        label: "School / work",
        description: "Deadlines, pressure, burnout, or falling behind.",
        suggestionGroups: [
          {
            id: "tired_school_rest",
            type: "rest",
            title: "Micro-break reset",
            subtitle: "2-minute energy restore exercise.",
            toolId: "energy_restore_2min"
          },
          {
            id: "tired_school_process",
            type: "process",
            title: "Acknowledge the weight",
            subtitle: "Quick burnout check-in.",
            toolId: "journal_burnout_check"
          },
          {
            id: "tired_school_practical",
            type: "practical",
            title: "Break it into tiny steps",
            subtitle: "Task breakdown helper for overwhelm.",
            toolId: "task_breakdown_helper"
          }
        ]
      },
      {
        id: "general",
        label: "Just tired in general",
        description: "No specific reason, just exhausted.",
        suggestionGroups: [
          {
            id: "tired_gen_rest",
            type: "rest",
            title: "Deep rest practice",
            subtitle: "10-minute guided relaxation.",
            toolId: "guided_relaxation_10min"
          },
          {
            id: "tired_gen_mindset",
            type: "mindset",
            title: "Permission to rest",
            subtitle: "Reframe: rest isn't lazy.",
            toolId: "reframe_rest_permission"
          }
        ]
      }
    ]
  },

  sad: {
    id: "sad",
    emoji: "😢",
    label: "Sad",
    introMessage: "It's okay to feel this. Let's sit with it together and find what you need.",
    contexts: [
      {
        id: "loss_grief",
        label: "Loss or grief",
        description: "Someone passed, a breakup, or losing something important.",
        suggestionGroups: [
          {
            id: "sad_loss_process",
            type: "process",
            title: "Honor what you're feeling",
            subtitle: "Grief journaling with gentle prompts.",
            toolId: "journal_grief_gentle"
          },
          {
            id: "sad_loss_connection",
            type: "connection",
            title: "You don't have to be alone",
            subtitle: "Find who to talk to, or professional support.",
            toolId: "grief_support_finder"
          },
          {
            id: "sad_loss_mindset",
            type: "mindset",
            title: "Permission to grieve",
            subtitle: "Normalize your sadness.",
            toolId: "reframe_grief_permission"
          }
        ]
      },
      {
        id: "rejection",
        label: "Rejection / disappointment",
        description: "Not getting the job, someone said no, plans fell through.",
        suggestionGroups: [
          {
            id: "sad_rej_process",
            type: "process",
            title: "Let it out",
            subtitle: "Safe space to process disappointment.",
            toolId: "journal_disappointment"
          },
          {
            id: "sad_rej_mindset",
            type: "mindset",
            title: "This doesn't define you",
            subtitle: "Reframe rejection as redirection.",
            toolId: "reframe_rejection"
          },
          {
            id: "sad_rej_practical",
            type: "practical",
            title: "What's one next step?",
            subtitle: "Tiny action planner.",
            toolId: "next_step_planner"
          }
        ]
      },
      {
        id: "loneliness",
        label: "Loneliness",
        description: "Feeling disconnected, isolated, or unseen.",
        suggestionGroups: [
          {
            id: "sad_lonely_connection",
            type: "connection",
            title: "Reconnect with someone",
            subtitle: "Plan one small outreach.",
            toolId: "connection_reachout_planner"
          },
          {
            id: "sad_lonely_process",
            type: "process",
            title: "Name the loneliness",
            subtitle: "Journal what you're missing.",
            toolId: "journal_loneliness"
          },
          {
            id: "sad_lonely_practical",
            type: "practical",
            title: "Find your people",
            subtitle: "Community finder based on interests.",
            toolId: "community_finder"
          }
        ]
      },
      {
        id: "general",
        label: "Just sad",
        description: "No clear reason, just feeling down.",
        suggestionGroups: [
          {
            id: "sad_gen_process",
            type: "process",
            title: "Let it flow",
            subtitle: "Free-form emotional release.",
            toolId: "journal_emotional_release"
          },
          {
            id: "sad_gen_rest",
            type: "rest",
            title: "Soothe your nervous system",
            subtitle: "Calming breathing practice.",
            toolId: "breathing_calm"
          }
        ]
      }
    ]
  },

  angry: {
    id: "angry",
    emoji: "😤",
    label: "Angry",
    introMessage: "Your anger is valid. Let's find a safe way to work through this.",
    contexts: [
      {
        id: "injustice",
        label: "Injustice / unfair treatment",
        description: "Someone wronged you, discrimination, or systemic frustration.",
        suggestionGroups: [
          {
            id: "angry_injust_process",
            type: "process",
            title: "Release it safely",
            subtitle: "Anger journaling with structure.",
            toolId: "journal_anger_release"
          },
          {
            id: "angry_injust_practical",
            type: "practical",
            title: "What action can you take?",
            subtitle: "Turn anger into advocacy.",
            toolId: "action_advocacy_planner"
          },
          {
            id: "angry_injust_rest",
            type: "rest",
            title: "Cool down first",
            subtitle: "Physical anger release exercise.",
            toolId: "anger_physical_release"
          }
        ]
      },
      {
        id: "betrayal",
        label: "Betrayal / broken trust",
        description: "Someone lied, broke a promise, or let you down.",
        suggestionGroups: [
          {
            id: "angry_betray_process",
            type: "process",
            title: "Process the hurt underneath",
            subtitle: "Anger + hurt journaling.",
            toolId: "journal_betrayal"
          },
          {
            id: "angry_betray_practical",
            type: "practical",
            title: "Decide your boundary",
            subtitle: "Relationship boundary setter.",
            toolId: "boundary_relationship_helper"
          },
          {
            id: "angry_betray_connection",
            type: "connection",
            title: "Talk to someone safe",
            subtitle: "Find support to process this.",
            toolId: "support_finder"
          }
        ]
      },
      {
        id: "frustration",
        label: "Frustration / things not working",
        description: "Technology, bureaucracy, or things keep going wrong.",
        suggestionGroups: [
          {
            id: "angry_frust_rest",
            type: "rest",
            title: "Reset your nervous system",
            subtitle: "Quick frustration release.",
            toolId: "frustration_release_breath"
          },
          {
            id: "angry_frust_practical",
            type: "practical",
            title: "Problem-solve mode",
            subtitle: "Break down the stuck point.",
            toolId: "problem_breakdown_helper"
          }
        ]
      },
      {
        id: "general",
        label: "Just angry",
        description: "Irritated, on edge, or rage without clear cause.",
        suggestionGroups: [
          {
            id: "angry_gen_rest",
            type: "rest",
            title: "Move the energy",
            subtitle: "Physical anger release.",
            toolId: "anger_movement_release"
          },
          {
            id: "angry_gen_process",
            type: "process",
            title: "What's underneath?",
            subtitle: "Explore what's fueling the anger.",
            toolId: "journal_anger_explore"
          }
        ]
      }
    ]
  },

  anxious: {
    id: "anxious",
    emoji: "😰",
    label: "Anxious",
    introMessage: "Let's slow down together. You're safe right now.",
    contexts: [
      {
        id: "health",
        label: "Health anxiety",
        description: "Worried about symptoms, illness, or medical issues.",
        suggestionGroups: [
          {
            id: "anx_health_safety",
            type: "safety",
            title: "Ground in the present",
            subtitle: "5-4-3-2-1 grounding exercise.",
            toolId: "grounding_54321"
          },
          {
            id: "anx_health_process",
            type: "process",
            title: "Separate facts from fears",
            subtitle: "Thought examination tool.",
            toolId: "thought_examination"
          },
          {
            id: "anx_health_practical",
            type: "practical",
            title: "What's one helpful action?",
            subtitle: "Action vs. rumination helper.",
            toolId: "action_vs_rumination"
          }
        ]
      },
      {
        id: "social",
        label: "Social anxiety",
        description: "Upcoming event, speaking, or being around people.",
        suggestionGroups: [
          {
            id: "anx_social_rest",
            type: "rest",
            title: "Calm your body first",
            subtitle: "Box breathing for anxiety.",
            toolId: "breathing_box"
          },
          {
            id: "anx_social_mindset",
            type: "mindset",
            title: "Challenge the worries",
            subtitle: "Reframe social fears.",
            toolId: "reframe_social_anxiety"
          },
          {
            id: "anx_social_practical",
            type: "practical",
            title: "Prepare realistically",
            subtitle: "Social prep toolkit.",
            toolId: "social_prep_helper"
          }
        ]
      },
      {
        id: "future",
        label: "Future / what-if thinking",
        description: "Spiraling about what might happen.",
        suggestionGroups: [
          {
            id: "anx_future_safety",
            type: "safety",
            title: "Come back to now",
            subtitle: "Present-moment anchor.",
            toolId: "present_moment_anchor"
          },
          {
            id: "anx_future_process",
            type: "process",
            title: "Externalize the spiral",
            subtitle: "Worry journal with containment.",
            toolId: "journal_worry_containment"
          },
          {
            id: "anx_future_mindset",
            type: "mindset",
            title: "Release need for certainty",
            subtitle: "Uncertainty tolerance practice.",
            toolId: "uncertainty_tolerance"
          }
        ]
      },
      {
        id: "general",
        label: "General anxiety",
        description: "Just anxious, can't pinpoint why.",
        suggestionGroups: [
          {
            id: "anx_gen_safety",
            type: "safety",
            title: "Regulate your nervous system",
            subtitle: "Calming breath work.",
            toolId: "breathing_calm_extended"
          },
          {
            id: "anx_gen_rest",
            type: "rest",
            title: "Body-based calming",
            subtitle: "Progressive muscle relaxation.",
            toolId: "progressive_relaxation"
          }
        ]
      }
    ]
  },

  overwhelmed: {
    id: "overwhelmed",
    emoji: "😵",
    label: "Overwhelmed",
    introMessage: "Too much at once. Let's break this down into something manageable.",
    contexts: [
      {
        id: "tasks",
        label: "Too many tasks",
        description: "To-do list is crushing you.",
        suggestionGroups: [
          {
            id: "over_task_practical",
            type: "practical",
            title: "Brain dump everything",
            subtitle: "Get it all out, then prioritize.",
            toolId: "brain_dump_prioritizer"
          },
          {
            id: "over_task_rest",
            type: "rest",
            title: "Pause before sorting",
            subtitle: "2-minute reset break.",
            toolId: "breathing_2min"
          },
          {
            id: "over_task_mindset",
            type: "mindset",
            title: "You don't have to do it all",
            subtitle: "Permission to let go.",
            toolId: "reframe_not_all"
          }
        ]
      },
      {
        id: "emotions",
        label: "Emotional overload",
        description: "Too many feelings at once.",
        suggestionGroups: [
          {
            id: "over_emo_safety",
            type: "safety",
            title: "Ground yourself first",
            subtitle: "Grounding to feel present.",
            toolId: "grounding_54321"
          },
          {
            id: "over_emo_process",
            type: "process",
            title: "Name each feeling",
            subtitle: "Emotion untangling journal.",
            toolId: "journal_emotion_untangle"
          },
          {
            id: "over_emo_rest",
            type: "rest",
            title: "Soothe your system",
            subtitle: "Calming visualization.",
            toolId: "visualization_calm"
          }
        ]
      },
      {
        id: "life",
        label: "Life feels like too much",
        description: "Everything is piling up at once.",
        suggestionGroups: [
          {
            id: "over_life_rest",
            type: "rest",
            title: "Just breathe",
            subtitle: "Extended calming practice.",
            toolId: "breathing_calm_extended"
          },
          {
            id: "over_life_practical",
            type: "practical",
            title: "What's one thing?",
            subtitle: "Single next step identifier.",
            toolId: "one_thing_identifier"
          },
          {
            id: "over_life_connection",
            type: "connection",
            title: "Get help",
            subtitle: "Identify who can support you.",
            toolId: "support_network_mapper"
          }
        ]
      }
    ]
  },

  lonely: {
    id: "lonely",
    emoji: "😔",
    label: "Lonely",
    introMessage: "You're not alone in feeling this way. Let's find connection.",
    contexts: [
      {
        id: "isolated",
        label: "Physically isolated",
        description: "Stuck at home, new place, or few people around.",
        suggestionGroups: [
          {
            id: "lonely_iso_connection",
            type: "connection",
            title: "Reach out digitally",
            subtitle: "Message template helper.",
            toolId: "digital_reachout_helper"
          },
          {
            id: "lonely_iso_practical",
            type: "practical",
            title: "Find online communities",
            subtitle: "Interest-based group finder.",
            toolId: "online_community_finder"
          },
          {
            id: "lonely_iso_process",
            type: "process",
            title: "Name what you're missing",
            subtitle: "Connection needs journal.",
            toolId: "journal_connection_needs"
          }
        ]
      },
      {
        id: "misunderstood",
        label: "Feeling unseen / misunderstood",
        description: "People around but feeling invisible.",
        suggestionGroups: [
          {
            id: "lonely_mis_process",
            type: "process",
            title: "Honor your experience",
            subtitle: "Validation journal practice.",
            toolId: "journal_self_validation"
          },
          {
            id: "lonely_mis_connection",
            type: "connection",
            title: "Find your people",
            subtitle: "Values-based connection finder.",
            toolId: "values_connection_finder"
          },
          {
            id: "lonely_mis_mindset",
            type: "mindset",
            title: "You are enough",
            subtitle: "Self-worth reminder practice.",
            toolId: "self_worth_practice"
          }
        ]
      },
      {
        id: "transition",
        label: "Life transition",
        description: "Moved, changed schools, lost a friend group.",
        suggestionGroups: [
          {
            id: "lonely_trans_practical",
            type: "practical",
            title: "Build new connections",
            subtitle: "New environment connection guide.",
            toolId: "new_connection_guide"
          },
          {
            id: "lonely_trans_process",
            type: "process",
            title: "Grieve what you lost",
            subtitle: "Transition grief journal.",
            toolId: "journal_transition_grief"
          }
        ]
      }
    ]
  },

  guilty: {
    id: "guilty",
    emoji: "😣",
    label: "Guilty",
    introMessage: "Let's look at this with compassion. Guilt can teach us, but doesn't have to trap us.",
    contexts: [
      {
        id: "hurt_someone",
        label: "I hurt someone",
        description: "Said something wrong, made a mistake, damaged a relationship.",
        suggestionGroups: [
          {
            id: "guilt_hurt_process",
            type: "process",
            title: "Acknowledge it fully",
            subtitle: "Accountability reflection.",
            toolId: "journal_accountability"
          },
          {
            id: "guilt_hurt_practical",
            type: "practical",
            title: "Make it right",
            subtitle: "Repair action planner.",
            toolId: "repair_action_planner"
          },
          {
            id: "guilt_hurt_mindset",
            type: "mindset",
            title: "You're human",
            subtitle: "Self-forgiveness practice.",
            toolId: "self_forgiveness_practice"
          }
        ]
      },
      {
        id: "not_enough",
        label: "Not doing enough",
        description: "Should be more productive, present, helpful.",
        suggestionGroups: [
          {
            id: "guilt_enough_mindset",
            type: "mindset",
            title: "Challenge 'should'",
            subtitle: "Reframe expectations.",
            toolId: "reframe_should_statements"
          },
          {
            id: "guilt_enough_process",
            type: "process",
            title: "What's realistic?",
            subtitle: "Capacity vs. expectation journal.",
            toolId: "journal_capacity_reality"
          }
        ]
      },
      {
        id: "boundaries",
        label: "Setting boundaries",
        description: "Saying no, prioritizing yourself.",
        suggestionGroups: [
          {
            id: "guilt_bound_mindset",
            type: "mindset",
            title: "Boundaries are self-care",
            subtitle: "Reframe boundary guilt.",
            toolId: "reframe_boundary_guilt"
          },
          {
            id: "guilt_bound_practical",
            type: "practical",
            title: "Practice saying no",
            subtitle: "No script builder.",
            toolId: "no_script_builder"
          }
        ]
      }
    ]
  },

  numb: {
    id: "numb",
    emoji: "😶",
    label: "Numb",
    introMessage: "Sometimes we shut down to protect ourselves. Let's gently reconnect.",
    contexts: [
      {
        id: "shutdown",
        label: "Emotional shutdown",
        description: "Can't feel much of anything.",
        suggestionGroups: [
          {
            id: "numb_shut_safety",
            type: "safety",
            title: "You're safe to feel",
            subtitle: "Gentle re-embodiment practice.",
            toolId: "gentle_reembodiment"
          },
          {
            id: "numb_shut_process",
            type: "process",
            title: "Notice without forcing",
            subtitle: "Sensation awareness journal.",
            toolId: "journal_sensation_awareness"
          },
          {
            id: "numb_shut_connection",
            type: "connection",
            title: "Professional support may help",
            subtitle: "Therapy resource finder.",
            toolId: "therapy_finder"
          }
        ]
      },
      {
        id: "burnout",
        label: "Burnout / exhaustion",
        description: "Used up all emotional capacity.",
        suggestionGroups: [
          {
            id: "numb_burn_rest",
            type: "rest",
            title: "Deep rest protocol",
            subtitle: "Extended restorative practice.",
            toolId: "restorative_practice_20min"
          },
          {
            id: "numb_burn_practical",
            type: "practical",
            title: "What needs to change?",
            subtitle: "Burnout recovery planner.",
            toolId: "burnout_recovery_planner"
          }
        ]
      },
      {
        id: "depression",
        label: "Depression",
        description: "Ongoing numbness, disconnection.",
        suggestionGroups: [
          {
            id: "numb_dep_connection",
            type: "connection",
            title: "Get professional help",
            subtitle: "Mental health resource guide.",
            toolId: "mental_health_resources"
          },
          {
            id: "numb_dep_safety",
            type: "safety",
            title: "Small reconnection steps",
            subtitle: "Gentle activation practice.",
            toolId: "gentle_activation"
          }
        ]
      }
    ]
  },

  okay: {
    id: "okay",
    emoji: "😐",
    label: "Okay",
    introMessage: "You're steady. Let's see if there's anything you'd like to explore or build on.",
    contexts: [
      {
        id: "maintenance",
        label: "Just checking in",
        description: "Keeping up with wellness habits.",
        suggestionGroups: [
          {
            id: "okay_maint_practical",
            type: "practical",
            title: "Quick reflection",
            subtitle: "Daily check-in prompts.",
            toolId: "daily_checkin"
          },
          {
            id: "okay_maint_mindset",
            type: "mindset",
            title: "Gratitude moment",
            subtitle: "What's going well?",
            toolId: "gratitude_quick"
          }
        ]
      },
      {
        id: "growth",
        label: "Growth mode",
        description: "Working on something specific.",
        suggestionGroups: [
          {
            id: "okay_growth_practical",
            type: "practical",
            title: "Track your progress",
            subtitle: "Goal progress tracker.",
            toolId: "goal_tracker"
          },
          {
            id: "okay_growth_process",
            type: "process",
            title: "Reflect on patterns",
            subtitle: "Pattern observation journal.",
            toolId: "journal_pattern_observation"
          }
        ]
      }
    ]
  },

  grateful: {
    id: "grateful",
    emoji: "🙏",
    label: "Grateful",
    introMessage: "Beautiful. Let's anchor this feeling.",
    contexts: [
      {
        id: "capture",
        label: "Capture this moment",
        description: "Lock in this positive feeling.",
        suggestionGroups: [
          {
            id: "grat_cap_process",
            type: "process",
            title: "Gratitude journaling",
            subtitle: "Deepen and savor this.",
            toolId: "journal_gratitude_deep"
          },
          {
            id: "grat_cap_practical",
            type: "practical",
            title: "Share it",
            subtitle: "Gratitude expression helper.",
            toolId: "gratitude_sharing"
          }
        ]
      },
      {
        id: "pay_forward",
        label: "Pay it forward",
        description: "Use this energy to help others.",
        suggestionGroups: [
          {
            id: "grat_pay_connection",
            type: "connection",
            title: "Reach out to someone",
            subtitle: "Appreciation message helper.",
            toolId: "appreciation_message_helper"
          },
          {
            id: "grat_pay_practical",
            type: "practical",
            title: "Acts of kindness",
            subtitle: "Small kindness ideas.",
            toolId: "kindness_ideas"
          }
        ]
      }
    ]
  },

  excited: {
    id: "excited",
    emoji: "🤩",
    label: "Excited",
    introMessage: "Love this energy! Let's channel it.",
    contexts: [
      {
        id: "new_opportunity",
        label: "New opportunity",
        description: "Starting something new, big possibility.",
        suggestionGroups: [
          {
            id: "exc_opp_practical",
            type: "practical",
            title: "Plan your next steps",
            subtitle: "Opportunity action planner.",
            toolId: "opportunity_planner"
          },
          {
            id: "exc_opp_process",
            type: "process",
            title: "Capture the vision",
            subtitle: "Dream journaling.",
            toolId: "journal_dream_vision"
          }
        ]
      },
      {
        id: "momentum",
        label: "Building momentum",
        description: "Things are flowing.",
        suggestionGroups: [
          {
            id: "exc_mom_practical",
            type: "practical",
            title: "Ride the wave",
            subtitle: "Momentum tracker.",
            toolId: "momentum_tracker"
          },
          {
            id: "exc_mom_mindset",
            type: "mindset",
            title: "Savor success",
            subtitle: "Celebrate your wins.",
            toolId: "celebration_practice"
          }
        ]
      }
    ]
  },

  calm: {
    id: "calm",
    emoji: "😌",
    label: "Calm",
    introMessage: "You're grounded. Let's maintain or deepen this peace.",
    contexts: [
      {
        id: "maintain",
        label: "Maintain this peace",
        description: "Anchor this calm feeling.",
        suggestionGroups: [
          {
            id: "calm_maint_rest",
            type: "rest",
            title: "Deepen the calm",
            subtitle: "Extended meditation.",
            toolId: "meditation_calm_15min"
          },
          {
            id: "calm_maint_process",
            type: "process",
            title: "Reflect on what helped",
            subtitle: "Peace pattern journal.",
            toolId: "journal_peace_patterns"
          }
        ]
      },
      {
        id: "prepare",
        label: "Prepare for challenges",
        description: "Build resilience while steady.",
        suggestionGroups: [
          {
            id: "calm_prep_practical",
            type: "practical",
            title: "Future self toolkit",
            subtitle: "Coping plan for hard times.",
            toolId: "coping_plan_builder"
          },
          {
            id: "calm_prep_mindset",
            type: "mindset",
            title: "Anchor your strength",
            subtitle: "Resilience reminder practice.",
            toolId: "resilience_anchoring"
          }
        ]
      }
    ]
  },

  proud: {
    id: "proud",
    emoji: "💪",
    label: "Proud",
    introMessage: "Yes! Let's celebrate what you've done.",
    contexts: [
      {
        id: "accomplishment",
        label: "Accomplished something",
        description: "Finished a goal, overcame a challenge.",
        suggestionGroups: [
          {
            id: "proud_acc_process",
            type: "process",
            title: "Celebrate fully",
            subtitle: "Win reflection journal.",
            toolId: "journal_win_reflection"
          },
          {
            id: "proud_acc_connection",
            type: "connection",
            title: "Share your win",
            subtitle: "Victory sharing helper.",
            toolId: "victory_sharing"
          }
        ]
      },
      {
        id: "growth",
        label: "Personal growth",
        description: "Noticed you've changed, healed, or grown.",
        suggestionGroups: [
          {
            id: "proud_growth_process",
            type: "process",
            title: "Honor your journey",
            subtitle: "Growth story reflection.",
            toolId: "journal_growth_story"
          },
          {
            id: "proud_growth_mindset",
            type: "mindset",
            title: "Anchor this progress",
            subtitle: "Progress integration practice.",
            toolId: "progress_integration"
          }
        ]
      }
    ]
  }
};
