import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { ISSUE_SOLUTIONS, IssueKey } from '../data/issueSolutions';
import { IssueSolutionsPanel } from './IssueSolutionsPanel';
import { DemographicsModal } from './DemographicsModal';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface IssuesGridPageProps {
  onBack?: () => void;
}

export function IssuesGridPage({ onBack }: IssuesGridPageProps) {
  const { user } = useAuth();
  const [selectedIssue, setSelectedIssue] = useState<IssueKey | null>(null);
  const [showDemographics, setShowDemographics] = useState(false);
  const [demographicsCompleted, setDemographicsCompleted] = useState(false);
  const [pendingIssue, setPendingIssue] = useState<IssueKey | null>(null);

  useEffect(() => {
    checkDemographics();
  }, [user]);

  const checkDemographics = async () => {
    if (!user?.id) {
      const localCompleted = localStorage.getItem('lifezinc_demographics_completed');
      setDemographicsCompleted(localCompleted === 'true');
      return;
    }

    const { data } = await supabase
      .from('user_demographics')
      .select('completed_at')
      .eq('user_id', user.id)
      .maybeSingle();

    setDemographicsCompleted(!!data?.completed_at);
  };

  const handleIssueClick = (issueKey: IssueKey) => {
    if (!demographicsCompleted) {
      setPendingIssue(issueKey);
      setShowDemographics(true);
    } else {
      setSelectedIssue(issueKey);
    }
  };

  const handleDemographicsComplete = () => {
    setDemographicsCompleted(true);
    setShowDemographics(false);

    if (!user?.id) {
      localStorage.setItem('lifezinc_demographics_completed', 'true');
    }

    if (pendingIssue) {
      setSelectedIssue(pendingIssue);
      setPendingIssue(null);
    }
  };

  const handleDemographicsSkip = () => {
    setShowDemographics(false);
    if (pendingIssue) {
      setSelectedIssue(pendingIssue);
      setPendingIssue(null);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 pb-20">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </button>
          )}

          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              What's on your mind?
            </h1>
            <p className="text-lg text-gray-600">
              Tap any topic to find helpful solutions and support
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {ISSUE_SOLUTIONS.map((issue) => (
              <button
                key={issue.key}
                onClick={() => handleIssueClick(issue.key)}
                className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-gray-100 hover:border-teal-300"
              >
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="text-5xl transition-transform group-hover:scale-110">
                    {issue.emoji}
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 leading-tight">
                    {issue.label}
                  </h3>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-teal-400/0 to-blue-400/0 group-hover:from-teal-400/5 group-hover:to-blue-400/5 rounded-2xl transition-all" />
              </button>
            ))}
          </div>

          <div className="mt-12 bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-100">
            <div className="text-center">
              <p className="text-gray-700 leading-relaxed">
                Each topic includes immediate actions, emotional tools, practical steps, and external resources to support you.
              </p>
              <p className="text-sm text-gray-500 mt-3">
                💛 You don't have to face this alone
              </p>
            </div>
          </div>
        </div>
      </div>

      {selectedIssue && (
        <IssueSolutionsPanel
          selectedIssue={selectedIssue}
          onClose={() => setSelectedIssue(null)}
        />
      )}

      {showDemographics && (
        <DemographicsModal
          onComplete={handleDemographicsComplete}
          onClose={handleDemographicsSkip}
        />
      )}
    </>
  );
}
