import { useState, useEffect } from 'react';
import { ArrowLeft, Heart, Trash2, Plus, Info } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { EmotionKey } from '../data/faithVerses';

interface FavoritesPageProps {
  onBack: () => void;
}

interface SavedReframe {
  id: string;
  reframe_text: string;
  is_user_created: boolean;
  created_at: string;
  journal_entry_id: string | null;
  emotion?: string;
  verse_text?: string;
  verse_reference?: string;
}

export function FavoritesPage({ onBack }: FavoritesPageProps) {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<SavedReframe[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newReframe, setNewReframe] = useState('');
  const [saving, setSaving] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [newEmotion, setNewEmotion] = useState<EmotionKey | ''>('');
  const [newVerseText, setNewVerseText] = useState('');
  const [newVerseReference, setNewVerseReference] = useState('');

  useEffect(() => {
    loadFavorites();
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (showTooltip && !target.closest('.tooltip-container')) {
        setShowTooltip(false);
      }
    };

    if (showTooltip) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showTooltip]);

  const loadFavorites = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('saved_reframes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading favorites:', error);
    } else {
      setFavorites(data || []);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('saved_reframes').delete().eq('id', id);

    if (error) {
      console.error('Error deleting favorite:', error);
    } else {
      setFavorites(prev => prev.filter(f => f.id !== id));
    }
  };

  const handleCreate = async () => {
    if (!newReframe.trim() || !user) return;

    setSaving(true);
    const { data, error } = await supabase
      .from('saved_reframes')
      .insert([
        {
          user_id: user.id,
          reframe_text: newReframe,
          is_user_created: true,
          emotion: newEmotion || null,
          verse_text: newVerseText || null,
          verse_reference: newVerseReference || null,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating reframe:', error);
    } else {
      setFavorites(prev => [data, ...prev]);
      setNewReframe('');
      setNewEmotion('');
      setNewVerseText('');
      setNewVerseReference('');
      setShowCreateForm(false);
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Heart className="w-8 h-8 text-emerald-600" />
              <h2 className="text-3xl font-bold text-gray-900">Saved Reframes</h2>
            </div>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create</span>
            </button>
          </div>

          {showCreateForm && (
            <div className="mb-6 p-6 bg-emerald-50 rounded-xl border-2 border-emerald-200">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-lg font-semibold text-gray-900">Create Your Own Reframe</h3>
                <div className="relative tooltip-container">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowTooltip(!showTooltip);
                    }}
                    className="text-gray-500 hover:text-teal-600 transition-colors cursor-pointer"
                    aria-label="What is a reframe?"
                    type="button"
                  >
                    <Info className="w-5 h-5" />
                  </button>
                  {showTooltip && (
                    <div
                      className="absolute left-0 top-8 z-50 w-80 p-4 bg-white rounded-xl shadow-lg border-2"
                      style={{ borderColor: '#1AB0A8' }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <h4 className="font-semibold text-gray-900 mb-2" style={{ fontSize: '14px' }}>What is a Reframe?</h4>
                      <p className="text-gray-700 leading-relaxed" style={{ fontSize: '13px' }}>
                        A reframe helps you change a stressful or painful thought into a calmer, more supportive one.
                      </p>
                      <p className="mt-2 italic text-gray-600" style={{ fontSize: '13px' }}>
                        Example: "I'm failing" → "I'm learning and still trying."
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <textarea
                value={newReframe}
                onChange={(e) => setNewReframe(e.target.value)}
                placeholder="Write a positive reframe that resonates with you..."
                className="w-full min-h-[120px] p-4 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:outline-none resize-none mb-4"
              />

              <div className="space-y-3 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Emotion (optional)
                  </label>
                  <select
                    value={newEmotion}
                    onChange={(e) => setNewEmotion(e.target.value as EmotionKey | '')}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:outline-none text-sm"
                  >
                    <option value="">None</option>
                    <option value="anxiety">Anxiety</option>
                    <option value="fear">Fear</option>
                    <option value="sadness">Sadness</option>
                    <option value="guilt">Guilt</option>
                    <option value="loneliness">Loneliness</option>
                    <option value="anger">Anger</option>
                    <option value="hopelessness">Hopelessness</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Verse Text (optional)
                  </label>
                  <input
                    type="text"
                    value={newVerseText}
                    onChange={(e) => setNewVerseText(e.target.value)}
                    placeholder="e.g., The Lord is close to the brokenhearted."
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Verse Reference (optional)
                  </label>
                  <input
                    type="text"
                    value={newVerseReference}
                    onChange={(e) => setNewVerseReference(e.target.value)}
                    placeholder="e.g., Psalm 34:18"
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:outline-none text-sm"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleCreate}
                  disabled={!newReframe.trim() || saving}
                  className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewReframe('');
                    setNewEmotion('');
                    setNewVerseText('');
                    setNewVerseReference('');
                  }}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          ) : favorites.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">No saved reframes yet</p>
              <p className="text-sm text-gray-500">
                Save reframes from your journal entries or create your own
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {favorites.map((favorite) => (
                <div
                  key={favorite.id}
                  className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border-l-4 border-emerald-600 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      {favorite.verse_text && favorite.verse_reference && (
                        <div className="mb-3 p-3 bg-white/60 rounded-lg border border-teal-200">
                          <p className="text-sm text-gray-700 italic mb-1">
                            "{favorite.verse_text}"
                          </p>
                          <p className="text-xs text-gray-600">
                            — {favorite.verse_reference}
                          </p>
                        </div>
                      )}

                      <p className="text-gray-800 text-lg leading-relaxed mb-2">
                        {favorite.reframe_text}
                      </p>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span>
                          {new Date(favorite.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                        {favorite.is_user_created && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                            Your Creation
                          </span>
                        )}
                        {favorite.emotion && (
                          <span className="px-2 py-1 bg-teal-100 text-teal-700 rounded text-xs font-medium capitalize">
                            {favorite.emotion}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(favorite.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-xs text-gray-700 leading-relaxed mb-2">
                <strong>Important:</strong> Faith-Friendly reflections are optional and may not fit everyone's beliefs. LifeZinc does not replace therapy, medical care, or emergency services.
              </p>
              <p className="text-xs text-gray-700 leading-relaxed">
                If you are in crisis or thinking of harming yourself or others, please contact your local emergency number or a crisis hotline immediately (for example, 988 in the United States).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
