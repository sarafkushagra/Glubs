
import { useState, useEffect } from "react"
import { ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, AreaChart, Area } from "recharts";

import { CgProfile } from "react-icons/cg";
import {
  Users,
  BarChart2,
  CheckCircle,
  Calendar,
  Search,
  Filter,
  Download,
  Edit,
  Trash2,
  Eye,
  UserCheck,
  TrendingUp,
  TrendingDown,
  Activity,
  Globe,
  Settings,
  Bell,
  Menu,
  X,
  ChevronRight,
  MoreHorizontal,
  RefreshCw,
  AlertCircle,
  Loader,
  Plus,
  Star,
  Clock,
  MapPin,
  Mail,
  Shield,
  UserPlus,
  Home,
} from "lucide-react"
import { Link } from "react-router-dom";

// If you deploy the backend elsewhere (e.g. Render, Railway) set NEXT_PUBLIC_API_BASE_URL.
const API_BASE_URL = import.meta.env.API_BASE_URL || "http://localhost:3000";

const ClubAdminDashboard = () => {
  // State management
  const [activeTab, setActiveTab] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTimeRange, setSelectedTimeRange] = useState("7d")

  // Data states
  const [users, setUsers] = useState([])
  const [events, setEvents] = useState([])
  const [clubs, setClubs] = useState([])
  const [pendingRequests, setPendingRequests] = useState([])

  // Loading states
  const [loading, setLoading] = useState({
    users: false,
    events: false,
    clubs: false,
    requests: false,
    action: false,
  })

  // Error states
  const [errors, setErrors] = useState({
    users: null,
    events: null,
    clubs: null,
    requests: null,
    action: null,
  })

  // Form states for editing
  const [editingUser, setEditingUser] = useState(null)
  const [editingEvent, setEditingEvent] = useState(null)
  const [editingClub, setEditingClub] = useState(null)
  const [showCreateForm, setShowCreateForm] = useState({ user: false, event: false, club: false })

  // API Functions
  const apiRequest = async (endpoint, options = {}) => {
    try {
      const url = API_BASE_URL ? `${API_BASE_URL}${endpoint}` : endpoint // endpoint is already relative (e.g. "/users")
      const response = await fetch(url, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error.message)
      throw new Error(`Server unreachable: ${error.message}`)
    }
  }

  // Fetch functions
  const fetchUsers = async () => {
    setLoading((prev) => ({ ...prev, users: true }))
    setErrors((prev) => ({ ...prev, users: null }))
    try {
      const data = await apiRequest("/users")
      setUsers(Array.isArray(data) ? data : [])
    } catch (error) {
      setErrors((prev) => ({ ...prev, users: error.message }))
      setUsers([])
    } finally {
      setLoading((prev) => ({ ...prev, users: false }))
    }
  }

  const fetchEvents = async () => {
    setLoading((prev) => ({ ...prev, events: true }))
    setErrors((prev) => ({ ...prev, events: null }))
    try {
      const data = await apiRequest("/event")
      setEvents(Array.isArray(data) ? data : [])
    } catch (error) {
      setErrors((prev) => ({ ...prev, events: error.message }))
      setEvents([])
    } finally {
      setLoading((prev) => ({ ...prev, events: false }))
    }
  }

  const fetchClubs = async () => {
    setLoading((prev) => ({ ...prev, clubs: true }))
    setErrors((prev) => ({ ...prev, clubs: null }))
    try {
      const data = await apiRequest("/clubs")
      setClubs(Array.isArray(data) ? data : [])
    } catch (error) {
      setErrors((prev) => ({ ...prev, clubs: error.message }))
      setClubs([])
    } finally {
      setLoading((prev) => ({ ...prev, clubs: false }))
    }
  }
