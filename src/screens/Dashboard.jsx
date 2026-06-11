import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Unlock, 
  Sun, 
  Settings as GearIcon, 
  Clock, 
  Activity, 
  Eye, 
  Zap 
} from 'lucide-react';

function Dashboard({ 
  doorLocked, 
  setDoorLocked, 
  ledBrightness, 
  setLedBrightness, 
  motorSpeed, 
  setMotorSpeed, 
  liveStreamLogs, 
  onViewReports, 
  showToast 
}) {
  // Deep scan simulation state
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  const scanIntervalRef = useRef(null);

  // Cleanup scan interval on unmount
  useEffect(() => {
    return () => {
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
      }
    };
  }, []);

  const handleRunDeepScan = () => {
    if (isScanning) return;
    setIsScanning(true);
    setScanProgress(0);

    let progress = 0;
    scanIntervalRef.current = setInterval(() => {
      progress += 10;
      setScanProgress(progress);
      
      if (progress >= 100) {
        clearInterval(scanIntervalRef.current);
        scanIntervalRef.current = null;
        setIsScanning(false);
        showToast('Deep scan completed. Integrity: 100%. All sub-grids operating normally.', 'success');
      }
    }, 250);
  };

  const handleLockToggle = () => {
    const nextState = !doorLocked;
    setDoorLocked(nextState);
    showToast(
      nextState ? 'Main Entrance locked' : 'Main Entrance unlocked (Biometric Bypass enabled)', 
      nextState ? 'error' : 'success'
    );
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Hero Card */}
      <div className="card" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '28px',
        borderLeft: '4px solid var(--color-highlight)'
      }}>
        <div style={{ flex: 1, paddingRight: '20px' }}>
          <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-secondary)', letterSpacing: '0.1em', marginBottom: '8px' }}>
            OPERATIONAL STATE
          </div>
          
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px', lineHeight: 1.2 }}>
            {isScanning ? `Scanning... ${scanProgress}%` : 'System Secure'}
          </h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <span className={`dot ${isScanning ? 'dot-indigo' : 'dot-green'}`} />
            <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>
              {isScanning 
                ? 'Biometric sensors and cores under diagnostic scan...' 
                : 'All protocols nominal. Last scan: 2m ago.'}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              className="btn btn-primary" 
              onClick={handleRunDeepScan}
              disabled={isScanning}
            >
              {isScanning ? 'Running Diagnostic...' : 'Run Deep Scan'}
            </button>
            <button 
              className="btn btn-outline"
              onClick={onViewReports}
              disabled={isScanning}
            >
              View Reports
            </button>
          </div>
        </div>

        {/* Shield graphic on right */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          color: isScanning ? 'var(--color-highlight)' : 'var(--color-neutral)',
          opacity: isScanning ? 0.9 : 0.4,
          transition: 'all 0.3s ease'
        }}>
          <ShieldCheck size={80} strokeWidth={1} className={isScanning ? 'animate-spin-custom' : ''} />
        </div>
      </div>

      {/* Row of 2 cards */}
      <div className="grid-2">
        
        {/* Card 1 — Main Entrance */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 className="card-title">Main Entrance</h3>
            <p className="card-subtitle">Biometric bypass enabled</p>
          </div>

          {/* Centered lock icon */}
          <div 
            onClick={handleLockToggle}
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              padding: '24px 0',
              cursor: 'pointer',
              userSelect: 'none'
            }}
          >
            <div style={{ 
              width: '80px', 
              height: '80px', 
              borderRadius: '20px', 
              backgroundColor: doorLocked ? 'rgba(239, 68, 68, 0.08)' : 'rgba(34, 197, 94, 0.08)',
              border: `1.5px solid ${doorLocked ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)'}`,
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: doorLocked ? 'var(--color-denied)' : 'var(--color-success)',
              transition: 'all 0.2s ease',
              boxShadow: doorLocked ? 'none' : '0 4px 15px rgba(34, 197, 94, 0.15)'
            }}>
              {doorLocked ? <Lock size={36} /> : <Unlock size={36} />}
            </div>
            
            <span style={{ 
              marginTop: '16px', 
              fontSize: '15px', 
              fontWeight: '700', 
              color: doorLocked ? 'var(--color-denied)' : 'var(--color-success)' 
            }}>
              {doorLocked ? 'Locked' : 'Unlocked'}
            </span>
          </div>

          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textAlign: 'center' }}>
            Click key container above to simulate manual access bypass
          </div>
        </div>

        {/* Card 2 — Smart LED (left) + Ventilation Motor (right) side by side */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
          
          {/* Smart LED Card */}
          <div className="card" style={{ 
            boxShadow: `0 4px 20px -5px rgba(99, 102, 241, ${ledBrightness / 400})`,
            border: ledBrightness > 50 ? '1px solid rgba(99, 102, 241, 0.2)' : '1px solid var(--border-color)',
            transition: 'all 0.2s ease'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 className="card-title">Smart LED</h3>
                <p className="card-subtitle" style={{ marginBottom: 0 }}>Ambient Lighting</p>
              </div>
              <span className="badge badge-update">
                {ledBrightness}%
              </span>
            </div>

            {/* Slider Row */}
            <div className="slider-container">
              <Sun size={16} style={{ color: ledBrightness > 30 ? 'var(--color-highlight)' : 'var(--text-secondary)' }} />
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={ledBrightness} 
                onChange={(e) => setLedBrightness(Number(e.target.value))}
                className="slider-input" 
              />
              <GearIcon size={16} style={{ color: 'var(--text-secondary)' }} />
            </div>
          </div>

          {/* Ventilation Motor Card */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 className="card-title">Ventilation Motor</h3>
                <p className="card-subtitle" style={{ marginBottom: 0 }}>Air Circulation System</p>
              </div>
              <span className={`badge ${motorSpeed === 'Off' ? 'badge-neutral' : 'badge-secure'}`}>
                {motorSpeed === 'Off' ? 'Offline' : motorSpeed}
              </span>
            </div>

            {/* 4-Segment pill toggle */}
            <div className="segment-pill">
              {['Off', 'Low', 'Med', 'High'].map((speed) => (
                <button
                  key={speed}
                  className={`segment-btn ${motorSpeed === speed ? 'active' : ''}`}
                  onClick={() => {
                    setMotorSpeed(speed);
                    if (speed !== 'Off') {
                      showToast(`Ventilation motor speed set to ${speed}`);
                    } else {
                      showToast('Ventilation motor deactivated', 'error');
                    }
                  }}
                >
                  {speed}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Live Audit Log section */}
      <div className="table-container">
        <div className="table-header">
          <div className="table-header-title">
            <Clock size={16} />
            <span>LIVE AUDIT LOG</span>
          </div>
          <div className="table-header-status">
            <span className="dot dot-green animate-pulse" />
            <span>Streaming</span>
          </div>
        </div>
        
        <table className="custom-table">
          <thead>
            <tr>
              <th>TIMESTAMP</th>
              <th>ENTITY</th>
              <th>ACTION</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {liveStreamLogs.map((log) => (
              <tr key={log.id} className="slide-in-row">
                <td style={{ fontFamily: 'monospace', fontWeight: '500', color: 'var(--text-secondary)' }}>
                  {log.timestamp}
                </td>
                <td style={{ fontWeight: '600' }}>
                  {log.entity}
                </td>
                <td style={{ color: 'var(--text-primary)' }}>
                  {log.action}
                </td>
                <td>
                  <span className={`badge ${
                    log.status === 'SECURE' ? 'badge-secure' : 
                    log.status === 'DENIED' ? 'badge-denied' : 'badge-update'
                  }`}>
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default Dashboard;
