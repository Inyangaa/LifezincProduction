import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Phone, Mail, MessageSquare, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ConnectInfo {
  valid: boolean;
  displayName?: string;
  shareUserPhone?: boolean;
  shareUserEmail?: boolean;
  userPhone?: string;
  userEmail?: string;
}

export default function ConnectPage() {
  const { token } = useParams<{ token: string }>();
  const [connectInfo, setConnectInfo] = useState<ConnectInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchConnectInfo() {
      if (!token) {
        setConnectInfo({ valid: false });
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke('get-connect-info', {
          body: { token },
        });

        if (error) {
          console.error('Error fetching connect info:', error);
          setConnectInfo({ valid: false });
        } else {
          setConnectInfo(data);
        }
      } catch (error) {
        console.error('Error:', error);
        setConnectInfo({ valid: false });
      } finally {
        setLoading(false);
      }
    }

    fetchConnectInfo();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!connectInfo?.valid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Link Expired</h1>
          <p className="text-gray-600 mb-6">
            This connect link has expired or is no longer valid.
          </p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">
              <strong>In Crisis?</strong><br />
              If you are in immediate danger, call local emergency services.<br />
              <strong>US:</strong> Call or text <a href="tel:988" className="underline font-semibold">988</a> (Suicide & Crisis Lifeline)
            </p>
          </div>
        </div>
      </div>
    );
  }

  const hasPhone = connectInfo.shareUserPhone && connectInfo.userPhone;
  const hasEmail = connectInfo.shareUserEmail && connectInfo.userEmail;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {connectInfo.displayName} would like to connect
          </h1>
          <p className="text-gray-600">
            They're reaching out and would appreciate your support.
          </p>
        </div>

        <div className="space-y-3 mb-8">
          {hasPhone && (
            <>
              <a
                href={`tel:${connectInfo.userPhone}`}
                className="w-full flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors"
              >
                <Phone className="w-5 h-5" />
                Call
              </a>

              <a
                href={`sms:${connectInfo.userPhone}`}
                className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors"
              >
                <MessageSquare className="w-5 h-5" />
                Text
              </a>
            </>
          )}

          {hasEmail && (
            <a
              href={`mailto:${connectInfo.userEmail}`}
              className="w-full flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors"
            >
              <Mail className="w-5 h-5" />
              Email
            </a>
          )}

          {!hasPhone && !hasEmail && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
              <p className="text-yellow-800">
                Contact information was not included with this link.
              </p>
            </div>
          )}
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">
            <strong>In Crisis?</strong><br />
            If you are in immediate danger, call local emergency services.<br />
            <strong>US:</strong> Call or text <a href="tel:988" className="underline font-semibold">988</a> (Suicide & Crisis Lifeline)
          </p>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            This is a secure, one-time connect link from LifeZinc
          </p>
        </div>
      </div>
    </div>
  );
}
