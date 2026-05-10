import { useState, useEffect } from 'react';
import { X, ExternalLink, Heart, Zap, CheckSquare, LifeBuoy } from 'lucide-react';
import { ISSUE_SOLUTIONS, IssueKey, SolutionType } from '../data/issueSolutions';
import { useAuth } from '../contexts/AuthContext';
import { getUserDemographics, UserDemographics, getInterestBasedActivities, getAgeAppropriateLanguage } from '../utils/demographicsHelper';

interface IssueSolutionsPanelProps {
  selectedIssue: IssueKey | null;
  onClose: () => void;
}

export function IssueSolutionsPanel({ selectedIssue, onClose }: IssueSolutionsPanelProps) {
  const { user } = useAuth();
  const [demographics, setDemographics] = useState<UserDemographics | null>(null);
  const [personalizedActivities, setPersonalizedActivities] = useState<string[]>([]);

  useEffect(() => {
    loadDemographics();
  }, [user]);

  const loadDemographics = async () => {
    if (!user?.id) return;

    const data = await getUserDemographics(user.id);
    setDemographics(data);

    if (data) {
      const activities = getInterestBasedActivities(data.interests);
      setPersonalizedActivities(activities.slice(0, 3));
    }
  };

  if (!selectedIssue) return null;

  const issueData = ISSUE_SOLUTIONS.find((issue) => issue.key === selectedIssue);
  if (!issueData) return null;

  const languageStyle = demographics ? getAgeAppropriateLanguage(demographics.age_range) : null;

  const getSolutionIcon = (type: SolutionType) => {
    switch (type) {
      case 'immediate_action':
        return <Zap className="w-5 h-5 text-amber-600" />;
      case 'emotional_tool':
        return <Heart className="w-5 h-5 text-rose-600" />;
      case 'practical_step':
        return <CheckSquare className="w-5 h-5 text-teal-600" />;
      case 'external_resource':
        return <LifeBuoy className="w-5 h-5 text-blue-600" />;
      default:
        return <CheckSquare className="w-5 h-5 text-gray-600" />;
    }
  };

  const getSolutionBg = (type: SolutionType) => {
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

  const getSolutionLabel = (type: SolutionType) => {
    switch (type) {
      case 'immediate_action':
        return 'Do Now';
      case 'emotional_tool':
        return 'Emotional Tool';
      case 'practical_step':
        return 'Practical Step';
      case 'external_resource':
        return 'Get Support';
      default:
        return type;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
      <div className="min-h-screen px-4 py-8 flex items-center justify-center">
        <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-3xl z-10">
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>

            <div className="flex items-center gap-4">
              <div className="text-5xl">{issueData.emoji}</div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{issueData.label}</h2>
                <p className="text-gray-600 mt-1">{issueData.intro}</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {issueData.solutions.map((solution, index) => (
              <div
                key={index}
                className={`p-5 rounded-2xl border-2 ${getSolutionBg(solution.type)} transition-all hover:shadow-md`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">{getSolutionIcon(solution.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                        {getSolutionLabel(solution.type)}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{solution.title}</h3>
                    <p className="text-gray-700 leading-relaxed">{solution.description}</p>

                    {solution.linkLabel && solution.linkUrl && (
                      <a
                        href={solution.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-white border-2 border-gray-300 rounded-full text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all"
                      >
                        {solution.linkLabel}
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {personalizedActivities.length > 0 && (
              <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
                <div className="flex items-center gap-2 mb-3">
                  <Heart className="w-5 h-5 text-purple-600" />
                  <h3 className="text-lg font-bold text-gray-900">Personalized for You</h3>
                </div>
                <p className="text-gray-700 mb-3">Based on your interests, try these activities:</p>
                <ul className="space-y-2">
                  {personalizedActivities.map((activity, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-700">
                      <span className="text-purple-500 mt-1">•</span>
                      <span>{activity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="sticky bottom-0 bg-gradient-to-t from-white via-white to-transparent p-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="w-full py-4 bg-teal-500 text-white rounded-full font-semibold hover:bg-teal-600 transition-all shadow-lg"
            >
              Back to Journal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
