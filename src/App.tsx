import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation, useParams, useSearchParams } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { SubscriptionProvider, useSubscription } from './contexts/SubscriptionContext';
import { AuthPage } from './components/AuthPage';
import { ForgotPasswordPage } from './components/ForgotPasswordPage';
import { HomePage } from './components/HomePage';
import { JournalPage } from './components/JournalPage';
import { CalendarPage } from './components/CalendarPage';
import { InsightsPage } from './components/InsightsPage';
import { FavoritesPage } from './components/FavoritesPage';
import { ToolsPage } from './components/ToolsPage';
import { SettingsPage } from './components/SettingsPage';
import { CommunityPage } from './components/CommunityPage';
import { ProfilePage } from './components/ProfilePage';
import { HistoryPage } from './components/HistoryPage';
import { ChallengesPage } from './components/ChallengesPage';
import PricingPage from './components/PricingPage';
import { ResourcesPage } from './components/ResourcesPage';
import { ChaptersPage } from './components/ChaptersPage';
import { CaregiverPage } from './components/CaregiverPage';
import { TherapistSupportPage } from './components/TherapistSupportPage';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { GoalsPage } from './components/GoalsPage';
import { SpiritualSupportPage } from './components/SpiritualSupportPage';
import { FaithPage } from './components/FaithPage';
import PrivacyPage from './components/PrivacyPage';
import TermsPage from './components/TermsPage';
import DataDeletionPage from './components/DataDeletionPage';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import FAQPage from './components/FAQPage';
import CrisisDisclaimerPage from './components/CrisisDisclaimerPage';
import MissionVisionPage from './components/MissionVisionPage';
import ForTeensPage from './components/ForTeensPage';
import ForSchoolCounselorsPage from './components/ForSchoolCounselorsPage';
import OnboardingPage from './components/OnboardingPage';
import { InstallAppButton } from './components/InstallAppButton';
import MainLayout from './components/MainLayout';
import { IssuesGridPage } from './components/IssuesGridPage';
import { SavedToolsPage } from './components/SavedToolsPage';
import { SuccessPage } from './components/SuccessPage';
import UpgradePage from './components/UpgradePage';
import { UpgradeSuccessPage } from './components/UpgradeSuccessPage';
import { UpgradePromptModal } from './components/UpgradePromptModal';
import { EmailVerificationPage } from './components/EmailVerificationPage';
import { EmailVerificationPendingPage } from './components/EmailVerificationPendingPage';
import { EmailVerificationSentPage } from './components/EmailVerificationSentPage';
import { VerifyEmailPage } from './components/VerifyEmailPage';
import { ResetPasswordPage } from './components/ResetPasswordPage';
import { SignedOutPage } from './components/SignedOutPage';
import { TherapistSetupPage } from './components/TherapistSetupPage';
import { ReturningUserFeedbackModal } from './components/ReturningUserFeedbackModal';
import { ProfileSetupPage } from './components/ProfileSetupPage';
import { ProfileEditPage } from './components/ProfileEditPage';
import { DebugAuthPage } from './components/DebugAuthPage';
import { UnifiedLoginPage } from './components/UnifiedLoginPage';
import { UnifiedSignUpPage } from './components/UnifiedSignUpPage';
import { EmotionSelectionPage } from './components/EmotionSelectionPage';
import { CustomIssueEntryPage } from './components/CustomIssueEntryPage';
import { CustomSuggestionsPage } from './components/CustomSuggestionsPage';
import { ViolenceInterventionFlow } from './components/ViolenceInterventionFlow';
import { AdvancedEmotionFlow } from './components/AdvancedEmotionFlow';
import { ConsentSafetyGate } from './components/ConsentSafetyGate';
import { AuthCallbackPage } from './components/AuthCallbackPage';
import { AdminLaunchCheckPage } from './components/AdminLaunchCheckPage';
import { PremiumRoute } from './components/PremiumRoute';
import ConnectPage from './components/ConnectPage';
import { shouldShowFeedbackModal, markSessionStart } from './utils/feedbackSessionManager';
import { supabase } from './lib/supabase';
import { SuggestionCard } from './utils/customSuggestionEngine';

