import React from "react";

export default function MissionVisionPage({ onNavigate }: { onNavigate: (page: string) => void }) {
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
        Mission & Vision
      </h1>

      <h2>Our Mission</h2>
      <p>
        LifeZinc exists to create a calm, safe space where people can slow down,
        process emotions, and heal with clarity, compassion, and support. Our
        mission is to empower emotional wellness for everyone — gently,
        privately, and without judgment.
      </p>
      <p>
        LifeZinc combines emotional awareness, reflective journaling,
        AI-guided support, and optional faith-friendly wisdom to bring comfort
        and clarity to your day.
      </p>

      <h2>Our Vision</h2>
      <p>
        We envision a world where emotional care is accessible to all, where
        people feel heard and strengthened, and where mental-health tools are
        compassionate and stigma-free. We believe journaling can become a daily
        practice of healing and self-understanding.
      </p>
      <p>
        Our long-term vision is to become a global emotional-wellness companion
        trusted by individuals, teens, families, and communities — offering a
        gentle, helpful hand through life's highs and lows.
      </p>

      <h2>Our Commitment</h2>
      <ul>
        <li><strong>Human-centered design</strong> — keeping you at the heart of every feature</li>
        <li><strong>Emotional safety</strong> — creating a private, secure place for your thoughts</li>
        <li><strong>Inclusivity</strong> — welcoming every background, belief, and identity</li>
        <li><strong>Faith-friendly options</strong> — available, never forced</li>
        <li><strong>Real support pathways</strong> — including therapist search and safety resources</li>
        <li><strong>Continuous improvement</strong> — shaping LifeZinc with your feedback</li>
      </ul>

      <p>
        Your journey matters. Your wellness matters. LifeZinc will always exist
        to walk with you — gently and step by step.
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
