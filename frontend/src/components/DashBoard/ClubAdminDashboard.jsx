import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import {
  Users,
  BarChart2,
  CheckCircle,
  AlertCircle,
  Calendar,
  MapPin,
  Clock,
  Undo2,
  Redo2,
  Trash2,
  LayoutDashboard,
  Settings,
  User,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Plus,
  FileText,
  Bell,
} from "lucide-react";
import "../../splash.css"
// For custom keyframes if needed

// Helper to get initials from a name
function getInitials(name) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

export default function ClubAdminDashboard() {
  const [registrations, setRegistrations] = useState([
    { name: "Alex Johnson", status: "pending" },
    { name: "Sarah Chen", status: "pending" },
    { name: "Mike Davis", status: "pending" },
    { name: "Emma Wilson", status: "pending" },
    { name: "James Brown", status: "pending" },
  ]);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  const [upcomingEvents, setUpcomingEvents] = useState([
    { name: "AI Workshop", date: "20th July", location: "Auditorium A", eventType: "Workshop" },
    { name: "Hackathon 2025", date: "25th July", location: "Block B", eventType: "Hackathon" },
    { name: "Webinar on React", date: "29th July", location: "Online", eventType: "Webinar" },
  ]);

  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');

  const pushToUndo = (prev) => {
    setUndoStack((stack) => [...stack, prev]);
    setRedoStack([]);
  };

  const handleAccept = (name) => {
    pushToUndo(registrations);
    setRegistrations((prev) =>
      prev.map((reg) =>
        reg.name === name ? { ...reg, status: "accepted" } : reg
      )
    );
  };

  const handleRemove = (name) => {
    pushToUndo(registrations);
    setRegistrations((prev) => prev.filter((reg) => reg.name !== name));
  };

  const handleAcceptAll = () => {
    pushToUndo(registrations);
    setRegistrations((prev) =>
      prev.map((reg) => ({ ...reg, status: "accepted" }))
    );
  };

  const handleUndo = () => {
    setUndoStack((stack) => {
      if (stack.length === 0) return stack;
      setRedoStack((redo) => [...redo, registrations]);
      const prev = stack[stack.length - 1];
      setRegistrations(prev);
      return stack.slice(0, -1);
    });
  };

  const handleRedo = () => {
    setRedoStack((stack) => {
      if (stack.length === 0) return stack;
      setUndoStack((undo) => [...undo, registrations]);
      const next = stack[stack.length - 1];
      setRegistrations(next);
      return stack.slice(0, -1);
    });
  };

  const handleDeleteEvent = (name) => {
    if (window.confirm(`Are you sure you want to delete the event "${name}"?`)) {
      setUpcomingEvents((prev) => prev.filter((event) => event.name !== name));
    }
  };

  const regTrend = [
    { date: "Mon", registrations: 45 },
    { date: "Tue", registrations: 78 },
    { date: "Wed", registrations: 123 },
    { date: "Thu", registrations: 89 },
    { date: "Fri", registrations: 156 },
    { date: "Sat", registrations: 234 },
    { date: "Sun", registrations: 189 },
  ];

  // Modal state for detailed view
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null); // 'event' or 'registration'
  const [modalData, setModalData] = useState(null);

  // Open modal for event or registration
  const openModal = (type, data) => {
    setModalType(type);
    setModalData(data);
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setModalType(null);
    setModalData(null);
  };

  // Dashboard customization state
  const defaultCards = [
    { key: "totalEvents", title: "Total Events", value: "8", Icon: Users },
    { key: "upcomingEvents", title: "Upcoming Events", value: "5", Icon: BarChart2 },
    { key: "totalRegistrations", title: "Total Registrations", value: "1,247", Icon: CheckCircle },
    { key: "attendanceRate", title: "Attendance Rate", value: "78%", Icon: AlertCircle },
  ];
  const [visibleCards, setVisibleCards] = useState(defaultCards.map(card => card.key));
  const [customizeOpen, setCustomizeOpen] = useState(false);
  // New: section toggles
  const [showTrend, setShowTrend] = useState(true);
  const [showEvents, setShowEvents] = useState(true);
  const [showRegistrations, setShowRegistrations] = useState(true);

  const handleCardToggle = (key) => {
    setVisibleCards((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  // Navigation items
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'registrations', label: 'Registrations', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  // Render content based on active section
  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4 sm:mb-6">
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-2 sm:mb-0">Dashboard Overview</h1>
              <div className="flex gap-2 items-center">
                <button
                  onClick={() => setCustomizeOpen(true)}
                  className="px-3 py-2 rounded-lg bg-blue-100 text-blue-700 font-semibold shadow hover:bg-blue-200 transition"
                >
                  Customize Dashboard
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 mb-4 md:mb-6">
              {defaultCards.filter(card => visibleCards.includes(card.key)).map(({ key, title, value, Icon }) => (
                <div
                  key={key}
                  className="bg-white backdrop-blur-md border border-slate-300 p-4 md:p-6 rounded-xl shadow-md hover:shadow-lg transition-all"
                >
                  <div className="flex items-center mb-3 md:mb-4">
                    <Icon className="h-6 w-6 text-blue-500 mr-3" />
                    <h3 className="text-sm md:text-md font-medium text-slate-800">{title}</h3>
                  </div>
                  <p className="text-2xl md:text-3xl font-semibold text-slate-800">{value}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col md:flex-row gap-2 md:gap-x-4 mb-4 md:mb-6">
              {showEvents && (
                <div className="bg-white backdrop-blur-md border border-slate-300 rounded-xl shadow-lg p-4 md:p-6 flex flex-col min-h-[260px] min-w-[340px] md:min-w-[400px] max-w-[420px] w-full mb-2 md:mb-0">
                  <h2 className="text-base md:text-lg font-semibold text-slate-800 mb-4 md:mb-6">Your Upcoming Events</h2>
                  {upcomingEvents.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 text-center text-slate-500 gap-2 animate-fade-in">
                      <Calendar className="w-10 h-10 mb-2 text-blue-300" />
                      <span className="font-semibold">No upcoming events</span>
                      <span className="text-xs">Check back soon or add a new event!</span>
                    </div>
                  ) : (
                    <ul className="space-y-3 md:space-y-4 overflow-y-auto pr-1 md:pr-2 max-h-72 md:max-h-96">
                      {upcomingEvents.map((event, idx) => (
                        <li
                          key={idx}
                          className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-white backdrop-blur rounded-xl border border-slate-300 shadow-sm hover:shadow-md transition cursor-pointer transform-gpu hover:scale-[1.02] duration-200 animate-fade-in"
                          onClick={() => openModal('event', event)}
                        >
                          <div className="flex flex-col flex-1">
                            <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
                              <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                                {event.eventType}
                              </span>
                              <h4 className="text-sm md:text-md font-semibold text-slate-800 truncate">
                                {event.name}
                              </h4>
                            </div>
                            <div className="flex items-center gap-4 md:gap-6 text-xs text-slate-500">
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4 text-blue-500" /> {event.date}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4 text-indigo-500" /> {event.location}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 md:gap-4">
                            <Calendar className="w-5 h-5 text-blue-400" />
                            <button
                              onClick={(e) => { e.stopPropagation(); handleDeleteEvent(event.name); }}
                              className="p-2 rounded-full hover:bg-red-50"
                              aria-label="Delete event"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4 text-red-500 hover:scale-110 transition" />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {showTrend && (
                <div className="bg-white backdrop-blur-md border border-slate-300 rounded-xl shadow-lg p-4 md:p-6 min-h-[260px] flex-1 min-w-0">
                  <h3 className="text-base md:text-lg font-medium text-slate-800 mb-4 md:mb-6">Registration Trend</h3>
                  <div className="h-56 md:h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={regTrend} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                        <XAxis dataKey="date" stroke="#334155" />
                        <YAxis stroke="#334155" />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="registrations"
                          stroke="#2563eb"
                          strokeWidth={3}
                          dot={{ r: 5, stroke: '#2563eb', fill: '#fff' }}
                          activeDot={{ r: 7 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>

            {showRegistrations && (
              <div className="bg-white backdrop-blur-md border border-slate-300 rounded-xl shadow-xl p-4 md:p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2 md:mb-3">
                  <h3 className="text-xl md:text-2xl font-bold text-slate-800">Recent Registrations</h3>
                  <div className="flex gap-2 md:gap-3">
                    <button
                      onClick={handleUndo}
                      disabled={!undoStack.length}
                      className="p-2 rounded-full bg-white/40 backdrop-blur hover:ring-2 ring-blue-300 hover:scale-105 transition"
                    >
                      <Undo2 className="w-5 h-5 text-blue-500" />
                    </button>
                    <button
                      onClick={handleRedo}
                      disabled={!redoStack.length}
                      className="p-2 rounded-full bg-white/40 backdrop-blur hover:ring-2 ring-blue-300 hover:scale-105 transition"
                    >
                      <Redo2 className="w-5 h-5 text-blue-500" />
                    </button>
                    <button
                      onClick={handleAcceptAll}
                      className="bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white px-4 md:px-5 py-2 rounded-full shadow-md transition"
                    >
                      Accept All
                    </button>
                  </div>
                </div>
                {registrations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-40 text-center text-slate-500 gap-2 animate-fade-in">
                    <Users className="w-10 h-10 mb-2 text-blue-300" />
                    <span className="font-semibold">No recent registrations</span>
                    <span className="text-xs">Invite people to register or check back later!</span>
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {registrations.map(({ name, status }) => (
                      <li
                        key={name}
                        className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 md:py-4 px-3 md:px-4 hover:bg-slate-50 hover:backdrop-blur rounded-lg transition cursor-pointer transform-gpu hover:scale-[1.01] duration-200 animate-fade-in"
                        onClick={() => openModal('registration', registrations.find(r => r.name === name))}
                      >
                        {/* Avatar for registrant */}
                        <div className="flex items-center gap-3 flex-1">
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-lg shadow">
                            {getInitials(name)}
                          </div>
                          <span className="text-base md:text-lg text-slate-800 font-medium">{name}</span>
                        </div>
                        <div className="flex gap-2 md:gap-3 items-center mt-2 sm:mt-0">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${status === "accepted"
                                ? "bg-green-100 text-green-700"
                                : "bg-blue-100 text-blue-700"
                              }`}
                          >
                            {status}
                          </span>
                          {status !== "accepted" && (
                            <>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleAccept(name); }}
                                className="p-2 rounded-full bg-green-100 hover:bg-green-200 text-green-700 shadow transition"
                                aria-label="Accept registration"
                                title="Accept"
                              >
                                <CheckCircle className="w-5 h-5" />
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleRemove(name); }}
                                className="p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-700 shadow transition"
                                aria-label="Remove registration"
                                title="Remove"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </>
        );
      case 'events':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-slate-800">Events Management</h1>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                <Plus className="w-4 h-4" />
                Create Event
              </button>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">All Events</h2>
              <div className="grid gap-4">
                {upcomingEvents.map((event, idx) => (
                  <div key={idx} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{event.name}</h3>
                        <p className="text-slate-600">{event.eventType}</p>
                        <div className="flex gap-4 mt-2 text-sm text-slate-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" /> {event.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" /> {event.location}
                          </span>
                        </div>
                      </div>
                      <button className="p-2 text-red-500 hover:bg-red-50 rounded-full">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'registrations':
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-slate-800">Registrations</h1>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">All Registrations</h2>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                  Export Data
                </button>
              </div>
              <div className="space-y-3">
                {registrations.map(({ name, status }) => (
                  <div key={name} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-bold">
                        {getInitials(name)}
                      </div>
                      <span className="font-medium">{name}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status === "accepted" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                      }`}>
                      {status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'analytics':
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-slate-800">Analytics</h1>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Registration Trends</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={regTrend} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                    <XAxis dataKey="date" stroke="#334155" />
                    <YAxis stroke="#334155" />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="registrations"
                      stroke="#2563eb"
                      strokeWidth={3}
                      dot={{ r: 5, stroke: '#2563eb', fill: '#fff' }}
                      activeDot={{ r: 7 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );
      case 'notifications':
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-slate-800">Notifications</h1>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Notifications</h2>
              <div className="space-y-3">
                <div className="p-3 border border-slate-200 rounded-lg">
                  <p className="font-medium">New registration for AI Workshop</p>
                  <p className="text-sm text-slate-600">2 hours ago</p>
                </div>
                <div className="p-3 border border-slate-200 rounded-lg">
                  <p className="font-medium">Event "Hackathon 2025" is starting soon</p>
                  <p className="text-sm text-slate-600">1 day ago</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-slate-800">Settings</h1>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Dashboard Preferences</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Show registration trend</span>
                  <input type="checkbox" checked={showTrend} onChange={() => setShowTrend(!showTrend)} className="accent-blue-500" />
                </div>
                <div className="flex items-center justify-between">
                  <span>Show events section</span>
                  <input type="checkbox" checked={showEvents} onChange={() => setShowEvents(!showEvents)} className="accent-blue-500" />
                </div>
                <div className="flex items-center justify-between">
                  <span>Show registrations section</span>
                  <input type="checkbox" checked={showRegistrations} onChange={() => setShowRegistrations(!showRegistrations)} className="accent-blue-500" />
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col sm:bg-[#2073ea] sm:items-center sm:justify-center">
      <div className="w-full flex flex-col min-h-screen sm:min-h-[80vh] sm:max-w-7xl sm:bg-white sm:rounded-2xl sm:shadow-2xl sm:flex-row sm:my-8 sm:overflow-hidden">
        {/* Mobile sidebar overlay */}
        {mobileSidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-50 sm:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={`
            fixed top-0 left-0 h-full max-w-xs w-4/5 bg-white border-r border-slate-200 z-50 transition-transform duration-300 ease-in-out
            sm:static sm:z-10 sm:w-64 sm:max-w-none sm:translate-x-0
            ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            ${!sidebarOpen ? 'lg:w-16' : ''}
            ${!mobileSidebarOpen && 'hidden sm:block'}
          `}
          style={{ boxShadow: mobileSidebarOpen ? '0 0 24px 0 rgba(0,0,0,0.10)' : undefined }}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              {sidebarOpen && (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">C</span>
                  </div>
                  <span className="font-semibold text-slate-800 text-base">Club Admin</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-1 rounded-lg hover:bg-slate-100 transition lg:block hidden"
                >
                  {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-2 rounded-lg hover:bg-slate-100 transition sm:hidden"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id);
                      setMobileSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition text-base ${activeSection === item.id
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-slate-600 hover:bg-slate-100'
                      }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {sidebarOpen && <span className="font-medium">{item.label}</span>}
                  </button>
                );
              })}
            </nav>

            {/* User Profile */}
            <div className="p-4 border-t border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-200 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-indigo-700" />
                </div>
                {sidebarOpen && (
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800">Admin User</p>
                    <p className="text-xs text-slate-500">admin@club.com</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-full">
          {/* Top Bar */}
          <header className="bg-white shadow-sm border-b border-slate-200 px-3 py-2 sm:px-4 sm:py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 sm:gap-4">
                <button
                  onClick={() => setMobileSidebarOpen(true)}
                  className="p-2 rounded-lg hover:bg-slate-100 transition sm:hidden"
                >
                  <Menu className="w-5 h-5" />
                </button>
                <h1 className="text-lg sm:text-xl font-semibold text-slate-800">
                  {navigationItems.find(item => item.id === activeSection)?.label}
                </h1>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <button className="p-2 rounded-lg hover:bg-slate-100 transition relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full"></span>
                </button>
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-indigo-200 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-indigo-700" />
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-2 sm:p-4 md:p-6">
            {renderContent()}
          </main>
        </div>
      </div>

      {/* Dashboard customization modal */}
      {customizeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all px-2 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl p-4 sm:p-6 w-full max-w-xs relative animate-slide-up border border-slate-200">
            <button
              onClick={() => setCustomizeOpen(false)}
              className="absolute top-2 right-2 sm:top-3 sm:right-3 text-slate-400 hover:text-slate-700 text-xl sm:text-2xl font-bold"
              aria-label="Close"
              title="Close"
            >
              &times;
            </button>
            <h2 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-slate-800">Customize Dashboard</h2>
            <form className="flex flex-col gap-2 sm:gap-3">
              {defaultCards.map(card => (
                <label key={card.key} className="flex items-center gap-2 cursor-pointer text-sm sm:text-base">
                  <input
                    type="checkbox"
                    checked={visibleCards.includes(card.key)}
                    onChange={() => handleCardToggle(card.key)}
                    className="accent-blue-500 w-4 h-4"
                  />
                  <span className="text-slate-700 font-medium">{card.title}</span>
                </label>
              ))}
              <hr className="my-1 sm:my-2" />
              <label className="flex items-center gap-2 cursor-pointer text-sm sm:text-base">
                <input
                  type="checkbox"
                  checked={showTrend}
                  onChange={() => setShowTrend(v => !v)}
                  className="accent-blue-500 w-4 h-4"
                />
                <span className="text-slate-700 font-medium">Registration Trend</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm sm:text-base">
                <input
                  type="checkbox"
                  checked={showEvents}
                  onChange={() => setShowEvents(v => !v)}
                  className="accent-blue-500 w-4 h-4"
                />
                <span className="text-slate-700 font-medium">Upcoming Events Section</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm sm:text-base">
                <input
                  type="checkbox"
                  checked={showRegistrations}
                  onChange={() => setShowRegistrations(v => !v)}
                  className="accent-blue-500 w-4 h-4"
                />
                <span className="text-slate-700 font-medium">Recent Registrations Section</span>
              </label>
            </form>
            <button
              onClick={() => setCustomizeOpen(false)}
              className="mt-4 sm:mt-6 w-full py-2 rounded-lg bg-blue-500 text-white font-semibold shadow hover:bg-blue-600 transition text-sm sm:text-base"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Modal for detailed view */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all px-2 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl p-3 sm:p-4 md:p-8 w-full max-w-md relative animate-slide-up border border-slate-300">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 sm:top-3 sm:right-3 text-slate-400 hover:text-slate-700 text-xl sm:text-2xl font-bold"
              aria-label="Close"
              title="Close"
            >
              &times;
            </button>
            {modalType === 'event' && modalData && (
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2 text-slate-800">{modalData.name}</h2>
                <p className="mb-1 text-slate-700 text-sm sm:text-base"><span className="font-semibold">Type:</span> {modalData.eventType}</p>
                <p className="mb-1 text-slate-700 text-sm sm:text-base"><span className="font-semibold">Date:</span> {modalData.date}</p>
                <p className="mb-1 text-slate-700 text-sm sm:text-base"><span className="font-semibold">Location:</span> {modalData.location}</p>
                {/* Add more event details/actions here */}
              </div>
            )}
            {modalType === 'registration' && modalData && (
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2 text-slate-800">{modalData.name}</h2>
                <p className="mb-1 text-slate-700 text-sm sm:text-base"><span className="font-semibold">Status:</span> {modalData.status}</p>
                <div className="flex gap-2 mt-3 sm:mt-4">
                  {modalData.status !== 'accepted' && (
                    <button
                      onClick={() => { handleAccept(modalData.name); closeModal(); }}
                      className="p-2 rounded-full bg-green-100 hover:bg-green-200 text-green-700 shadow transition"
                      aria-label="Accept registration"
                      title="Accept"
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={() => { handleRemove(modalData.name); closeModal(); }}
                    className="p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-700 shadow transition"
                    aria-label="Remove registration"
                    title="Remove"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
