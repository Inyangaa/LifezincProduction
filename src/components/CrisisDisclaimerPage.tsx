import React from "react";
import { AlertTriangle, Phone } from "lucide-react";

export default function CrisisDisclaimerPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const effectiveDate = "January 27, 2026";

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <div className="bg-gradient-to-br from-red-100 to-red-200 border-2 border-red-500 rounded-xl p-6 mb-8">
        <div className="flex items-center gap-3 mb-3">
          <AlertTriangle className="w-8 h-8 text-red-600" />
          <h1 className="text-3xl font-bold text-red-900 m-0">
            Crisis & Safety Disclaimer
          </h1>
        </div>
        <p className="m-0 text-lg text-red-900">
          <strong>If you are in immediate danger or experiencing a mental health emergency, please seek help immediately.</strong>
        </p>
      </div>

      <div className="bg-blue-100 border-2 border-blue-500 rounded-xl p-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Phone className="w-6 h-6 text-blue-700" />
          <h2 className="text-2xl font-bold text-blue-900 m-0">
            24/7 Crisis Resources
          </h2>
        </div>

        <div className="grid gap-4">
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              🇺🇸 United States
            </h3>
            <ul className="m-0 pl-5 space-y-1">
              <li><strong>988 Suicide & Crisis Lifeline:</strong> Call or text <strong>988</strong></li>
              <li><strong>Crisis Text Line:</strong> Text <strong>HELLO</strong> to <strong>741741</strong></li>
              <li><strong>National Domestic Violence Hotline:</strong> <strong>1-800-799-7233</strong></li>
              <li><strong>SAMHSA National Helpline:</strong> <strong>1-800-662-4357</strong> (substance abuse)</li>
              <li><strong>Trevor Project (LGBTQ+ Youth):</strong> <strong>1-866-488-7386</strong> or text <strong>START</strong> to <strong>678678</strong></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              🇨🇦 Canada
            </h3>
            <ul className="m-0 pl-5 space-y-1">
              <li><strong>Talk Suicide Canada:</strong> <strong>1-833-456-4566</strong> (call or text)</li>
              <li><strong>Kids Help Phone:</strong> <strong>1-800-668-6868</strong> or text <strong>686868</strong></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              🇬🇧 United Kingdom
            </h3>
            <ul className="m-0 pl-5 space-y-1">
              <li><strong>Samaritans:</strong> <strong>116 123</strong> (24/7 free hotline)</li>
              <li><strong>Crisis Text Line UK:</strong> Text <strong>SHOUT</strong> to <strong>85258</strong></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              🌍 International
            </h3>
            <p className="m-0">
              Visit <a href="https://findahelpline.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-700">findahelpline.com</a> for crisis resources in your country.
            </p>
          </div>
        </div>
      </div>

      <section className="space-y-6 text-sm leading-6">
        <div>
          <h2 className="text-xl font-semibold mb-3">What LifeZinc Is (and Is Not)</h2>

          <div className="bg-green-50 border border-green-300 rounded-lg p-4 mb-4">
            <h3 className="text-green-800 font-semibold mt-0 mb-2">✓ LifeZinc IS:</h3>
            <ul className="mb-0 pl-5 space-y-1">
              <li>An emotional wellness journaling companion</li>
              <li>A tool for self-reflection and tracking moods</li>
              <li>A resource for guided exercises and coping strategies</li>
              <li>A private, secure space for your thoughts</li>
            </ul>
          </div>

          <div className="bg-red-50 border border-red-300 rounded-lg p-4">
            <h3 className="text-red-900 font-semibold mt-0 mb-2">✗ LifeZinc IS NOT:</h3>
            <ul className="mb-0 pl-5 space-y-1">
              <li><strong>A substitute for professional medical care, therapy, or psychiatric treatment</strong></li>
              <li>A crisis intervention service or emergency hotline</li>
              <li>A diagnostic tool for mental health conditions</li>
              <li>A provider of medical advice or treatment</li>
              <li>Monitored by healthcare professionals 24/7</li>
            </ul>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">When to Seek Professional Help</h2>
          <p className="mb-2">You should seek immediate professional help if you:</p>
          <ul className="pl-5 space-y-1">
            <li>Have thoughts of harming yourself or others</li>
            <li>Are experiencing a mental health crisis or emergency</li>
            <li>Are in immediate physical danger</li>
            <li>Are experiencing symptoms of severe mental illness</li>
            <li>Have concerns about substance abuse or addiction</li>
            <li>Need diagnosis or treatment for a mental health condition</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Risk Detection & Intervention</h2>
          <p className="mb-2">
            LifeZinc includes risk detection algorithms that analyze journal entries for language
            indicating distress, self-harm, or violence. When high-risk language is detected:
          </p>
          <ul className="pl-5 space-y-1 mb-2">
            <li>The app displays crisis resources and hotline numbers</li>
            <li>You receive immediate suggestions to contact professional help</li>
            <li>Safety planning resources are offered</li>
          </ul>
          <p>
            <strong>Important:</strong> This system is not perfect and cannot replace human judgment.
            The absence of a crisis alert does not mean you are safe. If you feel you need help,
            please reach out to a professional immediately.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Data Privacy in Crisis Situations</h2>
          <p className="mb-2">
            Your journal entries are private and encrypted. We do <strong>not</strong> monitor or
            review your entries in real-time. Risk detection happens locally in your browser. We do
            not report crisis indicators to third parties without your consent, except where legally
            required.
          </p>
          <p>
            However, LifeZinc is not designed to handle emergencies. In a crisis, call emergency services
            directly (911 in the US, 999 in the UK, or your local emergency number).
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Limitations of Automated Support</h2>
          <p>
            LifeZinc provides automated guidance and suggestions based on your input. These suggestions
            are general wellness practices and are not personalized medical advice. They should not be
            used as a substitute for professional care.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Your Responsibility</h2>
          <p className="mb-2">By using LifeZinc, you acknowledge that:</p>
          <ul className="pl-5 space-y-1">
            <li>You understand LifeZinc is not a medical or crisis service</li>
            <li>You will seek professional help for serious mental health concerns</li>
            <li>You will call emergency services if you are in immediate danger</li>
            <li>You take full responsibility for your actions and decisions</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Liability Disclaimer</h2>
          <p>
            LifeZinc and its creators are not liable for any harm, injury, or adverse outcomes
            resulting from use of the app. The app is provided "as is" without warranties of any
            kind. Use of LifeZinc does not create a therapist-patient, doctor-patient, or any other
            professional relationship.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Contact Us</h2>
          <p>
            If you have questions about this disclaimer, please contact us at{" "}
            <a href="mailto:support@lifezinc.com" className="text-blue-600 underline hover:text-blue-700">
              support@lifezinc.com
            </a>
          </p>
        </div>
      </section>

      <footer className="mt-10 pt-6 border-t-2 border-gray-200">
        <p className="text-sm text-gray-500 mb-4">
          <strong>Effective date:</strong> {effectiveDate}
        </p>
        <div className="flex items-center justify-between text-sm">
          <button
            onClick={() => onNavigate("privacy")}
            className="underline hover:text-gray-600 transition-colors"
          >
            Privacy Policy
          </button>
          <button
            onClick={() => onNavigate("terms")}
            className="underline hover:text-gray-600 transition-colors"
          >
            Terms of Use
          </button>
        </div>
      </footer>
    </main>
  );
}
