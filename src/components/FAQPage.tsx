import React from "react";

export default function FAQPage({ onNavigate }: { onNavigate: (page: string) => void }) {
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
        Frequently Asked Questions
      </h1>

      <h2>1. What is LifeZinc?</h2>
      <p>
        LifeZinc is an emotional-wellness companion that helps you journal,
        reflect on your feelings, and take small steps toward healing. It offers
        gentle AI reflections, optional faith-friendly support, and pathways to
        find therapists and other resources.
      </p>

      <h2>2. Is LifeZinc a replacement for therapy or medical care?</h2>
      <p>
        No. LifeZinc is not a replacement for professional therapy, medical
        treatment, or crisis services. It is a supportive tool to help you
        understand your emotions and feel less alone. For serious mental-health
        concerns, please speak with a qualified professional.
      </p>

      <h2>3. Is LifeZinc safe for teens or students?</h2>
      <p>
        LifeZinc is designed to be gentle and supportive for teens, students,
        and adults. It is not intended for children under 13. Teens should use
        LifeZinc with guidance from a parent, guardian, or trusted adult when
        possible.
      </p>

      <h2>4. What is Faith-Friendly Mode?</h2>
      <p>
        Faith-Friendly Mode is an optional feature that offers spiritual
        reflections or verses that match how you&apos;re feeling. You can turn
        it on or off in Settings. It is never forced, and you can use LifeZinc
        without any faith-based content.
      </p>

      <h2>5. Does LifeZinc read my journal entries?</h2>
      <p>
        Your journal entries are private. We do not personally read your
        journals. Automated tools may process your text to generate supportive
        reflections inside the app, but we do not sell your content or use it
        for advertising.
      </p>

      <h2>6. How does LifeZinc protect my privacy?</h2>
      <p>
        We use industry-standard security practices to help protect your data.
        You can delete your journal entries and, where available, delete your
        account at any time. For more details, please see our Privacy Policy and
        Data Deletion pages.
      </p>

      <h2>7. How can I delete my data or account?</h2>
      <p>
        You can delete entries and favorites inside the app, and you can request
        full data or account deletion by emailing{" "}
        <strong>support@lifezinc.com</strong>. Detailed instructions are
        available on our Data Deletion page.
      </p>

      <h2>8. How do I find a therapist through LifeZinc?</h2>
      <p>
        LifeZinc offers a &quot;Find a Therapist&quot; section where you can
        enter your city, state, and ZIP code, and indicate whether you prefer
        online or in-person sessions. We may also link to external therapist
        directories and resources in your area.
      </p>

      <h2>9. What should I do in a crisis or emergency?</h2>
      <p>
        Do not rely on LifeZinc in an emergency. If you feel unsafe, are
        thinking of harming yourself or others, or are in immediate danger,
        please contact your local emergency number or a crisis hotline
        immediately (for example, 988 in the United States).
      </p>

      <h2>10. How can I contact the LifeZinc team?</h2>
      <p>
        You can reach us at:
        <br />
        <strong>support@lifezinc.com</strong> for general support,
        <br />
        <strong>partners@lifezinc.com</strong> for partnerships,
        <br />
        <strong>feedback@lifezinc.com</strong> for ideas and suggestions.
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
