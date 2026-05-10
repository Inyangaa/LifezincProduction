import { useState } from 'react';
import { X, Heart, Phone, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';

interface TherapistRecommendationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToSupport: () => void;
  distressLevel: 'moderate' | 'high' | 'severe';
  recommendation: string;
}

export function TherapistRecommendationModal({
  isOpen,
  onClose,
  onNavigateToSupport,
  distressLevel,
  recommendation,
}: TherapistRecommendationModalProps) {
  const [dismissed, setDismissed] = useState(false);

  if (!isOpen || dismissed) return null;

  const isCrisis = distressLevel === 'severe';

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 md:p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                isCrisis ? 'bg-red-100' : 'bg-teal-100'
              }`}>
                <Heart className={`w-6 h-6 ${isCrisis ? 'text-red-600' : 'text-teal-600'}`} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {isCrisis ? 'You may need extra support right now' : 'We care about you'}
                </h2>
                <p className="text-gray-600">{isCrisis ? 'Help is available 24/7' : 'Professional support could help'}</p>
              </div>
            </div>
            <button
              onClick={() => {
                setDismissed(true);
                onClose();
              }}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {isCrisis && (
            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded mb-6">
              <div className="flex items-start gap-3">
                <Heart className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-900 font-semibold mb-2">
                    What you're feeling is really hard
                  </p>
                  <p className="text-gray-800 text-sm mb-3">
                    You don't have to go through this alone. There are people who care and want to help—right now.
                  </p>
                  <div className="space-y-2">
                    <a
                      href="tel:988"
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm inline-flex"
                    >
                      <Phone className="w-4 h-4" />
                      Call or text 988
                    </a>
                    <p className="text-gray-700 text-xs">
                      Or text HOME to 741741—free, confidential, 24/7
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mb-6">
            <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl p-6 border-l-4 border-teal-500 mb-4">
              <p className="text-gray-800 leading-relaxed mb-4">{recommendation}</p>
              <p className="text-gray-700 text-sm">
                LifeZinc has noticed patterns in your emotional entries that may benefit from professional guidance.
                This is a gentle nudge, not a diagnosis. You're in control of your healing journey.
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Why This Suggestion?
              </h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-600">•</span>
                  <span>You've been experiencing persistent difficult emotions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">•</span>
                  <span>Professional therapists have specialized training to help</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">•</span>
                  <span>Therapy provides tools and support that journaling alone may not</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">•</span>
                  <span>Seeking help is a sign of strength and self-care</span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-gray-700 text-sm">
                <strong>Please note:</strong> LifeZinc provides supportive tools but is not a replacement for professional mental health care.
                This suggestion is based on patterns we've noticed and is meant to support your wellbeing.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => {
                onNavigateToSupport();
                setDismissed(true);
              }}
              className="w-full py-4 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors font-semibold text-lg flex items-center justify-center gap-2 shadow-lg"
            >
              Find Professional Support Near Me
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => {
                setDismissed(true);
                onClose();
              }}
              className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
            >
              Not Right Now
            </button>

            <p className="text-center text-gray-500 text-xs mt-4">
              We won't show this again for at least 7 days
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
