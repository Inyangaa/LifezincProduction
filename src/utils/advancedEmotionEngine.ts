import { supabase } from '../lib/supabase';
import {
  getStateById,
  calculateRiskLevel,
  getBasicEmotionMapping,
  findStatesByBasicEmotion,
} from '../data/advancedTaxonomy';
import type {
  AdvancedCategoryId,
  AdvancedStateId,
  IntensityLevel,
  RiskLevel,
  AdvancedEmotionEntry,
  AdvancedEmotionSession,
  AdvancedAction,
} from '../types/advancedTaxonomy';

export async function saveAdvancedEmotionEntry(
  userId: string,
  emotionData: {
    categoryId: AdvancedCategoryId;
    stateId: AdvancedStateId;
    intensity: IntensityLevel;
    selectedSignals: string[];
    riskLevel: RiskLevel;
    recommendedActions: string[];
    textEntry?: string;
    tags?: string[];
  }
) {
  const state = getStateById(emotionData.stateId);
  const basicEmotions = getBasicEmotionMapping(emotionData.stateId);

  const { data, error } = await supabase
    .from('journal_entries')
    .insert({
      user_id: userId,
      text_entry: emotionData.textEntry || `Feeling ${state.label.toLowerCase()}`,
      mood: basicEmotions[0] || 'anxious',
      emotions: basicEmotions,
      advanced_category_id: emotionData.categoryId,
      advanced_state_id: emotionData.stateId,
      intensity: emotionData.intensity,
      risk_level: emotionData.riskLevel,
      selected_signals: emotionData.selectedSignals,
      recommended_actions: emotionData.recommendedActions,
      completed_actions: [],
      is_advanced_mode: true,
      tags: emotionData.tags || [],
      category: mapCategoryToBasicCategory(emotionData.categoryId),
    })
    .select()
    .single();

  if (error) {
    console.error('Error saving advanced emotion entry:', error);
    throw error;
  }

  return data;
}

