import { useState, useEffect } from 'react';
import { ArrowLeft, User, Heart, Target, Shield, Sparkles, CheckCircle, Save } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface ProfileEditPageProps {
  onBack: () => void;
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

export function ProfileEditPage({ onBack }: ProfileEditPageProps) {
  const { user } = useAuth();
  const [ageGroup, setAgeGroup] = useState('');
  const [lifeStage, setLifeStage] = useState('');
  const [supportStyle, setSupportStyle] = useState('');
  const [crisisSensitivity, setCrisisSensitivity] = useState('');
  const [goalFocus, setGoalFocus] = useState<string[]>([]);
  const [nickname, setNickname] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error loading profile:', error);
    } else if (data) {
      setAgeGroup(data.age_group || '');
      setLifeStage(data.life_stage || '');
      setSupportStyle(data.support_style || '');
      setCrisisSensitivity(data.crisis_sensitivity || '');
      setGoalFocus(data.goal_focus || []);
      setNickname(data.nickname || '');
    }

    setIsLoading(false);
  };

  const handleGoalToggle = (goal: string) => {
    setGoalFocus(prev =>
      prev.includes(goal) ? prev.filter(g => g !== goal) : [...prev, goal]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!ageGroup || !supportStyle || !crisisSensitivity) {
      setError('Please fill in all required fields');
      return;
    }

    if (!user?.id) {
      setError('User not authenticated');
      return;
    }

    setIsSaving(true);

    try {
      const { error: dbError } = await supabase
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

      if (dbError) {
        console.error('Profile update error:', dbError);
        setError('Failed to update profile. Please try again.');
      } else {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-primary-50 via-teal-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-primary-50 via-teal-50 to-cyan-50 p-4 sm:p-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Edit Your Profile
            </h1>
            <p className="text-gray-600">
              Update your preferences to personalize your experience
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-sm text-green-800">Profile updated successfully!</p>
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
              className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
