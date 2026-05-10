import React from "react";

export default function PrivacyPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const effectiveDate = "January 27, 2026";

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold">Privacy Policy</h1>
        <p className="mt-2 text-sm text-gray-500">
          Effective date: {effectiveDate}
        </p>
        <p className="mt-4 text-base">
          LifeZinc helps you track mood, journal, and use coping tools. We take privacy seriously and
          aim to collect only what we need to provide the service.
        </p>
      </header>

      <section className="space-y-6 text-sm leading-6">
        <div>
          <h2 className="text-lg font-semibold">1) What we collect</h2>
          <ul className="mt-2 list-disc space-y-2 pl-5">
            <li>
              <span className="font-medium">Account data:</span> email, authentication identifiers, and basic profile preferences.
            </li>
            <li>
              <span className="font-medium">Wellness data you provide:</span> mood selections, advanced emotional states (if enabled), journaling text, and optional signals/intensity.
            </li>
            <li>
              <span className="font-medium">Usage data (limited):</span> basic app events needed to keep the service reliable (e.g., feature usage counts, error logs). We avoid collecting journal text in analytics.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold">2) How we use your data</h2>
          <ul className="mt-2 list-disc space-y-2 pl-5">
            <li>Provide core features like journaling, mood tracking, and insights.</li>
            <li>Show coping tool recommendations based on selected emotions/states.</li>
            <li>Maintain safety features, including crisis resources when certain high-risk signals are selected.</li>
            <li>Improve app reliability and fix bugs.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold">3) How we store and protect data</h2>
          <p className="mt-2">
            We store your data in a secure database and use authentication to identify you.
            Access is restricted so each user can only access their own records. Data is transmitted over HTTPS.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold">4) Sharing</h2>
          <p className="mt-2">
            We do not sell your personal data. We only share data with service providers necessary to operate
            the app (e.g., hosting, database, email), and only to the extent needed.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold">5) Your choices</h2>
          <ul className="mt-2 list-disc space-y-2 pl-5">
            <li>You can enable/disable advanced emotional tracking in Settings.</li>
            <li>You can request export or deletion of your account data (see Contact below).</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold">6) Children's privacy</h2>
          <p className="mt-2">
            LifeZinc is intended for general wellness use. If you believe a minor has provided personal data without appropriate permission, contact us.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold">7) Contact</h2>
          <p className="mt-2">
            Questions or requests (export/deletion):{" "}
            <span className="font-medium">support@lifezinc.com</span>
          </p>
        </div>
      </section>

      <footer className="mt-10 flex items-center justify-between text-sm">
        <button
          onClick={() => onNavigate("terms")}
          className="underline hover:text-gray-600 transition-colors"
        >
          Terms of Use
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
