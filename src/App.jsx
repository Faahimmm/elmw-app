import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Bell, 
  User, 
  LayoutDashboard, 
  History, 
  UserPlus, 
  Settings as SettingsIcon,
  LogOut,
  CheckCircle2,
  Lock
} from 'lucide-react';

// Import screens
import AuthScreen from './screens/AuthScreen';
import Dashboard from './screens/Dashboard';
import AuditHistory from './screens/AuditHistory';
import Enrollment from './screens/Enrollment';
import Settings from './screens/Settings';

function App() {
  // Authentication & Lock Gating
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Toast Banner
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ---------------------------------------------------------
  // SHARED SYSTEM STATES
  // ---------------------------------------------------------
  const [doorLocked, setDoorLocked] = useState(true);
  const [ledBrightness, setLedBrightness] = useState(65);
  const [motorSpeed, setMotorSpeed] = useState('Low'); // Off | Low | Med | High

  // Settings state
  const [wifiSsid, setWifiSsid] = useState('ELMW-WORKSHOP-SECURE');
  const [baudRate, setBaudRate] = useState(57600);
  const [autoLockTimeout, setAutoLockTimeout] = useState(true);
  const [failedAttemptLimit, setFailedAttemptLimit] = useState(3);
  const [nodeLocation, setNodeLocation] = useState('Virginia North-1');

  // Enrolled users database
  const [users, setUsers] = useState([
    { id: 1, name: 'Marcus Vance', uid: 'UID-8891-AD', initials: 'MV' },
    { id: 2, name: 'Elena Rostova', uid: 'UID-4029-BC', initials: 'ER' },
    { id: 3, name: 'Chen Wei', uid: 'UID-7110-EF', initials: 'CW' },
    { id: 4, name: 'Sarah Jenkins', uid: 'UID-9012-GH', initials: 'SJ' },
    { id: 5, name: 'David Mercer', uid: 'UID-1102-JK', initials: 'DM' },
  ]);

  // Master Logs List
  const [auditLogs, setAuditLogs] = useState([
    { id: 101, timestamp: '11:26:45', entity: 'MAIN ENTRANCE', action: 'Access Granted (Marcus Vance)', status: 'SECURE' },
    { id: 102, timestamp: '11:25:12', entity: 'BIOMETRIC SENSOR', action: 'Self-Scan Diagnostic Completed', status: 'SECURE' },
    { id: 103, timestamp: '11:24:30', entity: 'VENTILATION SYSTEM', action: 'Fan Speed Adjust -> High', status: 'UPDATE' },
    { id: 104, timestamp: '11:21:05', entity: 'MAIN ENTRANCE', action: 'Access Denied (Invalid UID-8802)', status: 'DENIED' },
    { id: 105, timestamp: '11:19:18', entity: 'SMART LED', action: 'LED Level dim -> 65%', status: 'UPDATE' },
    { id: 106, timestamp: '11:15:02', entity: 'SYSTEM CORE', action: 'Baud Rate Re-negotiated: 57600', status: 'SECURE' }
  ]);

  // Auto-rotating live streaming logs list for Dashboard
  const [liveStreamLogs, setLiveStreamLogs] = useState([
    { id: 1, timestamp: '11:27:32', entity: 'MAIN ENTRANCE', action: 'Access Granted (Elena Rostova)', status: 'SECURE' },
    { id: 2, timestamp: '11:26:05', entity: 'SMART LED', action: 'LED Level dim -> 80%', status: 'UPDATE' },
    { id: 3, timestamp: '11:24:12', entity: 'MAIN ENTRANCE', action: 'Access Denied (UID-9912)', status: 'DENIED' },
    { id: 4, timestamp: '11:23:45', entity: 'VENTILATION SYSTEM', action: 'Fan Speed Adjust -> Low', status: 'UPDATE' },
    { id: 5, timestamp: '11:22:10', entity: 'SYSTEM CORE', action: 'System Integrity Checked', status: 'SECURE' }
  ]);

  // Live streaming interval simulator (cycles log rows every 3 seconds)
  useEffect(() => {
    if (!isAuthenticated) return;

    const streamSources = [
      { entity: 'MAIN ENTRANCE', action: 'Access Granted (Chen Wei)', status: 'SECURE' },
      { entity: 'SMART LED', action: 'LED Level dim -> 40%', status: 'UPDATE' },
      { entity: 'MAIN ENTRANCE', action: 'Access Denied (Unknown Fingerprint)', status: 'DENIED' },
      { entity: 'VENTILATION SYSTEM', action: 'Fan Speed Adjust -> Med', status: 'UPDATE' },
      { entity: 'BIOMETRIC SENSOR', action: 'Index Scanner Cleaning Cycle', status: 'SECURE' },
      { entity: 'MAIN ENTRANCE', action: 'Access Granted (David Mercer)', status: 'SECURE' },
      { entity: 'SYSTEM CORE', action: 'Weekly Security Payload Generated', status: 'SECURE' },
      { entity: 'MAIN ENTRANCE', action: 'Access Denied (Out of Shift Hour UID-1102)', status: 'DENIED' },
      { entity: 'SMART LED', action: 'LED Level dim -> 95%', status: 'UPDATE' },
      { entity: 'VENTILATION SYSTEM', action: 'Fan Speed Adjust -> High', status: 'UPDATE' }
    ];

    const interval = setInterval(() => {
      const randomAction = streamSources[Math.floor(Math.random() * streamSources.length)];
      const now = new Date();
      const timestamp = now.toTimeString().split(' ')[0]; // HH:MM:SS
      const newLog = {
        id: Date.now(),
        timestamp,
        ...randomAction
      };

      // Add to dashboard stream (keep top 5)
      setLiveStreamLogs(prev => [newLog, ...prev.slice(0, 4)]);
      // Add to overall history log
      setAuditLogs(prev => [newLog, ...prev]);
    }, 3000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Handles adding a newly enrolled user
  const handleAddUser = (newUser, pin) => {
    const formattedUser = {
      id: Date.now(),
      name: newUser.fullName,
      uid: newUser.employeeId,
      initials: newUser.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    };

    setUsers(prev => [formattedUser, ...prev]);

    // Insert an audit log for the enrollment
    const now = new Date();
    const timestamp = now.toTimeString().split(' ')[0];
    const logEntry = {
      id: Date.now() + 1, // Avoid key collision with formattedUser.id
      timestamp,
      entity: 'BIOMETRIC SENSOR',
      action: `Enrolled User: ${formattedUser.name} (${formattedUser.uid})`,
      status: 'SECURE'
    };

    setAuditLogs(prev => [logEntry, ...prev]);
    setLiveStreamLogs(prev => [logEntry, ...prev.slice(0, 4)]);
    showToast(`Successfully enrolled ${formattedUser.name}!`);
  };

  // Lock the system
  const handleLockSystem = () => {
    setIsAuthenticated(false);
    setUserDropdownOpen(false);
    showToast('System locked', 'error');
  };

  // Render Lock Screen if not authenticated
  if (!isAuthenticated) {
    return (
      <AuthScreen 
        onAuthSuccess={() => {
          setIsAuthenticated(true);
          showToast('Authentication Successful. Access Granted.');
        }}
        failedAttemptLimit={failedAttemptLimit}
      />
    );
  }

  // Active Tab View router
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            doorLocked={doorLocked} 
            setDoorLocked={setDoorLocked}
            ledBrightness={ledBrightness}
            setLedBrightness={setLedBrightness}
            motorSpeed={motorSpeed}
            setMotorSpeed={setMotorSpeed}
            liveStreamLogs={liveStreamLogs}
            onViewReports={() => setActiveTab('audit')}
            showToast={showToast}
          />
        );
      case 'audit':
        return (
          <AuditHistory 
            auditLogs={auditLogs} 
            showToast={showToast}
          />
        );
      case 'enrollment':
        return (
          <Enrollment 
            onEnrollComplete={handleAddUser}
            nodeLocation={nodeLocation}
          />
        );
      case 'settings':
        return (
          <Settings 
            wifiSsid={wifiSsid}
            setWifiSsid={setWifiSsid}
            baudRate={baudRate}
            setBaudRate={setBaudRate}
            autoLockTimeout={autoLockTimeout}
            setAutoLockTimeout={setAutoLockTimeout}
            failedAttemptLimit={failedAttemptLimit}
            setFailedAttemptLimit={setFailedAttemptLimit}
            nodeLocation={nodeLocation}
            onExportLogs={() => {
              showToast('Audit Log Exported: ELMW_AUDIT.csv');
            }}
          />
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app-shell">
      {/* Toast Banner */}
      {toast && (
        <div className="toast-banner">
          <CheckCircle2 size={16} color={toast.type === 'error' ? '#EF4444' : '#22C55E'} />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Bar Header */}
      <header className="top-bar">
        <div className="top-bar-left">
          <Shield size={20} />
          <span>ELMW-ACS</span>
        </div>
        <div className="top-bar-right">
          <button className="top-bar-btn" onClick={() => showToast('Diagnostics: System nominal (99.9% Secure)')}>
            <Bell size={20} />
            <span className="notification-dot"></span>
          </button>
          
          <div style={{ position: 'relative' }}>
            <button className="user-avatar-btn" onClick={() => setUserDropdownOpen(!userDropdownOpen)}>
              <User size={18} />
            </button>

            {userDropdownOpen && (
              <div className="user-menu-dropdown">
                <div className="user-menu-header">
                  <div className="user-menu-name">Security Terminal</div>
                  <div className="user-menu-role">System Admin</div>
                </div>
                <button className="user-menu-item" onClick={() => { setUserDropdownOpen(false); showToast('Admin details loaded.'); }}>
                  <User size={14} /> Profile Settings
                </button>
                <button className="user-menu-item logout" onClick={handleLockSystem}>
                  <Lock size={14} /> Lock Console
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Contents Frame */}
      <main className="main-content">
        {renderActiveTab()}
      </main>

      {/* Bottom Nav Bar */}
      <nav className="bottom-nav">
        <button 
          className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => { setActiveTab('dashboard'); setUserDropdownOpen(false); }}
        >
          <LayoutDashboard size={20} />
          <span className="nav-tab-label">Dashboard</span>
        </button>

        <button 
          className={`nav-tab ${activeTab === 'audit' ? 'active' : ''}`}
          onClick={() => { setActiveTab('audit'); setUserDropdownOpen(false); }}
        >
          <History size={20} />
          <span className="nav-tab-label">Audit</span>
        </button>

        <button 
          className={`nav-tab ${activeTab === 'enrollment' ? 'active' : ''}`}
          onClick={() => { setActiveTab('enrollment'); setUserDropdownOpen(false); }}
        >
          <UserPlus size={20} />
          <span className="nav-tab-label">Enrollment</span>
        </button>

        <button 
          className={`nav-tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => { setActiveTab('settings'); setUserDropdownOpen(false); }}
        >
          <SettingsIcon size={20} />
          <span className="nav-tab-label">Settings</span>
        </button>
      </nav>
    </div>
  );
}

export default App;
