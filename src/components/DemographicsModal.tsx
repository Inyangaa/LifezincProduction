import { useState } from 'react';
import { X, User, MapPin, Heart } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface DemographicsModalProps {
  onComplete: () => void;
  onClose: () => void;
}

const AGE_RANGES = [
  'Child (<13)',
  'Teen (13-17)',
  'Young Adult (18-25)',
  'Adult (26-64)',
  'Senior (65+)'
];

const GENDERS = [
  'Female',
  'Male',
  'Non-binary',
  'Prefer not to say'
];

const INTEREST_OPTIONS = [
  'Sports & Fitness',
  'Arts & Creativity',
  'Music',
  'Reading & Writing',
  'Gaming',
  'Nature & Outdoors',
  'Technology',
  'Social Activities',
  'Spirituality & Faith',
  'Volunteering'
];

export function DemographicsModal({ onComplete, onClose }: DemographicsModalProps) {
  const { user } = useAuth();
  const [ageRange, setAgeRange] = useState('');
  const [gender, setGender] = useState('');
  const [location, setLocation] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const handleInterestToggle = (interest: string) => {
    setInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!ageRange || !gender) {
      setError('Please select your age range and gender');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      const { error: saveError } = await supabase
        .from('user_demographics')
        .upsert({
          user_id: user?.id || null,
          age_range: ageRange,
          gender: gender,
          location: location || null,
          interests: interests.length > 0 ? interests : null,
          completed_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (saveError) throw saveError;

      onComplete();
    } catch (err) {
      console.error('Error saving demographics:', err);
      setError('Failed to save. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">About You</h2>
              <p className="text-sm text-gray-500">Help us personalize your experience</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Age Range <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {AGE_RANGES.map((range) => (
                <button
                  key={range}
                  type="button"
                  onClick={() => setAgeRange(range)}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    ageRange === range
                      ? 'border-cyan-500 bg-cyan-50 text-cyan-900'
                      : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700'
                  }`}
                >
                  <div className="font-medium">{range}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Which best describes you? <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {GENDERS.map((genderOption) => (
                <button
                  key={genderOption}
                  type="button"
                  onClick={() => setGender(genderOption)}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    gender === genderOption
                      ? 'border-cyan-500 bg-cyan-50 text-cyan-900'
                      : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700'
                  }`}
                >
                  <div className="font-medium">{genderOption}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                Location <span className="text-gray-400 font-normal">(Optional)</span>
              </div>
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., California, USA"
              className="w-full px-4 py-3 text-base rounded-xl border-2 border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all"
            />
            <p className="text-xs text-gray-500 mt-2">
              Helps us provide location-specific resources and support
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-gray-500" />
                Interests <span className="text-gray-400 font-normal">(Optional)</span>
              </div>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {INTEREST_OPTIONS.map((interest) => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => handleInterestToggle(interest)}
                  className={`p-3 rounded-lg border-2 transition-all text-sm ${
                    interests.includes(interest)
                      ? 'border-cyan-500 bg-cyan-50 text-cyan-900'
                      : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Select any that apply - helps us personalize your experience
            </p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-full hover:bg-gray-50 transition-colors"
              disabled={isSaving}
            >
              Skip for now
            </button>
            <button
              type="submit"
              disabled={isSaving || !ageRange || !gender}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-full hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving...' : 'Continue'}
            </button>
          </div>

          <p className="text-xs text-center text-gray-500">
            Your information is private and secure. We use it only to personalize your mental health support.
          </p>
        </form>
      </div>
    </div>
  );
}
