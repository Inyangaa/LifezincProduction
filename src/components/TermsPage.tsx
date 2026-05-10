import React from "react";

export default function TermsPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const effectiveDate = "January 27, 2026";

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold">Terms of Use</h1>
        <p className="mt-2 text-sm text-gray-500">
          Effective date: {effectiveDate}
        </p>
        <p className="mt-4 text-base">
          By using LifeZinc, you agree to these Terms. If you do not agree, do not use the app.
        </p>
      </header>

      <section className="space-y-6 text-sm leading-6">
        <div>
          <h2 className="text-lg font-semibold">1) General wellness only</h2>
          <p className="mt-2">
            LifeZinc provides general wellness tools (mood tracking, journaling, coping tools). It is not a medical device,
            does not provide medical advice, and is not a substitute for professional care.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold">2) Emergency use</h2>
          <p className="mt-2">
            Do not use LifeZinc for emergencies. If you are in immediate danger, call your local emergency number.
            In the U.S., you can call or text 988 for the Suicide &amp; Crisis Lifeline.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold">3) Your responsibilities</h2>
          <ul className="mt-2 list-disc space-y-2 pl-5">
            <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
            <li>Do not misuse the app, attempt unauthorized access, or interfere with services.</li>
            <li>You agree that content you enter is your responsibility.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold">4) Content and intellectual property</h2>
          <p className="mt-2">
            The LifeZinc app, design, and code are owned by LifeZinc and/or its licensors. You receive a limited, non-exclusive
            right to use the app for personal use in accordance with these Terms.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold">5) Disclaimers and limitation of liability</h2>
          <p className="mt-2">
            The app is provided "as is" without warranties of any kind. To the maximum extent permitted by law,
            LifeZinc is not liable for any indirect or consequential damages arising from your use of the app.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold">6) Termination</h2>
          <p className="mt-2">
            We may suspend or terminate access if we reasonably believe there is misuse, security risk, or violation of these Terms.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold">7) Changes</h2>
          <p className="mt-2">
            We may update these Terms from time to time. Continued use after updates means you accept the updated Terms.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold">8) Contact</h2>
          <p className="mt-2">
            Support: <span className="font-medium">support@lifezinc.com</span>
          </p>
        </div>
      </section>

      <footer className="mt-10 flex items-center justify-between text-sm">
        <button
          onClick={() => onNavigate("privacy")}
          className="underline hover:text-gray-600 transition-colors"
        >
          Privacy Policy
        </button>
        <button
          onClick={() => onNavigate("crisis-disclaimer")}
          className="underline hover:text-gray-600 transition-colors"
        >
          Crisis Disclaimer
        </button>
      </footer>
    </main>
  );
}
