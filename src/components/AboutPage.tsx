import React from "react";

export default function AboutPage({ onNavigate }: { onNavigate: (page: string) => void }) {
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
        About LifeZinc
      </h1>

      <h2>Who We Are</h2>
      <p>
        LifeZinc is an emotional-wellness companion designed to help people slow
        down, reflect, and heal. Our mission is simple: to make mental wellness
        accessible, gentle, and supportive — for everyone.
      </p>

      <h2>What We Do</h2>
      <p>LifeZinc provides:</p>
      <ul>
        <li>Guided emotional journaling</li>
        <li>AI-powered reflections</li>
        <li>Faith-friendly options</li>
        <li>Personalized emotional check-ins</li>
        <li>Therapist search pathways</li>
        <li>Support for teens, adults, and families</li>
        <li>A gentle, stigma-free place to process emotions</li>
      </ul>

      <h2>Why LifeZinc Exists</h2>
      <p>
        Too many people carry emotional weight alone — stress, school pressure,
        family challenges, heartbreak, anxiety, loneliness. LifeZinc was created
        to remind you: <strong>You don't have to do this alone.</strong> Your
        feelings matter. Your healing matters.
      </p>

      <h2>How LifeZinc Helps</h2>
      <p>LifeZinc is designed around five pillars of emotional wellness:</p>
      <ol>
        <li><strong>Release</strong> — Express what you feel</li>
        <li><strong>Recognize</strong> — Understand your emotions</li>
        <li><strong>Reframe</strong> — Shift your perspective with support</li>
        <li><strong>Reconnect</strong> — Find meaning, grounding, or faith</li>
        <li><strong>Rebuild</strong> — Take small steps toward strength</li>
      </ol>

      <h2>Our Values</h2>
      <ul>
        <li><strong>Compassion first</strong> — every user deserves gentleness</li>
        <li><strong>Privacy always</strong> — your feelings stay yours</li>
        <li><strong>No judgment</strong> — this is your safe space</li>
        <li>
          <strong>Faith-inclusive</strong> — spiritual support is optional, never
          forced
        </li>
        <li><strong>Accessibility</strong> — emotional help should be for everyone</li>
      </ul>

      <h2>Our Promise</h2>
      <p>
        LifeZinc will always strive to be simple, safe, supportive, and
        human-centered. Your mind matters. Your heart matters. LifeZinc exists to
        help you breathe easier — one reflection at a time.
      </p>

      <h2>Contact Us</h2>
      <p>Email: <strong>support@lifezinc.com</strong></p>

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
