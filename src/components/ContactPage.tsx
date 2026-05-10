import React from "react";

export default function ContactPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "40px 20px",
        fontFamily: "system-ui, sans-serif",
        lineHeight: 1.7,
        color: "#123",
      }}
    >
      <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: 20 }}>
        Contact Us
      </h1>

      <h2>We're Here for You</h2>
      <p>
        Whether you have questions, feedback, or need support, we're glad to
        hear from you. LifeZinc is built to support your emotional wellness —
        and that includes supporting you while using the app.
      </p>

      <h2>General Support</h2>
      <p>
        For help with journaling, accounts, faith-friendly mode, or any app
        features:<br />
        <strong>support@lifezinc.com</strong>
      </p>

      <h2>Business & Partnership Inquiries</h2>
      <p>
        For collaborations, integrations, or partnership opportunities:<br />
        <strong>partners@lifezinc.com</strong>
      </p>

      <h2>Suggestions & Feedback</h2>
      <p>
        We love hearing from you. Share ideas or request new features anytime:<br />
        <strong>feedback@lifezinc.com</strong>
      </p>

      <h2>Crisis or Emergency</h2>
      <p>
        LifeZinc cannot respond to emergency requests. If you feel unsafe or are
        in crisis, please contact your local emergency number or crisis hotline
        immediately (e.g., 988 in the U.S.).
      </p>

      <h2>Therapist Support</h2>
      <p>
        If you are looking for therapy or professional help, LifeZinc offers a
        therapist-finder inside the app. You may also reach out to your local
        mental-health services for additional guidance.
      </p>

      <h2>Thank You</h2>
      <p>
        Thank you for being part of the LifeZinc community. Your healing matters,
        and we're honored to support your journey.
      </p>

      <button
        onClick={() => onNavigate("home")}
        style={{
          marginTop: 30,
          padding: "12px 24px",
          borderRadius: 999,
          background: "#1AB0A8",
          color: "white",
          border: "none",
          cursor: "pointer",
          fontSize: 16,
          fontWeight: 600,
        }}
      >
        Back to Home
      </button>
    </div>
  );
}
