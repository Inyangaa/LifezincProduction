import { Heart, Sparkles, X } from 'lucide-react';

interface UpgradePromptModalProps {
  onViewPlans: () => void;
  onContinueFree: () => void;
  onClose: () => void;
}

export function UpgradePromptModal({ onViewPlans, onContinueFree, onClose }: UpgradePromptModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-2xl mb-4">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            You've Used Your 7 Free Entries
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            To continue journaling and using all these tools without limits, upgrade to Premium anytime.
          </p>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={() => {
              console.log('[UpgradePromptModal] View Plans & Upgrade button clicked');
              onViewPlans();
            }}
            className="w-full py-4 px-6 bg-gradient-to-r from-cyan-500 via-blue-500 to-teal-500 text-white text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            <span>View Plans & Upgrade</span>
          </button>

          <button
            type="button"
            onClick={onContinueFree}
            className="w-full py-4 px-6 bg-white border-2 border-gray-200 text-gray-700 text-lg font-semibold rounded-full hover:bg-gray-50 hover:border-gray-300 transition-all"
          >
            Continue Free for Now
          </button>
        </div>

        <p className="text-xs text-center text-gray-500 mt-6">
          No pressure — you can always upgrade later
        </p>
      </div>
    </div>
  );
}
