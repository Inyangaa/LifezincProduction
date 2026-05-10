import { useState } from 'react';
import { ArrowLeft, BookOpen, Heart, Search, X, ExternalLink } from 'lucide-react';
import { faithVerses, type FaithKey, type EmotionKey } from '../data/faithVerses';
import { normalizeAndMapTopic, getMessageForTopic, getGeneralComfortMessage, type FaithSource as FaithSourceType } from '../data/faithMessagesByTopic';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { VoiceInput } from './VoiceInput';

interface FaithPageProps {
  onBack: () => void;
}

interface FaithSource {
  id: FaithKey;
  name: string;
  icon: string;
  book: string;
  color: string;
}

const faithSources: FaithSource[] = [
  { id: 'christian', name: 'Christian', icon: '✝️', book: 'Bible', color: 'from-blue-500 to-cyan-500' },
  { id: 'muslim', name: 'Muslim', icon: '☪️', book: 'Quran', color: 'from-emerald-500 to-teal-500' },
  { id: 'jewish', name: 'Jewish', icon: '✡️', book: 'Torah', color: 'from-indigo-500 to-blue-500' },
  { id: 'general', name: 'General Spiritual', icon: '🌟', book: 'Universal Wisdom', color: 'from-amber-500 to-orange-500' }
];

const externalBookLinks: Record<FaithKey, { url: string; label: string } | null> = {
  christian: {
    url: 'https://www.biblegateway.com/',
    label: 'Open full Bible'
  },
  muslim: {
    url: 'https://quran.com/',
    label: 'Open full Qur\'an'
  },
  jewish: {
    url: 'https://www.sefaria.org/',
    label: 'Open full Torah'
  },
  general: null
};

