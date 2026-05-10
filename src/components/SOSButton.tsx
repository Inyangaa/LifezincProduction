import { useState, useEffect } from 'react';
import { AlertCircle, Phone, MessageSquare, Heart, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { teenCrisisResources } from '../utils/teenMode';

export function SOSButton() {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [teenMode, setTeenMode] = useState(false);

  useEffect(() => {
    loadUserPreferences();
  }, [user]);

  const loadUserPreferences = async () => {
    if (!user?.id) return;

    const { data } = await supabase
      .from('user_preferences')
      .select('teen_mode')
      .eq('user_id', user.id)
      .maybeSingle();

    if (data) {
      setTeenMode(data.teen_mode || false);
    }
  };

  const crisisResources = [
    {
      name: 'National Suicide Prevention Lifeline',
      number: '988',
      description: '24/7 free and confidential support',
      action: 'tel:988',
    },
    {
      name: 'Crisis Text Line',
      text: 'HOME to 741741',
      description: 'Text-based support available 24/7',
      action: 'sms:741741&body=HOME',
    },
    {
      name: 'SAMHSA National Helpline',
      number: '1-800-662-4357',
      description: 'Treatment referral and information',
      action: 'tel:1-800-662-4357',
    },
  ];

  const groundingTechniques = [
    'Take 5 deep breaths: Inhale for 4, hold for 4, exhale for 4',
    'Name 5 things you can see around you right now',
    'Place your feet flat on the floor and press down firmly',
    'Hold an ice cube in your hand and focus on the sensation',
    'Say out loud: "I am safe right now. This feeling will pass."',
  ];

  const resourcesToShow = teenMode ? teenCrisisResources : crisisResources;

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 z-40 w-16 h-16 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 animate-pulse"
        aria-label="Crisis Support"
      >
        <AlertCircle className="w-8 h-8" />
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 md:p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <Heart className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">You're Not Alone</h2>
                    <p className="text-gray-600">Immediate support is available</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded">
                  <p className="text-red-900 font-semibold mb-2">
                    If you're in immediate danger, please call 911 or go to your nearest emergency room.
                  </p>
                  <p className="text-red-800 text-sm">
                    Your safety is the top priority. Professional help is available right now.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Phone className="w-5 h-5 text-emerald-600" />
                    {teenMode ? 'Crisis Support for Teens' : 'Crisis Hotlines'}
                  </h3>
                  <div className="space-y-3">
                    {resourcesToShow.map((resource, idx) => (
                      <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:border-emerald-500 transition-colors">
                        <div className="flex flex-col">
                          <h4 className="font-semibold text-gray-900 mb-1">{resource.name}</h4>
                          <p className="text-sm text-gray-600 mb-2">{resource.description}</p>
                          <div className="text-lg font-bold text-emerald-600 mb-2">
                            {resource.action}
                          </div>
                          {'link' in resource && resource.link && (
                            <a
                              href={resource.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:text-blue-800 underline"
                            >
                              Visit Website
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Quick Grounding Techniques
                  </h3>
                  <div className="space-y-2">
                    {groundingTechniques.map((technique, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-teal-50 rounded-lg">
                        <span className="flex-shrink-0 w-6 h-6 bg-teal-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {idx + 1}
                        </span>
                        <p className="text-gray-800">{technique}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <h3 className="font-bold text-gray-900 mb-2">You Matter</h3>
                  <p className="text-gray-700 text-sm">
                    This difficult moment doesn't define you. Reaching out for help is a sign of strength, not weakness.
                    Professionals are available right now to support you through this.
                  </p>
                </div>

                <button
                  onClick={() => setShowModal(false)}
                  className="w-full py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