export async function createAdvancedEmotionSession(
  userId: string,
  emotionData: {
    categoryId: AdvancedCategoryId;
    stateId: AdvancedStateId;
    intensity: IntensityLevel;
    riskLevel: RiskLevel;
  }
): Promise<string> {
  const { data, error } = await supabase
    .from('advanced_emotion_sessions')
    .insert({
      user_id: userId,
      initial_category: emotionData.categoryId,
      initial_state: emotionData.stateId,
      initial_intensity: emotionData.intensity,
      risk_level: emotionData.riskLevel,
      actions_taken: [],
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating advanced emotion session:', error);
    throw error;
  }

  return data.id;
}

export async function updateAdvancedEmotionSession(
  sessionId: string,
  updates: {
    finalIntensity?: IntensityLevel;
    actionsTaken?: string[];
    outcomeNotes?: string;
  }
) {
  const { error } = await supabase
    .from('advanced_emotion_sessions')
    .update({
      final_intensity: updates.finalIntensity,
      actions_taken: updates.actionsTaken,
      outcome_notes: updates.outcomeNotes,
      completed_at: new Date().toISOString(),
    })
    .eq('id', sessionId);

  if (error) {
    console.error('Error updating advanced emotion session:', error);
    throw error;
  }
}

export async function updateCompletedActions(
  entryId: string,
  completedActions: string[]
) {
  const { error } = await supabase
    .from('journal_entries')
    .update({
      completed_actions: completedActions,
    })
    .eq('id', entryId);

  if (error) {
    console.error('Error updating completed actions:', error);
    throw error;
  }
}

export async function getUserPreferredMode(userId: string): Promise<'basic' | 'advanced' | 'hybrid'> {
  const { data, error } = await supabase
    .from('user_preferences')
    .select('preferred_mode, enable_advanced_states')
    .eq('user_id', userId)
    .maybeSingle();

  if (error || !data) {
    return 'basic';
  }

  if (!data.enable_advanced_states) {
    return 'basic';
  }

  return data.preferred_mode || 'basic';
}

export async function shouldShowRiskWarnings(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('user_preferences')
    .select('show_risk_warnings')
    .eq('user_id', userId)
    .maybeSingle();

  if (error || !data) {
    return true;
  }

  return data.show_risk_warnings !== false;
}

export async function shouldAutoEscalateHighRisk(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('user_preferences')
    .select('auto_escalate_high_risk')
    .eq('user_id', userId)
    .maybeSingle();

  if (error || !data) {
    return true;
  }

  return data.auto_escalate_high_risk !== false;
}

export function suggestAdvancedStatesFromBasicEmotion(
  basicEmotion: string,
  intensity?: number
): AdvancedStateId[] {
  const states = findStatesByBasicEmotion(basicEmotion);

  if (!intensity) {
    return states.map(s => s.id);
  }

  return states
    .filter(state => {
      if (intensity >= 4) {
        return state.baseRiskLevel === 'high' || state.baseRiskLevel === 'medium';
      }
      if (intensity <= 2) {
        return state.baseRiskLevel === 'low';
      }
      return true;
    })
    .map(s => s.id);
}

export function getActionsForRiskLevel(
  stateId: AdvancedStateId,
  riskLevel: RiskLevel
): AdvancedAction[] {
  const state = getStateById(stateId);

  return state.actions.filter(action => {
    if (riskLevel === 'high') {
      return action.priority === 1 || action.type === 'professional';
    }
    if (riskLevel === 'medium') {
      return action.priority <= 2;
    }
    return true;
  });
}

export async function detectHighRiskPatterns(userId: string): Promise<{
  isHighRisk: boolean;
  reasons: string[];
  recommendedActions: string[];
}> {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { data: recentEntries, error } = await supabase
    .from('journal_entries')
    .select('risk_level, advanced_state_id, intensity, created_at')
    .eq('user_id', userId)
    .gte('created_at', sevenDaysAgo.toISOString())
    .order('created_at', { ascending: false });

  if (error || !recentEntries || recentEntries.length === 0) {
    return {
      isHighRisk: false,
      reasons: [],
      recommendedActions: [],
    };
  }

  const reasons: string[] = [];
  const recommendedActions: string[] = [];

  const highRiskCount = recentEntries.filter(e => e.risk_level === 'high').length;
  if (highRiskCount >= 3) {
    reasons.push('Multiple high-risk states in the past week');
    recommendedActions.push('professional-support');
  }

  const avgIntensity = recentEntries
    .filter(e => e.intensity)
    .reduce((sum, e) => sum + (e.intensity || 0), 0) / recentEntries.length;
  if (avgIntensity >= 4) {
    reasons.push('Consistently high intensity levels');
    recommendedActions.push('crisis-plan');
  }

  const existentialStates = [
    'despair-hopeless',
    'meaningless',
    'empty-purposeless',
    'dread-doom',
  ];
  const hasExistentialCrisis = recentEntries.some(e =>
    existentialStates.includes(e.advanced_state_id)
  );
  if (hasExistentialCrisis) {
    reasons.push('Existential distress detected');
    recommendedActions.push('existential-therapy');
  }

  return {
    isHighRisk: reasons.length > 0,
    reasons,
    recommendedActions,
  };
}

export async function getAdvancedInsights(userId: string): Promise<{
  mostCommonCategory: AdvancedCategoryId | null;
  mostCommonState: AdvancedStateId | null;
  averageIntensity: number;
  averageRiskLevel: RiskLevel;
  totalEntries: number;
  improvementTrend: 'improving' | 'stable' | 'declining' | 'unknown';
}> {
  const { data: entries, error } = await supabase
    .from('journal_entries')
    .select('advanced_category_id, advanced_state_id, intensity, risk_level, created_at')
    .eq('user_id', userId)
    .eq('is_advanced_mode', true)
    .order('created_at', { ascending: false });

  if (error || !entries || entries.length === 0) {
    return {
      mostCommonCategory: null,
      mostCommonState: null,
      averageIntensity: 0,
      averageRiskLevel: 'low',
      totalEntries: 0,
      improvementTrend: 'unknown',
    };
  }

  const categoryCount: Record<string, number> = {};
  const stateCount: Record<string, number> = {};
  let totalIntensity = 0;
  let riskScoreSum = 0;

  entries.forEach(entry => {
    if (entry.advanced_category_id) {
      categoryCount[entry.advanced_category_id] =
        (categoryCount[entry.advanced_category_id] || 0) + 1;
    }
    if (entry.advanced_state_id) {
      stateCount[entry.advanced_state_id] =
        (stateCount[entry.advanced_state_id] || 0) + 1;
    }
    if (entry.intensity) {
      totalIntensity += entry.intensity;
    }
    if (entry.risk_level) {
      riskScoreSum +=
        entry.risk_level === 'high' ? 3 : entry.risk_level === 'medium' ? 2 : 1;
    }
  });

  const mostCommonCategory = Object.keys(categoryCount).reduce((a, b) =>
    categoryCount[a] > categoryCount[b] ? a : b
  ) as AdvancedCategoryId;

  const mostCommonState = Object.keys(stateCount).reduce((a, b) =>
    stateCount[a] > stateCount[b] ? a : b
  ) as AdvancedStateId;

  const averageIntensity = totalIntensity / entries.length;
  const avgRiskScore = riskScoreSum / entries.length;
  const averageRiskLevel: RiskLevel =
    avgRiskScore >= 2.5 ? 'high' : avgRiskScore >= 1.5 ? 'medium' : 'low';

  let improvementTrend: 'improving' | 'stable' | 'declining' | 'unknown' = 'unknown';
  if (entries.length >= 5) {
    const recent = entries.slice(0, Math.floor(entries.length / 2));
    const older = entries.slice(Math.floor(entries.length / 2));

    const recentAvg =
      recent.reduce((sum, e) => sum + (e.intensity || 0), 0) / recent.length;
    const olderAvg =
      older.reduce((sum, e) => sum + (e.intensity || 0), 0) / older.length;

    if (recentAvg < olderAvg - 0.5) {
      improvementTrend = 'improving';
    } else if (recentAvg > olderAvg + 0.5) {
      improvementTrend = 'declining';
    } else {
      improvementTrend = 'stable';
    }
  }

  return {
    mostCommonCategory,
    mostCommonState,
    averageIntensity,
    averageRiskLevel,
    totalEntries: entries.length,
    improvementTrend,
  };
}

function mapCategoryToBasicCategory(
  advancedCategory: AdvancedCategoryId
): string {
  const mapping: Record<AdvancedCategoryId, string> = {
    'dysregulated': 'self_esteem',
    'stress-response': 'school',
    'relational': 'relationships',
    'identity': 'self_esteem',
    'existential': 'self_esteem',
    'growth-oriented': 'self_esteem',
  };

  return mapping[advancedCategory] || 'other';
}

export function shouldShowCrisisIntervention(
  riskLevel: RiskLevel,
  selectedSignals: string[],
  autoEscalate: boolean
): boolean {
  if (!autoEscalate) {
    return false;
  }

  if (riskLevel === 'high') {
    return true;
  }

  const criticalSignals = [
    'cant-breathe',
    'going-to-die',
    'losing-control',
    'dissociated',
    'outside-body',
    'derealization',
    'no-hope',
    'never-better',
    'giving-up',
    'no-point',
    'nothing-matters',
  ];

  return selectedSignals.some(signal => criticalSignals.includes(signal));
}
