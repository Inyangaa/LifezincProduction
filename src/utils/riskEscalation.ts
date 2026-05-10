/**
 * HARD-LOCKED RISK ESCALATION RULES
 *
 * This file contains the definitive risk assessment and escalation logic.
 * DO NOT MODIFY without clinical review and explicit authorization.
 *
 * Last Updated: 2026-01-27
 * Clinical Review Required: YES
 */

import type { RiskLevel, IntensityLevel } from '../types/advancedTaxonomy';

/**
 * DANGER SIGNAL DEFINITIONS
 *
 * These signals indicate imminent risk and trigger immediate crisis protocols.
 *
 * Categories:
 * - self_harm: Intent or urges to harm oneself
 * - imminent_danger: Immediate physical danger to self
 * - life_exit_thoughts: Suicidal ideation or planning
 * - harm_to_others: Intent or urges to harm others
 */
export const DANGER_SIGNALS = {
  self_harm: [
    'self-harm-urges',
    'cutting-urges',
    'self-injury-thoughts',
    'hurting-myself',
    'want-to-hurt-self',
  ],
  imminent_danger: [
    'going-to-die',
    'cant-breathe',
    'losing-control',
    'immediate-threat',
    'in-danger-now',
  ],
  life_exit_thoughts: [
    'suicidal-thoughts',
    'end-it-all',
    'no-reason-live',
    'better-off-dead',
    'suicide-plan',
    'giving-up',
    'no-hope',
    'never-better',
  ],
  harm_to_others: [
    'hurt-someone',
    'violent-thoughts',
    'harm-others',
    'revenge-thoughts',
    'violent-urges',
  ],
} as const;

/**
 * RISK SCORE CALCULATION
 *
 * Formula:
 * RiskScore = baseRiskNumeric + intensityModifier + dangerSignalModifier
 *
 * Where:
 * - baseRiskNumeric: low=1, medium=2, high=3
 * - intensityModifier: +1 if intensity >= 7, else 0
 * - dangerSignalModifier: +2 if any danger signal present, else 0
 *
 * @param baseRisk - Base risk level from emotion state
 * @param intensity - User-reported intensity (1-10 scale)
 * @param selectedSignals - Array of signal IDs selected by user
 * @returns Numeric risk score (1-6)
 */
export function calculateRiskScore(
  baseRisk: RiskLevel,
  intensity: IntensityLevel,
  selectedSignals: string[]
): number {
  // Convert base risk to numeric
  const baseRiskNumeric = baseRisk === 'high' ? 3 : baseRisk === 'medium' ? 2 : 1;

  // Check intensity modifier
  const intensityModifier = intensity >= 7 ? 1 : 0;

  // Check for danger signals
  const hasDangerSignal = checkForDangerSignals(selectedSignals);
  const dangerSignalModifier = hasDangerSignal ? 2 : 0;

  // Calculate final risk score
  const riskScore = baseRiskNumeric + intensityModifier + dangerSignalModifier;

  return riskScore;
}

/**
 * CHECK FOR DANGER SIGNALS
 *
 * Determines if any of the selected signals match danger signal definitions.
 *
 * @param selectedSignals - Array of signal IDs selected by user
 * @returns true if any danger signal is present
 */
export function checkForDangerSignals(selectedSignals: string[]): boolean {
  if (!selectedSignals || selectedSignals.length === 0) {
    return false;
  }

  // Flatten all danger signal arrays into one list
  const allDangerSignals: string[] = [
    ...DANGER_SIGNALS.self_harm,
    ...DANGER_SIGNALS.imminent_danger,
    ...DANGER_SIGNALS.life_exit_thoughts,
    ...DANGER_SIGNALS.harm_to_others,
  ];

  // Check if any selected signal matches a danger signal
  return selectedSignals.some(signal => allDangerSignals.includes(signal));
}

/**
 * CATEGORIZE DANGER SIGNAL TYPE
 *
 * Identifies which specific danger category the signals belong to.
 * Used for tailoring crisis intervention messaging.
 *
 * @param selectedSignals - Array of signal IDs selected by user
 * @returns Array of danger signal categories present
 */
export function categorizeDangerSignals(selectedSignals: string[]): Array<keyof typeof DANGER_SIGNALS> {
  const categories: Array<keyof typeof DANGER_SIGNALS> = [];

  if (selectedSignals.some(s => (DANGER_SIGNALS.self_harm as readonly string[]).includes(s))) {
    categories.push('self_harm');
  }
  if (selectedSignals.some(s => (DANGER_SIGNALS.imminent_danger as readonly string[]).includes(s))) {
    categories.push('imminent_danger');
  }
  if (selectedSignals.some(s => (DANGER_SIGNALS.life_exit_thoughts as readonly string[]).includes(s))) {
    categories.push('life_exit_thoughts');
  }
  if (selectedSignals.some(s => (DANGER_SIGNALS.harm_to_others as readonly string[]).includes(s))) {
    categories.push('harm_to_others');
  }

  return categories;
}

/**
 * CONVERT RISK SCORE TO RISK LEVEL
 *
 * Maps numeric risk score back to categorical risk level.
 *
 * Score Ranges:
 * - 1-2: low
 * - 3-4: medium
 * - 5-6: high
 *
 * @param riskScore - Numeric risk score (1-6)
 * @returns Categorical risk level
 */
