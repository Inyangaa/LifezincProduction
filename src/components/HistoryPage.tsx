import { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Tag, Download, TrendingUp, ChevronDown } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { analyzeJournalEntries, downloadTherapyExport } from '../utils/therapyExport';

interface HistoryPageProps {
  onBack: () => void;
}

interface JournalEntry {
  id: string;
  mood: string;
  emotions: string[] | null;
  text_entry: string;
  initial_reframe: string;
  tags: string[] | null;
  created_at: string;
}

export function HistoryPage({ onBack }: HistoryPageProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [filter, setFilter] = useState<'all' | 'week' | 'month'>('all');

  useEffect(() => {
    loadEntries();
  }, [user, filter]);

  const loadEntries = async () => {
    if (!user) return;

    setLoading(true);

    let query = supabase
      .from('journal_entries')
      .select('id, mood, emotions, text_entry, initial_reframe, tags, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (filter === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      query = query.gte('created_at', weekAgo.toISOString());
    } else if (filter === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      query = query.gte('created_at', monthAgo.toISOString());
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error loading entries:', error);
    } else {
      setEntries(data || []);
    }

    setLoading(false);
  };

  const handleExportForTherapy = async () => {
    setExporting(true);
    try {
      const analysis = analyzeJournalEntries(entries);
      downloadTherapyExport(analysis);
    } catch (error) {
      console.error('Error exporting for therapy:', error);
      alert('Failed to export. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const getMoodEmoji = (mood: string) => {
    const emojiMap: Record<string, string> = {
      happy: '😊',
      sad: '😔',
      anxious: '😰',
      frustrated: '😤',
      tired: '😴',
      confused: '🤔',
      loved: '😍',
      angry: '😡',
      hurt: '😢',
      peaceful: '😌',
      worried: '😟',
      vulnerable: '🥺',
      disappointed: '😞',
      content: '🙂',
      stressed: '😣',
      grateful: '🤗',
      overwhelmed: '😩',
      numb: '😐',
      hopeful: '🥰',
      guilty: '😖',
      embarrassed: '😳',
      skeptical: '🤨',
      relieved: '😌',
      uncertain: '😕',
    };
    return emojiMap[mood] || '😐';
  };

  const toggleEntry = (id: string) => {
    setExpandedEntry(expandedEntry === id ? null : id);
  };

  const getMoodStats = () => {
    const moodCounts: Record<string, number> = {};
    entries.forEach(entry => {
      moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
    });
    return Object.entries(moodCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
  };

  const topMoods = getMoodStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-rose-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          <button
            onClick={handleExportForTherapy}
            disabled={exporting || entries.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-full hover:from-teal-600 hover:to-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all font-medium shadow-lg"
          >
            {exporting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span className="hidden sm:inline">Exporting...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </>
            )}
          </button>
        </div>

        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Journey</h1>
          <p className="text-gray-600">{entries.length} journal {entries.length === 1 ? 'entry' : 'entries'}</p>
        </div>

        {topMoods.length > 0 && (
          <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-teal-600" />
              <h3 className="font-bold text-gray-900">Top Emotions</h3>
            </div>
            <div className="flex gap-3">
              {topMoods.map(([mood, count]) => (
                <div key={mood} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-full">
                  <span className="text-2xl">{getMoodEmoji(mood)}</span>
                  <span className="font-medium text-gray-900 capitalize">{mood}</span>
                  <span className="text-sm text-gray-600">×{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2 mb-6">
          {(['all', 'week', 'month'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === f
                  ? 'bg-teal-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {f === 'all' ? 'All Time' : f === 'week' ? 'This Week' : 'This Month'}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
            <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : entries.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
            <p className="text-gray-600 mb-6">No journal entries yet.</p>
            <button
              onClick={onBack}
              className="px-8 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-full hover:from-teal-600 hover:to-teal-700 transition-all font-semibold shadow-lg"
            >
              Start Journaling
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
              >
                <button
                  onClick={() => toggleEntry(entry.id)}
                  className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-full flex items-center justify-center text-2xl">
                          {getMoodEmoji(entry.mood)}
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-gray-900 capitalize text-lg">{entry.mood}</div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(entry.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </div>
                          {entry.emotions && entry.emotions.length > 0 && (
                            <div className="flex gap-1 flex-wrap mt-2">
                              {entry.emotions.map((emotion, idx) => (
                                <span
                                  key={idx}
                                  className="emotion-badge text-xs capitalize"
                                >
                                  {getMoodEmoji(emotion)} {emotion}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-700 line-clamp-2 leading-relaxed">
                        {entry.text_entry}
                      </p>
                      {entry.tags && entry.tags.length > 0 && (
                        <div className="flex items-center gap-2 mt-3">
                          <Tag className="w-3 h-3 text-gray-400" />
                          <div className="flex gap-2 flex-wrap">
                            {entry.tags.slice(0, 3).map((tag, idx) => (
                              <span
                                key={idx}
                                className="text-xs bg-teal-50 text-teal-700 px-3 py-1 rounded-full font-medium"
                              >
                                {tag}
                              </span>
                            ))}
                            {entry.tags.length > 3 && (
                              <span className="text-xs text-gray-500">+{entry.tags.length - 3}</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ml-4 ${
                        expandedEntry === entry.id ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </button>

                {expandedEntry === entry.id && (
                  <div className="px-6 pb-6 space-y-4 bg-gradient-to-br from-gray-50 to-teal-50/30">
                    <div className="pt-4 border-t border-gray-200">
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                        Your Thoughts
                      </div>
                      <p className="text-gray-800 leading-relaxed">{entry.text_entry}</p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl border border-teal-200">
                      <div className="text-xs font-bold text-teal-700 uppercase tracking-wider mb-2">
                        Reflection
                      </div>
                      <p className="text-gray-900 font-medium leading-relaxed">{entry.initial_reframe}</p>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(entry.created_at).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
