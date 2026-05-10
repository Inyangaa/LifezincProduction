import { useState } from 'react';
import { MessageSquare, Mail, Phone, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

type MessageTone = 'teen' | 'faith' | 'professional' | 'family' | 'ultra-short';

interface ReachOutFlowProps {
  onComplete?: () => void;
}

const MESSAGE_TEMPLATES = {
  sms: {
    teen: (name: string, link: string) =>
      `Hey ${name}, I'm feeling kinda alone right now and could really use someone to talk to. If you're free: ${link}`,
    faith: (name: string, link: string) =>
      `Hi ${name}, I'm feeling lonely today and could really use prayer and connection. If you have a moment: ${link} God bless you.`,
    professional: (name: string, link: string) =>
      `Hello ${name}, I'm having a difficult day and would appreciate a brief check-in if you're available. You can reach me here: ${link} Thank you.`,
    family: (name: string, link: string) =>
      `Hi ${name}, I'm feeling lonely today and could really use some family love. If you have time: ${link} Love you.`,
    'ultra-short': (name: string, link: string) =>
      `Hey ${name}, I'm feeling lonely today. Can we connect? ${link}`,
  },
  email: {
    subject: 'Quick check-in',
    teen: (name: string, link: string) =>
      `Hey ${name},\n\nI'm feeling kinda alone right now and could really use someone to talk to. If you're free, here's a quick way to reach me: ${link}\n\nThank you.`,
    faith: (name: string, link: string) =>
      `Hi ${name},\n\nI'm feeling lonely today and would appreciate prayer and connection. If you have a moment, here's a link to reach me: ${link}\n\nGod bless you.`,
    professional: (name: string, link: string) =>
      `Hello ${name},\n\nI'm having a difficult day and would appreciate a brief check-in if you're available.\n\nHere is the link: ${link}\n\nThank you.`,
    family: (name: string, link: string) =>
      `Hi ${name},\n\nI'm feeling lonely today and could really use some family love. If you have time, here's the link: ${link}\n\nLove you.`,
    'ultra-short': (name: string, link: string) =>
      `${name}, can we connect? ${link}`,
  },
};

export default function ReachOutFlow({ onComplete }: ReachOutFlowProps) {
  const [attachmentName, setAttachmentName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [tone, setTone] = useState<MessageTone>('teen');
  const [sharePhone, setSharePhone] = useState(false);
  const [shareEmail, setShareEmail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sentConfirmation, setSentConfirmation] = useState(false);

  const handleSendSMS = async () => {
    if (!attachmentName.trim()) {
      setError('Please enter a name for the person you\'re reaching out to');
      return;
    }

    if (!phone.trim()) {
      setError('Please enter a phone number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Not authenticated');
      }

      const { data, error: fnError } = await supabase.functions.invoke('create-connect-link', {
        body: {
          attachmentName: attachmentName.trim(),
          shareUserPhone: sharePhone,
          shareUserEmail: shareEmail,
          appOrigin: window.location.origin,
        },
      });

      if (fnError) {
        throw fnError;
      }

      const message = MESSAGE_TEMPLATES.sms[tone](attachmentName, data.url);
      const smsUrl = `sms:${phone.trim()}?&body=${encodeURIComponent(message)}`;

      window.location.href = smsUrl;
      setSentConfirmation(true);
    } catch (err: any) {
      console.error('Error creating connect link:', err);
      setError(err.message || 'Failed to create connect link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async () => {
    if (!attachmentName.trim()) {
      setError('Please enter a name for the person you\'re reaching out to');
      return;
    }

    if (!email.trim()) {
      setError('Please enter an email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Not authenticated');
      }

      const { data, error: fnError } = await supabase.functions.invoke('create-connect-link', {
        body: {
          attachmentName: attachmentName.trim(),
          shareUserPhone: sharePhone,
          shareUserEmail: shareEmail,
          appOrigin: window.location.origin,
        },
      });

      if (fnError) {
        throw fnError;
      }

      const body = MESSAGE_TEMPLATES.email[tone](attachmentName, data.url);
      const subject = MESSAGE_TEMPLATES.email.subject;
      const mailtoUrl = `mailto:${email.trim()}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      window.location.href = mailtoUrl;
      setSentConfirmation(true);
    } catch (err: any) {
      console.error('Error creating connect link:', err);
      setError(err.message || 'Failed to create connect link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkComplete = () => {
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Reach Out</h2>
          <p className="text-gray-600">
            Send a message to someone you trust with a secure way for them to connect back
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Who are you reaching out to? <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={attachmentName}
              onChange={(e) => setAttachmentName(e.target.value)}
              placeholder="e.g., Mom, Sarah, Dr. Smith"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Phone Number (for SMS)
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g., 555-123-4567"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g., friend@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Message Tone
            </label>
            <div className="space-y-2">
              {(['teen', 'faith', 'professional', 'family', 'ultra-short'] as MessageTone[]).map((t) => (
                <label key={t} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="tone"
                    value={t}
                    checked={tone === t}
                    onChange={(e) => setTone(e.target.value as MessageTone)}
                    className="w-4 h-4 text-blue-600"
                    disabled={loading}
                  />
                  <span className="text-gray-800 capitalize">{t.replace('-', ' ')}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Share your contact info in the connect link?
            </label>
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={sharePhone}
                  onChange={(e) => setSharePhone(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                  disabled={loading}
                />
                <span className="text-gray-700">Include my phone in the connect link</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={shareEmail}
                  onChange={(e) => setShareEmail(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                  disabled={loading}
                />
                <span className="text-gray-700">Include my email in the connect link</span>
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              These options control whether your contact info appears when they click the link
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSendSMS}
              disabled={loading || !phone.trim()}
              className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-colors"
            >
              <Phone className="w-5 h-5" />
              Send SMS
            </button>
            <button
              onClick={handleSendEmail}
              disabled={loading || !email.trim()}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-colors"
            >
              <Mail className="w-5 h-5" />
              Send Email
            </button>
          </div>

          {sentConfirmation && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3 mb-4">
                <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-blue-900 font-semibold">Message composer opened</p>
                  <p className="text-blue-800 text-sm mt-1">
                    Once you've sent the message, mark this action as complete below.
                  </p>
                </div>
              </div>
              <label className="flex items-center gap-3 p-3 bg-white border border-blue-200 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) {
                      handleMarkComplete();
                    }
                  }}
                  className="w-5 h-5 text-blue-600 rounded"
                />
                <span className="text-gray-800 font-medium">I sent the message</span>
              </label>
            </div>
          )}
        </div>

        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
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
