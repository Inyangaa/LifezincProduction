import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { LogOut } from "lucide-react";

interface MainLayoutProps {
  onNavigate: (page: string) => void;
  children: React.ReactNode;
}

export default function MainLayout({ onNavigate, children }: MainLayoutProps) {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      console.log('[MainLayout] User signed out, redirecting to home');
      onNavigate('home');
    } catch (error) {
      console.error('[MainLayout] Sign out error:', error);
    }
  };
  const navLinkStyle: React.CSSProperties = {
    fontSize: 13,
    padding: "6px 10px",
    borderRadius: 999,
    border: "none",
    background: "none",
    color: "#335250",
    cursor: "pointer",
    whiteSpace: "nowrap",
  };

  const navLinkSoftStyle: React.CSSProperties = {
    ...navLinkStyle,
    opacity: 0.9,
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background:
          "radial-gradient(circle at top left, #e7fbf7 0, #ffffff 45%, #fef7f6 100%)",
        color: "#122026",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      {/* HEADER / TOP NAV */}
      <header
        style={{
          borderBottom: "1px solid rgba(18,32,38,0.08)",
          background: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(10px)",
          position: "sticky",
          top: 0,
          zIndex: 20,
        }}
      >
        <div
          style={{
            maxWidth: 1040,
            margin: "0 auto",
            padding: "10px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          {/* Logo + brand */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              cursor: "pointer",
            }}
            onClick={() => onNavigate("home")}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "999px",
                background:
                  "linear-gradient(135deg, #1AB0A8 0%, #76E5D3 50%, #FFB5B0 100%)",
                boxShadow: "0 6px 14px rgba(0,0,0,0.16)",
              }}
            />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  fontWeight: 800,
                  letterSpacing: "0.14em",
                  fontSize: 13,
                }}
              >
                LIFEZINC
              </span>
              <span
                style={{
                  fontSize: 11,
                  color: "#6c8480",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Emotional Wellness
              </span>
            </div>
          </div>

          {/* Center nav links */}
          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexWrap: "wrap",
              justifyContent: "center",
              flex: 1,
            }}
          >
            <button
              style={navLinkStyle}
              onClick={() => onNavigate("home")}
            >
              Home
            </button>
            <button
              style={navLinkSoftStyle}
              onClick={() => onNavigate("about")}
            >
              About
            </button>
            <button
              style={navLinkSoftStyle}
              onClick={() => onNavigate("teens")}
            >
              For Teens
            </button>
            <button
              style={navLinkSoftStyle}
              onClick={() => onNavigate("faq")}
            >
              FAQ
            </button>
            <button
              style={navLinkSoftStyle}
              onClick={() => onNavigate("therapist-support")}
            >
              Find a Therapist
            </button>
            <button
              style={navLinkSoftStyle}
              onClick={() => onNavigate("contact")}
            >
              Contact
            </button>
          </nav>

          {/* Right CTA */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {user ? (
              <>
                <button
                  onClick={() => onNavigate("settings")}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 999,
                    background: "transparent",
                    color: "#335250",
                    fontSize: 13,
                    fontWeight: 600,
                    border: "1px solid rgba(51, 82, 80, 0.2)",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  Settings
                </button>
                <button
                  onClick={handleSignOut}
                  style={{
                    padding: "8px 18px",
                    borderRadius: 999,
                    background: "transparent",
                    color: "#dc2626",
                    fontSize: 13,
                    fontWeight: 600,
                    border: "1px solid rgba(220, 38, 38, 0.3)",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <LogOut size={14} />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => onNavigate("login")}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 999,
                    background: "transparent",
                    color: "#335250",
                    fontSize: 13,
                    fontWeight: 600,
                    border: "1px solid rgba(51, 82, 80, 0.2)",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  Log In
                </button>
                <button
                  onClick={() => onNavigate("signup")}
                  style={{
                    padding: "8px 18px",
                    borderRadius: 999,
                    background:
                      "linear-gradient(135deg, #1AB0A8 0%, #76E5D3 50%, #1AB0A8 100%)",
                    color: "#ffffff",
                    fontSize: 14,
                    fontWeight: 600,
                    border: "none",
                    cursor: "pointer",
                    boxShadow: "0 8px 18px rgba(26,176,168,0.35)",
                    whiteSpace: "nowrap",
                  }}
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main
        style={{
          flex: 1,
          maxWidth: 1040,
          margin: "0 auto",
          width: "100%",
          padding: "24px 16px 40px",
        }}
      >
        {children}
      </main>

      {/* FOOTER */}
      <footer
        style={{
          borderTop: "1px solid rgba(18,32,38,0.06)",
          background: "#f6fbfa",
          padding: "14px 16px 18px",
          marginTop: "auto",
        }}
      >
        <div
          style={{
            maxWidth: 1040,
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              fontSize: 12,
              justifyContent: "center",
            }}
          >
            <button
              style={navLinkSoftStyle}
              onClick={() => onNavigate("mission-vision")}
            >
              Mission &amp; Vision
            </button>
            <button
              style={navLinkSoftStyle}
              onClick={() => onNavigate("faq")}
            >
              FAQ
            </button>
            <button
              style={navLinkSoftStyle}
              onClick={() => onNavigate("privacy")}
            >
              Privacy Policy
            </button>
            <button
              style={navLinkSoftStyle}
              onClick={() => onNavigate("terms")}
            >
              Terms of Service
            </button>
            <button
              style={navLinkSoftStyle}
              onClick={() => onNavigate("data-deletion")}
            >
              Data Deletion
            </button>
            <button
              style={navLinkSoftStyle}
              onClick={() => onNavigate("contact")}
            >
              Contact Us
            </button>
            <button
              style={navLinkSoftStyle}
              onClick={() => onNavigate("school-counselors")}
            >
              For School Counselors
            </button>
          </div>

          <div
            style={{
              textAlign: "center",
              fontSize: 11,
              color: "#6b7c7a",
              marginTop: 4,
            }}
          >
            © {new Date().getFullYear()} LifeZinc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
