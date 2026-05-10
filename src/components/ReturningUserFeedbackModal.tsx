import { useState } from 'react';
import { X, Star, ThumbsUp, MessageCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface ReturningUserFeedbackModalProps {
  onClose: () => void;
}

type FeedbackStep = 'initial' | 'very-helpful' | 'somewhat-helpful' | 'not-helpful' | 'submitted';

export function ReturningUserFeedbackModal({ onClose }: ReturningUserFeedbackModalProps) {
  const { user } = useAuth();
  const [step, setStep] = useState<FeedbackStep>('initial');
  const [feedbackText, setFeedbackText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleFeedbackChoice = async (choice: 'very_helpful' | 'somewhat_helpful' | 'not_helpful') => {
    if (choice === 'very_helpful') {
      setStep('very-helpful');
      await saveFeedback('very_helpful', null);
    } else if (choice === 'somewhat_helpful') {
      setStep('somewhat-helpful');
      await saveFeedback('somewhat_helpful', null);
    } else {
      setStep('not-helpful');
    }
  };

  const saveFeedback = async (type: string, text: string | null) => {
    if (!user?.id) return;

    setSubmitting(true);
    try {
      await supabase.from('user_feedback').insert({
        user_id: user.id,
        feedback_type: type,
        feedback_text: text
      });

      await supabase
        .from('user_preferences')
        .update({ feedback_shown_this_session: true })
        .eq('user_id', user.id);
    } catch (error) {
      console.error('Error saving feedback:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleNotHelpfulSubmit = async () => {
    await saveFeedback('not_helpful', feedbackText || null);
    setStep('submitted');
  };

  const handleReviewClick = () => {
    window.open('https://lifezinc.com/review', '_blank');
    onClose();
  };

  const handleClose = () => {
    if (step === 'initial' && user?.id) {
      supabase
        .from('user_preferences')
        .update({ feedback_shown_this_session: true })
        .eq('user_id', user.id);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl transform animate-slideUp">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Welcome back!</h2>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {step === 'initial' && (
            <div className="space-y-4">
              <p className="text-gray-700 text-lg font-medium">
                Quick question:
              </p>
              <p className="text-gray-700 text-lg">
                Was using LifeZinc last time helpful for you?
              </p>

              <div className="space-y-3 mt-6">
                <button
                  onClick={() => handleFeedbackChoice('very_helpful')}
                  disabled={submitting}
                  className="w-full px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 text-left flex items-center gap-3"
                >
                  <ThumbsUp className="w-5 h-5" />
                  <span>Yes, it really helped</span>
                </button>

                <button
                  onClick={() => handleFeedbackChoice('somewhat_helpful')}
                  disabled={submitting}
                  className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 text-left"
                >
                  It helped a bit
                </button>

                <button
                  onClick={() => handleFeedbackChoice('not_helpful')}
                  disabled={submitting}
                  className="w-full px-6 py-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all disabled:opacity-50 text-left"
                >
                  Not really
                </button>
              </div>
            </div>
          )}

          {step === 'very-helpful' && (
            <div className="space-y-4">
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-emerald-600" />
                </div>
                <p className="text-lg text-gray-800 mb-2 font-semibold">
                  We're so glad LifeZinc supported you!
                </p>
                <p className="text-gray-600">
                  Would you mind giving us a 5-star review?
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleReviewClick}
                  className="w-full px-6 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <Star className="w-5 h-5 fill-current" />
                  <span>Leave a 5-Star Review</span>
                </button>

                <button
                  onClick={onClose}
                  className="w-full px-6 py-3 text-gray-600 font-medium rounded-xl hover:bg-gray-100 transition-all"
                >
                  Maybe later
                </button>
              </div>
            </div>
          )}

          {step === 'somewhat-helpful' && (
            <div className="space-y-4">
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ThumbsUp className="w-8 h-8 text-blue-600" />
                </div>
                <p className="text-lg text-gray-800 font-semibold">
                  Thanks! We're here for you every day.
                </p>
              </div>

              <button
                onClick={onClose}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all"
              >
                Continue
              </button>
            </div>
          )}

          {step === 'not-helpful' && (
            <div className="space-y-4">
              <p className="text-gray-700 font-medium">
                Tell us what didn't work so we can improve:
              </p>

              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Your feedback helps us make LifeZinc better..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-cyan-400 focus:outline-none resize-none"
                rows={4}
              />

              <div className="space-y-3">
                <button
                  onClick={handleNotHelpfulSubmit}
                  disabled={submitting}
                  className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Feedback'}
                </button>

                <button
                  onClick={onClose}
                  className="w-full px-6 py-3 text-gray-600 font-medium rounded-xl hover:bg-gray-100 transition-all"
                >
                  Skip
                </button>
              </div>
            </div>
          )}

          {step === 'submitted' && (
            <div className="space-y-4">
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-cyan-600" />
                </div>
                <p className="text-lg text-gray-800 font-semibold mb-2">
                  Thank you for your feedback!
                </p>
                <p className="text-gray-600">
                  We'll use your input to make LifeZinc better.
                </p>
              </div>

              <button
                onClick={onClose}
                className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all"
              >
                Continue
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
