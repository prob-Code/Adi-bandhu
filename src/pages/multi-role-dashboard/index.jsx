import React, { useState, useEffect } from 'react';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import StatisticsPanel from './components/StatisticsPanel';
import MapPreview from './components/MapPreview';
import QuickActionCards from './components/QuickActionCards';
import NotificationPanel from './components/NotificationPanel';
import RecentActivityFeed from './components/RecentActivityFeed';
import RoleSelector from './components/RoleSelector';
import EligibilityChecker from './components/EligibilityChecker';
import ComplianceAlerts from './components/ComplianceAlerts';
import GrievanceCenter from './components/GrievanceCenter';
import AuditLogs from './components/AuditLogs';
import { supabase, checkSupabaseConnectivity } from '../../utils/supabaseClient';
import { getDashboardData } from '../../services/dashboardData';
import { useAuth } from '../../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';

const MultiRoleDashboard = () => {
  const [currentRole, setCurrentRole] = useState('Field Officer');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dbOnline, setDbOnline] = useState(null);
  const [statsData, setStatsData] = useState({ stats: [], source: 'demo' });
  const [weatherData, setWeatherData] = useState({
    temperature: '28°C',
    condition: 'Partly Cloudy',
    humidity: '65%',
    location: 'Khandwa, MP'
  });

  // Available roles for demo - in real app this would come from user permissions
  const availableRoles = [
    'Field Officer',
    'Committee Member',
    'Administrator',
    'Public Viewer'
  ];

  const { user, role: authRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const displayName = user?.user_metadata?.full_name || (user?.email ? user.email.split('@')[0] : 'User');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  // Sync role from URL or auth
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const r = params.get('r');
    if (r && r !== currentRole) {
      setCurrentRole(r);
      return;
    }
    if (authRole && authRole !== currentRole) {
      setCurrentRole(authRole);
    }
  }, [location.search, authRole]);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      const [ok, data] = await Promise.all([
        checkSupabaseConnectivity(),
        getDashboardData(currentRole)
      ]);
      if (!cancelled) {
        setDbOnline(ok);
        setStatsData(data);
      }
    };
    run();
    const id = setInterval(run, 120000); // refresh every 2 mins
    return () => { cancelled = true; clearInterval(id); };
  }, [currentRole]);

  const handleRoleChange = (newRole) => {
    setCurrentRole(newRole);
    console.log(`Role switched to: ${newRole}`);
  };

  const getRoleGreeting = () => {
    const hour = currentTime?.getHours();
    const timeGreeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';
    
    const roleSpecificGreeting = {
      'Field Officer': 'Ready for field work today?',
      'Committee Member': 'Review pending claims await your attention.',
      'Administrator': 'System status and user management overview.',
      'Public Viewer': 'Explore public forest rights information.'
    };

    return {
      greeting: timeGreeting,
      message: roleSpecificGreeting?.[currentRole] || roleSpecificGreeting?.['Field Officer']
    };
  };

  const greeting = getRoleGreeting();

  const renderDbStatus = () => {
    if (dbOnline === null) {
      return (
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-warning rounded-full animate-pulse" />
          <span className="text-sm text-muted-foreground">Checking…</span>
        </div>
      );
    }
    if (dbOnline) {
      return (
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-success rounded-full" />
          <span className="text-sm text-success">Online</span>
        </div>
      );
    }
    return (
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-error rounded-full" />
        <span className="text-sm text-error">Offline</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1">
              <div className="flex items-center space-x-4">
                <img src="" />
                <div>
                  <h1 className="text-2xl font-bold text-foreground">
                    {greeting?.greeting}, {displayName}
                  </h1>
                  <p className="text-muted-foreground">{greeting?.message}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center space-x-1">
                      <Icon name="Calendar" size={14} />
                      <span>{currentTime?.toLocaleDateString('en-IN', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Icon name="Clock" size={14} />
                      <span>{currentTime?.toLocaleTimeString('en-IN', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Weather & Quick Info */}
            <div className="flex items-center space-x-6">
              <div className="hidden md:flex items-center space-x-3 px-4 py-2 bg-muted rounded-lg">
                <Icon name="Cloud" size={20} className="text-accent" />
                <div className="text-sm">
                  <p className="font-medium text-foreground">{weatherData?.temperature}</p>
                  <p className="text-muted-foreground">{weatherData?.condition}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                  <span className="text-sm text-muted-foreground">System Online</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="LogOut"
                  iconPosition="left"
                  onClick={async () => { await supabase.auth.signOut(); navigate('/auth/login'); }}
                >
                  Sign out
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Tricolor Ribbon */}
      <div className="w-full h-1 flex">
        <div className="w-1/3 bg-accent" />
        <div className="w-1/3 bg-white" />
        <div className="w-1/3 bg-secondary" />
      </div>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column - Main Dashboard */}
          <div className="lg:col-span-3 space-y-6">
            {/* Statistics Panel */}
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-muted-foreground">Overview</div>
              <span className={`px-2 py-0.5 text-xs rounded-full ${statsData.source === 'live' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>
                {statsData.source === 'live' ? 'Live Data' : 'Demo Data'}
              </span>
            </div>
            <StatisticsPanel userRole={currentRole} stats={statsData.stats} />

            {/* Quick Action Cards */}
            <QuickActionCards userRole={currentRole} />

            {/* Eligibility Checker */}
            <EligibilityChecker />

            {/* Compliance Alerts */}
            <ComplianceAlerts />

            {/* Map Preview */}
            <MapPreview userRole={currentRole} />

            {/* Recent Activity Feed */}
            <RecentActivityFeed userRole={currentRole} />
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Role Selector (only administrators can switch) */}
            {currentRole === 'Administrator' && (
              <RoleSelector
                currentRole={currentRole}
                onRoleChange={handleRoleChange}
                availableRoles={availableRoles}
              />
            )}

            {/* Notifications Panel */}
            <NotificationPanel userRole={currentRole} />

            {/* Grievance Center */}
            <GrievanceCenter />

            {/* Quick Links */}
            <div className="bg-card border border-border rounded-lg overflow-hidden elevation-1">
              <div className="px-4 py-3 bg-primary text-primary-foreground border-b">Quick Links</div>
              <div className="p-4 space-y-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  iconName="Map"
                  iconPosition="left"
                  onClick={() => window.location.href = '/interactive-web-gis-map'}
                >
                  Interactive Map
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  iconName="Upload"
                  iconPosition="left"
                  onClick={() => window.location.href = '/claim-upload-interface'}
                >
                  Upload Claim
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  iconName="CheckCircle"
                  iconPosition="left"
                  onClick={() => window.location.href = '/claim-verification'}
                >
                  Verify Claims
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  iconName="Users"
                  iconPosition="left"
                  onClick={() => window.location.href = '/committee-review'}
                >
                  Committee Review
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  iconName="Brain"
                  iconPosition="left"
                  onClick={() => window.location.href = '/decision-support'}
                >
                  DSS Recommendations
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  iconName="Globe"
                  iconPosition="left"
                  onClick={() => window.location.href = '/public-map-viewer'}
                >
                  Public Map
                </Button>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-card border border-border rounded-lg overflow-hidden elevation-1">
              <div className="px-4 py-3 bg-primary text-primary-foreground border-b">System Status</div>
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Database</span>
                  {renderDbStatus()}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Map Services</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-success rounded-full" />
                    <span className="text-sm text-success">Active</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">File Storage</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-warning rounded-full" />
                    <span className="text-sm text-warning">85% Full</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Last Backup</span>
                  <span className="text-sm text-muted-foreground">2 hours ago</span>
                </div>
              </div>
            </div>

            {/* Important Government Links */}
            <div className="bg-card border border-border rounded-lg overflow-hidden elevation-1">
              <div className="px-4 py-3 bg-primary text-primary-foreground border-b">Important Links</div>
              <ul className="p-4 space-y-2 text-sm">
                <li><a className="flex items-center gap-2 hover:underline" href="https://www.digilocker.gov.in/" target="_blank" rel="noreferrer"><span className="w-1.5 h-1.5 bg-accent rounded-full" />DigiLocker</a></li>
                <li><a className="flex items-center gap-2 hover:underline" href="https://uidai.gov.in/" target="_blank" rel="noreferrer"><span className="w-1.5 h-1.5 bg-accent rounded-full" />UIDAI (Aadhaar)</a></li>
                <li><a className="flex items-center gap-2 hover:underline" href="https://www.pmindia.gov.in/" target="_blank" rel="noreferrer"><span className="w-1.5 h-1.5 bg-accent rounded-full" />PMO India</a></li>
                <li><a className="flex items-center gap-2 hover:underline" href="https://www.mygov.in/" target="_blank" rel="noreferrer"><span className="w-1.5 h-1.5 bg-accent rounded-full" />MyGov</a></li>
                <li><a className="flex items-center gap-2 hover:underline" href="https://www.india.gov.in/" target="_blank" rel="noreferrer"><span className="w-1.5 h-1.5 bg-accent rounded-full" />National Portal</a></li>
              </ul>
            </div>

            {/* Audit Logs */}
            <AuditLogs />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiRoleDashboard;
