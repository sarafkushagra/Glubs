"use client"

import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import axios from "axios"
import { toast } from "react-toastify"
import { Users, Calendar, Globe, UserCheck, CheckCircle, X, Trash2, Mail, Clock, Activity, Bell, Settings, Home, Menu, ChevronRight, RefreshCw, AlertCircle, Loader, Search, Download, ChevronLeft, LayoutDashboard, Share2, Eye, MapPin, TrendingUp, Filter, MoreHorizontal, UserPlus, Star, Edit, IndianRupee } from 'lucide-react'
import { ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area, BarChart, Bar, Cell, PieChart, Pie, Legend } from 'recharts'
import { CgProfile } from "react-icons/cg"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"

const ClubAdminDashboard = () => {
  // State management
  const [activeTab, setActiveTab] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const navigate = useNavigate()

  // Data states
  const [dashboardData, setDashboardData] = useState({
    clubs: [],
    pendingRequests: [],
    recentEvents: [],
    stats: { totalClubs: 0, totalMembers: 0, pendingRequests: 0, totalEvents: 0 },
    trends: { registration: [], eventTypes: [] }
  })
  const [joinRequests, setJoinRequests] = useState([])
  const [clubMembers, setClubMembers] = useState({}) // Cache by clubId
  const [allMyMembers, setAllMyMembers] = useState([]) // Flat list for 'Users' view
  const [clubEvents, setClubEvents] = useState({}) // Cache by clubId
  const [allMyEvents, setAllMyEvents] = useState([]) // Flat list for 'Events' view

  // Analytics states
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [eventStats, setEventStats] = useState(null)
  const [participants, setParticipants] = useState([])
  const [paymentAnalytics, setPaymentAnalytics] = useState(null)

  // Loading states
  const [loading, setLoading] = useState({
    dashboard: false,
    requests: false,
    members: false,
    events: false,
    action: false,
  })

  // Error states
  const [errors, setErrors] = useState({
    dashboard: null,
    requests: null,
    members: null,
    events: null
  })

  const userss = JSON.parse(localStorage.getItem("glubsUser") || "null")

  // Check authentication
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("glubsUser") || "null")
    if (!userData || (userData.role !== "club-admin" && userData.role !== "admin")) {
      toast.error("Access denied. Club admin privileges required.")
      navigate("/")
      return
    }
  }, [navigate])

  // API Functions
  const apiRequest = async (endpoint, options = {}) => {
    try {
      const response = await axios({
        url: `${API_BASE_URL}${endpoint}`,
        withCredentials: true,
        ...options,
      })
      return response.data
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error)
      throw new Error(error.response?.data?.message || `Server error: ${error.message}`)
    }
  }

  // --- Fetch Data Functions ---

  const fetchDashboardData = async () => {
    setLoading((prev) => ({ ...prev, dashboard: true }))
    try {
      const data = await apiRequest("/club-admin/dashboard")
      setDashboardData(data)

      // Auto-populate events list from recentEvents initially
      if (data.recentEvents) {
        setAllMyEvents(data.recentEvents)
      }
    } catch (error) {
      setErrors((prev) => ({ ...prev, dashboard: error.message }))
      toast.error("Failed to load dashboard data")
    } finally {
      setLoading((prev) => ({ ...prev, dashboard: false }))
    }
  }

  const fetchJoinRequests = async (status = "pending") => {
    setLoading((prev) => ({ ...prev, requests: true }))
    try {
      const data = await apiRequest(`/club-admin/requests?status=${status}`)
      setJoinRequests(data.requests)
    } catch (error) {
      setErrors((prev) => ({ ...prev, requests: error.message }))
      toast.error("Failed to load join requests")
    } finally {
      setLoading((prev) => ({ ...prev, requests: false }))
    }
  }

  // Fetch all members across all managed clubs
  const fetchAllMembers = async () => {
    setLoading((prev) => ({ ...prev, members: true }))
    try {
      // We iterate through known clubs to fetch members. 
      // Ideally backend should provide a bulk endpoint, but we'll use per-club fetch for now.
      const clubs = dashboardData.clubs || [];
      let allMembers = [];
      for (const club of clubs) {
        const data = await apiRequest(`/club-admin/clubs/${club._id}/members`)
        // Add club info to member for display
        const membersWithClub = data.members.map(m => ({ ...m, clubName: data.club.name, clubId: club._id }))
        allMembers = [...allMembers, ...membersWithClub]
      }
      // Remove duplicates if a user is in multiple clubs (optional, but good for UX)
      const uniqueMembers = Array.from(new Map(allMembers.map(item => [item._id, item])).values());
      setAllMyMembers(uniqueMembers)
    } catch (error) {
      console.error("Fetch members error:", error)
      toast.error("Failed to load members")
    } finally {
      setLoading((prev) => ({ ...prev, members: false }))
    }
  }

  // Reload events specifically from clubs
  const fetchAllEvents = async () => {
    setLoading((prev) => ({ ...prev, events: true }))
    try {
      const clubs = dashboardData.clubs || []; // We need updated list of clubs first
      let allEvents = [];
      for (const club of clubs) {
        const events = await apiRequest(`/clubs/${club._id}/events`)
        // Add club info
        const eventsWithClub = events.map(e => ({ ...e, clubName: club.name }))
        allEvents = [...allEvents, ...eventsWithClub]
      }
      setAllMyEvents(allEvents)
    } catch (error) {
      console.error("Fetch events error:", error)
      toast.error("Failed to load events")
    } finally {
      setLoading((prev) => ({ ...prev, events: false }))
    }
  }

  const fetchEventStats = async (eventId) => {
    setLoading((prev) => ({ ...prev, dashboard: true }))
    try {
      const statsData = await apiRequest(`/club-admin/events/${eventId}/stats`)
      const participantsData = await apiRequest(`/club-admin/events/${eventId}/participants`)
      setEventStats(statsData)
      setParticipants(participantsData.participants)
      setSelectedEvent(eventId)
      setActiveTab("analytics")
    } catch (error) {
      toast.error("Failed to load event statistics")
    } finally {
      setLoading((prev) => ({ ...prev, dashboard: false }))
    }
  }

  const fetchPaymentAnalytics = async () => {
    try {
      setLoading(prev => ({ ...prev, action: true }))
      const response = await axios.get(`${API_BASE_URL}/api/payments/analytics`, {
        withCredentials: true
      })
      if (response.data.status === "success") {
        setPaymentAnalytics(response.data.data)
      }
    } catch (error) {
      console.error("Error fetching payment analytics:", error)
      toast.error("Failed to load payment data")
    } finally {
      setLoading(prev => ({ ...prev, action: false }))
    }
  }

  useEffect(() => {
    if (activeTab === "payments" && !paymentAnalytics) {
      fetchPaymentAnalytics()
    }
  }, [activeTab])

  // --- Action Functions ---

  const handleJoinRequest = async (requestId, action, rejectionReason = "") => {
    setLoading((prev) => ({ ...prev, action: true }))
    try {
      await apiRequest(`/club-admin/requests/${requestId}`, {
        method: "PATCH",
        data: { action, rejectionReason },
      })
      toast.success(`Request ${action}ed successfully!`)
      await Promise.all([fetchJoinRequests(), fetchDashboardData()])
    } catch (error) {
      toast.error(`Failed to ${action} request`)
    } finally {
      setLoading((prev) => ({ ...prev, action: false }))
    }
  }

  const removeMember = async (clubId, memberId) => {
    if (!confirm("Are you sure you want to remove this member?")) return
    setLoading((prev) => ({ ...prev, action: true }))
    try {
      await apiRequest(`/club-admin/clubs/${clubId}/members/${memberId}`, { method: "DELETE" })
      toast.success("Member removed successfully!")
      setAllMyMembers(prev => prev.filter(m => m._id !== memberId))
      fetchDashboardData()
    } catch (error) {
      toast.error("Failed to remove member")
    } finally {
      setLoading((prev) => ({ ...prev, action: false }))
    }
  }

  const exportToCSV = (eventId) => {
    const event = allMyEvents.find(e => e._id === eventId) || { title: "Event" }
    const headers = ["Username", "Email", "Gender", "College", "Phone", "Year", "Department", "Interests", "Payment Status"]
    const rows = participants.map(p => [
      `"${p.username}"`,
      `"${p.email}"`,
      `"${p.gender || "N/A"}"`,
      `"${p.college || "N/A"}"`,
      `"${p.phone || "N/A"}"`,
      `"${p.yearOfStudy || "N/A"}"`,
      `"${p.department || "N/A"}"`,
      `"${(p.interests || []).join(", ")}"`,
      `"${p.paymentStatus || "N/A"}"`
    ])
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${event.title}_Participants.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Initial load
  useEffect(() => {
    fetchDashboardData()
    fetchJoinRequests()
  }, [])

  // Auto-refresh requests
  useEffect(() => {
    let interval
    if (activeTab === "requests") {
      interval = setInterval(() => fetchJoinRequests(), 30000)
    }
    return () => clearInterval(interval)
  }, [activeTab])

  // --- Components from AdminDashboard ---

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center p-8">
      <Loader className="w-8 h-8 animate-spin text-blue-600" />
      <span className="ml-2 text-gray-600">Loading...</span>
    </div>
  )

  const StatCard = ({ title, value, icon: Icon, color = "blue", loading = false, onClick }) => (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-200 ${onClick ? "cursor-pointer" : ""}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          {loading ? (
            <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
          ) : (
            <p className="text-3xl font-bold text-gray-900">{value}</p>
          )}
        </div>
        <div className={`p-4 rounded-xl bg-gradient-to-br from-${color}-400 to-${color}-600 shadow-lg`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>
    </div>
  )

  // --- Render Functions ---

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Club Overview</h1>
          <p className="text-gray-600">Welcome back, {userss?.username}</p>
        </div>
        <button
          onClick={fetchDashboardData}
          disabled={loading.dashboard}
          className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading.dashboard ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="My Clubs"
          value={dashboardData.stats.totalClubs}
          icon={Globe}
          color="blue"
          loading={loading.dashboard}
        />
        <StatCard
          title="Total Members"
          value={dashboardData.stats.totalMembers}
          icon={Users}
          color="green"
          loading={loading.dashboard}
          onClick={() => { setActiveTab("members"); fetchAllMembers(); }}
        />
        <StatCard
          title="Pending Requests"
          value={dashboardData.stats.pendingRequests}
          icon={UserCheck}
          color="orange"
          loading={loading.dashboard}
          onClick={() => setActiveTab("requests")}
        />
        <StatCard
          title="Events Managed"
          value={dashboardData.stats.totalEvents}
          icon={Calendar}
          color="purple"
          loading={loading.dashboard}
          onClick={() => { setActiveTab("events"); fetchAllEvents(); }}
        />
      </div>

      {/* Quick Actions for Pending Requests */}
      {dashboardData.stats.pendingRequests > 0 && (
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-orange-900 mb-1">
                Action Required
              </h3>
              <p className="text-orange-700">You have {dashboardData.stats.pendingRequests} pending membership requests.</p>
            </div>
            <button
              onClick={() => setActiveTab("requests")}
              className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors shadow-lg"
            >
              Review Now
            </button>
          </div>
        </div>
      )}

      {/* Analytics Charts */}
      {dashboardData.trends && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Registration Trend */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity Trend</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dashboardData.trends.registration || []}>
                  <defs>
                    <linearGradient id="colorReg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip contentStyle={{ border: 'none', borderRadius: '8px' }} />
                  <Area type="monotone" dataKey="registrations" stroke="#3B82F6" fillOpacity={1} fill="url(#colorReg)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Event Types */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Event Distribution</h3>
            {dashboardData.trends.eventTypes && dashboardData.trends.eventTypes.length > 0 ? (
              <div className="flex items-center justify-center h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dashboardData.trends.eventTypes}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {dashboardData.trends.eventTypes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex items-center justify-center h-80 text-gray-400">
                <p>No event data available</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )

  const renderRequests = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Membership Requests</h1>
        <div className="flex gap-2">
          <button
            onClick={() => fetchJoinRequests()}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading.requests ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading.requests ? (
          <LoadingSpinner />
        ) : joinRequests.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <UserCheck className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No pending requests at the moment.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {joinRequests.map(request => (
              <div key={request._id} className="p-6 hover:bg-gray-50 transition flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">
                    {request.user?.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{request.user?.username}</h4>
                    <p className="text-sm text-gray-500">Requesting to join <span className="font-medium text-gray-700">{request.club?.name}</span></p>
                    <div className="flex gap-4 mt-1 text-xs text-gray-500">
                      <span>{request.user?.department}</span>
                      <span>•</span>
                      <span>{request.user?.yearOfStudy}</span>
                    </div>
                    {request.message && <p className="mt-2 text-sm italic text-gray-600">"{request.message}"</p>}
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleJoinRequest(request._id, 'accept')}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" /> Accept
                  </button>
                  <button
                    onClick={() => handleJoinRequest(request._id, 'reject')}
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition flex items-center gap-2"
                  >
                    <X className="w-4 h-4" /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )

  const renderMembers = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Club Members</h1>
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search members..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-200 bg-gray-50 text-sm font-semibold text-gray-600">
          <div className="col-span-4">Member</div>
          <div className="col-span-3">Club</div>
          <div className="col-span-3">Contact</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {loading.members ? (
          <LoadingSpinner />
        ) : (
          <div className="divide-y divide-gray-200">
            {allMyMembers
              .filter(m => m.username.toLowerCase().includes(searchQuery.toLowerCase()))
              .map(member => (
                <div key={`${member._id}-${member.clubId}`} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50">
                  <div className="col-span-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold">
                      {member.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{member.username}</p>
                      <p className="text-xs text-gray-500">{member.yearOfStudy} • {member.department}</p>
                    </div>
                  </div>
                  <div className="col-span-3">
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium">
                      {member.clubName}
                    </span>
                  </div>
                  <div className="col-span-3 text-sm text-gray-600">
                    <p>{member.email}</p>
                  </div>
                  <div className="col-span-2 flex justify-end">
                    <button
                      onClick={() => removeMember(member.clubId, member._id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition"
                      title="Remove from Club"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  )

  const renderEvents = () => (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Event Management</h1>
          <p className="text-gray-600 mt-1">Create and manage your club's events</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            />
          </div>
          <button
            onClick={() => fetchAllEvents()}
            disabled={loading.events}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading.events ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {errors.events && <div className="text-red-500 p-4 bg-red-50 rounded-lg">{errors.events}</div>}

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">All Events ({allMyEvents.length})</h3>
        </div>

        {loading.events ? (
          <LoadingSpinner />
        ) : allMyEvents.length === 0 ? (
          <div className="p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-600">No events found</p>
            <p className="text-sm text-gray-500">Events you create will appear here</p>
          </div>
        ) : (
          <div className="grid gap-6 p-6">
            {allMyEvents
              .filter(
                (event) =>
                  event.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  event.eventType?.toLowerCase().includes(searchQuery.toLowerCase()),
              )
              .map((event) => (
                <div
                  key={event._id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200 hover:border-blue-300"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full ${event.eventType === "Workshop"
                            ? "bg-blue-100 text-blue-800"
                            : event.eventType === "Seminar"
                              ? "bg-green-100 text-green-800"
                              : event.eventType === "Hackathon"
                                ? "bg-purple-100 text-purple-800"
                                : event.eventType === "Webinar"
                                  ? "bg-orange-100 text-orange-800"
                                  : "bg-gray-100 text-gray-800"
                            }`}
                        >
                          {event.eventType || "Event"}
                        </span>
                        <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-blue-500" />
                          <span>{new Date(event.date || event.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-green-500" />
                          <span>{event.venue || "TBD"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-purple-500" />
                          <span>{event.registeredUsers?.length || 0} registered</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => fetchEventStats(event._id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1 font-semibold"
                        title="View Analytics"
                      >
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-xs">Analytics</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  )

  const renderPayments = () => {
    if (!paymentAnalytics) return (
      <div className="flex items-center justify-center p-12">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )

    return (
      <div className="space-y-6 animate-fadeIn">
        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-all">
            <div>
              <p className="text-gray-500 font-medium mb-1">Total Revenue</p>
              <h3 className="text-3xl font-bold text-gray-900 flex items-center">
                <IndianRupee className="w-6 h-6 mr-1" />
                {paymentAnalytics.totalRevenue?.toLocaleString() || 0}
              </h3>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
              <IndianRupee className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-all">
            <div>
              <p className="text-gray-500 font-medium mb-1">Total Transactions</p>
              <h3 className="text-3xl font-bold text-gray-900">{paymentAnalytics.totalTransactions || 0}</h3>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
              <Activity className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Event-wise Breakdown */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-900">Event-wise Revenue</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Event Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Transactions</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Revenue</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Contribution</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paymentAnalytics.eventAnalytics.map((event) => (
                  <tr key={event.eventId} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{event.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{event.count}</td>
                    <td className="px-6 py-4 text-sm font-bold text-green-600 text-right">₹{event.revenue.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${(event.revenue / (paymentAnalytics.totalRevenue || 1)) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 w-8">{Math.round((event.revenue / (paymentAnalytics.totalRevenue || 1)) * 100)}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
                {paymentAnalytics.eventAnalytics.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">No payment data available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detailed Transactions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-900">Recent Transactions</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">User</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Event</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paymentAnalytics.recentTransactions.map((txn) => (
                  <tr key={txn._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold">
                          {txn.user?.username?.charAt(0) || "U"}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900">{txn.user?.username || "Unknown"}</span>
                          <span className="text-xs text-gray-500">{txn.user?.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{txn.event?.title || "Unknown Event"}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(txn.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">₹{txn.amount.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${txn.status === "captured" ? "bg-green-100 text-green-800" :
                        txn.status === "failed" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"
                        }`}>
                        {txn.status.charAt(0).toUpperCase() + txn.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
                {paymentAnalytics.recentTransactions.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No recent transactions found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  const renderEventAnalytics = () => {
    if (!eventStats) return <LoadingSpinner />

    const event = allMyEvents.find((e) => e._id === selectedEvent) ||
      dashboardData.recentEvents.find(e => e._id === selectedEvent) ||
      { title: "Event Analytics" }

    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        {/* Analytics Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setSelectedEvent(null)
                setActiveTab("events")
              }}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
              <p className="text-gray-600">Real-time participation and demographic insights</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => exportToCSV(selectedEvent)}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <Download className="w-4 h-4" />
              Download CSV
            </button>
            <button
              onClick={() => fetchEventStats(selectedEvent)}
              className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
              title="Refresh Data"
            >
              <RefreshCw className={`w-5 h-5 text-gray-600 ${loading.dashboard ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Analytics Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-blue-900 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-transform">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-800/50 rounded-xl">
                <Users className="w-6 h-6" />
              </div>
              <span className="font-medium opacity-90">Complete Registrations</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold">{eventStats.stats.completeRegistrations}</span>
            </div>
            <p className="mt-4 text-sm opacity-75">Total Registrations: {eventStats.stats.totalRegistrations}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transform hover:scale-105 transition-transform">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
              <span className="font-medium text-gray-600">Total Views</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-gray-900">{eventStats.stats.views}</span>
              <span className="text-green-500 text-sm font-medium">+16</span>
            </div>
            <div className="w-full bg-gray-100 h-1.5 rounded-full mt-6">
              <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: "70%" }}></div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-4 mb-2">
              <span className="font-semibold text-gray-800 text-lg">Registration Overview</span>
            </div>
            <div className="flex items-center gap-8 mt-4">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {eventStats.stats.totalRegistrations}{" "}
                  <span className="text-green-500 text-sm">{eventStats.stats.totalRegistrations > 0 ? "+2" : ""}</span>
                </p>
                <p className="text-xs text-gray-500 uppercase font-medium">Total Registrations</p>
              </div>
              <div className="w-px h-10 bg-gray-200"></div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{eventStats.stats.incompleteRegistrations || 0}</p>
                <p className="text-xs text-gray-500 uppercase font-medium">Incomplete</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Registration Trend Chart */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold text-gray-900">Registration Trend</h3>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={eventStats.trend}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1e3a8a" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#1e3a8a" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="#1e3a8a"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorTotal)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Demographic Breakdown */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold text-gray-900">Year of Study Distribution</h3>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={Object.entries(eventStats.demographics.yearStats || {}).map(([year, count]) => ({ year, count }))}
                >
                  <XAxis dataKey="year" axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip cursor={{ fill: "#f8fafc" }} />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]} barSize={40}>
                    {Object.keys(eventStats.demographics.yearStats || {}).map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={["#6366f1", "#8b5cf6", "#ec4899", "#f97316", "#10b981"][index % 5]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Detailed Participants List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">Registered Participants</h3>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                {participants.length} total
              </span>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {participants.map((p) => (
              <div
                key={p._id}
                className="border border-gray-100 rounded-2xl p-6 hover:shadow-lg transition-shadow bg-white relative overflow-hidden group"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex gap-6">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                      {p.avatar ? (
                        <img src={p.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        (p.username || "?").charAt(0).toUpperCase()
                      )}
                    </div>
                    {p.paymentStatus === "Complete" ? (
                      <div
                        className="absolute -bottom-1 -right-1 bg-green-500 border-4 border-white rounded-full p-1"
                        title="Verified Member"
                      >
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    ) : (
                      <div
                        className="absolute -bottom-1 -right-1 bg-orange-500 border-4 border-white rounded-full p-1"
                        title="Pending Payment"
                      >
                        <Clock className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded">
                          Student
                        </span>
                      </div>
                      <h4 className="text-2xl font-bold text-gray-900 mt-1 flex items-center gap-2">
                        {p.username}
                        {p.isVerified && (
                          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </h4>
                    </div>

                    <div className="space-y-2 text-gray-600">
                      <div className="flex items-center gap-3">
                        <Home className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium">{p.college || "Global Institute of Tech"}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Activity className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium">{p.phone || "+91 999 000 0000"}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium">{p.email}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium">{p.location || "Delhi, India"}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-full">
                        {p.yearOfStudy}
                      </span>
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-full">
                        {p.department || "Engineering"}
                      </span>
                      {p.gender && (
                        <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full">
                          {p.gender}
                        </span>
                      )}
                    </div>

                    <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                      <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors">
                        <Mail className="w-4 h-4" /> Message
                      </button>
                      <span className="text-xs text-gray-400 font-medium font-sans italic">
                        Registered on: {new Date(p.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // --- Main Render (Sidebar + Content) ---

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? "w-72" : "w-20"} bg-white h-full shadow-xl transition-all duration-300 ease-in-out relative flex flex-col z-20`}
      >
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-10 bg-white border border-gray-200 p-1.5 rounded-full shadow-md text-gray-500 hover:text-blue-600 transition-colors z-50 transform hover:scale-110"
        >
          {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>

        {/* Logo Area */}
        <div className="h-20 flex items-center justify-center border-b border-gray-100 bg-white">
          {sidebarOpen ? (
            <div className="flex items-center gap-3">
              <Link to="/">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                <LayoutDashboard className="text-white w-6 h-6" />
              </div>
              </Link>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  ClubAdmin
                </span>
              </div>
            </div>
          ) : (
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <span className="text-xl font-bold text-white">C</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto custom-scrollbar">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group relative overflow-hidden ${activeTab === "dashboard"
              ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
              : "text-gray-500 hover:bg-blue-50 hover:text-blue-600"
              }`}
          >
            <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="font-medium whitespace-nowrap">Dashboard</span>}
            {activeTab === "dashboard" && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white/20 rounded-l-full" />}
          </button>

          <button
            onClick={() => setActiveTab("events")}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group relative overflow-hidden ${activeTab === "events"
              ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
              : "text-gray-500 hover:bg-blue-50 hover:text-blue-600"
              }`}
          >
            <Calendar className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="font-medium whitespace-nowrap">Events</span>}
          </button>

          <button
            onClick={() => setActiveTab("members")}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group relative overflow-hidden ${activeTab === "members"
              ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
              : "text-gray-500 hover:bg-blue-50 hover:text-blue-600"
              }`}
          >
            <Users className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="font-medium whitespace-nowrap">Members</span>}
          </button>

          <button
            onClick={() => setActiveTab("requests")}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group relative overflow-hidden ${activeTab === "requests"
              ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
              : "text-gray-500 hover:bg-blue-50 hover:text-blue-600"
              }`}
          >
            <div className="relative">
              <UserCheck className="w-5 h-5 flex-shrink-0" />
              {dashboardData.stats.pendingRequests > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
              )}
            </div>
            {sidebarOpen && (
              <div className="flex items-center justify-between w-full">
                <span className="font-medium whitespace-nowrap">Requests</span>
                {dashboardData.stats.pendingRequests > 0 && (
                  <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">
                    {dashboardData.stats.pendingRequests}
                  </span>
                )}
              </div>
            )}
          </button>

          <button
            onClick={() => setActiveTab("payments")}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group relative overflow-hidden ${activeTab === "payments"
              ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
              : "text-gray-500 hover:bg-blue-50 hover:text-blue-600"
              }`}
          >
            <IndianRupee className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="font-medium whitespace-nowrap">Payments</span>}
          </button>

          <button
            onClick={() => setActiveTab("analytics")}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group relative overflow-hidden ${activeTab === "analytics"
              ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
              : "text-gray-500 hover:bg-blue-50 hover:text-blue-600"
              }`}
          >
            <TrendingUp className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="font-medium whitespace-nowrap">Analytics</span>}
          </button>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <div className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${sidebarOpen ? 'bg-white shadow-sm border border-gray-100' : 'justify-center'}`}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
              {userss?.username?.charAt(0).toUpperCase()}
            </div>

            {sidebarOpen && (
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold text-gray-900 truncate">{userss?.username}</p>
                <p className="text-xs text-gray-500 truncate">{userss?.email}</p>
              </div>
            )}

            {sidebarOpen && (
              <button
                onClick={() => navigate("/")}
                className="p-1.5 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                title="Logout"
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white shadow-sm border-b border-gray-100 flex items-center justify-between px-8 z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Welcome back, {userss?.username}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search anything..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all w-64"
              />
            </div>

            <button className="p-2.5 rounded-xl bg-gray-50 text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* Content Render */}
        <main className="flex-1 overflow-y-auto p-8 bg-gray-50/50">
          <div className="max-w-7xl mx-auto space-y-8 animate-fadeIn">
            {activeTab === "dashboard" && renderDashboard()}
            {activeTab === "requests" && renderRequests()}
            {activeTab === "members" && renderMembers()}
            {activeTab === "events" && renderEvents()}
            {activeTab === "analytics" && renderEventAnalytics()}
            {activeTab === "payments" && renderPayments()}
          </div>
        </main>
      </div>
    </div>
  )
}

export default ClubAdminDashboard
