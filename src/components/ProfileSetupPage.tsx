import { useState } from 'react';
import { User, Heart, Target, Shield, Sparkles, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Logo } from './Logo';

interface ProfileSetupPageProps {
  onComplete: () => void;
}

const AGE_GROUPS = ['13-15', '16-17', '18-24', '25-40', '40+'];
const LIFE_STAGES = ['High School', 'College', 'Working', 'Entrepreneur', 'Parent', 'Healing', 'Other'];
const SUPPORT_STYLES = ['Soft', 'Direct', 'Faith-based', 'Scientific', 'Balanced'];
const CRISIS_SENSITIVITY = ['Low', 'Medium', 'High'];
const GOAL_FOCUS = [
  'Mental Clarity',
  'Emotional Stability',
  'Spiritual Growth',
  'Relationships',
  'Academic Success',
  'Career Growth',
  'Financial Stability'
];

export function ProfileSetupPage({ onComplete }: ProfileSetupPageProps) {
  const { user } = useAuth();
  const [ageGroup, setAgeGroup] = useState('');
  const [lifeStage, setLifeStage] = useState('');
  const [supportStyle, setSupportStyle] = useState('');
  const [crisisSensitivity, setCrisisSensitivity] = useState('');
  const [goalFocus, setGoalFocus] = useState<string[]>([]);
  const [nickname, setNickname] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const handleGoalToggle = (goal: string) => {
    setGoalFocus(prev =>
      prev.includes(goal) ? prev.filter(g => g !== goal) : [...prev, goal]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!ageGroup || !supportStyle || !crisisSensitivity) {
      setError('Please fill in all required fields');
      return;
    }

    if (!user?.id) {
      setError('User not authenticated');
      return;
    }

    setIsSaving(true);
    console.log('[ProfileSetup] Starting profile creation for user:', user.id);

    try {
      // Check if profile already exists
      const { data: existingProfile } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (existingProfile) {
        console.log('[ProfileSetup] Profile already exists, updating instead');
        const { error: updateError } = await supabase
          .from('user_profiles')
          .update({
            age_group: ageGroup,
            life_stage: lifeStage || null,
            support_style: supportStyle,
            crisis_sensitivity: crisisSensitivity,
            goal_focus: goalFocus,
            nickname: nickname || null,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', user.id);

        if (updateError) {
          console.error('[ProfileSetup] Profile update error:', updateError);
          setError('Failed to update profile. Please try again.');
          setIsSaving(false);
          return;
        }
        console.log('[ProfileSetup] Profile updated successfully');
      } else {
        console.log('[ProfileSetup] Creating new profile');
        const { error: insertError } = await supabase
          .from('user_profiles')
          .insert({
            user_id: user.id,
            age_group: ageGroup,
            life_stage: lifeStage || null,
            support_style: supportStyle,
            crisis_sensitivity: crisisSensitivity,
            goal_focus: goalFocus,
            nickname: nickname || null,
            email_verified: false,
            user_type: localStorage.getItem('lifezinc_user_type') === 'therapist' ? 'therapist' : 'seeker',
          });

        if (insertError) {
          console.error('[ProfileSetup] Profile creation error:', insertError);
          setError(`Failed to create profile: ${insertError.message}. Please try again.`);
          setIsSaving(false);
          return;
        }
        console.log('[ProfileSetup] Profile created successfully');
      }

      console.log('[ProfileSetup] Profile save complete, calling onComplete');
      onComplete();
    } catch (err) {
      console.error('[ProfileSetup] Unexpected error:', err);
      setError('An unexpected error occurred. Please try again.');
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-primary-50 via-teal-50 to-cyan-50 p-4 sm:p-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <div className="flex flex-col items-center mb-8">
            <Logo size="md" className="mb-4" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 text-center">
              Welcome to LifeZinc!
            </h1>
            <p className="text-gray-600 text-center">
              Let's personalize your emotional wellness journey
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
                <User className="w-5 h-5 text-teal-600" />
                Age Group <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {AGE_GROUPS.map(age => (
                  <button
                    key={age}
                    type="button"
                    onClick={() => setAgeGroup(age)}
                    className={`p-3 rounded-lg border-2 transition-all font-medium ${
                      ageGroup === age
                        ? 'border-teal-500 bg-teal-50 text-teal-700'
                        : 'border-gray-300 hover:border-teal-300'
                    }`}
                  >
                    {age}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
                <Sparkles className="w-5 h-5 text-teal-600" />
                Life Stage <span className="text-xs text-gray-500 font-normal">(optional)</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {LIFE_STAGES.map(stage => (
                  <button
                    key={stage}
                    type="button"
                    onClick={() => setLifeStage(stage)}
                    className={`p-3 rounded-lg border-2 transition-all font-medium text-sm ${
                      lifeStage === stage
                        ? 'border-teal-500 bg-teal-50 text-teal-700'
                        : 'border-gray-300 hover:border-teal-300'
                    }`}
                  >
                    {stage}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
                <Heart className="w-5 h-5 text-teal-600" />
                Preferred Support Style <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                {SUPPORT_STYLES.map(style => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => setSupportStyle(style)}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      supportStyle === style
                        ? 'border-teal-500 bg-teal-50'
                        : 'border-gray-300 hover:border-teal-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">{style}</span>
                      {supportStyle === style && <CheckCircle className="w-5 h-5 text-teal-600" />}
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {style === 'Soft' && 'Gentle, nurturing, and comforting guidance'}
                      {style === 'Direct' && 'Clear, action-focused, and straightforward advice'}
                      {style === 'Faith-based' && 'Spiritually-grounded with faith integration'}
                      {style === 'Scientific' && 'Evidence-based cognitive and psychological approach'}
                      {style === 'Balanced' && 'A thoughtful mix of all approaches'}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
                <Shield className="w-5 h-5 text-teal-600" />
                Crisis Sensitivity <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-600 mb-3">
                Help us understand how to support you during difficult moments
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {CRISIS_SENSITIVITY.map(level => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setCrisisSensitivity(level)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      crisisSensitivity === level
                        ? 'border-teal-500 bg-teal-50'
                        : 'border-gray-300 hover:border-teal-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900 mb-1">{level}</div>
                    <p className="text-xs text-gray-600">
                      {level === 'Low' && 'I can handle intense guidance'}
                      {level === 'Medium' && 'Balanced support preferred'}
                      {level === 'High' && 'Need gentle, grounding support'}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
                <Target className="w-5 h-5 text-teal-600" />
                Goal Focus <span className="text-xs text-gray-500 font-normal">(select all that apply)</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {GOAL_FOCUS.map(goal => (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => handleGoalToggle(goal)}
                    className={`p-3 rounded-lg border-2 transition-all text-left ${
                      goalFocus.includes(goal)
                        ? 'border-teal-500 bg-teal-50'
                        : 'border-gray-300 hover:border-teal-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900 text-sm">{goal}</span>
                      {goalFocus.includes(goal) && <CheckCircle className="w-5 h-5 text-teal-600" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Nickname <span className="text-xs text-gray-500 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="What should we call you?"
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                maxLength={50}
              />
            </div>

            <button
              type="submit"
              disabled={isSaving || !ageGroup || !supportStyle || !crisisSensitivity}
              className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving...' : 'Complete Setup'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
