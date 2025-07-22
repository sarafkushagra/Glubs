"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import Navbar from "./Pages/Navbar"
import Footer from "./Pages/Footer"
import {
  Bell,
  CheckCircle,
  X,
  Loader2,
  AlertCircle,
  MessageSquare,
  Calendar,
  Clock,
  User,
  ExternalLink,
  Filter,
  ChevronDown,
  Search,
  Trash2,
} from "lucide-react"

const Notifications = () => {
  const navigate = useNavigate()

  // State variables
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [teamRequests, setTeamRequests] = useState([])
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [showErrorAlert, setShowErrorAlert] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [filterStatus, setFilterStatus] = useState("pending")
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [processingRequestId, setProcessingRequestId] = useState(null)
  const [allEvents, setAllEvents] = useState([])
  const [selectedEvent, setSelectedEvent] = useState("all")

  // Custom styles for hiding scrollbars
  useEffect(() => {
    if (typeof document !== "undefined") {
      const styleSheet = document.createElement("style")
      styleSheet.innerText = `
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .slide-in-bottom {
          animation: slide-in-bottom 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
        }
        @keyframes slide-in-bottom {
          0% {
            transform: translateY(20px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `
      document.head.appendChild(styleSheet)
    }
  }, [])

  // Fetch data on component mount
  useEffect(() => {
    fetchData()
  }, [])

  // Show success alert
  const showSuccess = (message) => {
    setSuccessMessage(message)
    setShowSuccessAlert(true)
    setTimeout(() => setShowSuccessAlert(false), 5000)
  }

  // Show error alert
  const showError = (message) => {
    setErrorMessage(message)
    setShowErrorAlert(true)
    setTimeout(() => setShowErrorAlert(false), 5000)
  }

  // Fetch all necessary data
  const fetchData = async () => {
    try {
      setLoading(true)

      // Fetch current user
      const userRes = await axios.get("http://localhost:3000/users/me", { withCredentials: true })
      setUser(userRes.data.user)

      // Fetch all events for filtering
      const eventsRes = await axios.get("http://localhost:3000/event", { withCredentials: true })
      setAllEvents(eventsRes.data)

      // Fetch all team requests across all events
      const allRequests = []

      // For each event, fetch team requests
      for (const event of eventsRes.data) {
        try {
          const requestsRes = await axios.get(`http://localhost:3000/teams/requests/${event._id}`, {
            withCredentials: true,
          })

          // Add event details to each request
          const requestsWithEvent = requestsRes.data.requests.map((req) => ({
            ...req,
            eventDetails: event,
          }))

          allRequests.push(...requestsWithEvent)
        } catch (err) {
          console.log(`No requests for event ${event._id}`)
        }
      }

      setTeamRequests(allRequests)
    } catch (err) {
      console.error("Error fetching data:", err)
      showError("Failed to load notifications. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Respond to team request
  const respondToRequest = async (requestId, action) => {
    try {
      setProcessingRequestId(requestId)
      await axios.put(`http://localhost:3000/teams/request/${requestId}`, { action }, { withCredentials: true })

      // Update local state to reflect the change
      setTeamRequests((prevRequests) =>
        prevRequests.map((req) =>
          req._id === requestId ? { ...req, status: action === "accept" ? "accepted" : "rejected" } : req,
        ),
      )

      showSuccess(`Request ${action === "accept" ? "accepted" : "rejected"} successfully!`)

      // If accepted, we might want to navigate to the team room
      if (action === "accept") {
        const request = teamRequests.find((req) => req._id === requestId)
        if (request) {
          setTimeout(() => {
            navigate(`/events/${request.event}/team-room`)
          }, 1500)
        }
      }
    } catch (err) {
      console.error("Error responding to request:", err)
      showError(err.response?.data?.message || "Error responding to request. Please try again.")
    } finally {
      setProcessingRequestId(null)
    }
  }

  // Filter requests based on search, status, and event
  const filteredRequests = teamRequests.filter((req) => {
    const matchesSearch =
      req.team?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.from?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.eventDetails?.title?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = filterStatus === "all" || req.status === filterStatus
    const matchesEvent = selectedEvent === "all" || req.event === selectedEvent

    return matchesSearch && matchesStatus && matchesEvent
  })

  // Theme classes for consistent styling
  const themeClasses = {
    background: isDarkMode
      ? "bg-gradient-to-br from-black via-gray-900 to-indigo-900 min-h-screen"
      : "bg-gradient-to-br from-blue-50 via-white to-indigo-100 min-h-screen",
    text: isDarkMode ? "text-white" : "text-gray-900",
    textSecondary: isDarkMode ? "text-gray-300" : "text-gray-600",
    textMuted: isDarkMode ? "text-gray-400" : "text-gray-500",
    card: isDarkMode
      ? "bg-gray-900/40 backdrop-blur-sm border-gray-700/50"
      : "bg-white/80 backdrop-blur-sm border-gray-200",
    cardHover: isDarkMode
      ? "hover:bg-gray-800/60 hover:border-indigo-500/50"
      : "hover:bg-white/90 hover:border-indigo-300",
    input: isDarkMode
      ? "bg-gray-800/50 border-gray-700 text-white placeholder-gray-400"
      : "bg-white/70 border-gray-300 text-gray-900 placeholder-gray-500",
    button: isDarkMode
      ? "bg-gray-800/50 border-gray-700 text-white hover:bg-gray-700/50"
      : "bg-white/70 border-gray-300 text-gray-700 hover:bg-gray-100",
    primaryButton:
      "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-indigo-500/25",
    successButton:
      "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-green-500/25",
    dangerButton:
      "bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white shadow-lg hover:shadow-red-500/25",
    warningButton:
      "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg hover:shadow-amber-500/25",
  }

  // Status badge styles
  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium">
            <Clock className="w-3 h-3" /> Pending
          </span>
        )
      case "accepted":
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
            <CheckCircle className="w-3 h-3" /> Accepted
          </span>
        )
      case "rejected":
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-medium">
            <X className="w-3 h-3" /> Rejected
          </span>
        )
      default:
        return null
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className={themeClasses.background}>
        <Navbar />
        <div className="flex justify-center items-center py-20">
          <div className="relative">
            <Loader2 className="animate-spin text-indigo-500 w-16 h-16" />
            <div className="absolute inset-0 bg-indigo-500/20 rounded-full animate-ping"></div>
            <div className="absolute inset-0 bg-purple-500/20 rounded-full animate-ping animation-delay-75"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={themeClasses.background}>
      <Navbar />

      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse animation-delay-150"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse animation-delay-300"></div>
      </div>

      {/* Success Alert */}
      {showSuccessAlert && (
        <div className="fixed top-20 right-4 z-50 slide-in-bottom">
          <div className="bg-green-900/80 border border-green-500/50 text-green-100 px-6 py-4 rounded-xl shadow-lg backdrop-blur-sm flex items-center gap-3 max-w-md">
            <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
            <p>{successMessage}</p>
            <button onClick={() => setShowSuccessAlert(false)} className="ml-auto text-green-400 hover:text-green-300">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {showErrorAlert && (
        <div className="fixed top-20 right-4 z-50 slide-in-bottom">
          <div className="bg-red-900/80 border border-red-500/50 text-red-100 px-6 py-4 rounded-xl shadow-lg backdrop-blur-sm flex items-center gap-3 max-w-md">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <p>{errorMessage}</p>
            <button onClick={() => setShowErrorAlert(false)} className="ml-auto text-red-400 hover:text-red-300">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      <div className="relative z-10 max-w-6xl mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full blur-lg opacity-75 animate-pulse"></div>
              <div className="relative p-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full">
                <Bell className="w-10 h-10 text-white" />
              </div>
            </div>
            <div>
              <h1 className={`text-5xl font-bold ${themeClasses.text} mb-2`}>Notifications</h1>
              <div className="h-1 w-32 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mx-auto"></div>
            </div>
          </div>
          <p className={`${themeClasses.textSecondary} text-xl mb-6 max-w-2xl mx-auto`}>
            Manage your team invitations and notifications
          </p>
        </div>

        {/* Main Content */}
        <div className={`${themeClasses.card} border rounded-2xl p-8 shadow-2xl`}>
          {/* Search and Filters */}
          <div className="mb-8 space-y-6">
            <div className="relative">
              <Search
                className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${themeClasses.textMuted} w-5 h-5`}
              />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-12 pr-4 py-4 ${themeClasses.input} border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-lg`}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-3 px-6 py-3 ${themeClasses.button} border rounded-xl transition-all hover:scale-105`}
            >
              <Filter className="w-5 h-5" />
              Filters
              <ChevronDown className={`w-5 h-5 transition-transform ${showFilters ? "rotate-180" : ""}`} />
            </button>
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl border border-indigo-500/20">
                <div>
                  <label className={`block text-sm font-semibold ${themeClasses.textSecondary} mb-3`}>Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className={`w-full px-4 py-3 ${themeClasses.input} border rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all`}
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-semibold ${themeClasses.textSecondary} mb-3`}>Event</label>
                  <select
                    value={selectedEvent}
                    onChange={(e) => setSelectedEvent(e.target.value)}
                    className={`w-full px-4 py-3 ${themeClasses.input} border rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all`}
                  >
                    <option value="all">All Events</option>
                    {allEvents.map((event) => (
                      <option key={event._id} value={event._id}>
                        {event.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Notifications List */}
          {filteredRequests.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full flex items-center justify-center">
                <Bell className="w-12 h-12 text-white" />
              </div>
              <h3 className={`text-2xl font-bold ${themeClasses.text} mb-4`}>No Notifications</h3>
              <p className={`${themeClasses.textMuted} text-lg`}>
                You don't have any team invitations or notifications at the moment.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredRequests.map((request) => (
                <div
                  key={request._id}
                  className={`p-6 ${isDarkMode ? "bg-gray-800/30" : "bg-gray-50"} rounded-xl border ${
                    isDarkMode ? "border-gray-700/50" : "border-gray-200"
                  } transition-all hover:scale-[1.01] ${
                    request.status === "pending"
                      ? "border-l-4 border-l-yellow-500"
                      : request.status === "accepted"
                        ? "border-l-4 border-l-green-500"
                        : "border-l-4 border-l-red-500"
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                        {request.from?.username?.charAt(0).toUpperCase() || "?"}
                      </div>
                      <div>
                        <div className={`font-bold text-lg ${themeClasses.text}`}>
                          Team Invitation: {request.team?.name || "Unknown Team"}
                        </div>
                        <div className={`text-sm ${themeClasses.textMuted} flex items-center gap-2 flex-wrap`}>
                          <span className="flex items-center gap-1">
                            <User className="w-4 h-4" /> {request.from?.username || "Unknown User"}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" /> {new Date(request.createdAt).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="w-4 h-4" /> {request.eventDetails?.title || "Unknown Event"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">{getStatusBadge(request.status)}</div>
                  </div>

                  {request.message && (
                    <div className={`p-4 mb-4 ${isDarkMode ? "bg-gray-700/30" : "bg-gray-100"} rounded-lg`}>
                      <p className={`${themeClasses.textSecondary} text-sm italic`}>"{request.message}"</p>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <button
                      onClick={() => navigate(`/events/${request.event}/team-room`)}
                      className={`flex items-center gap-2 px-4 py-2 ${themeClasses.button} rounded-lg transition-all hover:scale-105`}
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Team Room
                    </button>

                    {request.status === "pending" && (
                      <div className="flex gap-3">
                        <button
                          onClick={() => respondToRequest(request._id, "accept")}
                          disabled={processingRequestId === request._id}
                          className={`flex items-center gap-2 px-4 py-2 ${themeClasses.successButton} rounded-lg transition-all hover:scale-105`}
                        >
                          {processingRequestId === request._id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <CheckCircle className="w-4 h-4" />
                          )}
                          Accept
                        </button>
                        <button
                          onClick={() => respondToRequest(request._id, "reject")}
                          disabled={processingRequestId === request._id}
                          className={`flex items-center gap-2 px-4 py-2 ${themeClasses.dangerButton} rounded-lg transition-all hover:scale-105`}
                        >
                          {processingRequestId === request._id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <X className="w-4 h-4" />
                          )}
                          Reject
                        </button>
                      </div>
                    )}

                    {request.status !== "pending" && (
                      <button
                        onClick={() => {
                          setTeamRequests((prevRequests) => prevRequests.filter((req) => req._id !== request._id))
                          showSuccess("Notification dismissed")
                        }}
                        className={`flex items-center gap-2 px-4 py-2 ${themeClasses.button} rounded-lg transition-all hover:scale-105 hover:text-red-400`}
                      >
                        <Trash2 className="w-4 h-4" />
                        Dismiss
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Notifications
