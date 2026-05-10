import { useState, useRef } from 'react';
import { ArrowLeft, Search, MapPin, Phone, Mail, Globe, Calendar, Heart, Shield, Users, Baby, Home, BookHeart, Award, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';

interface TherapistSupportPageProps {
  onNavigate: (page: string) => void;
}

interface TherapistProfile {
  id: string;
  name: string;
  credentials: string;
  specialties: string[];
  address: string;
  distance: string;
  phone: string;
  email: string;
  website: string;
  acceptsInsurance: boolean;
  languages: string[];
  availability: string;
  rating: number;
  reviewCount: number;
  bio: string;
}

const therapyCategories = [
  { id: 'anxiety', label: 'Anxiety & Stress', icon: '😰', description: 'Worry, panic attacks, social anxiety' },
  { id: 'trauma', label: 'Trauma & PTSD', icon: '🌪️', description: 'Past experiences, flashbacks, healing' },
  { id: 'depression', label: 'Depression', icon: '🌧️', description: 'Low mood, loss of interest, hopelessness' },
  { id: 'relationships', label: 'Relationships', icon: '💑', description: 'Couples therapy, communication, boundaries' },
  { id: 'family', label: 'Family Issues', icon: '👨‍👩‍👧', description: 'Family dynamics, parenting, conflict' },
  { id: 'addiction', label: 'Addiction & Recovery', icon: '🚭', description: 'Substance use, behavioral addictions' },
  { id: 'child-teen', label: 'Child & Teen', icon: '👶', description: 'Youth counseling, developmental issues' },
  { id: 'faith-based', label: 'Faith-Based Counseling', icon: '🙏', description: 'Spiritually integrated therapy' },
];

const placeholderTherapists: TherapistProfile[] = [
  {
    id: '1',
    name: 'Dr. Sarah Mitchell, PhD',
    credentials: 'Licensed Clinical Psychologist',
    specialties: ['Anxiety', 'Trauma', 'CBT', 'EMDR'],
    address: '123 Main St, Suite 200',
    distance: '2.3 miles',
    phone: '(555) 123-4567',
    email: 'dr.mitchell@example.com',
    website: 'www.drmitchelltherapy.com',
    acceptsInsurance: true,
    languages: ['English', 'Spanish'],
    availability: 'Accepting new patients',
    rating: 4.9,
    reviewCount: 127,
    bio: 'Specializing in trauma-informed care with over 15 years of experience helping clients overcome anxiety and PTSD.',
  },
  {
    id: '2',
    name: 'Marcus Thompson, LMFT',
    credentials: 'Licensed Marriage & Family Therapist',
    specialties: ['Relationships', 'Family Therapy', 'Communication'],
    address: '456 Oak Avenue, Building B',
    distance: '3.7 miles',
    phone: '(555) 234-5678',
    email: 'marcus@familyhealingcenter.com',
    website: 'www.familyhealingcenter.com',
    acceptsInsurance: true,
    languages: ['English'],
    availability: 'Limited openings',
    rating: 4.8,
    reviewCount: 89,
    bio: 'Passionate about helping couples and families build stronger connections through compassionate, evidence-based therapy.',
  },
  {
    id: '3',
    name: 'Rev. Dr. Grace Chen, LPC',
    credentials: 'Licensed Professional Counselor',
    specialties: ['Faith-Based', 'Depression', 'Life Transitions'],
    address: '789 Church Street',
    distance: '4.1 miles',
    phone: '(555) 345-6789',
    email: 'grace@hopecounseling.org',
    website: 'www.hopecounseling.org',
    acceptsInsurance: false,
    languages: ['English', 'Mandarin'],
    availability: 'Accepting new patients',
    rating: 5.0,
    reviewCount: 156,
    bio: 'Integrating Christian principles with professional therapy to support your spiritual and emotional healing journey.',
  },
];

export function TherapistSupportPage({ onNavigate }: TherapistSupportPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [isOnline, setIsOnline] = useState(false);
  const [isInPerson, setIsInPerson] = useState(false);
  const [areaOfFocus, setAreaOfFocus] = useState('');
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [selectedTherapist, setSelectedTherapist] = useState<TherapistProfile | null>(null);
  const step2Ref = useRef<HTMLDivElement>(null);

  const handleSearch = () => {
    if ((city && state) || zipCode) {
      setSearchPerformed(true);
    }
  };

  const handleNextToStep2 = () => {
    step2Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleLocationPermission = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setZipCode('Using current location');
          setSearchPerformed(true);
        },
        (error) => {
          alert('Unable to access location. Please enter ZIP code manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto">

        {showDisclaimer && (
          <div className="mb-6 bg-amber-50 border-l-4 border-amber-500 rounded-lg p-6 shadow-md">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-2">Important Notice</h3>
                <p className="text-gray-700 text-sm mb-3">
                  LifeZinc is a wellness tool and does not replace professional mental health care.
                  The therapist directory is provided for informational purposes only. We do not endorse
                  specific providers and recommend verifying credentials before scheduling.
                </p>
                <p className="text-gray-700 text-sm mb-4">
                  <strong>In case of emergency:</strong> Call 911 or the 988 Suicide & Crisis Lifeline immediately.
                </p>
                <button
                  type="button"
                  onClick={() => setShowDisclaimer(false)}
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                >
                  I Understand
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 rounded-full mb-4">
              <Heart className="w-8 h-8 text-teal-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Get Professional Support</h1>
            <p className="text-xl text-gray-600">
              Find qualified therapists and counselors in your area
            </p>
          </div>

          <section
            style={{
              marginTop: 30,
              marginBottom: 24,
              padding: "18px 16px",
              borderRadius: 18,
              background: "#f4f9ff",
              border: "1px solid #d5e3ff",
            }}
          >
            <h2 style={{ fontSize: "1.2rem", marginBottom: 8 }}>
              School &amp; Campus Counselors
            </h2>
            <p style={{ fontSize: 14, color: "#355b58", marginBottom: 6 }}>
              If you&apos;re a student, one of the fastest ways to get real support is to
              talk to your school counselor, campus advisor, or trusted teacher.
            </p>
            <ul style={{ paddingLeft: 20, fontSize: 14, color: "#4a6765" }}>
              <li>Share how you&apos;ve been feeling lately.</li>
              <li>Show them a few LifeZinc entries if you feel safe doing that.</li>
              <li>Ask about counseling, wellness groups, or extra school support.</li>
            </ul>
            <p style={{ fontSize: 13, color: "#6c8480", marginTop: 6 }}>
              LifeZinc can help you put your feelings into words, and your school
              counselor can help you figure out what to do next in real life.
            </p>
          </section>

          <div className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-l-4 border-green-500">
            <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-600" />
              Why Seek Professional Help?
            </h3>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Professional therapists have specialized training to help you heal</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Therapy provides a safe, confidential space to process emotions</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Evidence-based techniques can create lasting positive change</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>You deserve support from someone trained to help</span>
              </li>
            </ul>
          </div>

          {!searchPerformed ? (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Step 1: What are you seeking help with?</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {therapyCategories.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(category.id);
                      }}
                      aria-pressed={selectedCategory === category.id}
                      className={`p-5 rounded-xl border-2 transition-all text-left hover:shadow-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
                        selectedCategory === category.id
                          ? 'border-teal-500 bg-teal-50 shadow-md'
                          : 'border-gray-200 bg-white hover:border-teal-300'
                      }`}
                    >
                      <div className="text-3xl mb-2">{category.icon}</div>
                      <h3 className="font-bold text-gray-900 mb-1 text-sm">{category.label}</h3>
                      <p className="text-xs text-gray-600">{category.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div ref={step2Ref} className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Step 2: Where are you located?</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="relative">
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="City"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-teal-500 focus:outline-none text-gray-900"
                    />
                  </div>
                  <div className="relative">
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-teal-500 focus:outline-none text-gray-900 appearance-none bg-white"
                    >
                      <option value="">Select State</option>
                      <option value="AL">Alabama</option>
                      <option value="AK">Alaska</option>
                      <option value="AZ">Arizona</option>
                      <option value="AR">Arkansas</option>
                      <option value="CA">California</option>
                      <option value="CO">Colorado</option>
                      <option value="CT">Connecticut</option>
                      <option value="DE">Delaware</option>
                      <option value="FL">Florida</option>
                      <option value="GA">Georgia</option>
                      <option value="HI">Hawaii</option>
                      <option value="ID">Idaho</option>
                      <option value="IL">Illinois</option>
                      <option value="IN">Indiana</option>
                      <option value="IA">Iowa</option>
                      <option value="KS">Kansas</option>
                      <option value="KY">Kentucky</option>
                      <option value="LA">Louisiana</option>
                      <option value="ME">Maine</option>
                      <option value="MD">Maryland</option>
                      <option value="MA">Massachusetts</option>
                      <option value="MI">Michigan</option>
                      <option value="MN">Minnesota</option>
                      <option value="MS">Mississippi</option>
                      <option value="MO">Missouri</option>
                      <option value="MT">Montana</option>
                      <option value="NE">Nebraska</option>
                      <option value="NV">Nevada</option>
                      <option value="NH">New Hampshire</option>
                      <option value="NJ">New Jersey</option>
                      <option value="NM">New Mexico</option>
                      <option value="NY">New York</option>
                      <option value="NC">North Carolina</option>
                      <option value="ND">North Dakota</option>
                      <option value="OH">Ohio</option>
                      <option value="OK">Oklahoma</option>
                      <option value="OR">Oregon</option>
                      <option value="PA">Pennsylvania</option>
                      <option value="RI">Rhode Island</option>
                      <option value="SC">South Carolina</option>
                      <option value="SD">South Dakota</option>
                      <option value="TN">Tennessee</option>
                      <option value="TX">Texas</option>
                      <option value="UT">Utah</option>
                      <option value="VT">Vermont</option>
                      <option value="VA">Virginia</option>
                      <option value="WA">Washington</option>
                      <option value="WV">West Virginia</option>
                      <option value="WI">Wisconsin</option>
                      <option value="WY">Wyoming</option>
                      <option value="DC">Washington D.C.</option>
                    </select>
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      placeholder="ZIP / Postal Code"
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-teal-500 focus:outline-none text-gray-900"
                      maxLength={10}
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleLocationPermission}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium flex items-center justify-center gap-2 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                >
                  <MapPin className="w-5 h-5" />
                  Use My Location
                </button>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Step 3: Preferences (Optional)</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                    <input
                      type="checkbox"
                      id="online-therapy"
                      checked={isOnline}
                      onChange={(e) => setIsOnline(e.target.checked)}
                      className="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                    />
                    <label htmlFor="online-therapy" className="text-gray-900 font-medium cursor-pointer flex-1">
                      I'm open to online/virtual therapy
                    </label>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                    <input
                      type="checkbox"
                      id="in-person"
                      checked={isInPerson}
                      onChange={(e) => setIsInPerson(e.target.checked)}
                      className="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                    />
                    <label htmlFor="in-person" className="text-gray-900 font-medium cursor-pointer flex-1">
                      I prefer in-person sessions
                    </label>
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Area of Focus</label>
                    <select
                      value={areaOfFocus}
                      onChange={(e) => setAreaOfFocus(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-teal-500 focus:outline-none text-gray-900 appearance-none bg-white"
                    >
                      <option value="">Select area of focus (optional)</option>
                      <option value="anxiety">Anxiety</option>
                      <option value="depression">Depression</option>
                      <option value="school-stress">School/Academic Stress</option>
                      <option value="family">Family Issues</option>
                      <option value="relationships">Relationships</option>
                      <option value="trauma">Trauma</option>
                      <option value="grief">Grief & Loss</option>
                      <option value="addiction">Addiction</option>
                      <option value="eating">Eating Disorders</option>
                      <option value="lgbtq">LGBTQ+ Issues</option>
                      <option value="career">Career & Life Transitions</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSearch}
                disabled={!(city && state) && !zipCode}
                className="w-full py-4 bg-teal-600 text-white text-lg font-semibold rounded-xl hover:bg-teal-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:focus:ring-0"
              >
                <Search className="w-5 h-5" />
                Find Therapists Near Me
              </button>

              <div className="mt-8 bg-red-50 border-l-4 border-red-500 rounded-lg p-6">
                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  Important Safety Information
                </h3>
                <p className="text-sm text-gray-700 mb-3">
                  <strong>LifeZinc does not provide therapy or endorse specific providers.</strong> The information
                  displayed is for informational purposes only. We recommend verifying all credentials and licenses
                  before scheduling an appointment.
                </p>
                <p className="text-sm text-gray-700">
                  <strong>If you are in crisis or thinking of harming yourself or others,</strong> please contact
                  your local emergency number (911 in the US) or call the 988 Suicide & Crisis Lifeline immediately.
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {therapyCategories.find(c => c.id === selectedCategory)?.label} Specialists
                  </h2>
                  <p className="text-gray-600">Found {placeholderTherapists.length} providers near {zipCode}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSearchPerformed(false);
                    setSelectedTherapist(null);
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                >
                  New Search
                </button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-900">
                  <strong>We're working on partnerships in your area.</strong> While we build connections
                  with verified therapist networks, you can use these resources:
                </p>
                <ul className="mt-3 space-y-2 text-sm text-blue-900">
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span><strong>Psychology Today:</strong> <a href="https://www.psychologytoday.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-700">psychologytoday.com</a></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span><strong>TherapyDen:</strong> <a href="https://www.therapyden.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-700">therapyden.com</a></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span><strong>SAMHSA Treatment Locator:</strong> <a href="https://findtreatment.samhsa.gov" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-700">findtreatment.samhsa.gov</a></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span><strong>Open Path Collective:</strong> <a href="https://openpathcollective.org" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-700">openpathcollective.org</a> (affordable therapy)</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                {placeholderTherapists.map((therapist) => (
                  <div key={therapist.id} className="border-2 border-gray-200 rounded-xl p-6 hover:border-teal-400 hover:shadow-lg transition-all bg-white">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{therapist.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{therapist.credentials}</p>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={`text-lg ${i < Math.floor(therapist.rating) ? 'text-yellow-500' : 'text-gray-300'}`}>
                                ★
                              </span>
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">
                            {therapist.rating} ({therapist.reviewCount} reviews)
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-teal-600 mb-1">{therapist.distance}</div>
                        <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          therapist.availability === 'Accepting new patients'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {therapist.availability}
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-700 text-sm mb-4">{therapist.bio}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                      <div className="text-sm">
                        <p className="font-semibold text-gray-900 mb-1">Specialties:</p>
                        <div className="flex flex-wrap gap-1">
                          {therapist.specialties.map((specialty, idx) => (
                            <span key={idx} className="px-2 py-1 bg-teal-100 text-teal-700 rounded text-xs">
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-sm">
                        <p className="font-semibold text-gray-900 mb-1">Languages:</p>
                        <p className="text-gray-700">{therapist.languages.join(', ')}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-700 mb-4">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span>{therapist.address}</span>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      {therapist.acceptsInsurance && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          <CheckCircle className="w-3 h-3" />
                          Accepts Insurance
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <a
                        href={`tel:${therapist.phone}`}
                        className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium text-sm"
                      >
                        <Phone className="w-4 h-4" />
                        Call
                      </a>
                      <a
                        href={`mailto:${therapist.email}`}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
                      >
                        <Mail className="w-4 h-4" />
                        Email
                      </a>
                      <a
                        href={`https://${therapist.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
                      >
                        <Globe className="w-4 h-4" />
                        Website
                      </a>
                      <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium text-sm">
                        <Calendar className="w-4 h-4" />
                        Book Appointment
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border-l-4 border-purple-500">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <BookHeart className="w-5 h-5 text-purple-600" />
                  Tips for Your First Appointment
                </h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">1.</span>
                    <span>Write down what you'd like to work on before your session</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">2.</span>
                    <span>Be honest about your symptoms and history</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">3.</span>
                    <span>Ask about their approach and what to expect</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">4.</span>
                    <span>It's okay if the first therapist isn't the right fit - keep trying</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">5.</span>
                    <span>Bring your LifeZinc therapy export to share your emotional patterns</span>
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>

      {selectedCategory && !searchPerformed && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-30 p-4">
          <div className="max-w-6xl mx-auto">
            <button
              type="button"
              onClick={handleNextToStep2}
              className="w-full py-4 bg-teal-600 text-white text-lg font-semibold rounded-xl hover:bg-teal-700 transition-colors flex items-center justify-center gap-2 shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
            >
              <span>Next: Enter Your Location</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
