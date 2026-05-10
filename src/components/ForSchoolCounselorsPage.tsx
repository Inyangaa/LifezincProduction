import React from "react";

interface ForSchoolCounselorsPageProps {
  onNavigate: (page: string) => void;
}

export default function ForSchoolCounselorsPage({ onNavigate }: ForSchoolCounselorsPageProps) {
  return (
    <div
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: "40px 20px",
        fontFamily: "system-ui, sans-serif",
        lineHeight: 1.7,
        color: "#123",
      }}
    >
      <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: 16 }}>
        LifeZinc for School Counselors
      </h1>

      <p style={{ marginBottom: 12 }}>
        LifeZinc is an emotional-wellness journaling companion that helps teens
        and students put their feelings into words. It is designed to support,
        not replace, the vital work you do as a school counselor or student
        support professional.
      </p>

      <h2>How LifeZinc Can Help Your Students</h2>
      <ul>
        <li>Encourages regular emotional check-ins and self-reflection</li>
        <li>Helps students name their feelings and stressors (school, family, peers)</li>
        <li>Provides gentle, non-judgmental reflections they can bring into sessions</li>
        <li>Offers optional faith-friendly support when appropriate for the student</li>
      </ul>

      <h2>How You Might Use LifeZinc Alongside Counseling</h2>
      <ul>
        <li>Invite students to journal between sessions and reflect on patterns.</li>
        <li>Ask if they&apos;d like to share a LifeZinc entry as a starting point.</li>
        <li>Use prompts as a way to normalize talking about emotions.</li>
        <li>
          Encourage students to identify small, realistic next steps inside and
          outside of school.
        </li>
      </ul>

      <h2>What LifeZinc Is Not</h2>
      <p>
        LifeZinc is not a diagnostic tool, a crisis service, or a replacement
        for professional mental-health care. It is a supportive journaling and
        reflection tool that can complement your work by helping students
        organize their thoughts and feelings.
      </p>

      <h2>Privacy & Safety</h2>
      <p>
        Students control what they write and what they choose to share. We
        encourage them to use LifeZinc as a private reflection space, and to
        share entries with you or other trusted adults when they feel it&apos;s
        helpful.
      </p>
      <p>
        In cases of immediate risk or safety concerns, LifeZinc should never be
        relied on as an emergency resource. Standard school safety protocols
        and crisis resources remain essential.
      </p>

      <h2>Partnering with LifeZinc</h2>
      <p>
        If you are interested in using LifeZinc with your school or district,
        you can reach us at{" "}
        <strong>partners@lifezinc.com</strong> to discuss pilots, group access,
        or training materials for staff.
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
