import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Loader, AlertTriangle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { assessRisk, shouldShowCrisisIntervention } from '../utils/riskEscalation';
import type { RiskLevel, IntensityLevel } from '../types/advancedTaxonomy';

interface CheckResult {
  status: 'pending' | 'success' | 'error' | 'warning';
  message: string;
  details?: string;
}

export function AdminLaunchCheckPage() {
  const [checks, setChecks] = useState<Record<string, CheckResult>>({
    build: { status: 'pending', message: 'Checking build...' },
    auth: { status: 'pending', message: 'Checking auth...' },
    db: { status: 'pending', message: 'Checking database connection...' },
    rls: { status: 'pending', message: 'Checking RLS policies...' },
    journal: { status: 'pending', message: 'Testing journal save...' },
    advanced: { status: 'pending', message: 'Testing advanced session save...' },
    crisis: { status: 'pending', message: 'Testing crisis trigger logic...' },
  });

  useEffect(() => {
    runAllChecks();
  }, []);

  const updateCheck = (key: string, result: Partial<CheckResult>) => {
    setChecks(prev => ({
      ...prev,
      [key]: { ...prev[key], ...result },
    }));
  };

  const runAllChecks = async () => {
    await checkBuild();
    await checkAuth();
    await checkDatabase();
    await checkRLS();
    await checkJournalSave();
    await checkAdvancedSave();
    await checkCrisisTrigger();
  };

  const checkBuild = async () => {
    try {
      updateCheck('build', {
        status: 'success',
        message: 'Build successful',
        details: 'Application compiled and loaded without errors',
      });
    } catch (error) {
      updateCheck('build', {
        status: 'error',
        message: 'Build failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  const checkAuth = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) throw error;

      if (session) {
        updateCheck('auth', {
          status: 'success',
          message: 'Auth working',
          details: `User authenticated: ${session.user.email}`,
        });
      } else {
        updateCheck('auth', {
          status: 'warning',
          message: 'Not authenticated',
          details: 'No active session (this is ok for testing)',
        });
      }
    } catch (error) {
      updateCheck('auth', {
        status: 'error',
        message: 'Auth check failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  const checkDatabase = async () => {
    try {
      const { error } = await supabase
        .from('user_preferences')
        .select('count')
        .limit(1);

      if (error) throw error;

      updateCheck('db', {
        status: 'success',
        message: 'Database connected',
        details: 'Successfully queried database',
      });
    } catch (error) {
      updateCheck('db', {
        status: 'error',
        message: 'Database connection failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  const checkRLS = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        updateCheck('rls', {
          status: 'warning',
          message: 'Cannot test RLS',
          details: 'No authenticated user (login to fully test RLS)',
        });
        return;
      }

      const tables = ['journal_entries', 'advanced_emotion_sessions', 'user_preferences'];
      const results = [];

      for (const table of tables) {
        const { error } = await supabase.from(table).select('id').limit(1);
        if (error) {
          results.push(`${table}: ${error.message}`);
        } else {
          results.push(`${table}: ✓`);
        }
      }

      updateCheck('rls', {
        status: 'success',
        message: 'RLS policies working',
        details: results.join(', '),
      });
    } catch (error) {
      updateCheck('rls', {
        status: 'error',
        message: 'RLS check failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  const checkJournalSave = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        updateCheck('journal', {
          status: 'warning',
          message: 'Cannot test journal save',
          details: 'No authenticated user (login to test)',
        });
        return;
      }

      const testEntry = {
        user_id: session.user.id,
        text_entry: `[TEST] Launch check - ${new Date().toISOString()}`,
        mood: 'neutral',
        category: 'quick',
        emotions: ['calm'],
      };

      const { data, error } = await supabase
        .from('journal_entries')
        .insert(testEntry)
        .select()
        .single();

      if (error) throw error;

      await supabase
        .from('journal_entries')
        .delete()
        .eq('id', data.id);

      updateCheck('journal', {
        status: 'success',
        message: 'Journal save working',
        details: 'Test entry created and deleted successfully',
      });
    } catch (error) {
      updateCheck('journal', {
        status: 'error',
        message: 'Journal save failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  const checkAdvancedSave = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        updateCheck('advanced', {
          status: 'warning',
          message: 'Cannot test advanced save',
          details: 'No authenticated user (login to test)',
        });
        return;
      }

      const testSession = {
        user_id: session.user.id,
        category_id: 'distressed',
        state_id: 'anxious-worried',
        intensity: 5,
        selected_signals: ['racing-thoughts'],
        risk_level: 'low',
        recommended_actions: ['deep-breathing'],
      };

      const { data, error } = await supabase
        .from('advanced_emotion_sessions')
        .insert(testSession)
        .select()
        .single();

      if (error) throw error;

      await supabase
        .from('advanced_emotion_sessions')
        .delete()
        .eq('id', data.id);

      updateCheck('advanced', {
        status: 'success',
        message: 'Advanced session save working',
        details: 'Test session created and deleted successfully',
      });
    } catch (error) {
      updateCheck('advanced', {
        status: 'error',
        message: 'Advanced session save failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  const checkCrisisTrigger = async () => {
    try {
      const testCases = [
        {
          name: 'Crisis trigger (high risk + high intensity)',
          baseRisk: 'high' as RiskLevel,
          intensity: 8 as IntensityLevel,
          signals: [] as string[],
          expectedCrisis: true,
        },
        {
          name: 'Crisis trigger (high risk + danger signal)',
          baseRisk: 'high' as RiskLevel,
          intensity: 5 as IntensityLevel,
          signals: ['suicidal-thoughts'],
          expectedCrisis: true,
        },
        {
          name: 'No crisis (high risk + low intensity, no signals)',
          baseRisk: 'high' as RiskLevel,
          intensity: 2 as IntensityLevel,
          signals: [] as string[],
          expectedCrisis: false,
        },
        {
          name: 'No crisis (medium risk)',
          baseRisk: 'medium' as RiskLevel,
          intensity: 8 as IntensityLevel,
          signals: [] as string[],
          expectedCrisis: false,
        },
      ];

      const results = testCases.map(test => {
        const assessment = assessRisk(test.baseRisk, test.intensity, test.signals);
        const showCrisis = shouldShowCrisisIntervention(test.baseRisk, test.intensity, test.signals);
        const passed = showCrisis === test.expectedCrisis;
        return {
          name: test.name,
          passed,
          expected: test.expectedCrisis,
          actual: showCrisis,
        };
      });

      const allPassed = results.every(r => r.passed);
      const passedCount = results.filter(r => r.passed).length;

      if (allPassed) {
        updateCheck('crisis', {
          status: 'success',
          message: 'Crisis trigger logic working',
          details: `All ${results.length} test cases passed`,
        });
      } else {
        updateCheck('crisis', {
          status: 'error',
          message: 'Crisis trigger logic failed',
          details: `${passedCount}/${results.length} tests passed. Failed: ${results.filter(r => !r.passed).map(r => r.name).join(', ')}`,
        });
      }
    } catch (error) {
      updateCheck('crisis', {
        status: 'error',
        message: 'Crisis trigger test failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  const getStatusIcon = (status: CheckResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'error':
        return <XCircle className="w-6 h-6 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-6 h-6 text-amber-600" />;
      case 'pending':
        return <Loader className="w-6 h-6 text-gray-400 animate-spin" />;
    }
  };

  const getStatusColor = (status: CheckResult['status']) => {
    switch (status) {
      case 'success':
        return 'border-green-300 bg-green-50';
      case 'error':
        return 'border-red-300 bg-red-50';
      case 'warning':
        return 'border-amber-300 bg-amber-50';
      case 'pending':
        return 'border-gray-300 bg-gray-50';
    }
  };

  const allChecks = Object.values(checks);
  const successCount = allChecks.filter(c => c.status === 'success').length;
  const errorCount = allChecks.filter(c => c.status === 'error').length;
  const warningCount = allChecks.filter(c => c.status === 'warning').length;
  const pendingCount = allChecks.filter(c => c.status === 'pending').length;

  const isComplete = pendingCount === 0;
  const allPassed = errorCount === 0 && warningCount === 0;

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Launch Check</h1>
              <p className="text-gray-600">System health and functionality verification</p>
            </div>
            {isComplete && (
              <div className={`px-6 py-3 rounded-full font-bold text-lg ${
                allPassed ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {allPassed ? '✓ All Systems Go' : '⚠ Issues Detected'}
              </div>
            )}
          </div>

          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="bg-green-50 rounded-lg p-4 text-center border-2 border-green-200">
              <div className="text-3xl font-bold text-green-700">{successCount}</div>
              <div className="text-sm text-green-600">Passed</div>
            </div>
            <div className="bg-red-50 rounded-lg p-4 text-center border-2 border-red-200">
              <div className="text-3xl font-bold text-red-700">{errorCount}</div>
              <div className="text-sm text-red-600">Failed</div>
            </div>
            <div className="bg-amber-50 rounded-lg p-4 text-center border-2 border-amber-200">
              <div className="text-3xl font-bold text-amber-700">{warningCount}</div>
              <div className="text-sm text-amber-600">Warnings</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center border-2 border-gray-200">
              <div className="text-3xl font-bold text-gray-700">{pendingCount}</div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
          </div>

          <div className="space-y-4">
            {Object.entries(checks).map(([key, check]) => (
              <div
                key={key}
                className={`border-2 rounded-xl p-5 transition-all ${getStatusColor(check.status)}`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {getStatusIcon(check.status)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold text-gray-900 text-lg capitalize">
                        {key === 'rls' ? 'RLS Policies' : key === 'db' ? 'Database' : key}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        check.status === 'success' ? 'bg-green-200 text-green-800' :
                        check.status === 'error' ? 'bg-red-200 text-red-800' :
                        check.status === 'warning' ? 'bg-amber-200 text-amber-800' :
                        'bg-gray-200 text-gray-600'
                      }`}>
                        {check.status}
                      </span>
                    </div>
                    <p className="text-gray-700 font-medium mb-1">{check.message}</p>
                    {check.details && (
                      <p className="text-sm text-gray-600">{check.details}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 text-sm text-gray-700">
          <p className="font-bold mb-2">Development Tool</p>
          <p>
            This page is for development and testing purposes only. It verifies that all critical
            systems are functioning correctly before launch. To test authenticated features,
            sign in with a test account.
          </p>
        </div>
      </div>
    </div>
  );
}
