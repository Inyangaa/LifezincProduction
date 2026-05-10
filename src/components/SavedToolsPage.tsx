import { useState, useEffect } from 'react';
import { ArrowLeft, Bookmark, ExternalLink, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { ISSUE_SOLUTIONS } from '../data/issueSolutions';

interface SavedToolsPageProps {
  onBack: () => void;
}

interface SavedTool {
  id: string;
  issue_key: string;
  solution_index: number;
  solution_title: string;
  solution_type: string;
  created_at: string;
}

export function SavedToolsPage({ onBack }: SavedToolsPageProps) {
  const { user } = useAuth();
  const [savedTools, setSavedTools] = useState<SavedTool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadSavedTools();
    }
  }, [user]);

  const loadSavedTools = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('saved_tools')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setSavedTools(data || []);
    } catch (error) {
      console.error('Error loading saved tools:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (toolId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('saved_tools')
        .delete()
        .eq('id', toolId)
        .eq('user_id', user.id);

      if (error) throw error;

      setSavedTools(prev => prev.filter(tool => tool.id !== toolId));
    } catch (error) {
      console.error('Error deleting saved tool:', error);
    }
  };

  const getFullSolution = (tool: SavedTool) => {
    const issue = ISSUE_SOLUTIONS.find(i => i.key === tool.issue_key);
    if (!issue) return null;
    return issue.solutions[tool.solution_index];
  };

  const getIssueEmoji = (issueKey: string) => {
    const issue = ISSUE_SOLUTIONS.find(i => i.key === issueKey);
    return issue?.emoji || '📌';
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'immediate_action':
        return 'Right now';
      case 'emotional_tool':
        return 'Emotional tool';
      case 'practical_step':
        return 'Practical step';
      case 'external_resource':
        return 'External resource';
      default:
        return 'Support';
    }
  };

  const getTypeBg = (type: string) => {
    switch (type) {
      case 'immediate_action':
        return 'bg-amber-50 border-amber-200';
      case 'emotional_tool':
        return 'bg-rose-50 border-rose-200';
      case 'practical_step':
        return 'bg-teal-50 border-teal-200';
      case 'external_resource':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-rose-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Bookmark className="w-8 h-8 text-teal-600" />
            <h1 className="text-4xl font-bold text-gray-900">Saved Tools</h1>
          </div>
          <p className="text-gray-600">Quick access to your favorite wellness tools</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your saved tools...</p>
          </div>
        ) : savedTools.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm">
            <Bookmark className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No saved tools yet</h2>
            <p className="text-gray-600 mb-6">
              Browse the Solutions page and save helpful tools for quick access
            </p>
            <button
              onClick={onBack}
              className="px-6 py-3 bg-teal-500 text-white rounded-full font-semibold hover:bg-teal-600 transition-all"
            >
              Explore Solutions
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {savedTools.map((tool) => {
              const solution = getFullSolution(tool);
              if (!solution) return null;

              return (
                <div
                  key={tool.id}
                  className={`rounded-2xl border-2 p-5 ${getTypeBg(tool.solution_type)} transition-all hover:shadow-md`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{getIssueEmoji(tool.issue_key)}</span>
                        <span className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                          {getTypeLabel(tool.solution_type)}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {tool.solution_title}
                      </h3>
                      <p className="text-gray-700 leading-relaxed mb-3">
                        {solution.description}
                      </p>

                      {solution.linkLabel && solution.linkUrl && (
                        <a
                          href={solution.linkUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 rounded-full text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all"
                        >
                          {solution.linkLabel}
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>

                    <button
                      onClick={() => handleDelete(tool.id)}
                      className="flex-shrink-0 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                      title="Remove from saved tools"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
