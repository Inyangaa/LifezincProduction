import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';

export function DebugAuthPage() {
  const [results, setResults] = useState<any>({
    loading: true,
    envVars: {
      url: '',
      keyPresent: false,
    },
    healthCheck: null,
    error: null,
  });

  const runDiagnostics = async () => {
    setResults({ ...results, loading: true, error: null });

    try {
      // Check environment variables
      const url = import.meta.env.VITE_SUPABASE_URL;
      const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

      console.log('=== DEBUG AUTH PAGE DIAGNOSTICS ===');
      console.log('URL:', url);
      console.log('Key present:', !!key);
      console.log('Key (first 30):', key ? key.substring(0, 30) + '...' : 'MISSING');

      // Test Supabase connection with a simple query
      let healthCheck: any = { status: 'unknown', message: 'Not tested' };

      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          healthCheck = {
            status: 'error',
            message: error.message,
            details: error,
          };
        } else {
          healthCheck = {
            status: 'success',
            message: 'Supabase connection successful',
            hasSession: !!data.session,
          };
        }
      } catch (err) {
        healthCheck = {
          status: 'error',
          message: err instanceof Error ? err.message : 'Unknown error',
          exception: String(err),
        };
      }

      // Test signup endpoint specifically
      let signupTest: any = { status: 'unknown' };

      try {
        // Try to call signUp with invalid credentials to test connectivity
        const { error } = await supabase.auth.signUp({
          email: 'test-debug-' + Date.now() + '@lifezinc-test.com',
          password: 'TestPassword123!@#',
        });

        if (error) {
          // Any error response means the endpoint is reachable
          signupTest = {
            status: 'reachable',
            message: 'Signup endpoint is reachable (got expected error)',
            errorReceived: error.message,
          };
        } else {
          signupTest = {
            status: 'reachable',
            message: 'Signup endpoint is reachable (test account created)',
          };
        }
      } catch (err) {
        signupTest = {
          status: 'error',
          message: 'Network error - signup endpoint unreachable',
          exception: err instanceof Error ? err.message : String(err),
        };
      }

      console.log('Health check:', healthCheck);
      console.log('Signup test:', signupTest);
      console.log('=== END DEBUG DIAGNOSTICS ===');

      setResults({
        loading: false,
        envVars: {
          url,
          keyPresent: !!key,
          keyPreview: key ? key.substring(0, 30) + '...' : 'MISSING',
        },
        healthCheck,
        signupTest,
        error: null,
      });
    } catch (err) {
      console.error('Diagnostic error:', err);
      setResults({
        ...results,
        loading: false,
        error: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
      case 'reachable':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-6 h-6 text-red-600" />;
      default:
        return <AlertCircle className="w-6 h-6 text-yellow-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Auth Debug Page</h1>
              <p className="text-gray-600 mt-2">Diagnostic information for Supabase authentication</p>
            </div>
            <button
              onClick={runDiagnostics}
              disabled={results.loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${results.loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {results.loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Running diagnostics...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Environment Variables */}
              <div className="border rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Environment Variables</h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">VITE_SUPABASE_URL:</span>
                    <span className="text-sm font-mono bg-gray-100 px-3 py-1 rounded">
                      {results.envVars.url || '❌ MISSING'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">VITE_SUPABASE_ANON_KEY:</span>
                    <span className="text-sm font-mono bg-gray-100 px-3 py-1 rounded">
                      {results.envVars.keyPresent ? '✅ Present' : '❌ MISSING'}
                    </span>
                  </div>
                  {results.envVars.keyPreview && (
                    <div className="mt-2 p-3 bg-gray-50 rounded">
                      <span className="text-xs text-gray-600">Key preview:</span>
                      <div className="text-xs font-mono mt-1 text-gray-800">{results.envVars.keyPreview}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Health Check */}
              {results.healthCheck && (
                <div className="border rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    {getStatusIcon(results.healthCheck.status)}
                    Connection Health Check
                  </h2>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Status:</span>
                      <span
                        className={`font-semibold ${
                          results.healthCheck.status === 'success' ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {results.healthCheck.status.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Message:</span>
                      <p className="mt-1 text-gray-600">{results.healthCheck.message}</p>
                    </div>
                    {results.healthCheck.details && (
                      <details className="mt-2">
                        <summary className="cursor-pointer text-sm text-blue-600 hover:text-blue-800">
                          View error details
                        </summary>
                        <pre className="mt-2 p-3 bg-gray-50 rounded text-xs overflow-auto">
                          {JSON.stringify(results.healthCheck.details, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              )}

              {/* Signup Test */}
              {results.signupTest && (
                <div className="border rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    {getStatusIcon(results.signupTest.status)}
                    Signup Endpoint Test
                  </h2>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Status:</span>
                      <span
                        className={`font-semibold ${
                          results.signupTest.status === 'reachable' ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {results.signupTest.status.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Message:</span>
                      <p className="mt-1 text-gray-600">{results.signupTest.message}</p>
                    </div>
                    {results.signupTest.exception && (
                      <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded">
                        <p className="text-sm font-medium text-red-800">Exception:</p>
                        <p className="text-xs text-red-600 mt-1 font-mono">{results.signupTest.exception}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Error */}
              {results.error && (
                <div className="border border-red-300 bg-red-50 rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-red-900 mb-4 flex items-center gap-2">
                    <AlertCircle className="w-6 h-6" />
                    Diagnostic Error
                  </h2>
                  <p className="text-red-700">{results.error}</p>
                </div>
              )}

              {/* Instructions */}
              <div className="border border-blue-300 bg-blue-50 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-blue-900 mb-4">Next Steps</h2>
                <ul className="space-y-2 text-blue-800">
                  <li className="flex items-start gap-2">
                    <span className="font-bold">1.</span>
                    <span>
                      If environment variables are missing, set them in Vercel:
                      <br />
                      <code className="text-xs bg-white px-2 py-1 rounded mt-1 inline-block">
                        VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
                      </code>
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">2.</span>
                    <span>If health check fails, verify the Supabase URL and key are correct</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">3.</span>
                    <span>If signup test fails with network error, check CORS and firewall settings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">4.</span>
                    <span>Open browser DevTools Console to see detailed logs</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
