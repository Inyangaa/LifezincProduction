import { useState } from "react";
import { Heart, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface NavigationProps {
  onNavigate: (page: string) => void;
}

export function Navigation({ onNavigate }: NavigationProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuIconClick = () => {
    console.log("Menu icon clicked");
    setIsMenuOpen(prev => !prev);
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  const handleBeginJourney = () => {
    console.log("Begin Journey clicked");
    setIsMenuOpen(false);
    if (user) {
      navigate('/journal');
    } else {
      navigate('/signup');
    }
  };

  return (
    <header className="sticky top-0 bg-white/80 backdrop-blur-xl border-b border-cyan-100/60 shadow-sm" style={{ zIndex: 1000 }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-4 sm:py-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/home"
            onClick={handleLinkClick}
            className="flex items-center gap-2 sm:gap-4 group cursor-pointer"
          >
            <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl shadow-lg transform group-hover:scale-105 transition-transform bg-gradient-to-br from-cyan-500 via-blue-500 to-teal-500 flex items-center justify-center">
              <Heart className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
            </div>
            <div className="hidden sm:block">
              <div className="font-bold text-xl sm:text-2xl tracking-tight bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">LifeZinc</div>
              <div className="text-xs text-gray-500 font-medium">Grow Through What You Go Through</div>
            </div>
            <div className="sm:hidden font-bold text-lg tracking-tight bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">LifeZinc</div>
          </Link>

          {/* Desktop Navigation - Hidden on mobile */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link
              to="/home"
              className="text-sm font-medium text-gray-600 hover:text-cyan-600 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-sm font-medium text-gray-600 hover:text-cyan-600 transition-colors"
            >
              About
            </Link>
            <Link
              to="/faq"
              className="text-sm font-medium text-gray-600 hover:text-cyan-600 transition-colors"
            >
              FAQ
            </Link>
            <Link
              to="/pricing"
              className="text-sm font-medium text-gray-600 hover:text-cyan-600 transition-colors"
            >
              Pricing
            </Link>
            <Link
              to="/faith"
              className="text-sm font-medium text-gray-600 hover:text-cyan-600 transition-colors"
            >
              Faith
            </Link>
            <Link
              to="/therapist-support"
              className="text-sm font-medium text-gray-600 hover:text-cyan-600 transition-colors"
            >
              Therapist
            </Link>
            <Link
              to="/contact"
              className="text-sm font-medium text-gray-600 hover:text-cyan-600 transition-colors"
            >
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {/* Desktop Begin Journey Button */}
            <button
              onClick={handleBeginJourney}
              className="hidden sm:flex px-4 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-cyan-500 via-blue-500 to-teal-500 text-white text-sm font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 items-center gap-2"
              type="button"
            >
              <span>Begin Journey</span>
            </button>

            {/* Mobile Menu Icon - Only visible on mobile/tablet */}
            <button
              type="button"
              onClick={handleMenuIconClick}
              className="lg:hidden inline-flex items-center justify-center rounded-lg border border-gray-300 p-3 text-gray-600 hover:bg-gray-50 transition-colors bg-white"
              aria-label="Toggle navigation"
              style={{
                WebkitTapHighlightColor: 'transparent',
                minWidth: '44px',
                minHeight: '44px'
              }}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU PANEL - Simple, Fixed Position */}
      {isMenuOpen && (
        <div
          className="lg:hidden bg-white border-t border-gray-200 shadow-lg"
          style={{
            position: 'fixed',
            top: '80px',
            left: 0,
            right: 0,
            zIndex: 999,
            maxHeight: 'calc(100vh - 80px)',
            overflowY: 'auto',
            pointerEvents: 'auto'
          }}
        >
          <nav className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex flex-col gap-1">
              <Link
                to="/home"
                onClick={handleLinkClick}
                className="w-full text-left px-4 py-4 text-base font-medium text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 rounded-lg transition-colors bg-white"
                style={{
                  minHeight: '48px',
                  touchAction: 'manipulation',
                  WebkitTapHighlightColor: 'rgba(6, 182, 212, 0.1)'
                }}
              >
                Home
              </Link>

              <Link
                to="/about"
                onClick={handleLinkClick}
                className="w-full text-left px-4 py-4 text-base font-medium text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 rounded-lg transition-colors bg-white"
                style={{
                  minHeight: '48px',
                  touchAction: 'manipulation',
                  WebkitTapHighlightColor: 'rgba(6, 182, 212, 0.1)'
                }}
              >
                About
              </Link>

              <Link
                to="/faq"
                onClick={handleLinkClick}
                className="w-full text-left px-4 py-4 text-base font-medium text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 rounded-lg transition-colors bg-white"
                style={{
                  minHeight: '48px',
                  touchAction: 'manipulation',
                  WebkitTapHighlightColor: 'rgba(6, 182, 212, 0.1)'
                }}
              >
                FAQ
              </Link>

              <Link
                to="/pricing"
                onClick={handleLinkClick}
                className="w-full text-left px-4 py-4 text-base font-medium text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 rounded-lg transition-colors bg-white"
                style={{
                  minHeight: '48px',
                  touchAction: 'manipulation',
                  WebkitTapHighlightColor: 'rgba(6, 182, 212, 0.1)'
                }}
              >
                Pricing
              </Link>

              <Link
                to="/faith"
                onClick={handleLinkClick}
                className="w-full text-left px-4 py-4 text-base font-medium text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 rounded-lg transition-colors bg-white"
                style={{
                  minHeight: '48px',
                  touchAction: 'manipulation',
                  WebkitTapHighlightColor: 'rgba(6, 182, 212, 0.1)'
                }}
              >
                Faith & Inspiration
              </Link>

              <Link
                to="/therapist-support"
                onClick={handleLinkClick}
                className="w-full text-left px-4 py-4 text-base font-medium text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 rounded-lg transition-colors bg-white"
                style={{
                  minHeight: '48px',
                  touchAction: 'manipulation',
                  WebkitTapHighlightColor: 'rgba(6, 182, 212, 0.1)'
                }}
              >
                Find a Therapist
              </Link>

              <Link
                to="/contact"
                onClick={handleLinkClick}
                className="w-full text-left px-4 py-4 text-base font-medium text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 rounded-lg transition-colors bg-white"
                style={{
                  minHeight: '48px',
                  touchAction: 'manipulation',
                  WebkitTapHighlightColor: 'rgba(6, 182, 212, 0.1)'
                }}
              >
                Contact
              </Link>
            </div>

            {/* Mobile Begin Journey Button */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={handleBeginJourney}
                className="w-full py-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-teal-500 text-white text-base font-semibold rounded-full shadow-lg hover:shadow-xl transition-all"
                style={{
                  minHeight: '52px',
                  touchAction: 'manipulation',
                  WebkitTapHighlightColor: 'transparent'
                }}
              >
                Begin Journey
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