const fetchPendingRequests = async () => {
  setLoading((prev) => ({ ...prev, requests: true }));
  setErrors((prev) => ({ ...prev, requests: null }));
  try {
    const data = await apiRequest("/admin/club-admin-requests");
   setPendingRequests(Array.isArray(data.users) ? data.users : []);
   console.log(data);
  } catch (error) {
    setErrors((prev) => ({ ...prev, requests: error.message }));
    setPendingRequests([]);
  } finally {
    setLoading((prev) => ({ ...prev, requests: false }));
  }
};

  // Action functions
  const approveClubAdmin = async (requestId) => {
    setLoading((prev) => ({ ...prev, action: true }))
    setErrors((prev) => ({ ...prev, action: null }))
    console.log(requestId);
    try {
      await apiRequest(`/admin/approve-club-admin/${requestId}`, { method: "POST" })
      setPendingRequests((prev) => prev.filter((req) => req._id !== requestId))
      alert("Request approved successfully!")
    } catch (error) {
      setErrors((prev) => ({ ...prev, action: error.message }))
      alert("Failed to approve request: " + error.message)
    } finally {
      setLoading((prev) => ({ ...prev, action: false }))
    }
  }

  const rejectClubAdmin = async (requestId) => {
    setLoading((prev) => ({ ...prev, action: true }))
    setErrors((prev) => ({ ...prev, action: null }))
    try {
      // Assuming you have a reject endpoint
      await apiRequest(`/admin/reject-club-admin/${requestId}`, { method: "POST" })
      setPendingRequests((prev) => prev.filter((req) => req._id !== requestId))
      alert("Request rejected successfully!")
    } catch (error) {
      // If no reject endpoint, just remove from local state
      setPendingRequests((prev) => prev.filter((req) => req._id !== requestId))
      alert("Request rejected!")
    } finally {
      setLoading((prev) => ({ ...prev, action: false }))
    }
  }

  const deleteUser = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) return
    setLoading((prev) => ({ ...prev, action: true }))
    try {
      await apiRequest(`/users/${userId}`, { method: "DELETE" })
      setUsers((prev) => prev.filter((user) => user._id !== userId))
      alert("User deleted successfully!")
    } catch (error) {
      alert("Failed to delete user: " + error.message)
    } finally {
      setLoading((prev) => ({ ...prev, action: false }))
    }
  }

  const updateUser = async (userId, userData) => {
    setLoading((prev) => ({ ...prev, action: true }))
    try {
      const updatedUser = await apiRequest(`/users/${userId}`, {
        method: "PUT",
        body: JSON.stringify(userData),
      })
      setUsers((prev) => prev.map((user) => (user._id === userId ? updatedUser : user)))
      setEditingUser(null)
      alert("User updated successfully!")
    } catch (error) {
      alert("Failed to update user: " + error.message)
    } finally {
      setLoading((prev) => ({ ...prev, action: false }))
    }
  }

  const createUser = async (userData) => {
    setLoading((prev) => ({ ...prev, action: true }))
    try {
      const newUser = await apiRequest("/users", {
        method: "POST",
        body: JSON.stringify(userData),
      })
      setUsers((prev) => [...prev, newUser])
      setShowCreateForm((prev) => ({ ...prev, user: false }))
      alert("User created successfully!")
    } catch (error) {
      alert("Failed to create user: " + error.message)
    } finally {
      setLoading((prev) => ({ ...prev, action: false }))
    }
  }

  const deleteEvent = async (eventId) => {
    if (!confirm("Are you sure you want to delete this event?")) return
    setLoading((prev) => ({ ...prev, action: true }))
    try {
      await apiRequest(`/event/${eventId}`, { method: "DELETE" })
      setEvents((prev) => prev.filter((event) => event._id !== eventId))
      alert("Event deleted successfully!")
    } catch (error) {
      alert("Failed to delete event: " + error.message)
    } finally {
      setLoading((prev) => ({ ...prev, action: false }))
    }
  }

  const updateEvent = async (eventId, eventData) => {
    setLoading((prev) => ({ ...prev, action: true }))
    try {
      const updatedEvent = await apiRequest(`/event/${eventId}`, {
        method: "PUT",
        body: JSON.stringify(eventData),
      })
      setEvents((prev) => prev.map((event) => (event._id === eventId ? updatedEvent : event)))
      setEditingEvent(null)
      alert("Event updated successfully!")
    } catch (error) {
      alert("Failed to update event: " + error.message)
    } finally {
      setLoading((prev) => ({ ...prev, action: false }))
    }
  }

  const createEvent = async (eventData) => {
    setLoading((prev) => ({ ...prev, action: true }))
    try {
      const newEvent = await apiRequest("/event", {
        method: "POST",
        body: JSON.stringify(eventData),
      })
      setEvents((prev) => [...prev, newEvent])
      setShowCreateForm((prev) => ({ ...prev, event: false }))
      alert("Event created successfully!")
    } catch (error) {
      alert("Failed to create event: " + error.message)
    } finally {
      setLoading((prev) => ({ ...prev, action: false }))
    }
  }

  const deleteClub = async (clubId) => {
    if (!confirm("Are you sure you want to delete this club?")) return
    setLoading((prev) => ({ ...prev, action: true }))
    try {
      await apiRequest(`/clubs/${clubId}`, { method: "DELETE" })
      setClubs((prev) => prev.filter((club) => club._id !== clubId))
      alert("Club deleted successfully!")
    } catch (error) {
      alert("Failed to delete club: " + error.message)
    } finally {
      setLoading((prev) => ({ ...prev, action: false }))
    }
  }

  const updateClub = async (clubId, clubData) => {
    setLoading((prev) => ({ ...prev, action: true }))
    try {
      const updatedClub = await apiRequest(`/clubs/${clubId}`, {
        method: "PUT",
        body: JSON.stringify(clubData),
      })
      setClubs((prev) => prev.map((club) => (club._id === clubId ? updatedClub : club)))
      setEditingClub(null)
      alert("Club updated successfully!")
    } catch (error) {
      alert("Failed to update club: " + error.message)
    } finally {
      setLoading((prev) => ({ ...prev, action: false }))
    }
  }

  const createClub = async (clubData) => {
    setLoading((prev) => ({ ...prev, action: true }))
    try {
      const newClub = await apiRequest("/clubs", {
        method: "POST",
        body: JSON.stringify(clubData),
      })
      setClubs((prev) => [...prev, newClub])
      setShowCreateForm((prev) => ({ ...prev, club: false }))
      alert("Club created successfully!")
    } catch (error) {
      alert("Failed to create club: " + error.message)
    } finally {
      setLoading((prev) => ({ ...prev, action: false }))
    }
  }

  const exportData = (type) => {
    let data = []
    let filename = ""

    switch (type) {
      case "users":
        data = users
        filename = "users.json"
        break
      case "events":
        data = events
        filename = "events.json"
        break
      case "clubs":
        data = clubs
        filename = "clubs.json"
        break
      default:
        return
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Data processing functions
  const processStats = () => {
    const totalUsers = users.length
    const activeUsers = users.filter((user) => user.isActive !== false).length
    const totalEvents = events.length
    const upcomingEvents = events.filter((event) => new Date(event.date || event.eventDate) > new Date()).length
    const totalClubs = clubs.length
    const activeClubs = clubs.filter((club) => club.isActive !== false).length

    // Calculate attendance rate
    const eventsWithAttendance = events.filter((event) => event.registeredUsers && event.attendedUsers)
    const totalRegistered = eventsWithAttendance.reduce((sum, event) => sum + (event.registeredUsers?.length || 0), 0)
    const totalAttended = eventsWithAttendance.reduce((sum, event) => sum + (event.attendedUsers?.length || 0), 0)
    const attendanceRate = totalRegistered > 0 ? Math.round((totalAttended / totalRegistered) * 100) : 0

    return {
      totalUsers,
      activeUsers,
      totalEvents,
      upcomingEvents,
      totalClubs,
      activeClubs,
      attendanceRate,
    }
  }

  const processRegistrationTrend = () => {
    const last7Days = []
    const now = new Date()

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      const dayName = date.toLocaleDateString("en-US", { weekday: "short" })

      const dayRegistrations = users.filter((user) => {
        const userDate = new Date(user.createdAt || user.registrationDate)
        return userDate.toDateString() === date.toDateString()
      }).length

      const dayEvents = events.filter((event) => {
        const eventDate = new Date(event.createdAt || event.date)
        return eventDate.toDateString() === date.toDateString()
      }).length

      last7Days.push({
        date: dayName,
        registrations: dayRegistrations,
        events: dayEvents,
      })
    }

    return last7Days
  }

  const processEventTypes = () => {
    const typeCount = {}
    const colors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4"]

    events.forEach((event) => {
      const type = event.eventType || event.type || "Other"
      typeCount[type] = (typeCount[type] || 0) + 1
    })

    const totalEvents = events.length
    return Object.entries(typeCount).map(([name, count], index) => ({
      name,
      value: totalEvents > 0 ? Math.round((count / totalEvents) * 100) : 0,
      count,
      color: colors[index % colors.length],
    }))
  }

  const processRecentActivity = () => {
    const activities = []

    // Recent user registrations
    users
      .sort((a, b) => new Date(b.createdAt || b.registrationDate) - new Date(a.createdAt || a.registrationDate))
      .slice(0, 3)
      .forEach((user) => {
        activities.push({
          id: `user-${user._id}`,
          type: "registration",
          user: user.name || user.username,
          event: "Platform",
          time: getTimeAgo(user.createdAt || user.registrationDate),
        })
      })

    // Recent events
    events
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 2)
      .forEach((event) => {
        activities.push({
          id: `event-${event._id}`,
          type: "event_created",
          user: event.createdBy || "Admin",
          event: event.name || event.title,
          time: getTimeAgo(event.createdAt),
        })
      })

    return activities.slice(0, 5)
  }

  const getTimeAgo = (dateString) => {
    if (!dateString) return "Unknown time"
    const now = new Date()
    const date = new Date(dateString)
    const diffInMinutes = Math.floor((now - date) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours} hours ago`

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays} days ago`

    return date.toLocaleDateString()
  }

  // Initial data fetch
  useEffect(() => {
    fetchUsers()
    fetchEvents()
    fetchClubs()
    fetchPendingRequests()
  }, [])

  // Computed values
  const stats = processStats()
  const registrationTrend = processRegistrationTrend()
  const eventTypes = processEventTypes()
  const recentActivity = processRecentActivity()

  // Components
  const LoadingSpinner = () => (
    <div className="flex items-center justify-center p-8">
      <Loader className="w-8 h-8 animate-spin text-blue-600" />
      <span className="ml-2 text-gray-600">Loading...</span>
    </div>
  )

  const ErrorMessage = ({ message, onRetry }) => (
    <div className="flex items-center justify-center p-8 bg-red-50 rounded-lg border border-red-200">
      <AlertCircle className="w-6 h-6 text-red-600 mr-2" />
      <span className="text-red-700 mr-4">{message}</span>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      )}
    </div>
  )

  const StatCard = ({ title, value, change, icon: Icon, color = "blue", loading = false }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          {loading ? (
            <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
          ) : (
            <p className="text-3xl font-bold text-gray-900">{value}</p>
          )}
          {change && !loading && (
            <div className="flex items-center mt-2">
              {change > 0 ? (
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm font-medium ${change > 0 ? "text-green-600" : "text-red-600"}`}>
                {Math.abs(change)}%
              </span>
            </div>
          )}
        </div>
        <div className={`p-4 rounded-xl bg-gradient-to-br from-${color}-400 to-${color}-600 shadow-lg`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>
    </div>
  )

  // Form Components
  const UserForm = ({ user, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
      name: user?.username || "",
      email: user?.email || "",
      role: user?.role || "student",
      isActive: user?.isActive !== false,
    })
    const handleSubmit = (e) => {
      e.preventDefault()
      onSave(formData)
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 className="text-lg font-semibold mb-4">{user ? "Edit User" : "Create User"}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="student">Student</option>
                <option value="club_admin">Club Admin</option>
                <option value="host">Host</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                Active
              </label>
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading.action}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading.action ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  const EventForm = ({ event, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
      name: event?.title || "",
      eventType: event?.eventType || "Workshop",
      date: event?.date ? event.date.split("T")[0] : "",
      location: event?.venue || "",
      description: event?.description || "",
    })

    const handleSubmit = (e) => {
      e.preventDefault()
      onSave(formData)
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 className="text-lg font-semibold mb-4">{event ? "Edit Event" : "Create Event"}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={formData.eventType}
                onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="Workshop">Workshop</option>
                <option value="Seminar">Seminar</option>
                <option value="Hackathon">Hackathon</option>
                <option value="Webinar">Webinar</option>
                <option value="Bootcamp">Bootcamp</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading.action}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading.action ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  const ClubForm = ({ club, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
      name: club?.name || "",
      description: club?.description || "",
      isActive: club?.isActive !== false,
    })

    const handleSubmit = (e) => {
      e.preventDefault()
      onSave(formData)
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 className="text-lg font-semibold mb-4">{club ? "Edit Club" : "Create Club"}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows="3"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="clubActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="clubActive" className="text-sm font-medium text-gray-700">
                Active
              </label>
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading.action}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading.action ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  // Render functions
  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your platform.</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <button
            onClick={() => {
              fetchUsers()
              fetchEvents()
              fetchClubs()
              fetchPendingRequests()
            }}
            disabled={loading.users || loading.events || loading.clubs || loading.requests}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
          >
            <RefreshCw
              className={`w-4 h-4 ${loading.users || loading.events || loading.clubs || loading.requests ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>
      </div>

      {/* Error Messages */}
      {(errors.users || errors.events || errors.clubs || errors.requests) && (
        <div className="space-y-2">
          {errors.users && <ErrorMessage message={`Users API Error: ${errors.users}`} onRetry={fetchUsers} />}
          {errors.events && <ErrorMessage message={`Events API Error: ${errors.events}`} onRetry={fetchEvents} />}
          {errors.clubs && <ErrorMessage message={`Clubs API Error: ${errors.clubs}`} onRetry={fetchClubs} />}
          {errors.requests && (
            <ErrorMessage message={`Requests API Error: ${errors.requests}`} onRetry={fetchPendingRequests} />
          )}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          change={12}
          icon={Users}
          color="blue"
          loading={loading.users}
        />
        <StatCard
          title="Active Events"
          value={stats.upcomingEvents}
          change={8}
          icon={Calendar}
          color="green"
          loading={loading.events}
        />
        <StatCard
          title="Total Clubs"
          value={stats.totalClubs}
          change={-2}
          icon={Globe}
          color="purple"
          loading={loading.clubs}
        />
        <StatCard
          title="Attendance Rate"
          value={`${stats.attendanceRate}%`}
          change={5}
          icon={TrendingUp}
          color="orange"
          loading={loading.events}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Registration Trend */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Registration Trend</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Registrations</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Events</span>
              </div>
            </div>
          </div>
          {loading.users || loading.events ? (
            <LoadingSpinner />
          ) : errors.users || errors.events ? (
            <div className="flex items-center justify-center h-80 text-red-500">
              <div className="text-center">
                <AlertCircle className="w-16 h-16 mx-auto mb-4" />
                <p className="text-lg font-medium">Failed to load chart data</p>
                <p className="text-sm">Check API connection</p>
              </div>
            </div>
          ) : (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={registrationTrend}>
                  <XAxis dataKey="date" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="registrations"
                    stackId="1"
                    stroke="#3B82F6"
                    fill="#3B82F6"
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="events"
                    stackId="2"
                    stroke="#10B981"
                    fill="#10B981"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Event Types Distribution */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Event Types Distribution</h3>
          {loading.events ? (
            <LoadingSpinner />
          ) : errors.events ? (
            <div className="flex items-center justify-center h-80 text-red-500">
              <div className="text-center">
                <AlertCircle className="w-16 h-16 mx-auto mb-4" />
                <p className="text-lg font-medium">Failed to load event data</p>
                <p className="text-sm">Check API connection</p>
              </div>
            </div>
          ) : eventTypes.length > 0 ? (
            <>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={eventTypes}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {eventTypes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-6">
                {eventTypes.map((type, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: type.color }}></div>
                    <div>
                      <span className="text-sm font-medium text-gray-900">{type.name}</span>
                      <div className="text-xs text-gray-500">
                        {type.count} events ({type.value}%)
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-80 text-gray-500">
              <div className="text-center">
                <BarChart2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">No event data available</p>
                <p className="text-sm">Events will appear here once created</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Top Performing Clubs */}
        <div className="xl:col-span-2 bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Top Performing Clubs</h3>
            <button
              onClick={() => setActiveTab("clubs")}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline"
            >
              View All
            </button>
          </div>
          {loading.clubs ? (
            <LoadingSpinner />
          ) : errors.clubs ? (
            <div className="flex items-center justify-center h-40 text-red-500">
              <div className="text-center">
                <AlertCircle className="w-12 h-12 mx-auto mb-4" />
                <p className="text-lg font-medium">Failed to load clubs</p>
                <p className="text-sm">Check API connection</p>
              </div>
            </div>
          ) : clubs.length > 0 ? (
            <div className="space-y-4">
              {clubs.slice(0, 4).map((club, index) => (
                <div
                  key={club._id}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-blue-50 hover:to-blue-100 transition-all duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{club.name}</h4>
                      <p className="text-sm text-gray-600">
                        {club.members.length || 0} members • {club.events.length || 0} events
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-medium text-gray-700">#{index + 1}</span>
                    </div>
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium text-green-600">{Math.floor(Math.random() * 20) + 5}%</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-40 text-gray-500">
              <div className="text-center">
                <Globe className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">No clubs available</p>
                <p className="text-sm">Clubs will appear here once created</p>
              </div>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h3>
          {loading.users || loading.events ? (
            <LoadingSpinner />
          ) : errors.users || errors.events ? (
            <div className="flex items-center justify-center h-40 text-red-500">
              <div className="text-center">
                <AlertCircle className="w-12 h-12 mx-auto mb-4" />
                <p className="text-lg font-medium">Failed to load activity</p>
                <p className="text-sm">Check API connection</p>
              </div>
            </div>
          ) : recentActivity.length > 0 ? (
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">
                      <span className="font-semibold">{activity.user}</span>
                      {activity.type === "registration" && " registered for "}
                      {activity.type === "event_created" && " created event "}
                      {activity.type === "club_request" && " requested admin access for "}
                      <span className="font-semibold text-blue-600">{activity.event || activity.club}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-40 text-gray-500">
              <div className="text-center">
                <Activity className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">No recent activity</p>
                <p className="text-sm">Activity will appear here as users interact</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">Manage all platform users</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            />
          </div>
          <button
            onClick={() => exportData("users")}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={() => setShowCreateForm({ ...showCreateForm, user: true })}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            Add User
          </button>
          <button
            onClick={fetchUsers}
            disabled={loading.users}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading.users ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {errors.users && <ErrorMessage message={`Error loading users: ${errors.users}`} onRetry={fetchUsers} />}

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">All Users ({users.length})</h3>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select className="text-sm border border-gray-300 rounded px-3 py-1 bg-white">
                <option>All Roles</option>
                <option>Students</option>
                <option>Club Admins</option>
                <option>Hosts</option>
              </select>
            </div>
          </div>
        </div>

        {loading.users ? (
          <LoadingSpinner />
        ) : users.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-600">No users found</p>
            <p className="text-sm text-gray-500">Users will appear here once they register</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users
                  .filter(
                    (user) =>
                      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      user.email?.toLowerCase().includes(searchQuery.toLowerCase()),
                  )
                  .map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                            <span className="text-white font-semibold text-lg">
                              {(user.name || user.username || "?")
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-gray-900">{user.name || user.username}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            user.role === "admin"
                              ? "bg-red-100 text-red-800"
                              : user.role === "club_admin"
                                ? "bg-purple-100 text-purple-800"
                                : user.role === "host"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {user.role || "Student"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            user.isActive !== false ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {user.isActive !== false ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => alert(`Viewing user: ${user.username}`)}
                            className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingUser(user)}
                            className="text-gray-600 hover:text-gray-900 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteUser(user._id)}
                            disabled={loading.action}
                            className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Forms */}
      {editingUser && (
        <UserForm
          user={editingUser}
          onSave={(data) => updateUser(editingUser._id, data)}
          onCancel={() => setEditingUser(null)}
        />
      )}
      {showCreateForm.user && (
        <UserForm onSave={createUser} onCancel={() => setShowCreateForm({ ...showCreateForm, user: false })} />
      )}
    </div>
  )

  const renderEvents = () => (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Event Management</h1>
          <p className="text-gray-600 mt-1">Create and manage all platform events</p>
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
            onClick={() => exportData("events")}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={() => setShowCreateForm({ ...showCreateForm, event: true })}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Event
          </button>
          <button
            onClick={fetchEvents}
            disabled={loading.events}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading.events ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {errors.events && <ErrorMessage message={`Error loading events: ${errors.events}`} onRetry={fetchEvents} />}

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">All Events ({events.length})</h3>
        </div>

        {loading.events ? (
          <LoadingSpinner />
        ) : events.length === 0 ? (
          <div className="p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-600">No events found</p>
            <p className="text-sm text-gray-500">Create your first event to get started</p>
          </div>
        ) : (
          <div className="grid gap-6 p-6">
            {events
              .filter(
                (event) =>
                  event.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
                          className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            event.eventType === "Workshop"
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
                          {event.eventType || event.type}
                        </span>
                        <h3 className="text-xl font-semibold text-gray-900">{event.name || event.title}</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-blue-500" />
                          <span>{new Date(event.date || event.eventDate).toLocaleDateString()}</span>
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
                        onClick={() => alert(`Viewing event: ${event.title}`)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingEvent(event)}
                        className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteEvent(event._id)}
                        disabled={loading.action}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Forms */}
      {editingEvent && (
        <EventForm
          event={editingEvent}
          onSave={(data) => updateEvent(editingEvent._id, data)}
          onCancel={() => setEditingEvent(null)}
        />
      )}
      {showCreateForm.event && (
        <EventForm onSave={createEvent} onCancel={() => setShowCreateForm({ ...showCreateForm, event: false })} />
      )}
    </div>
  )

  const renderClubs = () => (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Club Management</h1>
          <p className="text-gray-600 mt-1">Manage all clubs and their activities</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search clubs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            />
          </div>
          <button
            onClick={() => exportData("clubs")}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={() => setShowCreateForm({ ...showCreateForm, club: true })}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Club
          </button>
          <button
            onClick={fetchClubs}
            disabled={loading.clubs}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading.clubs ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {errors.clubs && <ErrorMessage message={`Error loading clubs: ${errors.clubs}`} onRetry={fetchClubs} />}

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">All Clubs ({clubs.length})</h3>
        </div>

        {loading.clubs ? (
          <LoadingSpinner />
        ) : clubs.length === 0 ? (
          <div className="p-12 text-center">
            <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-600">No clubs found</p>
            <p className="text-sm text-gray-500">Create your first club to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {clubs
              .filter((club) => club.name?.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((club) => (
                <div
                  key={club._id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200 hover:border-blue-300 bg-gradient-to-br from-white to-gray-50"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingClub(club)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteClub(club._id)}
                        disabled={loading.action}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{club.name}</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-500" />
                      <span>{club.members.length || 0} members</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-green-500" />
                      <span>{club.events.length || 0} events</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          club.isActive !== false ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {club.isActive !== false ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Forms */}
      {editingClub && (
        <ClubForm
          club={editingClub}
          onSave={(data) => updateClub(editingClub._id, data)}
          onCancel={() => setEditingClub(null)}
        />
      )}
      {showCreateForm.club && (
        <ClubForm onSave={createClub} onCancel={() => setShowCreateForm({ ...showCreateForm, club: false })} />
      )}
    </div>
  )

  const renderRequests = () => (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Club Admin Requests</h1>
          <p className="text-gray-600 mt-1">Review and manage club administrator requests</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search requests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            />
          </div>
          <button
            onClick={fetchPendingRequests}
            disabled={loading.requests}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading.requests ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {errors.requests && (
        <ErrorMessage message={`Error loading requests: ${errors.requests}`} onRetry={fetchPendingRequests} />
      )}

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Pending Requests ({pendingRequests.length})</h3>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select className="text-sm border border-gray-300 rounded px-3 py-1 bg-white">
                <option>All Requests</option>
                <option>Recent</option>
                <option>Oldest</option>
              </select>
            </div>
          </div>
        </div>

        {loading.requests ? (
          <LoadingSpinner />
        ) : pendingRequests.length === 0 ? (
          <div className="p-12 text-center">
            <UserCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-600">No pending requests</p>
            <p className="text-sm text-gray-500">New club admin requests will appear here</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {pendingRequests
              .filter(
                (request) =>
                  request.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  request.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  request.club?.toLowerCase().includes(searchQuery.toLowerCase()),
              )
              .map((request) => (
                <div key={request._id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white font-semibold text-lg">
                          {request.name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("") || "?"}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-lg">{request.name}</h4>
                        <div className="flex items-center gap-2 text-gray-600 mt-1">
                          <Mail className="w-4 h-4" />
                          <span>{request.email}</span>
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1">
                            <Globe className="w-4 h-4 text-blue-500" />
                            <span className="text-sm text-gray-600">Club: {request.club}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-gray-600">
                              Requested: {new Date(request.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => approveClubAdmin(request._id)}
                        disabled={loading.action}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => rejectClubAdmin(request._id)}
                        disabled={loading.action}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
                      >
                        <X className="w-4 h-4" />
                        Reject
                      </button>
                      <button className="p-3 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
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

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart2 },
    { id: "users", label: "Users", icon: Users },
    { id: "events", label: "Events", icon: Calendar },
    { id: "clubs", label: "Clubs", icon: Globe },
    { id: "requests", label: "Club Requests", icon: UserCheck, badge: pendingRequests.length },
    { id: "analytics", label: "Analytics", icon: Activity },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return renderDashboard()
      case "users":
        return renderUsers()
      case "events":
        return renderEvents()
      case "clubs":
        return renderClubs()
      case "requests":
        return renderRequests()
      case "analytics":
        return (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Analytics Coming Soon</h2>
              <p className="text-gray-600">Advanced analytics and reporting features will be available here.</p>
            </div>
          </div>
        )
      case "settings":
        return (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Settings</h2>
              <p className="text-gray-600">System settings and configuration options will be available here.</p>
            </div>
          </div>
        )
      default:
        return renderDashboard()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? "w-64" : "w-16"} bg-white shadow-xl transition-all duration-300 flex flex-col border-r border-gray-200`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="font-bold text-gray-900 text-lg">Admin Panel</h1>
                <p className="text-xs text-gray-500">Club Management System</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  activeTab === item.id
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && (
                  <>
                    <span className="font-medium">{item.label}</span>
                    {item.badge && item.badge > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center font-semibold">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </button>
            )
          })}
        </nav>

        {/* Sidebar Toggle */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center p-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
          >
            {sidebarOpen ? <ChevronRight className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" ><Home className="w-6 h-6 "/></Link>
              <h2 className="text-2xl font-semibold text-gray-900">
                {sidebarItems.find((item) => item.id === activeTab)?.label}
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              <span className="font-semibold text-gray-700">Hi,{" Admin"}
               
              </span>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-semibold"><CgProfile size={30}/></span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">{renderContent()}</main>
      </div>
    </div>
  )
}

export default ClubAdminDashboard;
