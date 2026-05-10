import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Sparkles, Award, Heart, CheckCircle, WifiOff, Send, Baby, User, BookOpen, Target } from 'lucide-react';
import { getRandomReframe } from '../utils/reframeMessages';
import { MoodSelector } from './MoodSelector';
import { VoiceInput } from './VoiceInput';
import { TagSelector } from './TagSelector';
import { SOSButton } from './SOSButton';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import { updateUserStreak, checkAndAwardAchievements } from '../utils/streakManager';
import { detectEmotion } from '../utils/emotionDetector';
import { generateCoachingResponse } from '../utils/aiCoach';
import { savePendingEntry, getPendingEntries, removePendingEntry, isOnline, generateOfflineId } from '../utils/offlineStorage';
import { generateEmotionalTransformation } from '../utils/emotionalTransformation';
import { generateEmotionalRecycle, EmotionalRecycleResult } from '../utils/emotionalRecycle';
import { UserProfile } from '../utils/profileFiltering';
import { awardRewards } from '../utils/gamification';
import { getFaithVerse, categorizeEmotion, FaithVerse } from '../utils/faithEncouragement';
import { findVerse, EmotionKey, FaithKey } from '../data/faithVerses';
import { getRandomInnerChildPrompt, generateInnerChildResponse, generateInnerChildAffirmations, generateInnerChildRenewalStep } from '../utils/innerChildMode';
import { detectDistressLevel, shouldShowTherapistRecommendation } from '../utils/distressDetector';
import { TherapistRecommendationModal } from './TherapistRecommendationModal';
import { generateTeenCoachingResponse, getTeenReframe } from '../utils/teenMode';
import { IssueSolutionsPanel } from './IssueSolutionsPanel';
import { IssueKey } from '../data/issueSolutions';
import { OnboardingIntro } from './OnboardingIntro';
import { EmotionCheckInFlow } from './EmotionCheckInFlow';
import { QuickJournalFlow } from './QuickJournalFlow';
import { updateLastCheckInTime } from '../utils/feedbackSessionManager';
import { TherapistBadge } from './TherapistBadge';
import { assessRiskFromJournal } from '../utils/riskAssessment';
import { ViolenceInterventionFlow } from './ViolenceInterventionFlow';
import { usePremiumStatus } from '../hooks/usePremiumStatus';
import { PremiumRequiredModal } from './PremiumRequiredModal';
import { saveJournalEntry, incrementFreeEntriesCounter } from '../utils/journalEntryService';

interface JournalPageProps {
  onBack: () => void;
  onNavigate?: (page: string) => void;
  initialCustomTopic?: string;
}

