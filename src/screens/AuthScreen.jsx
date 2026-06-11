import React, { useState, useEffect, useRef } from 'react';
import { Fingerprint, Lock, ShieldAlert, ShieldCheck, Delete, RefreshCw, HelpCircle } from 'lucide-react';

function AuthScreen({ onAuthSuccess, failedAttemptLimit = 3 }) {
  const [phase, setPhase] = useState('fingerprint'); // 'fingerprint' | 'pin'
  const [scanProgress, setScanProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [pin, setPin] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Interval reference for scanner simulation
  const scanIntervalRef = useRef(null);

  // PERSISTED SECURITY STATES: failed attempts & lockout expiration
  const [failedAttempts, setFailedAttempts] = useState(() => {
    const saved = localStorage.getItem('elmw_failed_attempts');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [lockoutTimeLeft, setLockoutTimeLeft] = useState(() => {
    const savedEnd = localStorage.getItem('elmw_lockout_end');
    if (savedEnd) {
      const timeLeft = Math.ceil((parseInt(savedEnd, 10) - Date.now()) / 1000);
      return timeLeft > 0 ? timeLeft : 0;
    }
    return 0;
  });

  // Lockout countdown timer
  useEffect(() => {
    if (lockoutTimeLeft <= 0) {
      localStorage.removeItem('elmw_lockout_end');
      return;
    }
    const timer = setTimeout(() => {
      setLockoutTimeLeft(prev => {
        const next = prev - 1;
        if (next <= 0) {
          localStorage.removeItem('elmw_lockout_end');
        }
        return next;
      });
    }, 1000);
    return () => clearTimeout(timer);
  }, [lockoutTimeLeft]);

  // Cleanup scan interval on unmount
  useEffect(() => {
    return () => {
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
      }
    };
  }, []);

  // Fingerprint scanning animation simulator
  const handleFingerprintPress = () => {
    if (lockoutTimeLeft > 0 || isScanning) return;
    
    setIsScanning(true);
    setScanProgress(0);
    setErrorMessage('');
    
    let currentProgress = 0;
    scanIntervalRef.current = setInterval(() => {
      currentProgress += 5;
      setScanProgress(currentProgress);
      
      if (currentProgress >= 100) {
        clearInterval(scanIntervalRef.current);
        scanIntervalRef.current = null;
        setIsScanning(false);
        setPhase('pin');
      }
    }, 80);
  };

  // Numpad input handler
  const handleNumPress = (num) => {
    if (lockoutTimeLeft > 0 || isVerifying) return;
    if (pin.length >= 6) return;
    
    setErrorMessage('');
    const newPin = pin + num;
    setPin(newPin);

    // Auto-check PIN when it reaches 6 digits
    if (newPin.length === 6) {
      setIsVerifying(true);
      setTimeout(() => {
        if (newPin === '123456') {
          setIsVerifying(false);
          setPin('');
          onAuthSuccess();
        } else {
          const newFailedCount = failedAttempts + 1;
          setFailedAttempts(newFailedCount);
          localStorage.setItem('elmw_failed_attempts', newFailedCount.toString());
          setPin('');
          setIsVerifying(false);
          
          if (newFailedCount >= failedAttemptLimit) {
            setErrorMessage(`LIMIT REACHED. LOCKOUT ACTIVE.`);
            const lockoutDurationMs = 15000;
            const lockoutEnd = Date.now() + lockoutDurationMs;
            localStorage.setItem('elmw_lockout_end', lockoutEnd.toString());
            setLockoutTimeLeft(15); // 15 seconds lockout
            setFailedAttempts(0);
            localStorage.setItem('elmw_failed_attempts', '0');
          } else {
            setErrorMessage(`ACCESS DENIED. ATTEMPTS: ${newFailedCount}/${failedAttemptLimit}`);
          }
        }
      }, 300);
    }
  };

  // Numpad controls
  const handleBackspace = () => {
    if (isVerifying || lockoutTimeLeft > 0) return;
    if (pin.length > 0) {
      setPin(pin.slice(0, -1));
    }
  };

  const handleClear = () => {
    if (isVerifying || lockoutTimeLeft > 0) return;
    setPin('');
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card fade-in">
        {/* Terminal Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6366F1', marginBottom: '8px' }}>
          <ShieldAlert size={24} />
          <span style={{ fontSize: '13px', fontWeight: '800', letterSpacing: '0.1em' }}>ELMW SECURITY GATE</span>
        </div>
        
        <h2 className="auth-card-title">
          {phase === 'fingerprint' ? 'BIOMETRIC SCAN REQUIRED' : 'ENTER MASTER PIN'}
        </h2>
        
        <p className="auth-card-subtitle">
          {phase === 'fingerprint' 
            ? 'Touch & hold fingerprint sensor below to initialize identity handshake.' 
            : 'Console locked. Provide 6-digit secondary credential PIN.'}
        </p>

        {/* Phase 1: Fingerprint Sensor */}
        {phase === 'fingerprint' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <div 
              className={`fingerprint-widget ${isScanning ? 'scanning' : ''}`}
              onClick={handleFingerprintPress}
            >
              <Fingerprint />
              <div className="scanner-arc"></div>
            </div>

            <div className={`scanner-progress-bar ${isScanning ? 'visible' : ''}`}>
              <div className="scanner-progress-fill" style={{ width: `${scanProgress}%` }}></div>
            </div>

            <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {isScanning ? (
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#6366F1', animation: 'pulse 1s infinite' }}>
                  SCANNING FINGERPRINT... {scanProgress}%
                </span>
              ) : lockoutTimeLeft > 0 ? (
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#EF4444' }}>
                  CONSOLE LOCKED: WAIT {lockoutTimeLeft}s
                </span>
              ) : (
                <button 
                  className="btn btn-primary" 
                  style={{ backgroundColor: '#24243E', border: '1px solid #4E4E6E' }}
                  onClick={handleFingerprintPress}
                >
                  SIMULATE BIOMETRIC INPUT
                </button>
              )}
            </div>
          </div>
        )}

        {/* Phase 2: 6-Digit PIN pad */}
        {phase === 'pin' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            {/* PIN Dots Indicator */}
            <div className="pin-indicators">
              {[...Array(6)].map((_, i) => (
                <div 
                  key={i} 
                  className={`pin-dot ${i < pin.length ? 'filled' : ''} ${errorMessage ? 'error' : ''}`}
                />
              ))}
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div style={{ 
                backgroundColor: 'rgba(239, 68, 68, 0.1)', 
                border: '1px solid rgba(239, 68, 68, 0.2)',
                color: '#EF4444',
                padding: '6px 16px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: '700',
                marginBottom: '20px',
                textAlign: 'center',
                width: '100%'
              }}>
                {errorMessage}
              </div>
            )}

            {lockoutTimeLeft > 0 && (
              <div style={{ 
                color: '#EF4444', 
                fontSize: '13px', 
                fontWeight: '600', 
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                Security Lockout Active: {lockoutTimeLeft}s
              </div>
            )}

            {/* Keypad Grid */}
            <div className="numpad">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button 
                  key={num} 
                  className="numkey"
                  disabled={lockoutTimeLeft > 0 || isVerifying}
                  onClick={() => handleNumPress(num)}
                >
                  {num}
                </button>
              ))}
              
              <button 
                className="numkey special"
                disabled={lockoutTimeLeft > 0 || isVerifying}
                onClick={handleClear}
              >
                X
              </button>
              
              <button 
                className="numkey"
                disabled={lockoutTimeLeft > 0 || isVerifying}
                onClick={() => handleNumPress(0)}
              >
                0
              </button>
              
              <button 
                className="numkey special"
                disabled={lockoutTimeLeft > 0 || isVerifying}
                onClick={handleBackspace}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <Delete size={20} />
              </button>
            </div>

            {/* Hint Box */}
            <div style={{ 
              marginTop: '24px', 
              padding: '12px', 
              backgroundColor: '#24243E', 
              border: '1px solid #32325A', 
              borderRadius: '8px', 
              display: 'flex', 
              alignItems: 'flex-start', 
              gap: '8px',
              width: '100%',
              maxWidth: '280px'
            }}>
              <HelpCircle size={14} style={{ color: '#94A3B8', marginTop: '2px', flexShrink: 0 }} />
              <div style={{ fontSize: '11px', color: '#94A3B8' }}>
                <span style={{ fontWeight: '700', color: '#FFFFFF' }}>Demo Access:</span> Use fingerprint bypass simulation, then input PIN <span style={{ fontFamily: 'monospace', fontWeight: '700', color: '#6366F1' }}>123456</span> to access.
              </div>
            </div>
            
            <button 
              className="btn btn-outline" 
              style={{ marginTop: '20px', width: '100%', maxWidth: '280px', color: '#94A3B8', borderColor: '#32325A' }}
              disabled={isVerifying}
              onClick={() => { setPhase('fingerprint'); setPin(''); setErrorMessage(''); }}
            >
              ← RETURN TO FINGERPRINT SCAN
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AuthScreen;
