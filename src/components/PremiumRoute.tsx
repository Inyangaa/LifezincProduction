import { ReactNode, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePremiumStatus } from '../hooks/usePremiumStatus';

interface PremiumRouteProps {
  children: ReactNode;
}

export function PremiumRoute({ children }: PremiumRouteProps) {
  const { user } = useAuth();
  const { isPremium, loading } = usePremiumStatus(user?.id);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !isPremium) {
      const fromRoute = location.pathname;
      console.log('[PremiumRoute] Non-premium user accessing premium route:', fromRoute);
      navigate(`/upgrade?from=${encodeURIComponent(fromRoute)}`, { replace: true });
    }
  }, [isPremium, loading, location.pathname, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Checking premium access...</p>
        </div>
      </div>
    );
  }

  if (!isPremium) {
    return null;
  }

  return <>{children}</>;
}