export function FaithPage({ onBack }: FaithPageProps) {
  const { user } = useAuth();
  const [selectedSource, setSelectedSource] = useState<FaithKey | null>(null);
  const [searchTopic, setSearchTopic] = useState('');
  const [filteredVerses, setFilteredVerses] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [noMatchMessage, setNoMatchMessage] = useState('');

  const handleSourceSelect = (sourceId: FaithKey) => {
    setSelectedSource(sourceId);
    setSearchTopic('');
    setFilteredVerses([]);
    setNoMatchMessage('');
  };

  const handleSearch = (topic: string) => {
    setSearchTopic(topic);
    setNoMatchMessage('');

    if (!selectedSource) return;

    if (!topic) {
      setFilteredVerses([]);
      return;
    }

    const mappedTopic = normalizeAndMapTopic(topic);

    if (mappedTopic) {
      const message = getMessageForTopic(selectedSource as FaithSourceType, mappedTopic);

      if (message) {
        setFilteredVerses([
          {
            emotion: mappedTopic,
            text: message.text,
            reference: message.reference
          }
        ]);
      } else {
        setNoMatchMessage(`We don't have specific messages for that topic yet, so here are some general words of comfort.`);
        const comfortMessage = getGeneralComfortMessage(selectedSource as FaithSourceType);
        setFilteredVerses([
          {
            emotion: 'comfort',
            text: comfortMessage.text,
            reference: comfortMessage.reference
          }
        ]);
      }
    } else {
      setNoMatchMessage(`We don't have specific messages for "${topic}" yet, so here are some general words of comfort.`);
      const comfortMessage = getGeneralComfortMessage(selectedSource as FaithSourceType);
      setFilteredVerses([
        {
          emotion: 'comfort',
          text: comfortMessage.text,
          reference: comfortMessage.reference
        }
      ]);
    }
  };

  const handleVoiceInput = (text: string) => {
    handleSearch(text);
  };

  const handleSaveVerse = async (verse: any) => {
    if (!user?.id) {
      setSaveMessage('Please sign in to save verses');
      setTimeout(() => setSaveMessage(''), 3000);
      return;
    }

    setSaving(true);
    setSaveMessage('');

    try {
      const { error } = await supabase
        .from('saved_reframes')
        .insert({
          user_id: user.id,
          original_thought: `Seeking ${verse.emotion} support`,
          reframed_thought: verse.text,
          emotion: verse.emotion,
          faith_verse: verse.reference,
          created_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error saving verse:', error);
        setSaveMessage('Failed to save verse');
      } else {
        setSaveMessage('Verse saved to your check-in history');
      }
    } catch (err) {
      console.error('Error:', err);
      setSaveMessage('Failed to save verse');
    }

    setSaving(false);
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleBack = () => {
    if (selectedSource) {
      setSelectedSource(null);
      setSearchTopic('');
      setFilteredVerses([]);
    } else {
      onBack();
    }
  };

  const currentSource = selectedSource ? faithSources.find(s => s.id === selectedSource) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{selectedSource ? 'Choose Another Source' : 'Back to Home'}</span>
        </button>

        {!selectedSource ? (
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl mb-4">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Faith & Inspiration</h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Find comfort and guidance from sacred texts and spiritual wisdom. Choose your source of inspiration below.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                This feature is optional and stays within the app
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {faithSources.map((source) => (
                <button
                  key={source.id}
                  onClick={() => handleSourceSelect(source.id)}
                  className="group p-8 bg-white rounded-2xl border-2 border-gray-200 hover:border-cyan-400 hover:shadow-xl transition-all duration-300 text-left hover:-translate-y-1"
                >
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${source.color} rounded-2xl mb-4 text-3xl group-hover:scale-110 transition-transform`}>
                    {source.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{source.name}</h3>
                  <p className="text-gray-600">{source.book}</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10">
            <div className="flex items-center gap-4 mb-8">
              <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${currentSource?.color} rounded-2xl text-3xl`}>
                {currentSource?.icon}
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">{currentSource?.name}</h2>
                <p className="text-gray-600">{currentSource?.book}</p>
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Search by topic (peace, fear, strength, etc.)
              </label>
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchTopic}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Type a topic or emotion..."
                    className="w-full pl-12 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:border-cyan-400 focus:outline-none text-gray-900"
                  />
                  {searchTopic && (
                    <button
                      onClick={() => handleSearch('')}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
                <VoiceInput onTranscript={handleVoiceInput} />
              </div>
            </div>

            <div className="space-y-6 mb-8">
              {noMatchMessage && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <p className="text-sm text-amber-800">{noMatchMessage}</p>
                </div>
              )}

              <h3 className="text-xl font-semibold text-gray-900">
                {searchTopic ? `Results for "${searchTopic}"` : 'Search for a topic above'}
              </h3>

              {filteredVerses.map((verse, index) => (
                <div
                  key={index}
                  className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-cyan-200 hover:shadow-lg transition-shadow"
                >
                  <div className="mb-3">
                    <span className="inline-block px-3 py-1 bg-white rounded-full text-sm font-medium text-cyan-700 mb-3 capitalize">
                      {verse.emotion}
                    </span>
                  </div>
                  <p className="text-gray-800 text-lg leading-relaxed italic mb-4">
                    "{verse.text}"
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-gray-600 font-medium">— {verse.reference}</p>
                    <button
                      onClick={() => handleSaveVerse(verse)}
                      disabled={saving}
                      className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-cyan-300 text-cyan-700 rounded-lg hover:bg-cyan-50 transition-colors disabled:opacity-50"
                    >
                      <Heart className="w-4 h-4" />
                      <span className="text-sm font-medium">Save</span>
                    </button>
                  </div>
                </div>
              ))}

              {filteredVerses.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No passages found. Try a different topic.</p>
                </div>
              )}
            </div>

            {selectedSource && externalBookLinks[selectedSource] && (
              <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border-2 border-blue-200">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-center sm:text-left">
                    <h4 className="text-lg font-semibold text-gray-900 mb-1">
                      Want to explore more?
                    </h4>
                    <p className="text-sm text-gray-600">
                      Read the complete text for deeper study and reflection
                    </p>
                  </div>
                  <a
                    href={externalBookLinks[selectedSource]!.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-full hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg hover:shadow-xl whitespace-nowrap"
                  >
                    <span>{externalBookLinks[selectedSource]!.label}</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                <p className="text-xs text-gray-500 mt-3 text-center sm:text-left">
                  Opens in a new tab • Optional reading resource
                </p>
              </div>
            )}

            {saveMessage && (
              <div className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg text-white font-medium ${
                saveMessage.includes('Failed') ? 'bg-red-500' : 'bg-emerald-500'
              }`}>
                {saveMessage}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
