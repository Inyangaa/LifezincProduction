import { Phone, Shield, MessageCircle } from 'lucide-react';

interface ViolenceInterventionFlowProps {
  flowId: string;
  onBack: () => void;
}

export function ViolenceInterventionFlow({ flowId, onBack }: ViolenceInterventionFlowProps) {
  const isImminentThreat = flowId === 'imminent_threat_protocol';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center gap-4 mb-6">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
            isImminentThreat ? 'bg-red-100' : 'bg-orange-100'
          }`}>
            <Shield className={`w-8 h-8 ${isImminentThreat ? 'text-red-600' : 'text-orange-600'}`} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {isImminentThreat ? 'You may need support right now' : 'Let\'s talk about safety'}
            </h2>
            <p className="text-gray-600">You don't have to go through this alone</p>
          </div>
        </div>

        <div className="space-y-6">
          {isImminentThreat ? (
            <>
              <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-6">
                <p className="text-gray-900 font-semibold mb-4">
                  What you've shared sounds really difficult, and your safety matters. There are people who care and can help—right now, 24/7.
                </p>
                <p className="text-gray-800 mb-4">
                  Please reach out to someone who can support you:
                </p>
                <div className="space-y-3">
                  <a
                    href="tel:988"
                    className="flex items-center gap-3 p-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    <Phone className="w-6 h-6" />
                    <div className="text-left">
                      <div className="font-bold">Call or text 988</div>
                      <div className="text-sm opacity-90">Suicide & Crisis Lifeline—24/7, free, confidential</div>
                    </div>
                  </a>
                  <a
                    href="sms:741741"
                    className="flex items-center gap-3 p-4 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors"
                  >
                    <MessageCircle className="w-6 h-6" />
                    <div className="text-left">
                      <div className="font-bold">Text HOME to 741741</div>
                      <div className="text-sm opacity-90">Crisis Text Line—text support anytime</div>
                    </div>
                  </a>
                  <a
                    href="tel:911"
                    className="flex items-center gap-3 p-4 bg-gray-700 text-white rounded-xl hover:bg-gray-800 transition-colors"
                  >
                    <Phone className="w-6 h-6" />
                    <div className="text-left">
                      <div className="font-bold">Call 911</div>
                      <div className="text-sm opacity-90">For immediate emergency help</div>
                    </div>
                  </a>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 mb-3">Other ways to get help:</h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• Tell someone you trust—a friend, family member, teacher, or counselor</li>
                  <li>• Go to your nearest emergency room if you're in immediate danger</li>
                  <li>• Contact your therapist or school counselor</li>
                  <li>• Call your local mental health crisis team</li>
                </ul>
              </div>
            </>
          ) : (
            <>
              <div className="bg-teal-50 border-2 border-teal-300 rounded-xl p-6">
                <p className="text-gray-900 font-semibold mb-4">
                  It sounds like you're going through something really difficult right now.
                </p>
                <p className="text-gray-800 mb-4">
                  If you need support, there are people ready to listen—24/7, free, and confidential:
                </p>
                <div className="space-y-3">
                  <a
                    href="tel:988"
                    className="flex items-center gap-3 p-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    <Phone className="w-6 h-6" />
                    <div className="text-left">
                      <div className="font-bold">Call or text 988</div>
                      <div className="text-sm opacity-90">Suicide & Crisis Lifeline</div>
                    </div>
                  </a>
                  <a
                    href="sms:741741"
                    className="flex items-center gap-3 p-4 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors"
                  >
                    <MessageCircle className="w-6 h-6" />
                    <div className="text-left">
                      <div className="font-bold">Text HOME to 741741</div>
                      <div className="text-sm opacity-90">Crisis Text Line</div>
                    </div>
                  </a>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 mb-3">More support options:</h3>
                <p className="text-gray-700 text-sm mb-4">
                  Many people go through intense thoughts and feelings. Talking to someone who understands can really help.
                </p>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• <strong>Trevor Project</strong> (LGBTQ+ youth): Call 1-866-488-7386 or text START to 678-678</li>
                  <li>• <strong>Veterans Crisis Line:</strong> Call 988 and press 1, or text 838255</li>
                  <li>• <strong>SAMHSA National Helpline:</strong> 1-800-662-4357 (mental health & substance use)</li>
                </ul>
              </div>
            </>
          )}

          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
            <h3 className="font-bold text-gray-900 mb-2">Please note:</h3>
            <p className="text-gray-700 text-sm">
              LifeZinc provides supportive tools but is not a replacement for professional mental health care or emergency services. If you're in immediate danger, please call 911 or reach out to a crisis hotline right away.
            </p>
          </div>

          <button
            onClick={onBack}
            className="w-full py-4 bg-gray-600 text-white rounded-full font-semibold hover:bg-gray-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