function AppContent() {
  const { user, loading, needsEmailVerification, unverifiedEmail } = useAuth();
  const { isPro, entryCount, trialLimit, hasReachedLimit } = useSubscription();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [hasInitialized, setHasInitialized] = useState(false);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [customIssueTopic, setCustomIssueTopic] = useState<string>('');
  const [customSuggestions, setCustomSuggestions] = useState<SuggestionCard[]>([]);
  const [safetyFlowId, setSafetyFlowId] = useState<string | null>(null);
  const [showConsentGate, setShowConsentGate] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(registration => {
          registration.unregister();
        });
      });
    }
  }, []);

  // DEV MODE: Email verification disabled
  useEffect(() => {
    if (!loading && needsEmailVerification) {
      console.log('[App] DEV MODE: Email verification check disabled');
    }
  }, [loading, needsEmailVerification, unverifiedEmail]);

  useEffect(() => {
    if (!loading && !hasInitialized) {
      const sessionId = searchParams.get('session_id');
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const type = hashParams.get('type');
      const accessToken = hashParams.get('access_token');
      const error = hashParams.get('error');

      console.log('[App] Initialization - User:', user?.id, 'Type:', type, 'SessionId:', sessionId);
      console.log('[App] Hash params:', { type, hasAccessToken: !!accessToken, error });
      console.log('[App] Setting initial page...');

      const verifyToken = searchParams.get('token');
      const pageParam = searchParams.get('page');
      const pathMatch = window.location.pathname.match(/^\/admin\/launch-check$/);

      // Handle admin routes
      if (pathMatch) {
        console.log('[App] → admin-launch-check (admin route)');
        navigate('/admin/launch-check', { replace: true });
      }
      // Handle auth callbacks (OAuth, email verification, password reset)
      else if (type || accessToken || error) {
        console.log('[App] → auth-callback (detected auth callback)');
        navigate('/auth/callback', { replace: true });
      } else if (sessionId) {
        console.log('[App] → success (payment success)');
        navigate('/success', { replace: true });
      } else if (pageParam === 'verify-email' && verifyToken) {
        console.log('[App] → verify-email (custom token verification)');
        navigate(`/verify-email?token=${verifyToken}`, { replace: true });
      } else if (pageParam === 'email-verification-sent') {
        console.log('[App] → email-verification-sent');
        navigate('/email-verification-sent', { replace: true });
      } else if (location.pathname === '/' || location.pathname === '') {
        console.log('[App] → stay on root (unified auth landing)');
        // Root path shows UnifiedLoginPage - no redirect needed
      }
      setHasInitialized(true);
      console.log('[App] Initialization complete');
    }
  }, [loading, hasInitialized, user, navigate, searchParams, location.pathname]);

  const checkUserOnboarding = async () => {
    if (!user?.id) return;

    console.log('[App] Checking user onboarding status...');

    // STEP 1: Check if profile exists
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('id, user_type, therapist_profile_completed')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!profile) {
      console.log('[App] → Profile not found, redirecting to profile-setup');
      navigate('/profile-setup');
      return;
    }

    // STEP 2: Check if therapist needs to complete professional profile
    if (profile.user_type === 'therapist' && !profile.therapist_profile_completed) {
      console.log('[App] → Therapist profile incomplete, redirecting to therapist-setup');
      navigate('/therapist-setup');
      return;
    }

    // STEP 3: Profile exists, go to journal
    console.log('[App] → Onboarding complete, going to journal');
    navigate('/journal');
  };

  useEffect(() => {
    const checkConsentStatus = async () => {
      if (user?.id && hasInitialized && !loading && !consentChecked) {
        const { data: preferences } = await supabase
          .from('user_preferences')
          .select('consent_accepted')
          .eq('user_id', user.id)
          .maybeSingle();

        setConsentChecked(true);

        if (!preferences?.consent_accepted) {
          setShowConsentGate(true);
        }
      }
    };

    checkConsentStatus();
  }, [user, hasInitialized, loading, consentChecked]);

  useEffect(() => {
    const checkFeedbackModal = async () => {
      if (user?.id && hasInitialized && !loading) {
        const shouldShow = await shouldShowFeedbackModal(user.id);
        if (shouldShow) {
          setShowFeedbackModal(true);
        }
        markSessionStart();
      }
    };

    checkFeedbackModal();
  }, [user, hasInitialized, loading]);

  useEffect(() => {
    if (location.pathname === '/journal' && customIssueTopic) {
      const timer = setTimeout(() => {
        setCustomIssueTopic('');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [location.pathname, customIssueTopic]);

  useEffect(() => {
    const checkOnboardingForProtectedPages = async () => {
      if (!user || !hasInitialized || loading) return;

      const protectedPaths = ['/journal', '/calendar', '/insights', '/tools', '/favorites', '/community', '/profile', '/history', '/challenges', '/resources', '/chapters', '/caregiver', '/therapist-support', '/analytics', '/goals', '/spiritual-support', '/faith', '/saved-tools'];

      if (protectedPaths.includes(location.pathname)) {
        console.log('[App] Checking onboarding for protected page:', location.pathname);

        // STEP 1: Check if profile exists
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('id, user_type, therapist_profile_completed')
          .eq('user_id', user.id)
          .maybeSingle();

        if (!profile) {
          console.log('[App] → Profile not found, redirecting to profile-setup');
          navigate('/profile-setup');
          return;
        }

        // STEP 2: Check if therapist needs to complete professional profile
        if (profile.user_type === 'therapist' && !profile.therapist_profile_completed) {
          console.log('[App] → Therapist profile incomplete, redirecting to therapist-setup');
          navigate('/therapist-setup');
          return;
        }

        console.log('[App] → Onboarding complete, allowing access to:', location.pathname);
      }
    };

    checkOnboardingForProtectedPages();
  }, [user, location.pathname, hasInitialized, loading, navigate]);

  // Redirect profile-setup and therapist-setup to login if not authenticated
  useEffect(() => {
    if (!hasInitialized || loading) return;

    const authRequiredPaths = ['/profile-setup', '/therapist-setup'];
    if (authRequiredPaths.includes(location.pathname) && !user) {
      console.log('[App] Protected page requires auth, redirecting to login');
      navigate('/login');
    }
  }, [user, location.pathname, hasInitialized, loading, navigate]);

  // Redirect authenticated users from login/signup pages to home
  useEffect(() => {
    if (!hasInitialized || loading) return;

    const authPages = ['/login', '/signup'];
    if (authPages.includes(location.pathname) && user) {
      console.log('[App] Authenticated user on auth page, redirecting to home');
      navigate('/home');
    }
  }, [user, location.pathname, hasInitialized, loading, navigate]);

  const handleStartJournal = async () => {
    console.log('[App] handleStartJournal called, user:', user ? 'logged in' : 'not logged in');

    if (!user) {
      console.log('[App] → No user, redirecting to signup');
      navigate('/signup');
      return;
    }

    console.log('[App] → User logged in, navigating to journal (guards will handle onboarding)');

    if (hasReachedLimit) {
      setShowUpgradePrompt(true);
    } else {
      navigate('/journal');
    }
  };

  const handleViewPlans = () => {
    console.log('[App] handleViewPlans: Navigating to /upgrade from', location.pathname);
    console.log('[App] handleViewPlans: Closing upgrade prompt modal');
    setShowUpgradePrompt(false);
    const fromPath = encodeURIComponent(location.pathname);
    const upgradeUrl = `/upgrade?reason=trial-ended&from=${fromPath}`;
    console.log('[App] handleViewPlans: Navigating to', upgradeUrl);
    navigate(upgradeUrl);
    console.log('[App] handleViewPlans: Navigation command issued');
  };

  const handleContinueFree = () => {
    setShowUpgradePrompt(false);
    navigate('/journal');
  };

  const handleNavigate = (page: string) => {
    // Map old page names to new routes
    const routeMap: Record<string, string> = {
      'home': '/home',
      'auth': '/auth',
      'auth-callback': '/auth/callback',
      'signup': '/signup',
      'unified-signup': '/signup',
      'login': '/login',
      'unified-login': '/login',
      'forgot-password': '/forgot-password',
      'reset-password': '/reset-password',
      'signed-out': '/signed-out',
      'therapist-setup': '/therapist-setup',
      'journal': '/journal',
      'emotion-flow': '/emotion-flow',
      'advanced-emotion-flow': '/advanced-emotion-flow',
      'calendar': '/calendar',
      'insights': '/insights',
      'tools': '/tools',
      'favorites': '/favorites',
      'settings': '/settings',
      'community': '/community',
      'profile': '/profile',
      'profile-setup': '/profile-setup',
      'profile-edit': '/profile-edit',
      'history': '/history',
      'challenges': '/challenges',
      'pricing': '/pricing',
      'upgrade': '/upgrade',
      'resources': '/resources',
      'chapters': '/chapters',
      'caregiver': '/caregiver',
      'therapist-support': '/therapist-support',
      'analytics': '/analytics',
      'goals': '/goals',
      'spiritual-support': '/spiritual-support',
      'faith': '/faith',
      'privacy': '/privacy',
      'terms': '/terms',
      'data-deletion': '/data-deletion',
      'about': '/about',
      'contact': '/contact',
      'faq': '/faq',
      'mission-vision': '/mission-vision',
      'teens': '/teens',
      'school-counselors': '/school-counselors',
      'issues-grid': '/issues-grid',
      'saved-tools': '/saved-tools',
      'success': '/success',
      'verify-email': '/verify-email',
      'email-verification-sent': '/email-verification-sent',
      'debug-auth': '/debug-auth',
      'custom-issue-entry': '/custom-issue-entry',
      'custom-suggestions': '/custom-suggestions',
      'admin-launch-check': '/admin/launch-check',
      'crisis-disclaimer': '/crisis-disclaimer',
      'onboarding': '/onboarding',
    };

    const route = routeMap[page] || `/${page}`;
    navigate(route);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const pagesWithLayout = ['/home', '/about', '/faq', '/contact', '/mission-vision', '/privacy', '/terms', '/data-deletion', '/therapist-support', '/teens', '/school-counselors', '/pricing', '/faith', '/crisis-disclaimer'];
  const shouldUseLayout = pagesWithLayout.includes(location.pathname);

  return (
    <>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<UnifiedLoginPage onNavigate={handleNavigate} />} />
        <Route path="/signup" element={<UnifiedSignUpPage onNavigate={handleNavigate} />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage onNavigate={handleNavigate} />} />
        <Route path="/reset-password" element={<ResetPasswordPage onNavigate={handleNavigate} />} />
        <Route path="/signed-out" element={<SignedOutPage onNavigate={handleNavigate} />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage onNavigate={handleNavigate} />} />

        {/* Onboarding Routes */}
        <Route path="/onboarding" element={<OnboardingPage onFinish={() => navigate('/auth')} onSkip={() => navigate('/auth')} />} />
        <Route path="/profile-setup" element={user ? <ProfileSetupPage onComplete={() => navigate('/journal')} /> : <Navigate to="/login" />} />
        <Route path="/therapist-setup" element={user ? <TherapistSetupPage onComplete={() => navigate('/journal')} /> : <Navigate to="/login" />} />

        {/* Main App Routes */}
        <Route path="/home" element={shouldUseLayout ? <MainLayout onNavigate={handleNavigate}><HomePage onStartJournal={handleStartJournal} onNavigate={handleNavigate} /></MainLayout> : <HomePage onStartJournal={handleStartJournal} onNavigate={handleNavigate} />} />
        <Route path="/journal" element={user ? <JournalPage onBack={() => navigate('/home')} onNavigate={handleNavigate} initialCustomTopic={customIssueTopic} /> : <Navigate to="/home" />} />
        <Route path="/emotion-flow" element={user ? <EmotionSelectionPage onBack={() => navigate('/home')} /> : <Navigate to="/home" />} />
        <Route path="/advanced-emotion-flow" element={user ? <PremiumRoute><AdvancedEmotionFlow onComplete={async (data) => { console.log('[App] Advanced emotion flow completed:', data); navigate('/journal'); }} onCancel={() => navigate('/journal')} /></PremiumRoute> : <Navigate to="/home" />} />
        <Route path="/calendar" element={user ? <CalendarPage onBack={() => navigate('/home')} /> : <Navigate to="/home" />} />
        <Route path="/insights" element={user ? <PremiumRoute><InsightsPage onBack={() => navigate('/home')} /></PremiumRoute> : <Navigate to="/home" />} />
        <Route path="/favorites" element={user ? <FavoritesPage onBack={() => navigate('/home')} /> : <Navigate to="/home" />} />
        <Route path="/tools" element={user ? <ToolsPage onBack={() => navigate('/home')} /> : <Navigate to="/home" />} />
        <Route path="/settings" element={user ? <SettingsPage onBack={() => navigate('/home')} onNavigate={handleNavigate} /> : <Navigate to="/home" />} />
        <Route path="/community" element={user ? <CommunityPage onBack={() => navigate('/home')} /> : <Navigate to="/home" />} />
        <Route path="/profile" element={user ? <ProfilePage onBack={() => navigate('/home')} /> : <Navigate to="/home" />} />
        <Route path="/profile-edit" element={user ? <ProfileEditPage onBack={() => navigate('/settings')} /> : <Navigate to="/home" />} />
        <Route path="/history" element={user ? <HistoryPage onBack={() => navigate('/home')} /> : <Navigate to="/home" />} />
        <Route path="/challenges" element={user ? <ChallengesPage onBack={() => navigate('/home')} /> : <Navigate to="/home" />} />
        <Route path="/resources" element={user ? <ResourcesPage onBack={() => navigate('/home')} /> : <Navigate to="/home" />} />
        <Route path="/chapters" element={user ? <ChaptersPage onBack={() => navigate('/home')} /> : <Navigate to="/home" />} />
        <Route path="/caregiver" element={user ? <CaregiverPage onBack={() => navigate('/home')} /> : <Navigate to="/home" />} />
        <Route path="/analytics" element={user ? <PremiumRoute><AnalyticsDashboard onBack={() => navigate('/home')} /></PremiumRoute> : <Navigate to="/home" />} />
        <Route path="/goals" element={user ? <GoalsPage onBack={() => navigate('/home')} /> : <Navigate to="/home" />} />
        <Route path="/spiritual-support" element={user ? <SpiritualSupportPage onBack={() => navigate('/home')} /> : <Navigate to="/home" />} />
        <Route path="/issues-grid" element={user ? <IssuesGridPage onBack={() => navigate('/home')} /> : <Navigate to="/home" />} />
        <Route path="/saved-tools" element={user ? <SavedToolsPage onBack={() => navigate('/home')} /> : <Navigate to="/home" />} />

        {/* Custom Issue Entry Flow */}
        <Route path="/custom-issue-entry" element={user ? <CustomIssueEntryPage onBack={() => { setCustomIssueTopic(''); setCustomSuggestions([]); navigate('/journal'); }} onNext={(topic, suggestions) => { setCustomIssueTopic(topic); setCustomSuggestions(suggestions); navigate('/custom-suggestions'); }} onSafetyIntervention={(flowId) => { setSafetyFlowId(flowId); }} /> : <Navigate to="/home" />} />
        <Route path="/custom-suggestions" element={user ? <CustomSuggestionsPage customTopic={customIssueTopic} suggestions={customSuggestions} onBack={() => navigate('/custom-issue-entry')} onFinish={() => { setCustomIssueTopic(''); setCustomSuggestions([]); navigate('/journal'); }} /> : <Navigate to="/home" />} />

        {/* Public Routes with Layout */}
        <Route path="/pricing" element={<MainLayout onNavigate={handleNavigate}><PricingPage onNavigate={handleNavigate} /></MainLayout>} />
        <Route path="/upgrade" element={<UpgradePage onBack={() => navigate('/journal')} onNavigate={handleNavigate} />} />
        <Route path="/upgrade/success" element={<UpgradeSuccessPage onNavigate={handleNavigate} />} />
        <Route path="/therapist-support" element={<MainLayout onNavigate={handleNavigate}><TherapistSupportPage onNavigate={handleNavigate} /></MainLayout>} />
        <Route path="/faith" element={<MainLayout onNavigate={handleNavigate}><FaithPage onBack={() => navigate('/home')} /></MainLayout>} />
        <Route path="/privacy" element={<MainLayout onNavigate={handleNavigate}><PrivacyPage onNavigate={handleNavigate} /></MainLayout>} />
        <Route path="/terms" element={<MainLayout onNavigate={handleNavigate}><TermsPage onNavigate={handleNavigate} /></MainLayout>} />
        <Route path="/crisis-disclaimer" element={<MainLayout onNavigate={handleNavigate}><CrisisDisclaimerPage onNavigate={handleNavigate} /></MainLayout>} />
        <Route path="/data-deletion" element={<MainLayout onNavigate={handleNavigate}><DataDeletionPage onNavigate={handleNavigate} /></MainLayout>} />
        <Route path="/about" element={<MainLayout onNavigate={handleNavigate}><AboutPage onNavigate={handleNavigate} /></MainLayout>} />
        <Route path="/contact" element={<MainLayout onNavigate={handleNavigate}><ContactPage onNavigate={handleNavigate} /></MainLayout>} />
        <Route path="/faq" element={<MainLayout onNavigate={handleNavigate}><FAQPage onNavigate={handleNavigate} /></MainLayout>} />
        <Route path="/mission-vision" element={<MainLayout onNavigate={handleNavigate}><MissionVisionPage onNavigate={handleNavigate} /></MainLayout>} />
        <Route path="/teens" element={<MainLayout onNavigate={handleNavigate}><ForTeensPage onNavigate={handleNavigate} /></MainLayout>} />
        <Route path="/school-counselors" element={<MainLayout onNavigate={handleNavigate}><ForSchoolCounselorsPage onNavigate={handleNavigate} /></MainLayout>} />

        {/* Connect Link Route */}
        <Route path="/connect/:token" element={<ConnectPage />} />

        {/* Email Verification Routes */}
        <Route path="/verify-email" element={<VerifyEmailPage token={searchParams.get('token') || ''} onNavigate={handleNavigate} />} />
        <Route path="/email-verification-sent" element={<EmailVerificationSentPage email={searchParams.get('email') || unverifiedEmail || user?.email || ''} onNavigate={handleNavigate} />} />

        {/* Payment Success */}
        <Route path="/success" element={<SuccessPage onNavigate={handleNavigate} />} />

        {/* Admin Routes */}
        <Route path="/admin/launch-check" element={<AdminLaunchCheckPage />} />
        <Route path="/debug-auth" element={<DebugAuthPage />} />

        {/* Default Route */}
        <Route path="/" element={<UnifiedLoginPage onNavigate={handleNavigate} />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>

      <InstallAppButton />
      {showUpgradePrompt && (
        <UpgradePromptModal
          onViewPlans={handleViewPlans}
          onContinueFree={handleContinueFree}
          onClose={() => setShowUpgradePrompt(false)}
        />
      )}
      {showFeedbackModal && (
        <ReturningUserFeedbackModal
          onClose={() => setShowFeedbackModal(false)}
        />
      )}
      {showConsentGate && (
        <ConsentSafetyGate
          onAccept={() => setShowConsentGate(false)}
          canClose={false}
        />
      )}
      {safetyFlowId && (
        <ViolenceInterventionFlow
          flowId={safetyFlowId}
          onBack={() => {
            setSafetyFlowId(null);
            setCustomIssueTopic('');
            setCustomSuggestions([]);
            navigate('/journal');
          }}
        />
      )}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SubscriptionProvider>
          <ThemeProvider>
            <AppContent />
          </ThemeProvider>
        </SubscriptionProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
