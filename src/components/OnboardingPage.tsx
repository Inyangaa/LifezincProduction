import React, { useState } from "react";

interface OnboardingPageProps {
  onFinish: () => void;
  onSkip?: () => void;
}

export default function OnboardingPage({ onFinish, onSkip }: OnboardingPageProps) {
  const [step, setStep] = useState(1);

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      onFinish();
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSkip = () => {
    if (onSkip) onSkip();
    else onFinish();
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h1 style={{ fontSize: "2rem", marginBottom: 12 }}>
              Welcome to LifeZinc
            </h1>
            <p style={{ marginBottom: 12 }}>
              LifeZinc is a calm space to process your emotions, journal
              honestly, and receive gentle reflections — with optional
              faith-friendly support when you want it.
            </p>
            <p style={{ fontWeight: 500 }}>
              Your feelings are safe here.
            </p>
          </>
        );
      case 2:
        return (
          <>
            <h1 style={{ fontSize: "2rem", marginBottom: 12 }}>
              How LifeZinc Helps
            </h1>
            <ul style={{ paddingLeft: 20, marginBottom: 12 }}>
              <li>Journal what you&apos;re feeling in your own words.</li>
              <li>LifeZinc helps you recognize and name your emotions.</li>
              <li>Reframe heavy thoughts and choose small next steps.</li>
            </ul>
            <p>
              You can also explore Faith-Friendly Mode and therapist pathways
              when you need more than an app.
            </p>
          </>
        );
      case 3:
        return (
          <>
            <h1 style={{ fontSize: "2rem", marginBottom: 12 }}>
              Your Safety & Privacy
            </h1>
            <p style={{ marginBottom: 10 }}>
              LifeZinc is a support tool, not a crisis service or therapy. Your
              journal entries are private, and you can delete them anytime.
            </p>
            <p style={{ marginBottom: 10 }}>
              If you are ever in crisis or feel unsafe, please contact your
              local emergency number or a crisis hotline (for example, 988 in
              the United States).
            </p>
            <p>
              We&apos;re here to walk with you gently, one step at a time.
            </p>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(circle at top left, #e7fbf7 0, #ffffff 45%, #fef7f6 100%)",
        fontFamily: "system-ui, sans-serif",
        color: "#122026",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 520,
          background: "#ffffff",
          borderRadius: 26,
          boxShadow: "0 18px 40px rgba(0,0,0,0.12)",
          padding: "28px 24px 22px",
          border: "1px solid #e0f0ee",
        }}
      >
        <div
          style={{
            fontSize: 13,
            color: "#6c8480",
            marginBottom: 8,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>Step {step} of 3</span>
          <button
            onClick={handleSkip}
            style={{
              background: "none",
              border: "none",
              fontSize: 13,
              color: "#4a6765",
              textDecoration: "underline",
              cursor: "pointer",
            }}
          >
            Skip for now
          </button>
        </div>

        {renderStep()}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 24,
          }}
        >
          <button
            onClick={handleBack}
            disabled={step === 1}
            style={{
              padding: "10px 16px",
              borderRadius: 999,
              border: "1px solid #c8dad6",
              background: step === 1 ? "#f3f5f5" : "#ffffff",
              color: "#4a6765",
              fontSize: 14,
              cursor: step === 1 ? "default" : "pointer",
            }}
          >
            Back
          </button>

          <button
            onClick={handleNext}
            style={{
              padding: "10px 20px",
              borderRadius: 999,
              border: "none",
              background:
                "linear-gradient(135deg, #1AB0A8 0%, #76E5D3 50%, #1AB0A8 100%)",
              color: "#ffffff",
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 10px 24px rgba(26,176,168,0.4)",
            }}
          >
            {step === 3 ? "Get Started" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
