// Advanced Emotion Taxonomy Types
// Phase 1: Data model for advanced emotional states

export type RiskLevel = 'low' | 'medium' | 'high';
export type IntensityLevel = 1 | 2 | 3 | 4 | 5;

export type AdvancedCategoryId =
  | 'dysregulated'
  | 'stress-response'
  | 'relational'
  | 'identity'
  | 'existential'
  | 'growth-oriented';

export type AdvancedStateId =
  // Dysregulated
  | 'numb-disconnected'
  | 'overwhelmed-spiraling'
  | 'rage-destructive'
  | 'manic-impulsive'
  | 'dissociated'
  // Stress Response
  | 'anxious-vigilant'
  | 'panicked'
  | 'shutdown-avoidant'
  | 'irritable-reactive'
  | 'exhausted-depleted'
  // Relational
  | 'abandoned-rejected'
  | 'betrayed-distrustful'
  | 'envious-resentful'
  | 'codependent-enmeshed'
  | 'isolated-disconnected'
  | 'loneliness'
  // Identity
  | 'shame-inadequate'
  | 'confused-lost'
  | 'fraudulent-impostor'
  | 'empty-purposeless'
  | 'conflicted-torn'
  // Existential
  | 'grief-mourning'
  | 'dread-doom'
  | 'despair-hopeless'
  | 'regret-guilt'
  | 'meaningless'
  // Growth-Oriented
  | 'hopeful-motivated'
  | 'curious-exploring'
  | 'confident-empowered'
  | 'grateful-content'
  | 'peaceful-aligned';

export interface AdvancedSignal {
  id: string;
  label: string;
  riskIndicator?: boolean;
}

export interface AdvancedAction {
  id: string;
  type: 'immediate' | 'grounding' | 'processing' | 'support' | 'professional';
  title: string;
  description: string;
  steps?: string[];
  toolId?: string;
  priority: number;
}

export interface AdvancedPrompt {
  id: string;
  text: string;
  purpose: 'clarify' | 'explore' | 'ground' | 'validate';
}

export interface AdvancedState {
  id: AdvancedStateId;
  label: string;
  description: string;
  categoryId: AdvancedCategoryId;
  baseRiskLevel: RiskLevel;
  signals: AdvancedSignal[];
  prompts: AdvancedPrompt[];
  actions: AdvancedAction[];
  relatedBasicEmotions: string[];
}

export interface AdvancedCategory {
  id: AdvancedCategoryId;
  label: string;
  description: string;
  emoji: string;
  baseRiskLevel: RiskLevel;
  states: AdvancedStateId[];
}

export interface AdvancedEmotionEntry {
  categoryId: AdvancedCategoryId;
  stateId: AdvancedStateId;
  intensity: IntensityLevel;
  selectedSignals: string[];
  riskLevel: RiskLevel;
  recommendedActions: string[];
  completedActions?: string[];
  timestamp: string;
}

// Database schema extension
export interface JournalEntryAdvanced {
  // Existing fields (preserved)
  id: string;
  user_id: string;
  created_at: string;
  text_entry: string;
  mood: string | null;
  emotions: string[] | null;
  category: string | null;
  tags: string[] | null;

  // New advanced fields
  advanced_category_id: AdvancedCategoryId | null;
  advanced_state_id: AdvancedStateId | null;
  intensity: IntensityLevel | null;
  risk_level: RiskLevel | null;
  selected_signals: string[] | null;
  recommended_actions: string[] | null;
  completed_actions: string[] | null;
  is_advanced_mode: boolean;
}

// User preferences extension
export interface UserPreferencesAdvanced {
  enable_advanced_states: boolean;
  preferred_mode: 'basic' | 'advanced' | 'hybrid';
  show_risk_warnings: boolean;
  auto_escalate_high_risk: boolean;
}

// Session tracking for analytics
export interface AdvancedEmotionSession {
  id: string;
  user_id: string;
  started_at: string;
  completed_at: string | null;
  initial_category: AdvancedCategoryId;
  initial_state: AdvancedStateId;
  initial_intensity: IntensityLevel;
  final_intensity: IntensityLevel | null;
  actions_taken: string[];
  outcome_notes: string | null;
  risk_level: RiskLevel;
}
