import { useState } from 'react';
import { ArrowLeft, ArrowRight, AlertTriangle, Check, X } from 'lucide-react';
import {
  advancedCategories,
  getStatesByCategory,
  getStateById,
  calculateRiskLevel,
} from '../data/advancedTaxonomy';
import {
  assessRisk,
  shouldShowCrisisIntervention,
  shouldShowExtraSupport,
  checkForDangerSignals,
} from '../utils/riskEscalation';
import type {
  AdvancedCategoryId,
  AdvancedStateId,
  IntensityLevel,
  RiskLevel,
  AdvancedAction,
} from '../types/advancedTaxonomy';

interface AdvancedEmotionFlowProps {
  onComplete: (data: {
    categoryId: AdvancedCategoryId;
    stateId: AdvancedStateId;
    intensity: IntensityLevel;
    selectedSignals: string[];
    riskLevel: RiskLevel;
    recommendedActions: string[];
  }) => void;
  onCancel: () => void;
  showRiskWarnings?: boolean;
  autoEscalateHighRisk?: boolean;
}

type FlowStep = 'category' | 'state' | 'intensity' | 'signals' | 'actions';

export function AdvancedEmotionFlow({
  onComplete,
  onCancel,
  showRiskWarnings = true,
  autoEscalateHighRisk = true,
}: AdvancedEmotionFlowProps) {
  const [step, setStep] = useState<FlowStep>('category');
  const [selectedCategory, setSelectedCategory] = useState<AdvancedCategoryId | null>(null);
  const [selectedState, setSelectedState] = useState<AdvancedStateId | null>(null);
  const [intensity, setIntensity] = useState<IntensityLevel>(3);
  const [selectedSignals, setSelectedSignals] = useState<string[]>([]);
  const [completedActions, setCompletedActions] = useState<string[]>([]);
  const [riskLevel, setRiskLevel] = useState<RiskLevel>('low');
  const [showCrisis, setShowCrisis] = useState(false);
  const [showExtraSupport, setShowExtraSupport] = useState(false);

  const handleCategorySelect = (categoryId: AdvancedCategoryId) => {
    setSelectedCategory(categoryId);
    setStep('state');
  };

  const handleStateSelect = (stateId: AdvancedStateId) => {
    setSelectedState(stateId);
    setStep('intensity');
  };

  const handleIntensitySelect = (level: IntensityLevel) => {
    setIntensity(level);
    setStep('signals');
  };

  const handleSignalToggle = (signalId: string) => {
    setSelectedSignals(prev =>
      prev.includes(signalId)
        ? prev.filter(id => id !== signalId)
        : [...prev, signalId]
    );
  };

  const handleContinueToActions = () => {
    if (!selectedState) return;

    const state = getStateById(selectedState);

    // Use new hard-locked risk assessment
    const riskAssessment = assessRisk(state.baseRiskLevel, intensity, selectedSignals);

    setRiskLevel(riskAssessment.riskLevel);
    setShowCrisis(riskAssessment.showCrisisIntervention);
    setShowExtraSupport(riskAssessment.showExtraSupport);

    console.log('[AdvancedEmotionFlow] Risk Assessment:', {
      baseRisk: state.baseRiskLevel,
      intensity,
      selectedSignals,
      riskScore: riskAssessment.riskScore,
      riskLevel: riskAssessment.riskLevel,
      hasDangerSignal: riskAssessment.hasDangerSignal,
      dangerSignalCategories: riskAssessment.dangerSignalCategories,
      interventionType: riskAssessment.interventionType,
    });

    setStep('actions');
  };

  const handleComplete = () => {
    if (!selectedCategory || !selectedState) return;

    const state = getStateById(selectedState);
    const recommendedActions = state.actions
      .filter(action => {
        if (riskLevel === 'high') return action.priority === 1;
        if (riskLevel === 'medium') return action.priority <= 2;
        return true;
      })
      .map(action => action.id);

    onComplete({
      categoryId: selectedCategory,
      stateId: selectedState,
      intensity,
      selectedSignals,
      riskLevel,
      recommendedActions,
    });
  };

  const renderCategorySelection = () => {
    return (
      <div className="space-y-4">
        <div className="text-center mb-6">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">How are you feeling?</h3>
          <p className="text-gray-600 text-sm sm:text-base">Choose the category that best fits your current state</p>
        </div>

        <div className="grid gap-3">
          {Object.values(advancedCategories).map(category => (
            <button
              key={category.id}
              onClick={() => handleCategorySelect(category.id)}
              className="min-h-[88px] p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-brand-primary-500 hover:bg-brand-primary-50 active:scale-95 transition-all text-left group touch-manipulation"
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl">{category.emoji}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-gray-900 text-lg">{category.label}</h4>
                    {category.baseRiskLevel === 'high' && showRiskWarnings && (
                      <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full font-medium">
                        High Risk
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{category.description}</p>
                  <p className="text-xs text-gray-500 mt-2">{category.states.length} specific states</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-brand-primary-600 transition-colors" />
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderStateSelection = () => {
    if (!selectedCategory) return null;

    const states = getStatesByCategory(selectedCategory);
    const category = advancedCategories[selectedCategory];

    return (
      <div className="space-y-4">
        <button
          onClick={() => setStep('category')}
          className="min-h-[44px] flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4 touch-manipulation"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to categories</span>
        </button>

        <div className="text-center mb-6">
          <div className="text-4xl mb-2">{category.emoji}</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{category.label}</h3>
          <p className="text-gray-600">Which specific state describes you best?</p>
        </div>

        <div className="grid gap-3">
          {states.map(state => (
            <button
              key={state.id}
              onClick={() => handleStateSelect(state.id)}
              className="p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-brand-primary-500 hover:bg-brand-primary-50 transition-all text-left group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900">{state.label}</h4>
                    {state.baseRiskLevel === 'high' && showRiskWarnings && (
                      <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full font-medium">
                        High Risk
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{state.description}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-brand-primary-600 transition-colors flex-shrink-0" />
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderIntensitySelection = () => {
    if (!selectedState) return null;

    const state = getStateById(selectedState);

    return (
      <div className="space-y-4">
        <button
          onClick={() => setStep('state')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to states</span>
        </button>

        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{state.label}</h3>
          <p className="text-gray-600">How intense is this feeling right now?</p>
        </div>

        <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm text-gray-600">Mild</span>
            <span className="text-lg font-bold text-brand-primary-600">Intensity: {intensity}</span>
            <span className="text-sm text-gray-600">Severe</span>
          </div>

          <div className="grid grid-cols-5 gap-3 mb-6">
            {[1, 2, 3, 4, 5].map(level => (
              <button
                key={level}
                onClick={() => setIntensity(level as IntensityLevel)}
                className={`h-16 rounded-lg border-2 font-bold text-lg transition-all ${
                  intensity === level
                    ? 'border-brand-primary-600 bg-brand-primary-600 text-white scale-105'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-brand-primary-400'
                }`}
              >
                {level}
              </button>
            ))}
          </div>

          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>1-2:</span>
              <span>Noticeable but manageable</span>
            </div>
            <div className="flex justify-between">
              <span>3:</span>
              <span>Moderate, affecting daily life</span>
            </div>
            <div className="flex justify-between">
              <span>4-5:</span>
              <span>Severe, hard to function</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSignalSelection = () => {
    if (!selectedState) return null;

    const state = getStateById(selectedState);

    return (
      <div className="space-y-4">
        <button
          onClick={() => setStep('intensity')}
          className="min-h-[44px] flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4 touch-manipulation"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to intensity</span>
        </button>

        <div className="text-center mb-6">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">What are you experiencing?</h3>
          <p className="text-gray-600 text-sm sm:text-base">Select all the signals that apply (optional)</p>
        </div>

        <div className="space-y-2">
          {state.signals.map(signal => {
            const isSelected = selectedSignals.includes(signal.id);
            return (
              <button
                key={signal.id}
                onClick={() => handleSignalToggle(signal.id)}
                className={`w-full min-h-[60px] p-4 rounded-lg border-2 transition-all text-left flex items-center justify-between active:scale-95 touch-manipulation ${
                  isSelected
                    ? 'border-brand-primary-600 bg-brand-primary-50'
                    : 'border-gray-200 bg-white hover:border-brand-primary-300'
                }`}
              >
                <div className="flex items-center gap-3 flex-1">
                  {signal.riskIndicator && showRiskWarnings && (
                    <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  )}
                  <span className="text-gray-900">{signal.label}</span>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  isSelected ? 'border-brand-primary-600 bg-brand-primary-600' : 'border-gray-300'
                }`}>
                  {isSelected && <Check className="w-4 h-4 text-white" />}
                </div>
              </button>
            );
          })}
        </div>

        {state.prompts.length > 0 && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Reflection Prompts</h4>
            <div className="space-y-2">
              {state.prompts.map(prompt => (
                <p key={prompt.id} className="text-sm text-blue-800">• {prompt.text}</p>
              ))}
            </div>
          </div>
        )}

      </div>
    );
  };

  const renderActions = () => {
    if (!selectedState) return null;

    const state = getStateById(selectedState);
    const hasRiskSignals = selectedSignals.some(signalId =>
      state.signals.find(s => s.id === signalId)?.riskIndicator
    );

    const priorityActions = state.actions.filter(action => {
      if (riskLevel === 'high') return action.priority === 1 || action.type === 'professional';
      if (riskLevel === 'medium') return action.priority <= 2;
      return true;
    });

    const getRiskColor = (risk: RiskLevel) => {
      switch (risk) {
        case 'high': return 'red';
        case 'medium': return 'amber';
        case 'low': return 'green';
      }
    };

    const riskColor = getRiskColor(riskLevel);

    return (
      <div className="space-y-4">
        <button
          onClick={() => setStep('signals')}
          className="min-h-[44px] flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4 touch-manipulation"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to signals</span>
        </button>

        <div className="text-center mb-6">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Recommended Actions</h3>
          <p className="text-gray-600 text-sm sm:text-base">Based on your state and intensity</p>
        </div>

        {showRiskWarnings && (
          <div className={`p-4 rounded-xl border-2 ${
            riskLevel === 'high' ? 'bg-red-50 border-red-300' :
            riskLevel === 'medium' ? 'bg-amber-50 border-amber-300' :
            'bg-green-50 border-green-300'
          }`}>
            <div className="flex items-center gap-2 mb-1">
              {riskLevel === 'high' && <AlertTriangle className="w-5 h-5 text-red-600" />}
              <span className={`font-semibold text-${riskColor}-900`}>
                Risk Level: {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)}
              </span>
            </div>
            <p className={`text-sm text-${riskColor}-800`}>
              {riskLevel === 'high' && 'This state requires immediate support. Please prioritize professional help.'}
              {riskLevel === 'medium' && 'This state needs attention. Follow the recommended actions below.'}
              {riskLevel === 'low' && 'You\'re managing well. These actions can help you feel even better.'}
            </p>
          </div>
        )}

        {/* CRISIS INTERVENTION - HARD-LOCKED RULE: Only shown if baseRisk=high AND (intensity>=7 OR dangerSignal) */}
        {showCrisis && autoEscalateHighRisk && (
          <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-5">
            <h4 className="font-bold text-gray-900 text-lg mb-3">
              You may need extra support right now.
            </h4>
            <div className="space-y-3 text-sm text-gray-800">
              <p className="leading-relaxed">
                What you're feeling is really hard, and you don't have to go through it alone.
                There are people who care and want to help—24/7, free, and confidential.
              </p>
              <div className="bg-white rounded-lg p-4 space-y-2 border border-blue-200">
                <div className="font-semibold text-gray-900">Reach out anytime:</div>
                <div>• <strong>Call or text 988</strong> - Suicide & Crisis Lifeline</div>
                <div>• <strong>Text HOME to 741741</strong> - Crisis Text Line</div>
                <div>• <strong>Call 1-800-799-7233</strong> - Domestic Violence Hotline</div>
              </div>
              <p className="leading-relaxed">
                If you're in immediate danger, <strong>call 911</strong> or go to your nearest emergency room.
                Your safety matters.
              </p>
              <div className="mt-4 pt-3 border-t border-blue-200 text-xs text-gray-600">
                <strong>Please note:</strong> LifeZinc provides supportive tools but is not a replacement for professional mental health care or emergency services.
              </div>
            </div>
          </div>
        )}

        {/* EXTRA SUPPORT - Shown when baseRisk=high but intensity<=3 and no dangerSignal */}
        {showExtraSupport && (
          <div className="bg-teal-50 border-2 border-teal-300 rounded-xl p-5">
            <h4 className="font-bold text-gray-900 text-lg mb-3">
              You're handling something difficult.
            </h4>
            <div className="space-y-3 text-sm text-gray-800">
              <p className="leading-relaxed">
                What you're experiencing is tough, and reaching out for extra support could make a real difference.
              </p>
              <div className="mt-3 font-semibold text-gray-900">Here are some next steps:</div>
              <div className="space-y-1.5">
                <div>• Talk to someone you trust—a friend, family member, or mentor</div>
                <div>• Schedule time with a therapist or counselor</div>
                <div>• Try the coping tools and actions below</div>
              </div>
              <div className="mt-3 bg-white rounded-lg p-3 border border-teal-200">
                <strong className="text-gray-900">Need someone to talk to?</strong>
                <div className="mt-1.5 space-y-1">
                  <div>• <strong>Text HOME to 741741</strong> - Crisis Text Line</div>
                  <div>• <strong>Call 988</strong> - Supportive listening anytime</div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {priorityActions.map((action: AdvancedAction) => {
            const isCompleted = completedActions.includes(action.id);
            return (
              <div
                key={action.id}
                className={`bg-white rounded-xl border-2 p-4 transition-all ${
                  isCompleted ? 'border-green-500 bg-green-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{action.title}</h4>
                      {action.priority === 1 && (
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full font-medium">
                          Priority
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                  <button
                    onClick={() => {
                      setCompletedActions(prev =>
                        prev.includes(action.id)
                          ? prev.filter(id => id !== action.id)
                          : [...prev, action.id]
                      );
                    }}
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      isCompleted
                        ? 'border-green-600 bg-green-600'
                        : 'border-gray-300 hover:border-green-400'
                    }`}
                  >
                    {isCompleted && <Check className="w-5 h-5 text-white" />}
                  </button>
                </div>
                {action.steps && action.steps.length > 0 && (
                  <div className="mt-3 pl-4 border-l-2 border-gray-200">
                    <div className="text-xs text-gray-600 mb-1">Steps:</div>
                    <ol className="space-y-1">
                      {action.steps.map((step, idx) => (
                        <li key={idx} className="text-sm text-gray-700">
                          {idx + 1}. {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Determine if we should show sticky button
  const showStickyButton = step === 'intensity' || step === 'signals' || step === 'actions';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto p-4 md:p-8 pb-32">
          <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8">
            {step === 'category' && renderCategorySelection()}
            {step === 'state' && renderStateSelection()}
            {step === 'intensity' && renderIntensitySelection()}
            {step === 'signals' && renderSignalSelection()}
            {step === 'actions' && renderActions()}
          </div>

          <div className="mt-4 text-center">
            <button
              onClick={onCancel}
              className="min-h-[44px] px-4 text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors touch-manipulation"
            >
              Cancel and return
            </button>
          </div>
        </div>
      </div>

      {/* Sticky bottom button for continue actions */}
      {showStickyButton && (
        <div className="sticky bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-lg z-10">
          <div className="max-w-2xl mx-auto flex gap-3">
            {step === 'signals' && (
              <button
                onClick={() => {
                  setSelectedSignals([]);
                  handleContinueToActions();
                }}
                className="flex-1 min-h-[48px] px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 active:scale-95 transition-all font-semibold touch-manipulation"
              >
                Skip
              </button>
            )}
            {step === 'actions' ? (
              <>
                <button
                  onClick={onCancel}
                  className="flex-1 min-h-[48px] px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 active:scale-95 transition-all font-semibold touch-manipulation flex items-center justify-center gap-2"
                >
                  <X className="w-5 h-5" />
                  Cancel
                </button>
                <button
                  onClick={handleComplete}
                  className="flex-1 min-h-[48px] px-6 py-3 bg-gradient-to-r from-brand-primary-600 to-teal-600 text-white rounded-xl hover:from-brand-primary-700 hover:to-teal-700 active:scale-95 transition-all font-semibold shadow-lg touch-manipulation flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  Complete
                </button>
              </>
            ) : (
              <button
                onClick={step === 'intensity' ? () => setStep('signals') : handleContinueToActions}
                className="flex-1 min-h-[48px] px-6 py-3 bg-gradient-to-r from-brand-primary-600 to-teal-600 text-white rounded-xl hover:from-brand-primary-700 hover:to-teal-700 active:scale-95 transition-all font-semibold shadow-lg touch-manipulation"
              >
                Continue
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
