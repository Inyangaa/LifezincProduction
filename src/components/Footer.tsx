import { Heart, Mail } from "lucide-react";
import { Link } from "react-router-dom";

interface FooterProps {
  onNavigate: (page: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-br from-gray-50 via-cyan-50/30 to-blue-50/30 border-t border-gray-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl shadow-lg bg-gradient-to-br from-cyan-500 via-blue-500 to-teal-500 flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-bold text-lg bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
                  LifeZinc
                </div>
                <div className="text-xs text-gray-500 font-medium">Emotional Wellness</div>
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Your daily companion for emotional wellness, clarity, and peace.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
            <nav className="space-y-2.5">
              <Link
                to="/about"
                className="block text-sm text-gray-600 hover:text-cyan-600 transition-colors"
              >
                About Us
              </Link>
              <Link
                to="/mission-vision"
                className="block text-sm text-gray-600 hover:text-cyan-600 transition-colors"
              >
                Mission & Vision
              </Link>
              <Link
                to="/contact"
                className="block text-sm text-gray-600 hover:text-cyan-600 transition-colors"
              >
                Contact Us
              </Link>
            </nav>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Resources</h3>
            <nav className="space-y-2.5">
              <Link
                to="/faq"
                className="block text-sm text-gray-600 hover:text-cyan-600 transition-colors"
              >
                FAQ
              </Link>
              <Link
                to="/faith"
                className="block text-sm text-gray-600 hover:text-cyan-600 transition-colors"
              >
                Faith & Inspiration
              </Link>
              <Link
                to="/therapist-support"
                className="block text-sm text-gray-600 hover:text-cyan-600 transition-colors"
              >
                Find a Therapist
              </Link>
              <Link
                to="/school-counselors"
                className="block text-sm text-gray-600 hover:text-cyan-600 transition-colors"
              >
                For School Counselors
              </Link>
            </nav>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
            <nav className="space-y-2.5">
              <Link
                to="/privacy"
                className="block text-sm text-gray-600 hover:text-cyan-600 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="block text-sm text-gray-600 hover:text-cyan-600 transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                to="/crisis-disclaimer"
                className="block text-sm text-gray-600 hover:text-cyan-600 transition-colors"
              >
                Crisis Disclaimer
              </Link>
              <Link
                to="/data-deletion"
                className="block text-sm text-gray-600 hover:text-cyan-600 transition-colors"
              >
                Data Deletion
              </Link>
            </nav>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200/50">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600">
              © {currentYear} LifeZinc. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link
                to="/contact"
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-cyan-600 transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>Support</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
