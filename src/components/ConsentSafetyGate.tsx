import { useState } from 'react';
import { AlertTriangle, Phone, Shield, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ConsentSafetyGateProps {
  onAccept: () => void;
  onClose?: () => void;
  canClose?: boolean;
}

export function ConsentSafetyGate({ onAccept, onClose, canClose = false }: ConsentSafetyGateProps) {
  const [accepted, setAccepted] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleAccept = async () => {
    if (!accepted) {
      return;
    }

    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { error } = await supabase
          .from('user_preferences')
          .update({
            consent_accepted: true,
            consent_accepted_at: new Date().toISOString()
          })
          .eq('user_id', user.id);

        if (error) {
          console.error('Error saving consent:', error);
        }
      }

      onAccept();
    } catch (error) {
      console.error('Error in consent flow:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Consent & Safety</h2>
          </div>
          {canClose && onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          )}
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-red-900">Emergency Crisis Resources</h3>
                <div className="space-y-2 text-red-900">
                  <p className="font-semibold">If you are in immediate danger, call 911</p>
                  <div className="bg-white rounded-lg p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <Phone className="w-5 h-5 text-red-600" />
                      <div>
                        <p className="font-semibold">988 Suicide & Crisis Lifeline</p>
                        <p className="text-sm text-gray-700">Call or text 988 (available 24/7)</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-5 h-5 text-red-600" />
                      <div>
                        <p className="font-semibold">Crisis Text Line</p>
                        <p className="text-sm text-gray-700">Text HOME to 741741</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 space-y-3">
            <h3 className="text-lg font-semibold text-blue-900">Important Information</h3>
            <ul className="space-y-2 text-blue-900">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>LifeZinc is a mental wellness companion and journaling tool designed to support emotional awareness and personal growth.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>LifeZinc is <strong>not a substitute for professional medical advice, diagnosis, or treatment</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>If you are experiencing a mental health crisis or have concerns about your wellbeing, please consult with a qualified mental health professional.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Always seek the advice of your physician or other qualified health provider with any questions regarding a medical condition.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Never disregard professional medical advice or delay seeking it because of something you have used or read in LifeZinc.</span>
              </li>
            </ul>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 space-y-3">
            <h3 className="text-lg font-semibold text-emerald-900">What LifeZinc Offers</h3>
            <ul className="space-y-2 text-emerald-900">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 mt-1">✓</span>
                <span>Emotional awareness tools and mood tracking</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 mt-1">✓</span>
                <span>Guided journaling prompts and reflections</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 mt-1">✓</span>
                <span>Self-help resources and coping strategies</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 mt-1">✓</span>
                <span>Personal growth insights and patterns</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 mt-1">✓</span>
                <span>Optional spiritual support and encouragement</span>
              </li>
            </ul>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                className="mt-1 w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 cursor-pointer"
              />
              <span className="text-gray-900 select-none group-hover:text-gray-700">
                <strong>I understand and agree that:</strong> LifeZinc is not medical advice, diagnosis, or treatment. I will seek professional help for medical or mental health concerns and call 911 or 988 in case of emergency.
              </span>
            </label>
          </div>

          <div className="flex gap-3">
            {canClose && onClose && (
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              onClick={handleAccept}
              disabled={!accepted || saving}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
                accepted && !saving
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg hover:shadow-xl'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {saving ? 'Saving...' : 'Continue to LifeZinc'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
