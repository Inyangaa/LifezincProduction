import React, { useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";

interface PricingPageProps {
  onNavigate: (page: string) => void;
}

const STRIPE_PRICES = {
  monthly: import.meta.env.VITE_STRIPE_MONTHLY_PRICE_ID || 'price_monthly_placeholder',
  yearly: import.meta.env.VITE_STRIPE_YEARLY_PRICE_ID || 'price_yearly_placeholder',
};

export default function PricingPage({ onNavigate }: PricingPageProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUseFreePlan = async () => {
    if (!user) {
      console.log('[PricingPage] User not logged in, redirecting to login');
      onNavigate('login');
      return;
    }

    setLoading('free');
    setError(null);

    try {
      console.log('[PricingPage] Setting free plan for user:', user.id);

      const { error: updateError } = await supabase
        .from('user_subscriptions')
        .upsert({
          user_id: user.id,
          tier: 'free',
          status: 'active',
          started_at: new Date().toISOString(),
          expires_at: null,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id'
        });

      if (updateError) {
        console.error('[PricingPage] Error setting free plan:', updateError);
        setError('Failed to activate free plan. Please try again.');
        setLoading(null);
        return;
      }

      console.log('[PricingPage] Free plan activated successfully');
      onNavigate('journal');
    } catch (err) {
      console.error('[PricingPage] Unexpected error:', err);
      setError('Something went wrong. Please try again.');
      setLoading(null);
    }
  };

  const handleStartCheckout = async (planType: 'monthly' | 'yearly') => {
    if (!user) {
      console.log('[PricingPage] User not logged in, redirecting to login');
      onNavigate('login');
      return;
    }

    setLoading(planType);
    setError(null);

    try {
      console.log('[PricingPage] ====== STARTING CHECKOUT ======');
      console.log('[PricingPage] Plan:', planType);
      console.log('[PricingPage] User ID:', user.id);

      // Use supabase.functions.invoke for proper auth and error handling
      const { data, error: fnError } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          plan: planType,
        },
      });

      console.log('[PricingPage] Edge function response:', { data, error: fnError });

      if (fnError) {
        console.error('[PricingPage] Checkout failed with error:', fnError);
        setError(fnError.message || 'Failed to create checkout session');
        setLoading(null);
        return;
      }

      if (data?.url) {
        console.log('[PricingPage] Redirecting to Stripe:', data.url);
        window.location.href = data.url;
      } else {
        console.error('[PricingPage] No checkout URL in response:', data);
        setError('Failed to open payment page. Please try again.');
        setLoading(null);
      }
    } catch (err) {
      console.error('[PricingPage] Unexpected error during checkout:', err);
      setError(`Error: ${err instanceof Error ? err.message : 'Something went wrong'}`);
      setLoading(null);
    }
  };

  const handleSelectPlan = async (planId: string) => {
    if (planId === 'free') {
      await handleUseFreePlan();
    } else if (planId === 'monthly' || planId === 'yearly') {
      await handleStartCheckout(planId);
    }
  };

  const cardStyle: React.CSSProperties = {
    flex: 1,
    minWidth: 240,
    background: "#ffffff",
    borderRadius: 20,
    border: "1px solid #e0f0ee",
    boxShadow: "0 10px 24px rgba(0,0,0,0.06)",
    padding: "20px 18px",
  };

  const buttonStyle: React.CSSProperties = {
    marginTop: 16,
    width: "100%",
    padding: "10px 16px",
    borderRadius: 999,
    border: "none",
    background:
      "linear-gradient(135deg, #1AB0A8 0%, #76E5D3 50%, #1AB0A8 100%)",
    color: "#ffffff",
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
    boxShadow: "0 8px 18px rgba(26,176,168,0.35)",
  };

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: "20px 4px 40px",
        fontFamily: "system-ui, sans-serif",
        color: "#123",
      }}
    >
      <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: 10 }}>
        LifeZinc Plans
      </h1>
      <p style={{ marginBottom: 6, color: "#4a6765" }}>
        Your first 7 journal entries are free. After that, keep your healing journey going
        with our Monthly or Yearly plan.
      </p>
      <p style={{ marginBottom: 24, fontSize: 13, color: "#6c8480" }}>
        All payments are handled securely by Stripe. LifeZinc never sees your card details.
      </p>

      {error && (
        <div
          style={{
            padding: 16,
            marginBottom: 20,
            background: "#fee",
            border: "1px solid #fcc",
            borderRadius: 12,
            color: "#c33",
          }}
        >
          {error}
        </div>
      )}

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 16,
          alignItems: "stretch",
        }}
      >
        <div style={cardStyle}>
          <h2 style={{ fontSize: "1.2rem", marginBottom: 4 }}>Free</h2>
          <p style={{ fontSize: 24, fontWeight: 700, marginBottom: 6 }}>
            $0 <span style={{ fontSize: 13, fontWeight: 400 }}>/ forever</span>
          </p>
          <ul style={{ paddingLeft: 18, fontSize: 14, color: "#4a6765" }}>
            <li>First 7 journal entries free</li>
            <li>Basic emotional reflections</li>
            <li>Faith-Friendly Mode (optional)</li>
          </ul>
          <button
            style={buttonStyle}
            onClick={() => handleSelectPlan("free")}
            disabled={loading !== null}
          >
            {loading === 'free' ? 'Loading...' : 'Use Free Plan'}
          </button>
        </div>

        <div style={{ ...cardStyle, borderColor: "#1AB0A8" }}>
          <h2 style={{ fontSize: "1.2rem", marginBottom: 4 }}>Monthly</h2>
          <p style={{ fontSize: 24, fontWeight: 700, marginBottom: 6 }}>
            $9 <span style={{ fontSize: 13, fontWeight: 400 }}>/ month</span>
          </p>
          <ul style={{ paddingLeft: 18, fontSize: 14, color: "#4a6765" }}>
            <li>Unlimited journaling after your first 7 entries</li>
            <li>Deeper guided prompts</li>
            <li>Save favorites &amp; reframes</li>
            <li>Priority feature updates</li>
          </ul>
          <button
            style={buttonStyle}
            onClick={() => handleSelectPlan("monthly")}
            disabled={loading !== null}
          >
            {loading === 'monthly' ? 'Loading...' : 'Get Monthly Plan'}
          </button>
        </div>

        <div style={cardStyle}>
          <h2 style={{ fontSize: "1.2rem", marginBottom: 4 }}>Yearly</h2>
          <p style={{ fontSize: 24, fontWeight: 700, marginBottom: 6 }}>
            $89{" "}
            <span style={{ fontSize: 13, fontWeight: 400 }}>/ year</span>
          </p>
          <ul style={{ paddingLeft: 18, fontSize: 14, color: "#4a6765" }}>
            <li>Everything in Monthly</li>
            <li>Best value for long-term use</li>
            <li>Ideal for families &amp; students</li>
          </ul>
          <button
            style={buttonStyle}
            onClick={() => handleSelectPlan("yearly")}
            disabled={loading !== null}
          >
            {loading === 'yearly' ? 'Loading...' : 'Get Yearly Plan'}
          </button>
        </div>
      </div>
    </div>
  );
}