export function riskScoreToLevel(riskScore: number): RiskLevel {
  if (riskScore >= 5) return 'high';
  if (riskScore >= 3) return 'medium';
  return 'low';
}

/**
 * CRISIS INTERVENTION TRIGGER LOGIC
 *
 * HARD-LOCKED RULE:
 * Crisis UI triggers ONLY if BOTH conditions are true:
 * 1. baseRisk === 'high'
 * 2. (intensity >= 7 OR dangerSignal === true)
 *
 * Special Case:
 * If baseRisk === 'high' but intensity <= 3 and no danger signal,
 * show "extra support" screen, NOT crisis intervention.
 *
 * @param baseRisk - Base risk level from emotion state
 * @param intensity - User-reported intensity (1-10 scale)
 * @param selectedSignals - Array of signal IDs selected by user
 * @returns true if crisis intervention should be shown
 */
export function shouldShowCrisisIntervention(
  baseRisk: RiskLevel,
  intensity: IntensityLevel,
  selectedSignals: string[]
): boolean {
  // Check for danger signals
  const hasDangerSignal = checkForDangerSignals(selectedSignals);

  // HARD-LOCKED RULE: Crisis ONLY if baseRisk=high AND (intensity>=7 OR dangerSignal)
  if (baseRisk === 'high') {
    // Crisis trigger conditions
    if (intensity >= 7 || hasDangerSignal) {
      return true;
    }
  }

  // All other cases: no crisis intervention
  return false;
}

/**
 * EXTRA SUPPORT TRIGGER LOGIC
 *
 * Determines if "extra support" (non-crisis support) should be shown.
 *
 * Conditions:
 * - baseRisk === 'high'
 * - intensity <= 3
 * - NO danger signals present
 *
 * This provides supportive resources without triggering crisis protocols.
 *
 * @param baseRisk - Base risk level from emotion state
 * @param intensity - User-reported intensity (1-10 scale)
 * @param selectedSignals - Array of signal IDs selected by user
 * @returns true if extra support should be shown
 */
export function shouldShowExtraSupport(
  baseRisk: RiskLevel,
  intensity: IntensityLevel,
  selectedSignals: string[]
): boolean {
  // Check for danger signals
  const hasDangerSignal = checkForDangerSignals(selectedSignals);

  // Extra support condition: high base risk, low intensity, no danger signals
  if (baseRisk === 'high' && intensity <= 3 && !hasDangerSignal) {
    return true;
  }

  return false;
}

/**
 * COMPREHENSIVE RISK ASSESSMENT
 *
 * Performs complete risk assessment and returns all relevant information
 * for UI display and intervention logic.
 *
 * @param baseRisk - Base risk level from emotion state
 * @param intensity - User-reported intensity (1-10 scale)
 * @param selectedSignals - Array of signal IDs selected by user
 * @returns Complete risk assessment result
 */
export interface RiskAssessmentResult {
  riskScore: number;
  riskLevel: RiskLevel;
  hasDangerSignal: boolean;
  dangerSignalCategories: Array<keyof typeof DANGER_SIGNALS>;
  showCrisisIntervention: boolean;
  showExtraSupport: boolean;
  interventionType: 'crisis' | 'extra-support' | 'standard' | 'none';
}

export function assessRisk(
  baseRisk: RiskLevel,
  intensity: IntensityLevel,
  selectedSignals: string[]
): RiskAssessmentResult {
  const riskScore = calculateRiskScore(baseRisk, intensity, selectedSignals);
  const riskLevel = riskScoreToLevel(riskScore);
  const hasDangerSignal = checkForDangerSignals(selectedSignals);
  const dangerSignalCategories = categorizeDangerSignals(selectedSignals);
  const showCrisisIntervention = shouldShowCrisisIntervention(baseRisk, intensity, selectedSignals);
  const showExtraSupport = shouldShowExtraSupport(baseRisk, intensity, selectedSignals);

  // Determine intervention type
  let interventionType: 'crisis' | 'extra-support' | 'standard' | 'none';
  if (showCrisisIntervention) {
    interventionType = 'crisis';
  } else if (showExtraSupport) {
    interventionType = 'extra-support';
  } else if (riskLevel === 'medium' || riskLevel === 'high') {
    interventionType = 'standard';
  } else {
    interventionType = 'none';
  }

  return {
    riskScore,
    riskLevel,
    hasDangerSignal,
    dangerSignalCategories,
    showCrisisIntervention,
    showExtraSupport,
    interventionType,
  };
}

/**
 * LEGACY COMPATIBILITY FUNCTION
 *
 * Maintains backwards compatibility with existing calculateRiskLevel function.
 * Uses the new hard-locked rules but returns the old function signature.
 *
 * @deprecated Use assessRisk() for new implementations
 */
export function calculateRiskLevel(
  baseRisk: RiskLevel,
  intensity: IntensityLevel,
  hasRiskSignals: boolean,
  selectedSignals: string[] = []
): RiskLevel {
  // Use new assessment logic
  const assessment = assessRisk(baseRisk, intensity, selectedSignals);
  return assessment.riskLevel;
}
