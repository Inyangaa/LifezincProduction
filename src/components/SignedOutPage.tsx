import { Logo } from './Logo';
import { CheckCircle } from 'lucide-react';

interface SignedOutPageProps {
  onNavigate: (page: string) => void;
}

export function SignedOutPage({ onNavigate }: SignedOutPageProps) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-primary-50 via-teal-50 to-cyan-50 p-4">
      <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8 text-center">
        <Logo size="md" className="mx-auto mb-6" />

        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
          You've Been Signed Out
        </h1>

        <p className="text-gray-600 mb-6 leading-relaxed">
          Thanks for taking a moment to check in with LifeZinc today.
          You can close this window or log back in whenever you're ready.
        </p>

        <button
          onClick={() => onNavigate('login')}
          className="w-full sm:w-auto inline-block px-6 py-3 rounded-lg bg-brand-primary-500 text-white font-semibold hover:bg-brand-primary-600 transition-colors shadow-md hover:shadow-lg"
        >
          Log In Again
        </button>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={() => onNavigate('home')}
            className="text-sm text-gray-600 hover:text-brand-primary-600 font-medium transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    </main>
  );
}
