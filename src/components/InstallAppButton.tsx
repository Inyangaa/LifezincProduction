import { useState, useEffect } from 'react';
import { Download, Smartphone, X, Check } from 'lucide-react';
import { usePwaInstall } from '../hooks/usePwaInstall';

export function InstallAppButton() {
  const { requestInstall, canInstall, isInstalled } = usePwaInstall();
  const [showBanner, setShowBanner] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [messageType, setMessageType] = useState<'not-supported' | 'success'>('not-supported');

  useEffect(() => {
    if (isInstalled) {
      return;
    }

    const dismissed = localStorage.getItem('pwa-banner-dismissed');
    if (!dismissed && canInstall) {
      setTimeout(() => setShowBanner(true), 3000);
    }
  }, [isInstalled, canInstall]);

  const handleInstallClick = async () => {
    const result = await requestInstall();

    if (result === 'prompted') {
      setShowBanner(false);
    } else if (result === 'installed') {
      setMessageType('success');
      setShowMessage(true);
      setShowBanner(false);
      setTimeout(() => setShowMessage(false), 3000);
    } else if (result === 'not-supported') {
      setMessageType('not-supported');
      setShowMessage(true);
      setShowBanner(false);
      setTimeout(() => setShowMessage(false), 5000);
    }
  };

  const dismissBanner = () => {
    setShowBanner(false);
    localStorage.setItem('pwa-banner-dismissed', 'true');
  };

  if (isInstalled || !showBanner) {
    return showMessage ? (
      <div
        style={{
          position: 'fixed',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 50,
          maxWidth: 400,
          width: 'calc(100% - 32px)',
          background: messageType === 'success' ? '#d1fae5' : '#ffffff',
          borderRadius: 16,
          boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
          border: messageType === 'success' ? '1px solid #10b981' : '1px solid #d3ebe7',
          padding: 16,
          animation: 'slideUp 0.3s ease-out',
        }}
      >
        <button
          onClick={() => setShowMessage(false)}
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#6b7c7a',
            padding: 4,
          }}
        >
          <X className="w-5 h-5" />
        </button>

        <div style={{ display: 'flex', alignItems: 'start', gap: 12, paddingRight: 24 }}>
          {messageType === 'success' && (
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Check className="w-5 h-5 text-white" />
            </div>
          )}
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 14, color: '#2c514e', lineHeight: 1.6, margin: 0 }}>
              {messageType === 'success'
                ? "LifeZinc is now installed! You can access it from your home screen anytime."
                : "You're already using LifeZinc in your browser. If you'd like, you can save it to your home screen later from your browser menu. No download required."}
            </p>
          </div>
        </div>

        <style>
          {`
            @keyframes slideUp {
              from {
                transform: translate(-50%, 100px);
                opacity: 0;
              }
              to {
                transform: translate(-50%, 0);
                opacity: 1;
              }
            }
          `}
        </style>
      </div>
    ) : null;
  }

  return (
    <>
      <div
        style={{
          position: 'fixed',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 50,
          maxWidth: 400,
          width: 'calc(100% - 32px)',
          background: '#ffffff',
          borderRadius: 16,
          boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
          border: '1px solid #d3ebe7',
          padding: 16,
          animation: 'slideUp 0.3s ease-out',
        }}
      >
        <button
          onClick={dismissBanner}
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#6b7c7a',
            padding: 4,
          }}
        >
          <X className="w-5 h-5" />
        </button>

        <div style={{ display: 'flex', alignItems: 'start', gap: 12, marginBottom: 12 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #1AB0A8 0%, #76E5D3 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Smartphone className="w-6 h-6 text-white" />
          </div>
          <div style={{ flex: 1 }}>
            <h3
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: '#2c514e',
                marginBottom: 4,
              }}
            >
              Install LifeZinc App
            </h3>
            <p style={{ fontSize: 13, color: '#6b7c7a', lineHeight: 1.5 }}>
              Get the full experience with offline access, faster performance, and quick access from your home screen.
            </p>
          </div>
        </div>

        <button
          onClick={handleInstallClick}
          style={{
            width: '100%',
            padding: '12px 20px',
            borderRadius: 999,
            background: 'linear-gradient(135deg, #1AB0A8 0%, #76E5D3 100%)',
            color: '#ffffff',
            fontSize: 14,
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            boxShadow: '0 4px 12px rgba(26,176,168,0.3)',
          }}
        >
          <Download className="w-4 h-4" />
          Install App
        </button>
      </div>

      <style>
        {`
          @keyframes slideUp {
            from {
              transform: translate(-50%, 100px);
              opacity: 0;
            }
            to {
              transform: translate(-50%, 0);
              opacity: 1;
            }
          }
        `}
      </style>
    </>
  );
}
