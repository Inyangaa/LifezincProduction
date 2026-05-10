import React from "react";

interface ForTeensPageProps {
  onNavigate: (page: string) => void;
}

export default function ForTeensPage({ onNavigate }: ForTeensPageProps) {
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
      <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: 16 }}>
        LifeZinc for Teens & Students
      </h1>

      <p style={{ marginBottom: 12 }}>
        Being a teen can feel heavy sometimes — school, family, friends,
        social media, expectations, and all the emotions that come with it.
        LifeZinc is here to give you a calm, private space to breathe and sort
        through what you&apos;re feeling.
      </p>

      <h2>What LifeZinc Can Help With</h2>
      <ul>
        <li>School and academic stress</li>
        <li>Family arguments or tension at home</li>
        <li>Friendship drama or feeling left out</li>
        <li>Social media pressure</li>
        <li>Feeling anxious, sad, angry, or overwhelmed</li>
        <li>Questions about identity, confidence, or self-worth</li>
      </ul>

      <h2>How It Works</h2>
      <p>
        LifeZinc gives you a simple way to:
      </p>
      <ul>
        <li>Write out what happened and how you feel</li>
        <li>Choose emotions and issues (like school, family, or friends)</li>
        <li>See gentle reflections to help you make sense of it</li>
        <li>Find small, realistic next steps you can take</li>
      </ul>

      <h2>Faith-Friendly (If You Want It)</h2>
      <p>
        If you choose to turn it on, Faith-Friendly Mode can share comforting
        spiritual reflections and verses that match how you&apos;re feeling.
        This is completely optional — LifeZinc works with or without it.
      </p>

      <h2>Your Privacy</h2>
      <p>
        Your entries are meant to be your safe space. You can delete what you
        write at any time. For more details, you can always check our Privacy
        Policy and Data Deletion pages.
      </p>

      <h2>LifeZinc Is Not a Replacement for Help</h2>
      <p>
        LifeZinc is a support tool, not a replacement for parents, guardians,
        trusted adults, teachers, school counselors, or therapists.
      </p>
      <p>
        If you&apos;re feeling really stuck, scared, or hopeless, please talk
        to someone you trust in real life — a parent, guardian, teacher, or
        counselor. You&apos;re not a burden. You deserve support.
      </p>

      <h2>Talking to Your School Counselor</h2>
      <p>
        If your school has a counselor, advisor, or trusted teacher, they can be an
        important part of your support team. You can:
      </p>
      <ul>
        <li>Show them how you&apos;ve been feeling in LifeZinc.</li>
        <li>Ask if there is someone at school you can talk to regularly.</li>
        <li>Let them know if school, friends, or home feels too heavy.</li>
      </ul>
      <p>
        You don&apos;t have to explain everything perfectly. Just starting the
        conversation is already a strong step.
      </p>

      <h2>If You&apos;re in Crisis</h2>
      <p>
        If you ever feel like you might hurt yourself, or you&apos;re in
        immediate danger, do not rely on this app.
      </p>
      <p>
        Call your local emergency number or a crisis hotline right away (for
        example, 988 in the United States), or reach out to a trusted adult
        near you.
      </p>

      <p style={{ marginTop: 16 }}>
        You don&apos;t have to carry everything by yourself. LifeZinc is here
        to walk with you, one small step at a time.
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
