import { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, CheckCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { getFaithTraditions, getFaithVerse, categorizeEmotion } from '../utils/faithEncouragement';
import type { FaithTradition } from '../utils/faithEncouragement';

interface SpiritualSupportPageProps {
  onBack: () => void;
}

export function SpiritualSupportPage({ onBack }: SpiritualSupportPageProps) {
  const { user } = useAuth();
  const [faithEnabled, setFaithEnabled] = useState(false);
  const [selectedFaith, setSelectedFaith] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'anxiety' | 'sadness' | 'anger' | 'guilt' | 'stress' | 'gratitude'>('gratitude');
  const faithTraditions = getFaithTraditions();
  const [previewVerse, setPreviewVerse] = useState<any>(null);

  useEffect(() => {
    loadFaithPreferences();
  }, [user]);

  useEffect(() => {
    if (selectedFaith && selectedCategory) {
      const verse = getFaithVerse(selectedFaith, selectedCategory);
      setPreviewVerse(verse);
    }
  }, [selectedFaith, selectedCategory]);

  const loadFaithPreferences = async () => {
    if (!user?.id) return;

    const { data, error } = await supabase
      .from('user_preferences')
      .select('faith_support_enabled, faith_tradition')
      .eq('user_id', user.id)
      .maybeSingle();

    if (data) {
      setFaithEnabled(data.faith_support_enabled || false);
      setSelectedFaith(data.faith_tradition || '');
    }
  };

  const saveFaithPreferences = async () => {
    if (!user?.id) return;

    setSaving(true);
    setSaveMessage('');

    const { data: existing } = await supabase
      .from('user_preferences')
      .select('user_id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from('user_preferences')
        .update({
          faith_support_enabled: faithEnabled,
          faith_tradition: selectedFaith,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating faith preferences:', error);
        setSaveMessage('Failed to save preferences');
      } else {
        setSaveMessage('Spiritual preferences saved successfully');
      }
    } else {
      const { error } = await supabase
        .from('user_preferences')
        .insert({
          user_id: user.id,
          faith_support_enabled: faithEnabled,
          faith_tradition: selectedFaith,
        });

      if (error) {
        console.error('Error creating faith preferences:', error);
        setSaveMessage('Failed to save preferences');
      } else {
        setSaveMessage('Spiritual preferences saved successfully');
      }
    }

    setSaving(false);
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const emotionCategories = [
    { id: 'gratitude', name: 'Gratitude & Peace', color: 'emerald' },
    { id: 'anxiety', name: 'Anxiety & Worry', color: 'amber' },
    { id: 'sadness', name: 'Sadness & Grief', color: 'blue' },
    { id: 'anger', name: 'Anger & Frustration', color: 'red' },
    { id: 'guilt', name: 'Guilt & Shame', color: 'purple' },
    { id: 'stress', name: 'Stress & Overwhelm', color: 'orange' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-3 rounded-xl">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Spiritual Support</h2>
              <p className="text-gray-600">Connect with wisdom from sacred traditions</p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-6 h-6 text-amber-600" />
                <h3 className="text-xl font-semibold text-gray-900">How It Works</h3>
              </div>
              <p className="text-gray-700 leading-relaxed mb-3">
                When you complete a journal entry, you'll receive a relevant verse or teaching from your chosen spiritual tradition, along with a gentle reflection question. This optional feature is designed to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Provide comfort and perspective during difficult emotions</li>
                <li>Connect your mental wellness journey with your faith</li>
                <li>Offer timeless wisdom that relates to your current state</li>
                <li>Respect and honor diverse spiritual paths</li>
              </ul>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="mb-6 p-4 rounded-2xl bg-[#f1fbf9] border border-[#d3ebe7]">
                <p className="text-sm mb-3 text-[#2c514e] font-medium">
                  Need spiritual encouragement?
                </p>
                <div className="flex items-center justify-between mb-3">
                  <button
                    onClick={() => setFaithEnabled(!faithEnabled)}
                    className="px-4 py-2 rounded-full border border-[#1AB0A8] bg-white text-[#1AB0A8] text-sm font-semibold hover:bg-[#f1fbf9] transition-colors"
                  >
                    {faithEnabled ? 'Faith Mode: On' : 'Enable Faith-Friendly Mode'}
                  </button>
                  <button
                    id="faith-toggle"
                    onClick={() => setFaithEnabled(!faithEnabled)}
                    className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${
                      faithEnabled ? 'bg-[#1AB0A8]' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                        faithEnabled ? 'translate-x-8' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                <p className="text-xs text-[#6b7c7a]">
                  These verses are optional and meant to comfort you. LifeZinc is not a replacement for therapy, medical care, or emergency help.
                </p>
              </div>

              {faithEnabled && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Select Your Spiritual Tradition
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Choose from the five major world religions. Each tradition offers wisdom from its sacred texts.
                    </p>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {faithTraditions.map((tradition: FaithTradition) => (
                        <button
                          key={tradition.id}
                          onClick={() => setSelectedFaith(tradition.id)}
                          className={`p-5 rounded-xl border-2 transition-all text-left ${
                            selectedFaith === tradition.id
                              ? 'border-emerald-600 bg-emerald-50 shadow-md'
                              : 'border-gray-200 bg-white hover:border-emerald-300 hover:shadow-sm'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-4xl">{tradition.icon}</span>
                            {selectedFaith === tradition.id && (
                              <CheckCircle className="w-6 h-6 text-emerald-600" />
                            )}
                          </div>
                          <div className="font-bold text-gray-900 text-lg mb-1">{tradition.name}</div>
                          <div className="text-sm text-gray-600">{tradition.book}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {selectedFaith && (
                    <div className="space-y-4 border-t border-gray-200 pt-6">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Preview Wisdom
                      </h3>
                      <p className="text-sm text-gray-600">
                        See how verses from your selected tradition relate to different emotional states
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {emotionCategories.map((category) => (
                          <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id as any)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                              selectedCategory === category.id
                                ? `bg-${category.color}-100 text-${category.color}-800 border-2 border-${category.color}-400`
                                : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:border-gray-300'
                            }`}
                          >
                            {category.name}
                          </button>
                        ))}
                      </div>

                      {previewVerse && (
                        <div className="p-6 bg-[#f1fbf9] rounded-2xl border border-[#d3ebe7] animate-in fade-in duration-300">
                          <div className="bg-white rounded-xl p-5 mb-4 border border-[#e0f0ee]">
                            <p className="text-[#304845] text-base leading-relaxed italic mb-3">
                              "{previewVerse.text}"
                            </p>
                            <p className="text-[#6b7c7a] text-sm">
                              — {previewVerse.citation}
                            </p>
                          </div>
                          <div className="bg-white rounded-xl p-4 border border-[#e0f0ee]">
                            <p className="text-sm font-medium text-[#304845] mb-2">Reflection:</p>
                            <p className="text-sm text-[#304845] leading-relaxed">
                              {previewVerse.reflection}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <button
                    onClick={saveFaithPreferences}
                    disabled={saving || !selectedFaith}
                    className="w-full mt-4 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-semibold flex items-center justify-center gap-2"
                  >
                    {saving ? 'Saving...' : 'Save Spiritual Preferences'}
                  </button>

                  {saveMessage && (
                    <div className={`p-4 rounded-lg text-center font-medium ${
                      saveMessage.includes('Failed')
                        ? 'bg-red-100 border border-red-200 text-red-800'
                        : 'bg-emerald-100 border border-emerald-200 text-emerald-800'
                    }`}>
                      {saveMessage}
                    </div>
                  )}
                </div>
              )}

              {!faithEnabled && (
                <div className="p-6 bg-gray-50 rounded-xl border border-gray-200 text-center">
                  <p className="text-gray-600">
                    Enable spiritual support to connect your mental wellness journey with your faith tradition.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