export function JournalPage({ onBack, onNavigate, initialCustomTopic }: JournalPageProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, userProfile: authUserProfile } = useAuth();
  const { isPro, entryCount: contextEntryCount, hasReachedLimit: contextHasReachedLimit, refreshSubscription, freeEntriesRemaining, incrementTrialCounter } = useSubscription();
  const { isPremium } = usePremiumStatus(user?.id);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [feelings, setFeelings] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [reframeMessage, setReframeMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [newAchievements, setNewAchievements] = useState<string[]>([]);
  const [offline, setOffline] = useState(!isOnline());
  const [pendingSync, setPendingSync] = useState(getPendingEntries().length);
  const [transformation, setTransformation] = useState<any>(null);
  const [emotionalRecycle, setEmotionalRecycle] = useState<EmotionalRecycleResult | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [faithEnabled, setFaithEnabled] = useState(false);
  const [faithTradition, setFaithTradition] = useState<string>('');
  const [faithVerse, setFaithVerse] = useState<FaithVerse | null>(null);
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionKey | null>(null);
  const [innerChildMode, setInnerChildMode] = useState(false);
  const [teenMode, setTeenMode] = useState(false);
  const [innerChildPrompt, setInnerChildPrompt] = useState(getRandomInnerChildPrompt());
  const [actionCompleted, setActionCompleted] = useState(false);
  const [currentEntryId, setCurrentEntryId] = useState<string | null>(null);
  const [chapters, setChapters] = useState<any[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const [coachingResponse, setCoachingResponse] = useState<{
    message: string;
    reflectionQuestion?: string;
    copingTechnique?: {
      title: string;
      description: string;
      steps: string[];
    };
  } | null>(null);
  const [showTherapistModal, setShowTherapistModal] = useState(false);
  const [distressInfo, setDistressInfo] = useState<{
    level: 'moderate' | 'high' | 'severe';
    recommendation: string;
  } | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<IssueKey | null>(null);
  const [showCheckInFlow, setShowCheckInFlow] = useState(false);
  const [showQuickJournal, setShowQuickJournal] = useState(true);
  const [checkInEmoji, setCheckInEmoji] = useState('');
  const [checkInLabel, setCheckInLabel] = useState('');
  const [checkInMood, setCheckInMood] = useState('');
  const [customTopic, setCustomTopic] = useState('');
  const [showCustomTopicInput, setShowCustomTopicInput] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showInterventionFlow, setShowInterventionFlow] = useState(false);
  const [interventionFlowId, setInterventionFlowId] = useState<string>('');

  const FREE_LIMIT = 5;
  const entryCount = contextEntryCount;
  const hasReachedLimit = contextHasReachedLimit;

  useEffect(() => {
    loadFaithPreferences();
    loadChapters();
    loadUserProfile();
  }, [user]);

  useEffect(() => {
    if (initialCustomTopic) {
      setSelectedCategory('other');
      setCustomTopic(initialCustomTopic);
      setShowCustomTopicInput(true);
    }
  }, [initialCustomTopic]);

  const loadUserProfile = async () => {
    if (!user?.id) return;

    const { data } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (data) {
      setUserProfile(data as UserProfile);
    }
  };

  const loadChapters = async () => {
    if (!user?.id) return;

    const { data } = await supabase
      .from('life_chapters')
      .select('id, title, color')
      .eq('user_id', user.id)
      .order('start_date', { ascending: false });

    setChapters(data || []);
  };

  useEffect(() => {
    const handleOnline = () => {
      setOffline(false);
      syncPendingEntries();
    };
    const handleOffline = () => setOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if (isOnline() && pendingSync > 0) {
      syncPendingEntries();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadFaithPreferences = async () => {
    if (!user?.id) return;

    const { data } = await supabase
      .from('user_preferences')
      .select('faith_support_enabled, faith_tradition, inner_child_mode, teen_mode')
      .eq('user_id', user.id)
      .maybeSingle();

    if (data) {
      setFaithEnabled(data.faith_support_enabled || false);
      setFaithTradition(data.faith_tradition || '');
      setInnerChildMode(data.inner_child_mode || false);
      setTeenMode(data.teen_mode || false);
    }
  };

  const toggleInnerChildMode = async () => {
    const newMode = !innerChildMode;
    setInnerChildMode(newMode);

    if (newMode) {
      setInnerChildPrompt(getRandomInnerChildPrompt());
    }

    if (!user?.id) return;

    const { data: existing } = await supabase
      .from('user_preferences')
      .select('user_id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (existing) {
      await supabase
        .from('user_preferences')
        .update({
          inner_child_mode: newMode,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);
    } else {
      await supabase
        .from('user_preferences')
        .insert({
          user_id: user.id,
          inner_child_mode: newMode,
        });
    }
  };

  const toggleFaithMode = async () => {
    const newMode = !faithEnabled;
    setFaithEnabled(newMode);

    if (!user?.id) return;

    const { data: existing } = await supabase
      .from('user_preferences')
      .select('user_id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (existing) {
      await supabase
        .from('user_preferences')
        .update({
          faith_support_enabled: newMode,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);
    } else {
      await supabase
        .from('user_preferences')
        .insert({
          user_id: user.id,
          faith_support_enabled: newMode,
        });
    }
  };

  const syncPendingEntries = async () => {
    const pending = getPendingEntries();
    if (pending.length === 0) return;

    for (const entry of pending) {
      // Use centralized service to enforce trial limits on offline entry sync
      const result = await saveJournalEntry(entry.user_id, {
        text_entry: entry.text_entry,
        mood: entry.mood,
        tags: entry.tags,
        initial_reframe: entry.initial_reframe,
      });

      if (result.success) {
        removePendingEntry(entry.id);
      } else if (result.errorCode === 'TRIAL_EXHAUSTED') {
        // Stop syncing if trial limit is hit
        console.log('[JournalPage] Trial limit reached during sync, stopping');
        break;
      }
    }

    setPendingSync(getPendingEntries().length);
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleVoiceTranscript = (transcript: string) => {
    setFeelings((prev) => (prev ? prev + ' ' + transcript : transcript));
  };

  const mapMoodToEmotion = (mood: string): EmotionKey => {
    const lowerMood = mood.toLowerCase();
    if (lowerMood.includes('anxious') || lowerMood.includes('nervous') || lowerMood.includes('worried')) return 'anxiety';
    if (lowerMood.includes('fear') || lowerMood.includes('scared') || lowerMood.includes('afraid')) return 'fear';
    if (lowerMood.includes('sad') || lowerMood.includes('down') || lowerMood.includes('depressed')) return 'sadness';
    if (lowerMood.includes('guilt') || lowerMood.includes('ashamed') || lowerMood.includes('embarrassed')) return 'guilt';
    if (lowerMood.includes('lonely') || lowerMood.includes('alone') || lowerMood.includes('isolated')) return 'loneliness';
    if (lowerMood.includes('angry') || lowerMood.includes('mad') || lowerMood.includes('frustrated')) return 'anger';
    if (lowerMood.includes('hopeless') || lowerMood.includes('despair') || lowerMood.includes('helpless')) return 'hopelessness';
    return 'anxiety';
  };

  useEffect(() => {
    if (feelings.trim().length > 20 && !selectedMood) {
      const detected = detectEmotion(feelings);
      if (detected) {
        setSelectedMood(detected);
      }
    }
  }, [feelings]);

  const handleRecycle = async () => {
    if (!feelings.trim()) return;

    if (hasReachedLimit && !isPro) {
      if (onNavigate) {
        onNavigate('upgrade');
      }
      return;
    }

    const riskAssessment = assessRiskFromJournal(feelings);
    if (riskAssessment.riskLevel === 2 || riskAssessment.riskLevel === 3) {
      setInterventionFlowId(riskAssessment.flowId);
      setShowInterventionFlow(true);
      return;
    }

    const reframe = innerChildMode
      ? generateInnerChildResponse(feelings, selectedMood || 'neutral')
      : teenMode
      ? getTeenReframe(selectedCategory)
      : getRandomReframe(selectedCategory);
    setReframeMessage(reframe);

    const moodsToUse = selectedMoods.length > 0 ? selectedMoods : (selectedMood ? [selectedMood] : ['neutral']);

    const recycleResult = generateEmotionalRecycle(moodsToUse, selectedCategory, userProfile);
    setEmotionalRecycle(recycleResult);

    let emotionalTransform;
    if (innerChildMode) {
      emotionalTransform = {
        steps: [
          {
            title: 'Your Younger Self Hears You',
            description: reframe,
            icon: '👂',
          },
          {
            title: 'Inner Child Affirmations',
            description: 'Gentle truths for your younger self',
            icon: '💝',
            affirmations: generateInnerChildAffirmations(selectedMood || 'neutral'),
          },
          {
            title: 'Comfort & Nurture',
            description: 'You are giving yourself what you always needed',
            icon: '🤗',
          },
          {
            title: 'Healing Action',
            description: generateInnerChildRenewalStep(selectedMood || 'neutral'),
            icon: '🌱',
          },
        ],
      };
    } else {
      const steps: any[] = [
        {
          title: '🎯 What You\'re Feeling',
          description: recycleResult.emotionalReflection,
          icon: '🎯',
        },
        {
          title: '💡 What It Means',
          description: recycleResult.emotionInterpretation,
          icon: '💡',
        }
      ];

      if (recycleResult.ageSpecificGuidance) {
        steps.push({
          title: `${recycleResult.recycledEmotion.icon} Your Personal Guidance`,
          description: recycleResult.ageSpecificGuidance + (recycleResult.topicContext ? ' — ' + recycleResult.topicContext : ''),
          icon: recycleResult.recycledEmotion.icon,
        });
      } else {
        steps.push({
          title: `${recycleResult.recycledEmotion.icon} ${recycleResult.recycledEmotion.title}`,
          description: recycleResult.recycledEmotion.description + (recycleResult.topicContext ? ' ' + recycleResult.topicContext : ''),
          icon: recycleResult.recycledEmotion.icon,
        });
      }

      if (recycleResult.grounding) {
        steps.push({
          title: '🫁 Ground Yourself',
          description: recycleResult.grounding,
          icon: '🫁',
        });
      }

      steps.push({
        title: '✨ Action Steps',
        description: 'Here are personalized suggestions for you right now',
        icon: '✨',
        suggestions: recycleResult.actionSteps,
        faithHint: recycleResult.faithHint,
      });

      emotionalTransform = { steps };
    }
    setTransformation(emotionalTransform);
    setCurrentStep(0);

    if (faithEnabled && faithTradition && (faithTradition === 'christianity' || faithTradition === 'islam')) {
      const detectedEmotion = mapMoodToEmotion(selectedMood || 'neutral');
      setSelectedEmotion(detectedEmotion);
    }

    const coaching = teenMode
      ? generateTeenCoachingResponse(
          selectedMood || 'neutral',
          feelings,
          reframe,
          selectedCategory
        )
      : generateCoachingResponse(
          selectedMood || 'neutral',
          feelings,
          reframe,
          selectedCategory
        );
    setCoachingResponse(coaching);

    setIsSaving(true);
    try {
      if (!isOnline()) {
        const finalCategory = selectedCategory === 'other' && customTopic.trim()
          ? `Other: ${customTopic}`
          : selectedCategory;

        const offlineEntry = {
          id: generateOfflineId(),
          text_entry: feelings,
          mood: selectedMood,
          category: finalCategory,
          tags: selectedTags.length > 0 ? selectedTags : null,
          initial_reframe: reframe,
          user_id: user?.id || '',
          created_at: new Date().toISOString(),
        };
        savePendingEntry(offlineEntry);
        setPendingSync(getPendingEntries().length);

        setTimeout(() => {
          setFeelings('');
          setSelectedMood(null);
          setSelectedMoods([]);
          setSelectedTags([]);
          setReframeMessage('');
          setCoachingResponse(null);
          setTransformation(null);
          setCurrentStep(0);
          setFaithVerse(null);
        }, 2000);
      } else {
        const actionText = emotionalTransform.steps?.[3]?.description || emotionalTransform.steps?.[3]?.content || '';

        const finalCategory = selectedCategory === 'other' && customTopic.trim()
          ? `Other: ${customTopic}`
          : selectedCategory;

        const result = await saveJournalEntry(user!.id, {
          text_entry: feelings,
          mood: selectedMood,
          emotions: selectedMoods.length > 0 ? selectedMoods : null,
          category: finalCategory,
          tags: selectedTags.length > 0 ? selectedTags : null,
          initial_reframe: reframe,
          is_inner_child_mode: innerChildMode,
          action_text: actionText,
          action_completed: false,
          chapter_id: selectedChapter,
        });

        if (!result.success) {
          console.error('Error saving entry:', result.error);

          if (result.errorCode === 'TRIAL_EXHAUSTED') {
            setShowPremiumModal(true);
            return;
          }

          alert(result.error || 'Failed to save entry. Please try again.');
          return;
        }

        const insertedData = result.data ? [result.data] : null;

        if (insertedData && insertedData[0]) {
          setCurrentEntryId(insertedData[0].id);
        }

        if (result.success) {
          if (!user?.id) {
            const newCount = entryCount + 1;
            localStorage.setItem('lifezinc_entry_count', newCount.toString());
          } else {
            await incrementFreeEntriesCounter(user.id);
            await incrementTrialCounter();
          }

          await refreshSubscription();

          if (user?.id) {
            await updateUserStreak(user.id);
            const achievements = await checkAndAwardAchievements(user.id);
            if (achievements.length > 0) {
              setNewAchievements(achievements);
              setTimeout(() => setNewAchievements([]), 5000);
            }

            await awardRewards(user.id, 'journal_entry');
            await updateLastCheckInTime(user.id);

            const { data: recentEntries } = await supabase
              .from('journal_entries')
              .select('id')
              .eq('user_id', user.id)
              .order('created_at', { ascending: false })
              .limit(10);

            const distressResult = detectDistressLevel(
              feelings,
              selectedMood,
              recentEntries?.length || 0
            );

            if (insertedData && insertedData[0]) {
              await supabase.from('distress_tracking').insert({
                user_id: user.id,
                journal_entry_id: insertedData[0].id,
                distress_level: distressResult.level,
                triggers: distressResult.triggers,
                recommendation_shown: distressResult.shouldShowSupport,
              });
            }

            if (distressResult.shouldShowSupport && distressResult.level !== 'low') {
              const { data: recentDistress } = await supabase
                .from('distress_tracking')
                .select('distress_level, created_at')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(10);

              const { data: lastRecommendation } = await supabase
                .from('therapist_recommendations')
                .select('shown_at')
                .eq('user_id', user.id)
                .order('shown_at', { ascending: false })
                .limit(1)
                .maybeSingle();

              const daysSinceLast = lastRecommendation
                ? Math.floor((Date.now() - new Date(lastRecommendation.shown_at).getTime()) / (1000 * 60 * 60 * 24))
                : 999;

              const recentLevels = recentDistress?.map(d => d.distress_level) || [];

              if (shouldShowTherapistRecommendation(recentLevels, daysSinceLast)) {
                setDistressInfo({
                  level: distressResult.level as 'moderate' | 'high' | 'severe',
                  recommendation: distressResult.recommendation,
                });
                setShowTherapistModal(true);

                await supabase.from('therapist_recommendations').insert({
                  user_id: user.id,
                  category: selectedMood || 'general',
                  shown_at: new Date().toISOString(),
                });
              }
            }
          }

          setTimeout(() => {
            setFeelings('');
            setSelectedMood(null);
            setSelectedMoods([]);
            setSelectedCategory(null);
            setSelectedTags([]);
            setReframeMessage('');
            setCoachingResponse(null);
            setTransformation(null);
            setCurrentStep(0);
            setFaithVerse(null);
            setActionCompleted(false);
            setCurrentEntryId(null);
          }, 2000);
        }
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-rose-50">
      <OnboardingIntro />
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-2">
            {offline && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-full text-sm border border-amber-200">
                <WifiOff className="w-4 h-4" />
                <span>Offline {pendingSync > 0 && `(${pendingSync})`}</span>
              </div>
            )}

            <button
              onClick={toggleFaithMode}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                faithEnabled
                  ? 'bg-amber-100 text-amber-700 border border-amber-300'
                  : 'bg-gray-100 text-gray-600 border border-gray-200'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Faith {faithEnabled ? 'On' : 'Off'}</span>
            </button>
          </div>
        </div>

        {(isPro || authUserProfile?.user_type === 'therapist' || !isPro) && (
          <div className="mb-4 flex items-center justify-center gap-3 flex-wrap">
            {isPro ? (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-full text-sm font-medium shadow-md">
                <Sparkles className="w-4 h-4" />
                <span>LifeZinc Plus: Unlimited entries</span>
              </div>
            ) : (
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium shadow-md ${
                freeEntriesRemaining > 2
                  ? 'bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 border border-blue-200'
                  : freeEntriesRemaining > 0
                  ? 'bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 border border-amber-300'
                  : 'bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border border-red-300'
              }`}>
                <Heart className="w-4 h-4" />
                <span>
                  {freeEntriesRemaining > 0
                    ? `${freeEntriesRemaining} free ${freeEntriesRemaining === 1 ? 'entry' : 'entries'} remaining`
                    : 'Trial limit reached'}
                </span>
                {freeEntriesRemaining === 0 && (
                  <button
                    onClick={() => onNavigate?.('upgrade')}
                    className="ml-2 px-2 py-1 bg-red-600 text-white text-xs font-semibold rounded hover:bg-red-700 transition-colors"
                  >
                    Upgrade
                  </button>
                )}
              </div>
            )}
            {authUserProfile?.user_type === 'therapist' && <TherapistBadge compact />}
          </div>
        )}

        {!transformation ? (
          <>

            <div className={`rounded-3xl shadow-xl p-8 ${
              innerChildMode
                ? 'bg-gradient-to-br from-pink-50 to-rose-50'
                : 'bg-white'
            }`}>
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {innerChildMode ? innerChildPrompt.intro : "Mental Health for Every Stage of Life — Powered by Real, Proven Tools."}
                </h1>
                <p className="text-gray-600">
                  {innerChildMode
                    ? innerChildPrompt.promptQuestion
                    : "How are you feeling? Share what's on your mind"}
                </p>
              </div>

            <div className="space-y-4">
              <button
                onClick={() => setShowQuickJournal(true)}
                className="w-full p-6 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white rounded-2xl hover:from-emerald-600 hover:to-cyan-600 transition-all shadow-xl hover:shadow-2xl transform hover:scale-[1.02] group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <Heart className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="text-xl font-bold mb-1">Quick Journal</div>
                      <div className="text-sm text-emerald-50">3 simple steps • Select emotion, write, done</div>
                    </div>
                  </div>
                  <div className="text-3xl group-hover:scale-110 transition-transform">→</div>
                </div>
              </button>

              <button
                onClick={() => {
                  if (!isPremium) {
                    if (hasReachedLimit) {
                      const fromPath = encodeURIComponent(location.pathname);
                      navigate(`/upgrade?reason=trial-ended&from=${fromPath}`);
                      return;
                    }
                    setShowPremiumModal(true);
                    return;
                  }
                  if (onNavigate) {
                    onNavigate('advanced-emotion-flow');
                  }
                }}
                className="w-full p-5 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-300 rounded-xl hover:from-blue-100 hover:to-purple-100 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🌀</span>
                  <div className="text-left flex-1">
                    <div className="font-semibold text-gray-900 flex items-center gap-2">
                      Deep Reflection (Advanced)
                      {!isPremium && <span className="px-2 py-0.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs rounded-full flex items-center gap-1">
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                        </svg>
                        PREMIUM
                      </span>}
                    </div>
                    <div className="text-sm text-gray-600">Detailed tracking with 35+ emotional states & intensity levels</div>
                  </div>
                </div>
              </button>

              {selectedMood && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    What is this about?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { emoji: '📚', label: 'School / Academics', value: 'school', issueKey: 'school' as IssueKey },
                      { emoji: '👨‍👩‍👧‍👦', label: 'Family', value: 'family', issueKey: 'family' as IssueKey },
                      { emoji: '🤝', label: 'Friends / Social', value: 'friends', issueKey: 'loneliness' as IssueKey },
                      { emoji: '🧠', label: 'Self-Esteem', value: 'self_esteem', issueKey: 'confidence' as IssueKey },
                      { emoji: '💛', label: 'Relationships', value: 'relationships', issueKey: 'relationship' as IssueKey },
                      { emoji: '💼', label: 'Work / Goals', value: 'work', issueKey: 'work' as IssueKey },
                      { emoji: '💸', label: 'Money / Stress', value: 'money', issueKey: 'money' as IssueKey },
                      { emoji: '❓', label: 'Other', value: 'other', issueKey: 'overwhelm' as IssueKey },
                    ].map((category) => (
                      <button
                        key={category.value}
                        onClick={() => {
                          setSelectedCategory(category.value);
                          setSelectedIssue(category.issueKey);
                          if (category.value === 'other') {
                            setShowCustomTopicInput(true);
                          } else {
                            setShowCustomTopicInput(false);
                            setCustomTopic('');
                          }
                        }}
                        className={`p-3 rounded-xl border-2 text-left transition-all ${
                          selectedCategory === category.value
                            ? 'border-teal-500 bg-teal-50'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <div className="text-2xl mb-1">{category.emoji}</div>
                        <div className="text-sm font-medium text-gray-700">{category.label}</div>
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      if (onNavigate) {
                        onNavigate('custom-issue-entry');
                      }
                    }}
                    className="mt-3 w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-teal-400 hover:text-teal-600 hover:bg-teal-50 transition-all font-medium"
                  >
                    ✏️ Something else – let me type it
                  </button>

                  {showCustomTopicInput && (
                    <div className="mt-6 p-6 bg-teal-50 rounded-xl border-2 border-teal-200">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Tell us briefly: what is this about?
                      </label>
                      <div className="relative mb-4">
                        <input
                          type="text"
                          value={customTopic}
                          onChange={(e) => setCustomTopic(e.target.value)}
                          placeholder="Type your topic here..."
                          className="w-full px-4 py-3 pr-12 text-base border-2 border-gray-200 rounded-xl focus:border-teal-400 focus:outline-none"
                        />
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                          <VoiceInput onTranscript={(text) => setCustomTopic(text)} />
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            setShowCustomTopicInput(false);
                            setCustomTopic('');
                          }}
                          className="flex-1 px-4 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                        >
                          Skip
                        </button>
                        <button
                          onClick={() => {
                            if (customTopic.trim()) {
                              setShowCustomTopicInput(false);
                            }
                          }}
                          disabled={!customTopic.trim()}
                          className="flex-1 px-4 py-3 bg-teal-500 text-white rounded-lg font-medium hover:bg-teal-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                          Continue
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div>
                <div className="relative">
                  <textarea
                    value={feelings}
                    onChange={(e) => setFeelings(e.target.value)}
                    placeholder={innerChildMode ? innerChildPrompt.placeholder : "I'm feeling..."}
                    className={`w-full min-h-[120px] sm:min-h-[200px] p-4 border-2 rounded-2xl focus:outline-none resize-none text-base leading-relaxed ${
                      innerChildMode
                        ? 'border-pink-200 focus:border-pink-400 bg-white/70'
                        : 'border-gray-200 focus:border-teal-400'
                    }`}
                  />
                  <div className="absolute bottom-4 right-4">
                    <VoiceInput onTranscript={handleVoiceTranscript} />
                  </div>
                </div>
              </div>

              <TagSelector
                selectedTags={selectedTags}
                onTagToggle={handleTagToggle}
              />

              {chapters.length > 0 && (
                <select
                  value={selectedChapter || ''}
                  onChange={(e) => setSelectedChapter(e.target.value || null)}
                  className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-2xl focus:border-teal-400 focus:outline-none"
                >
                  <option value="">No chapter</option>
                  {chapters.map((chapter) => (
                    <option key={chapter.id} value={chapter.id}>
                      {chapter.title}
                    </option>
                  ))}
                </select>
              )}

              <button
                onClick={handleRecycle}
                disabled={!feelings.trim() || isSaving || (!isPro && hasReachedLimit)}
                className={`w-full py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                  innerChildMode
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600'
                    : 'bg-gradient-to-r from-teal-500 to-teal-600 text-white hover:from-teal-600 hover:to-teal-700'
                }`}
              >
                {isSaving ? (
                  'Processing...'
                ) : (!isPro && hasReachedLimit) ? (
                  'Upgrade to Continue'
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit
                  </>
                )}
              </button>
            </div>
          </div>
          </>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Your Journey</h2>
                  <p className="text-sm text-gray-600">
                    {innerChildMode ? 'Healing your inner child' : 'Transform your emotions'}
                  </p>
                </div>
              </div>

              {transformation.isFallback && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    We're expanding personalized suggestions. Here are some general supportive ideas.
                  </p>
                </div>
              )}

              <div className="space-y-4">
                {transformation.steps ? transformation.steps.map((step: any, idx: number) => (
                  <div
                    key={idx}
                    className={`p-5 rounded-2xl border-2 transition-all ${
                      idx <= currentStep
                        ? 'border-teal-300 bg-teal-50'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                        idx < currentStep
                          ? 'bg-teal-500 text-white'
                          : idx === currentStep
                          ? 'bg-teal-600 text-white'
                          : 'bg-gray-300 text-gray-600'
                      }`}>
                        {idx < currentStep ? <CheckCircle className="w-6 h-6" /> : (idx + 1)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-1">{step.title}</h3>
                        <p className="text-gray-700">{step.description || step.content}</p>
                        {step.affirmations && (
                          <div className="mt-3 space-y-2">
                            {step.affirmations.map((affirmation: string, i: number) => (
                              <div key={i} className="p-3 bg-white rounded-lg border border-pink-200">
                                <p className="text-sm text-gray-700">{affirmation}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {idx === currentStep && currentStep < 3 && (
                      <button
                        onClick={async () => {
                          const newStep = currentStep + 1;
                          setCurrentStep(newStep);
                          if (newStep === 3 && user?.id) {
                            await awardRewards(user.id, 'transformation_complete');
                          }
                        }}
                        className="mt-4 w-full py-3 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition-colors font-medium"
                      >
                        Next Step
                      </button>
                    )}

                    {idx === currentStep && currentStep === 3 && step.suggestions && (
                      <div className="mt-4 space-y-3">
                        {step.suggestions.map((suggestion: any, sIdx: number) => (
                          <div key={sIdx} className="p-4 bg-white rounded-xl border-2 border-teal-200 hover:border-teal-400 transition-all">
                            <div className="flex items-start gap-3">
                              <div className="text-2xl flex-shrink-0">{
                                suggestion.type === 'breathing' ? '🫁' :
                                suggestion.type === 'grounding' ? '🌍' :
                                suggestion.type === 'reframe' ? '💭' :
                                suggestion.type === 'action' ? '✨' :
                                suggestion.type === 'reflection' ? '🪞' :
                                suggestion.type === 'gratitude' ? '🙏' : '✨'
                              }</div>
                              <div className="flex-1">
                                <h4 className="font-bold text-gray-900 mb-1">{suggestion.title}</h4>
                                <p className="text-sm text-gray-700">{suggestion.body}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                        {step.faithHint && (
                          <div className="p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl border-2 border-teal-200">
                            <div className="flex items-start gap-3">
                              <div className="text-2xl flex-shrink-0">🙏</div>
                              <div className="flex-1">
                                <h4 className="font-bold text-gray-900 mb-1">Faith Support</h4>
                                <p className="text-sm text-gray-700">{step.faithHint}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {idx === currentStep && currentStep === 3 && step.description && !step.suggestions && (
                      <div className="mt-4 p-4 bg-white rounded-2xl border-2 border-teal-300">
                        <div className="flex items-start gap-3">
                          <Target className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900 mb-2">Action Step</h4>
                            <p className="text-gray-700 mb-3">{step.description}</p>
                            <label className="flex items-center gap-3 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={actionCompleted}
                                onChange={async (e) => {
                                  const completed = e.target.checked;
                                  setActionCompleted(completed);
                                  if (currentEntryId && user?.id) {
                                    await supabase
                                      .from('journal_entries')
                                      .update({ action_completed: completed })
                                      .eq('id', currentEntryId);
                                    if (completed) {
                                      await awardRewards(user.id, 'action_completed');
                                    }
                                  }
                                }}
                                className="w-5 h-5 rounded border-2 border-gray-300 text-teal-600"
                              />
                              <span className={`font-medium ${
                                actionCompleted ? 'text-teal-700 line-through' : 'text-gray-700'
                              }`}>
                                {actionCompleted ? 'Completed!' : 'Mark as done'}
                              </span>
                            </label>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )) : Object.values(transformation).map((step: any, idx: number) => (
                  <div
                    key={idx}
                    className={`p-5 rounded-2xl border-2 transition-all ${
                      idx <= currentStep
                        ? 'border-teal-300 bg-teal-50'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                        idx < currentStep
                          ? 'bg-teal-500 text-white'
                          : idx === currentStep
                          ? 'bg-teal-600 text-white'
                          : 'bg-gray-300 text-gray-600'
                      }`}>
                        {idx < currentStep ? <CheckCircle className="w-6 h-6" /> : step.step}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-1">{step.title}</h3>
                        <p className="text-gray-700">{step.content}</p>
                      </div>
                    </div>

                    {idx === currentStep && currentStep < 3 && (
                      <button
                        onClick={async () => {
                          const newStep = currentStep + 1;
                          setCurrentStep(newStep);
                          if (newStep === 3 && user?.id) {
                            await awardRewards(user.id, 'transformation_complete');
                          }
                        }}
                        className="mt-4 w-full py-3 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition-colors font-medium"
                      >
                        Next Step
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {coachingResponse && currentStep === 3 && (
              <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-3xl shadow-lg p-8 border border-teal-200">
                <div className="flex items-center gap-3 mb-4">
                  <Heart className="w-6 h-6 text-teal-600" />
                  <h3 className="text-lg font-bold text-gray-900">Your Coach</h3>
                </div>
                <p className="text-gray-800 leading-relaxed">{coachingResponse.message}</p>
              </div>
            )}

            {faithEnabled && currentStep === 3 && (
              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl shadow-md p-6 border border-teal-200">
                <h3 className="font-semibold text-gray-900 mb-3">Faith-Friendly Mode</h3>

                {!faithTradition || faithTradition === '' ? (
                  <p className="text-sm text-gray-600">
                    Faith-Friendly Mode is off. You can turn it on in Settings → Faith Preferences.
                  </p>
                ) : (faithTradition === 'christianity' || faithTradition === 'islam') ? (
                  <div className="space-y-4">
                    {!selectedEmotion ? (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          What are you feeling?
                        </label>
                        <select
                          value={selectedEmotion || ''}
                          onChange={(e) => setSelectedEmotion(e.target.value as EmotionKey)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-base"
                        >
                          <option value="">Select an emotion...</option>
                          <option value="anxiety">Anxiety</option>
                          <option value="fear">Fear</option>
                          <option value="sadness">Sadness</option>
                          <option value="guilt">Guilt</option>
                          <option value="loneliness">Loneliness</option>
                          <option value="anger">Anger</option>
                          <option value="hopelessness">Hopelessness</option>
                        </select>
                      </div>
                    ) : (() => {
                      const verse = findVerse(faithTradition as FaithKey, selectedEmotion, selectedCategory);
                      return verse ? (
                        <div>
                          <div className="bg-white rounded-xl p-4 mb-3">
                            <p className="text-gray-800 text-sm italic mb-2">
                              "{verse.text}"
                            </p>
                            <p className="text-xs text-gray-600">
                              — {verse.reference}
                            </p>
                          </div>
                          {verse.reflection && (
                            <div className="bg-teal-50 rounded-lg p-3 mb-3">
                              <p className="text-sm text-gray-700 italic">{verse.reflection}</p>
                            </div>
                          )}
                          <p className="text-xs text-gray-600 italic">
                            This verse is offered as comfort, not as a command. Take what helps and leave the rest.
                          </p>
                          <button
                            onClick={() => setSelectedEmotion(null)}
                            className="mt-3 text-xs text-teal-600 hover:text-teal-700 underline"
                          >
                            Choose a different emotion
                          </button>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-600">No verse found for this emotion.</p>
                      );
                    })()}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">
                    Faith-Friendly Mode is set to "{faithTradition}". Bible and Qur'an verses are currently available for Christian and Muslim faiths.
                  </p>
                )}

                <div className="mt-4 pt-4 border-t border-teal-200">
                  <p className="text-xs text-gray-600 leading-relaxed">
                    <strong>Important:</strong> Faith-Friendly reflections are optional and may not fit everyone's beliefs. LifeZinc does not replace therapy, medical care, or emergency services.
                  </p>
                  <p className="text-xs text-gray-600 leading-relaxed mt-2">
                    If you are in crisis or thinking of harming yourself or others, please contact your local emergency number or a crisis hotline immediately (for example, 988 in the United States).
                  </p>
                </div>
              </div>
            )}

            {newAchievements.length > 0 && (
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-3xl shadow-lg p-8 border-2 border-purple-300">
                <div className="flex items-center gap-3">
                  <Award className="w-7 h-7 text-purple-600" />
                  <div>
                    <h3 className="font-bold text-gray-900">Achievement Unlocked!</h3>
                    {newAchievements.map((achievement) => (
                      <p key={achievement} className="text-gray-700 capitalize">
                        {achievement.replace(/_/g, ' ')}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <SOSButton />
      {showTherapistModal && distressInfo && (
        <TherapistRecommendationModal
          isOpen={showTherapistModal}
          onClose={() => setShowTherapistModal(false)}
          onNavigateToSupport={() => {
            setShowTherapistModal(false);
            onBack();
          }}
          distressLevel={distressInfo.level}
          recommendation={distressInfo.recommendation}
        />
      )}
      <IssueSolutionsPanel
        selectedIssue={selectedIssue}
        onClose={() => setSelectedIssue(null)}
      />
      {showCheckInFlow && (
        <EmotionCheckInFlow
          selectedEmoji={checkInEmoji}
          selectedMoodLabel={checkInLabel}
          onComplete={async (data) => {
            const entryText = data.voiceTranscript || data.text;

            if (entryText && user?.id) {
              try {
                const result = await saveJournalEntry(user.id, {
                  text_entry: entryText,
                  mood: checkInMood,
                  emotions: [checkInMood],
                  category: null,
                  tags: [],
                  initial_reframe: null,
                  is_inner_child_mode: false,
                  action_completed: false,
                  chapter_id: null,
                });

                if (!result.success) {
                  console.error('Error saving check-in:', result.error);

                  if (result.errorCode === 'TRIAL_EXHAUSTED') {
                    setShowPremiumModal(true);
                    setShowCheckInFlow(false);
                    if (onNavigate) {
                      onNavigate('upgrade');
                    }
                    return;
                  }

                  alert('Failed to save check-in. Please try again.');
                  return;
                }

                await incrementFreeEntriesCounter(user.id);
                await incrementTrialCounter();
                await refreshSubscription();
              } catch (error) {
                console.error('Error saving check-in:', error);
                alert('An unexpected error occurred. Please try again.');
              }
            }
          }}
          onClose={() => setShowCheckInFlow(false)}
          onChangeFeeling={() => {
            setShowCheckInFlow(false);
            setSelectedMood(null);
            setSelectedMoods([]);
          }}
          onBackToHome={() => {
            setShowCheckInFlow(false);
            if (onNavigate) {
              onNavigate('home');
            } else {
              onBack();
            }
          }}
        />
      )}
      {showQuickJournal && (
        <QuickJournalFlow
          onComplete={async (data) => {
            if (hasReachedLimit && !isPro) {
              console.log('[JournalPage] Trial limit reached, navigating to /upgrade');
              setShowQuickJournal(false);
              const fromPath = encodeURIComponent(location.pathname);
              navigate(`/upgrade?reason=trial-ended&from=${fromPath}`);
              return;
            }

            if (user?.id) {
              try {
                const result = await saveJournalEntry(user.id, {
                  text_entry: data.text,
                  mood: data.mood,
                  emotions: [data.mood],
                  category: null,
                  tags: [],
                  initial_reframe: null,
                  is_inner_child_mode: false,
                  action_completed: false,
                  chapter_id: null,
                });

                if (!result.success) {
                  console.error('Error saving quick journal:', result.error);

                  if (result.errorCode === 'TRIAL_EXHAUSTED') {
                    setShowPremiumModal(true);
                    setShowQuickJournal(false);
                    const fromPath = encodeURIComponent(location.pathname);
                    navigate(`/upgrade?reason=trial-ended&from=${fromPath}`);
                    return;
                  }

                  alert('Failed to save entry. Please try again.');
                  return;
                }

                await incrementFreeEntriesCounter(user.id);
                await incrementTrialCounter();
                await updateUserStreak(user.id);
                await updateLastCheckInTime(user.id);
                await refreshSubscription();
                setShowQuickJournal(false);
              } catch (error) {
                console.error('Error saving quick journal:', error);
                alert('An unexpected error occurred. Please try again.');
              }
            }
          }}
          onClose={() => setShowQuickJournal(false)}
          onSwitchToAdvanced={() => {
            setShowQuickJournal(false);
            if (!isPremium) {
              setShowPremiumModal(true);
              return;
            }
            onNavigate?.('advanced-emotion-flow');
          }}
        />
      )}
      {showInterventionFlow && (
        <ViolenceInterventionFlow
          flowId={interventionFlowId}
          onBack={() => setShowInterventionFlow(false)}
        />
      )}
      {showPremiumModal && (
        <PremiumRequiredModal
          onClose={() => setShowPremiumModal(false)}
          featureName="Unlimited Journal Entries"
          isTrialExhausted={true}
        />
      )}
    </div>
  );
}
