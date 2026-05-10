import { useState } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { Logo } from './Logo';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface TherapistSetupPageProps {
  onComplete: () => void;
}

const focusOptions = [
  'Teens',
  'Adults',
  'Couples',
  'Families',
  'Anxiety',
  'Depression',
  'Trauma',
  'Stress / Burnout',
  'Self-esteem',
];

export function TherapistSetupPage({ onComplete }: TherapistSetupPageProps) {
  const { user } = useAuth();
  const [fullName, setFullName] = useState('');
  const [profession, setProfession] = useState('Therapist / Counselor');
  const [licenseRegion, setLicenseRegion] = useState('');
  const [yearsExperience, setYearsExperience] = useState('0-2');
  const [practiceType, setPracticeType] = useState('Private practice');
  const [focusAreas, setFocusAreas] = useState<string[]>([]);
  const [consent, setConsent] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleFocus = (area: string) => {
    setFocusAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!consent) {
      setError('Please confirm you are a qualified professional.');
      return;
    }

    if (!user) {
      setError('You must be logged in to complete this step.');
      return;
    }

    setSaving(true);

    console.log('[TherapistSetup] Saving therapist profile for user:', user.id);

    try {
      const { error: profileError } = await supabase
        .from('therapist_profiles')
        .insert({
          user_id: user.id,
          full_name: fullName,
          profession: profession,
          license_region: licenseRegion,
          years_experience: yearsExperience,
          practice_type: practiceType,
          focus_areas: focusAreas,
          consent_statement_accepted: consent,
        });

      if (profileError) {
        console.error('[TherapistSetup] Error saving therapist profile:', profileError);
        throw profileError;
      }

      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ therapist_profile_completed: true })
        .eq('user_id', user.id);

      if (updateError) {
        console.error('[TherapistSetup] Error updating profile completion:', updateError);
        throw updateError;
      }

      console.log('[TherapistSetup] Therapist profile saved successfully');
      onComplete();
    } catch (err) {
      console.error('[TherapistSetup] Error:', err);
      setError('We couldn\'t save your details. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-primary-50 via-teal-50 to-cyan-50 p-4 py-8">
      <div className="max-w-2xl w-full bg-white shadow-xl rounded-2xl p-6 sm:p-8">
        <div className="text-center mb-6">
          <Logo size="md" className="mx-auto mb-4" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Therapist Onboarding
          </h1>
          <p className="text-gray-600">
            Tell us a little about your professional background. This helps us keep therapist experiences distinct from personal users.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-brand-primary-500 focus:border-transparent"
              placeholder="Dr. Jane Smith"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profession <span className="text-red-500">*</span>
            </label>
            <select
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-brand-primary-500 focus:border-transparent"
            >
              <option>Therapist / Counselor</option>
              <option>Psychologist</option>
              <option>Psychiatrist</option>
              <option>Social Worker</option>
              <option>Coach</option>
              <option>Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Where do you primarily practice? <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Maryland, USA"
              required
              value={licenseRegion}
              onChange={(e) => setLicenseRegion(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-brand-primary-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Years of Experience <span className="text-red-500">*</span>
              </label>
              <select
                value={yearsExperience}
                onChange={(e) => setYearsExperience(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-brand-primary-500 focus:border-transparent"
              >
                <option value="0-2">0–2 years</option>
                <option value="3-5">3–5 years</option>
                <option value="6-10">6–10 years</option>
                <option value="10+">10+ years</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Practice Type <span className="text-red-500">*</span>
              </label>
              <select
                value={practiceType}
                onChange={(e) => setPracticeType(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-brand-primary-500 focus:border-transparent"
              >
                <option>Private practice</option>
                <option>Clinic/Hospital</option>
                <option>School/University</option>
                <option>Online-only</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Primary focus areas (select all that apply)
            </label>
            <div className="flex flex-wrap gap-2">
              {focusOptions.map((area) => (
                <button
                  key={area}
                  type="button"
                  onClick={() => toggleFocus(area)}
                  className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                    focusAreas.includes(area)
                      ? 'bg-brand-primary-500 text-white border-brand-primary-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-brand-primary-300'
                  }`}
                >
                  {area}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <input
                id="consent"
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-1 w-4 h-4 text-brand-primary-500 border-gray-300 rounded focus:ring-brand-primary-500"
              />
              <label htmlFor="consent" className="text-sm text-gray-700 leading-relaxed">
                <span className="font-semibold">Professional Confirmation:</span> I confirm that I am a licensed or qualified mental health professional (or equivalent) in my region, and I understand that LifeZinc does not replace emergency or crisis services.
              </label>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full px-6 py-3 rounded-lg bg-brand-primary-500 text-white font-semibold hover:bg-brand-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Finish Therapist Setup
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          After completing setup, you'll have access to all LifeZinc features.
        </p>
      </div>
    </main>
  );
}
