"use client"

import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"
import Footer from "../Pages/Footer"
import Navbar from "../Pages/Navbar"
import {
  Search,
  Filter,
  Calendar,
  MapPin,
  Users,
  Clock,
  ChevronDown,
  Plus,
  BrainCircuit,
  Hammer,
  BookOpen,
  HelpCircle,
  Users2,
  Award,
  Palette,
  Globe,
  Loader2,
  Sparkles,
  User,
  Edit3,
  Trash2,
  MessageSquare,
  Star,
  Share2,
  Bookmark,
  X,
  TrendingUp,
  Eye,
  CalendarIcon,
  Trophy,
} from "lucide-react"
import ShareButtons from "./ShareModel"

// Custom styles for hiding scrollbars
const scrollbarHideStyles = `
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
`

// Add this style tag to the document head
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style")
  styleSheet.innerText = scrollbarHideStyles
  document.head.appendChild(styleSheet)
}

const EventLanding = () => {
  const navigate = useNavigate()
  const { eventId } = useParams()
  const [events, setEvents] = useState([])
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [feedbacks, setFeedbacks] = useState([])
  const [loading, setLoading] = useState(true)
  const [detailsLoading, setDetailsLoading] = useState(false)
  const [search, setSearch] = useState("")
  const [error, setError] = useState(null)
  const [registering, setRegistering] = useState({})
  const [currentUserId, setCurrentUserId] = useState(null)
  const [user, setUser] = useState(null)
  const [filters, setFilters] = useState({
    eventType: "All",
    mode: "All",
    sortBy: "date",
  })
  const [showFilters, setShowFilters] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)

  // Event type configurations
  const eventTypeConfig = {
    Hackathon: {
      icon: BrainCircuit,
      color: "bg-purple-100 text-purple-700 border-purple-200",
      colorDark: "bg-purple-900/20 text-purple-300 border-purple-500/30",
      bgColor: "bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200",
      bgColorDark: "bg-gradient-to-br from-purple-900/10 to-indigo-900/10 border-purple-500/20",
      gradient: "from-purple-600 to-indigo-700",
      accent: "purple",
    },
    Workshop: {
      icon: Hammer,
      color: "bg-emerald-100 text-emerald-700 border-emerald-200",
      colorDark: "bg-emerald-900/20 text-emerald-300 border-emerald-500/30",
      bgColor: "bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200",
      bgColorDark: "bg-gradient-to-br from-emerald-900/10 to-teal-900/10 border-emerald-500/20",
      gradient: "from-emerald-600 to-teal-700",
      accent: "emerald",
    },
    Seminar: {
      icon: BookOpen,
      color: "bg-blue-100 text-blue-700 border-blue-200",
      colorDark: "bg-blue-900/20 text-blue-300 border-blue-500/30",
      bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200",
      bgColorDark: "bg-gradient-to-br from-blue-900/10 to-cyan-900/10 border-blue-500/20",
      gradient: "from-blue-600 to-cyan-700",
      accent: "blue",
    },
    Quiz: {
      icon: Award,
      color: "bg-amber-100 text-amber-700 border-amber-200",
      colorDark: "bg-amber-900/20 text-amber-300 border-amber-500/30",
      bgColor: "bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200",
      bgColorDark: "bg-gradient-to-br from-amber-900/10 to-orange-900/10 border-amber-500/20",
      gradient: "from-amber-600 to-orange-700",
      accent: "amber",
    },
    Conference: {
      icon: Users2,
      color: "bg-indigo-100 text-indigo-700 border-indigo-200",
      colorDark: "bg-indigo-900/20 text-indigo-300 border-indigo-500/30",
      bgColor: "bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200",
      bgColorDark: "bg-gradient-to-br from-indigo-900/10 to-purple-900/10 border-indigo-500/20",
      gradient: "from-indigo-600 to-purple-700",
      accent: "indigo",
    },
    "Case Study": {
      icon: HelpCircle,
      color: "bg-pink-100 text-pink-700 border-pink-200",
      colorDark: "bg-pink-900/20 text-pink-300 border-pink-500/30",
      bgColor: "bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200",
      bgColorDark: "bg-gradient-to-br from-pink-900/10 to-rose-900/10 border-pink-500/20",
      gradient: "from-pink-600 to-rose-700",
      accent: "pink",
    },
    "Creative Showcase": {
      icon: Palette,
      color: "bg-orange-100 text-orange-700 border-orange-200",
      colorDark: "bg-orange-900/20 text-orange-300 border-orange-500/30",
      bgColor: "bg-gradient-to-br from-orange-50 to-red-50 border-orange-200",
      bgColorDark: "bg-gradient-to-br from-orange-900/10 to-red-900/10 border-orange-500/20",
      gradient: "from-orange-600 to-red-700",
      accent: "orange",
    },
    Other: {
      icon: CalendarIcon,
      color: "bg-gray-100 text-gray-700 border-gray-200",
      colorDark: "bg-gray-800/20 text-gray-300 border-gray-500/30",
      bgColor: "bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200",
      bgColorDark: "bg-gradient-to-br from-gray-900/10 to-slate-900/10 border-gray-500/20",
      gradient: "from-gray-600 to-slate-700",
      accent: "gray",
    },
  }

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:3000/users/me", { withCredentials: true })
        setCurrentUserId(res.data.user._id)
        setUser(res.data.user)
      } catch {
        console.error("User not logged in")
      }
    }
    fetchUser()
  }, [])

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("http://localhost:3000/event", { withCredentials: true })
        const eventsData = Array.isArray(res.data) ? res.data : []
        const currentDate = new Date()
        const activeEvents = eventsData.filter((event) => {
          const eventDate = new Date(event.date)
          return eventDate >= currentDate
        })
        setEvents(activeEvents)

        if (eventId && !isMobile) {
          const event = activeEvents.find((e) => e._id === eventId)
          if (event) {
            setSelectedEvent(event)
            fetchEventDetails(eventId)
          }
        }
      } catch (err) {
        console.error(err)
        setError("Failed to fetch events.")
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [eventId, isMobile])

  // Fetch event details
  const fetchEventDetails = async (id) => {
    try {
      setDetailsLoading(true)
      const res = await axios.get(`http://localhost:3000/event/${id}`, { withCredentials: true })
      setSelectedEvent(res.data.event)
      setFeedbacks(res.data.feedbacks || [])
    } catch (err) {
      console.error(err)
    } finally {
      setDetailsLoading(false)
    }
  }

  const handleEventClick = (event) => {
    if (isMobile) {
      navigate(`/events/${event._id}`)
    } else {
      setSelectedEvent(event)
      fetchEventDetails(event._id)
      window.history.pushState(null, "", `/events/${event._id}`)
    }
  }

  const handleRegister = async (eventId) => {
    const event = events.find((e) => e._id === eventId) || selectedEvent

    // If it's a team event, redirect to team room instead of direct registration
    if (event.participationType === "Team") {
      navigate(`/events/${eventId}/team-room`)
      return
    }

    // Existing individual registration logic
    try {
      setRegistering((prev) => ({ ...prev, [eventId]: true }))
      await axios.post(`http://localhost:3000/event/${eventId}/register`, {}, { withCredentials: true })
      setEvents((prev) =>
        prev.map((e) =>
          e._id === eventId ? { ...e, registeredUsers: [...(e.registeredUsers || []), currentUserId] } : e,
        ),
      )
      if (selectedEvent && selectedEvent._id === eventId) {
        setSelectedEvent((prev) => ({
          ...prev,
          registeredUsers: [...(prev.registeredUsers || []), currentUserId],
        }))
      }
      alert("Registered successfully!")
    } catch (err) {
      console.error(err)
      alert("Registration failed. Please ensure you are logged in.")
    } finally {
      setRegistering((prev) => ({ ...prev, [eventId]: false }))
    }
  }

  const handleDelete = async (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return
    try {
      await axios.delete(`http://localhost:3000/event/${eventId}`, { withCredentials: true })
      setEvents((prev) => prev.filter((e) => e._id !== eventId))
      if (selectedEvent && selectedEvent._id === eventId) {
        setSelectedEvent(null)
        window.history.pushState(null, "", "/events")
      }
    } catch {
      alert("Failed to delete event.")
    }
  }

  const handleDeleteFeedback = async (feedbackId) => {
    if (!window.confirm("Delete this feedback?")) return
    try {
      await axios.delete(`http://localhost:3000/feedback/${feedbackId}`, { withCredentials: true })
      setFeedbacks(feedbacks.filter((fb) => fb._id !== feedbackId))
    } catch {
      alert("Failed to delete feedback.")
    }
  }

  const isUserRegistered = (event) =>
    currentUserId && Array.isArray(event.registeredUsers) && event.registeredUsers.includes(currentUserId)

  const getDaysLeft = (date) => {
    const eventDate = new Date(date)
    const today = new Date()
    const diffTime = eventDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? "text-amber-400 fill-current" : isDarkMode ? "text-gray-600" : "text-gray-300"}`}
      />
    ))
  }

  const shareToWhatsApp = (event) => {
    const eventUrl = `${window.location.origin}/events/${event._id}`
    const message = `🎉 Check out this amazing event: *${event.title}*\n\n📅 Date: ${new Date(event.date).toLocaleDateString()}\n📍 Mode: ${event.mode || "Online"}\n${event.prizePool ? `💰 Prize Pool: ₹${event.prizePool.toLocaleString()}\n` : ""}👥 ${event.registeredUsers?.length || 0} people registered\n\n${event.description ? event.description.substring(0, 100) + "...\n\n" : ""}Register now: ${eventUrl}\n\n#Glubs #Events #${event.eventType || "Competition"}`

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  const filteredEvents = events
    .filter((event) => {
      const matchesSearch = event.title.toLowerCase().includes(search.toLowerCase())
      const matchesType = filters.eventType === "All" || event.eventType === filters.eventType
      const matchesMode = filters.mode === "All" || event.mode === filters.mode
      return matchesSearch && matchesType && matchesMode
    })
    .sort((a, b) => {
      if (filters.sortBy === "date") return new Date(a.date) - new Date(b.date)
      if (filters.sortBy === "registrations") return (b.registeredUsers?.length || 0) - (a.registeredUsers?.length || 0)
      return 0
    })

  const eventTypes = ["All", ...new Set(events.map((e) => e.eventType).filter(Boolean))]

  const themeClasses = {
    background: isDarkMode
      ? "bg-gradient-to-br from-black via-gray-900 to-indigo-900"
      : "bg-gradient-to-br from-blue-50 via-white to-indigo-100",
    text: isDarkMode ? "text-white" : "text-gray-900",
    textSecondary: isDarkMode ? "text-gray-300" : "text-gray-600",
    textMuted: isDarkMode ? "text-gray-400" : "text-gray-500",
    card: isDarkMode
      ? "bg-gray-900/40 backdrop-blur-sm border-gray-700"
      : "bg-white/80 backdrop-blur-sm border-gray-200",
    cardHover: isDarkMode ? "hover:border-indigo-500/50" : "hover:border-indigo-300",
    input: isDarkMode
      ? "bg-gray-800/50 border-gray-700 text-white placeholder-gray-400"
      : "bg-white/70 border-gray-300 text-gray-900 placeholder-gray-500",
    button: isDarkMode
      ? "bg-gray-800/50 border-gray-700 text-white hover:bg-gray-700/50"
      : "bg-white/70 border-gray-300 text-gray-700 hover:bg-gray-100",
    primaryButton:
      "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white",
  }

  if (loading) {
    return (
      <div className={`min-h-screen ${themeClasses.background}`}>
        <Navbar />
        <div className="flex justify-center items-center py-20">
          <div className="relative">
            <Loader2 className="animate-spin text-indigo-500 w-12 h-12" />
            <div className="absolute inset-0 bg-indigo-500/20 rounded-full animate-ping"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${themeClasses.background}`}>
      <Navbar />

      {/* Mobile View - Show only event list or redirect to details */}
      {isMobile ? (
        <div className="pt-20 pb-12">
          {/* Header */}
          <div className="px-4 mb-6">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h1
                  className={`text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent`}
                >
                  Discover Events
                </h1>
              </div>
              <p className={`text-lg ${themeClasses.textSecondary} max-w-2xl mx-auto mb-6`}>
                Explore amazing opportunities and level up your skills through premium events.
              </p>
            </div>

            {/* Search */}
            <div className="relative mb-4">
              <Search
                className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${themeClasses.textMuted} w-5 h-5`}
              />
              <input
                type="text"
                placeholder="Search events..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`w-full pl-12 pr-4 py-3 ${themeClasses.input} rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
              />
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`w-full flex items-center justify-center gap-2 px-4 py-3 ${themeClasses.button} rounded-xl transition-all duration-300`}
            >
              <Filter className="w-4 h-4" />
              Filters
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
            </button>

            {/* Filter Panel */}
            {showFilters && (
              <div className={`${themeClasses.card} rounded-xl p-4 mt-4 border`}>
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium ${themeClasses.textSecondary} mb-2`}>Event Type</label>
                    <select
                      value={filters.eventType}
                      onChange={(e) => setFilters((prev) => ({ ...prev, eventType: e.target.value }))}
                      className={`w-full p-2 ${themeClasses.input} rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm`}
                    >
                      {eventTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${themeClasses.textSecondary} mb-2`}>Mode</label>
                    <select
                      value={filters.mode}
                      onChange={(e) => setFilters((prev) => ({ ...prev, mode: e.target.value }))}
                      className={`w-full p-2 ${themeClasses.input} rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm`}
                    >
                      <option value="All">All</option>
                      <option value="online">Online</option>
                      <option value="offline">Offline</option>
                      <option value="hybrid">Hybrid</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Events Grid */}
          <div className="px-4">
            {filteredEvents.length === 0 ? (
              <div className="text-center py-20">
                <div className={`${themeClasses.card} border rounded-xl p-12 max-w-md mx-auto`}>
                  <Calendar className={`w-16 h-16 ${themeClasses.textMuted} mx-auto mb-4`} />
                  <h3 className={`text-xl font-semibold ${themeClasses.textSecondary} mb-2`}>No events found</h3>
                  <p className={themeClasses.textMuted}>Try adjusting your search or filters</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4 hide-scrollbar">
                {filteredEvents.map((event) => {
                  const config = eventTypeConfig[event.eventType] || eventTypeConfig.Other
                  const IconComponent = config.icon
                  const daysLeft = getDaysLeft(event.date)

                  return (
                    <div
                      key={event._id}
                      onClick={() => handleEventClick(event)}
                      className={`${themeClasses.card} border ${themeClasses.cardHover} rounded-xl transition-all duration-300 overflow-hidden cursor-pointer shadow-lg hover:shadow-xl`}
                    >
                      {/* Event Header */}
                      <div
                        className={`${isDarkMode ? config.bgColorDark : config.bgColor} border-b ${isDarkMode ? "border-gray-700/50" : "border-gray-200"} p-4`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div
                            className={`flex items-center gap-2 px-3 py-1 rounded-full border ${isDarkMode ? config.colorDark : config.color} text-xs font-medium`}
                          >
                            <IconComponent className="w-3 h-3" />
                            {event.eventType || "Event"}
                          </div>
                          {daysLeft <= 7 && daysLeft > 0 && (
                            <div
                              className={`flex items-center gap-1 ${isDarkMode ? "bg-red-900/30 border-red-500/30 text-red-300" : "bg-red-100 border-red-300 text-red-700"} px-2 py-1 rounded-full text-xs font-medium border`}
                            >
                              <Clock className="w-3 h-3" />
                              {daysLeft}d
                            </div>
                          )}
                        </div>
                        <h3 className={`text-lg font-bold ${themeClasses.text} line-clamp-2 mb-2`}>{event.title}</h3>
                        <p className={`${themeClasses.textMuted} text-sm line-clamp-2`}>
                          {event.description || "No description available"}
                        </p>
                      </div>

                      {/* Event Details */}
                      <div className="p-4">
                        <div className="space-y-2 mb-4">
                          <div className={`flex items-center gap-2 text-sm ${themeClasses.textSecondary}`}>
                            <Calendar className="w-3 h-3 text-indigo-500" />
                            {new Date(event.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </div>
                          {event.venue && (
                            <div className={`flex items-center gap-2 text-sm ${themeClasses.textSecondary}`}>
                              <MapPin className="w-3 h-3 text-emerald-500" />
                              <span className="truncate">{event.venue}</span>
                            </div>
                          )}
                          <div className={`flex items-center gap-2 text-sm ${themeClasses.textSecondary}`}>
                            <Users className="w-3 h-3 text-blue-500" />
                            {event.registeredUsers?.length || 0} registered
                          </div>
                        </div>

                        {/* Prize Pool */}
                        {event.prizePool && (
                          <div className="mb-4">
                            <div className={`text-2xl font-bold ${themeClasses.text}`}>
                              ₹ {event.prizePool.toLocaleString()}
                            </div>
                            <div className="text-indigo-500 text-sm">Prize Pool</div>
                          </div>
                        )}

                        {/* Registration Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRegister(event._id)
                          }}
                          disabled={isUserRegistered(event) || registering[event._id]}
                          className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 text-sm ${isUserRegistered(event)
                              ? isDarkMode
                                ? "bg-green-900/30 border border-green-500/30 text-green-300 cursor-not-allowed"
                                : "bg-green-100 border border-green-300 text-green-700 cursor-not-allowed"
                              : registering[event._id]
                                ? isDarkMode
                                  ? "bg-indigo-900/30 border border-indigo-500/30 text-indigo-300 cursor-not-allowed animate-pulse"
                                  : "bg-indigo-100 border border-indigo-300 text-indigo-700 cursor-not-allowed animate-pulse"
                                : themeClasses.primaryButton + " shadow-lg hover:shadow-indigo-500/25"
                            }`}
                        >
                          {isUserRegistered(event)
                            ? "✓ Registered"
                            : registering[event._id]
                              ? "Registering..."
                              : event.participationType === "Team"
                                ? "Find Team"
                                : "Register Now"}
                        </button>
                        {event.participationType === "Team" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              navigate(`/events/${event._id}/team-room`)
                            }}
                            className={`w-full py-2 rounded-lg font-semibold transition-all duration-300 text-sm ${themeClasses.button} mt-2`}
                          >
                            <Users className="w-4 h-4 inline mr-2" />
                            {isUserRegistered(event) ? "Team Room" : "Find Team"}
                          </button>
                        )}
                        {/* <button
                          onClick={(e) => {
                            e.stopPropagation()
                            
                          }}
                          className={`w-full py-2 rounded-lg font-semibold transition-all duration-300 text-sm ${themeClasses.button} mt-2`}
                        >
                          <Share2 className="w-4 h-4 inline mr-2" />
                          Share on WhatsApp
                        </button> */}
                        <div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setShowShare((prev) => !prev)
                            }}
                            className={`w-full py-2 rounded-lg font-semibold transition-all duration-300 text-sm ${themeClasses.button} mt-2`}
                          >
                            <Share2 className="w-4 h-4 inline mr-2" />
                            Share on WhatsApp
                          </button>

                          {showShare && (
                            <div className="mt-2">
                              <ShareButtons event={event} />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Desktop View - Split Screen */
        <div className="flex h-screen pt-16">
          {/* Left Panel - Events List (30%) */}
          <div className="w-[30%] border-r border-gray-700/50 overflow-y-auto hide-scrollbar">
            <div className="p-6">
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <h1 className={`text-2xl font-bold ${themeClasses.text}`}>Events</h1>
                </div>

                {/* Stats */}
                <div className="flex gap-4 mb-4">
                  <div className="text-center">
                    <div className={`text-lg font-bold ${themeClasses.text}`}>{events.length}</div>
                    <div className={`text-indigo-500 text-xs`}>Active</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-lg font-bold ${themeClasses.text}`}>
                      {events.reduce((acc, e) => acc + (e.registeredUsers?.length || 0), 0)}
                    </div>
                    <div className={`text-indigo-500 text-xs`}>Registered</div>
                  </div>
                </div>

                {/* Search */}
                <div className="relative mb-4">
                  <Search
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${themeClasses.textMuted} w-4 h-4`}
                  />
                  <input
                    type="text"
                    placeholder="Search events..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 ${themeClasses.input} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm`}
                  />
                </div>

                {/* Filters */}
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-2 px-3 py-2 ${themeClasses.button} rounded-lg transition-all duration-300 text-sm`}
                  >
                    <Filter className="w-3 h-3" />
                    Filters
                  </button>
                  {/* <button
                    onClick={() => navigate("/hosts")}
                    className={`flex items-center gap-2 ${themeClasses.primaryButton} px-3 py-2 rounded-lg transition-all duration-300 text-sm shadow-lg`}
                  >
                    <Plus className="w-3 h-3" />
                    Host
                  </button> */}
                </div>

                {/* Filter Panel */}
                {showFilters && (
                  <div className={`${themeClasses.card} border rounded-lg p-3 mb-4`}>
                    <div className="space-y-3">
                      <div>
                        <label className={`block text-xs font-medium ${themeClasses.textSecondary} mb-1`}>Type</label>
                        <select
                          value={filters.eventType}
                          onChange={(e) => setFilters((prev) => ({ ...prev, eventType: e.target.value }))}
                          className={`w-full p-2 ${themeClasses.input} rounded text-xs focus:ring-2 focus:ring-indigo-500`}
                        >
                          {eventTypes.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className={`block text-xs font-medium ${themeClasses.textSecondary} mb-1`}>Mode</label>
                        <select
                          value={filters.mode}
                          onChange={(e) => setFilters((prev) => ({ ...prev, mode: e.target.value }))}
                          className={`w-full p-2 ${themeClasses.input} rounded text-xs focus:ring-2 focus:ring-indigo-500`}
                        >
                          <option value="All">All</option>
                          <option value="online">Online</option>
                          <option value="offline">Offline</option>
                          <option value="hybrid">Hybrid</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Events List */}
              <div className="space-y-3">
                {filteredEvents.map((event) => {
                  const config = eventTypeConfig[event.eventType] || eventTypeConfig.Other
                  const IconComponent = config.icon
                  const daysLeft = getDaysLeft(event.date)
                  const isSelected = selectedEvent && selectedEvent._id === event._id

                  return (
                    <div
                      key={event._id}
                      onClick={() => handleEventClick(event)}
                      className={`${themeClasses.card} border ${isSelected ? "border-indigo-500 ring-2 ring-indigo-500/30" : themeClasses.cardHover
                        } rounded-lg transition-all duration-300 overflow-hidden cursor-pointer hover:shadow-lg`}
                    >
                      {/* Event Header */}
                      <div
                        className={`${isDarkMode ? config.bgColorDark : config.bgColor} border-b ${isDarkMode ? "border-gray-700/50" : "border-gray-200"} p-3`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div
                            className={`flex items-center gap-1 px-2 py-1 rounded-full border ${isDarkMode ? config.colorDark : config.color} text-xs font-medium`}
                          >
                            <IconComponent className="w-2 h-2" />
                            {event.eventType || "Event"}
                          </div>
                          {daysLeft <= 7 && daysLeft > 0 && (
                            <div
                              className={`flex items-center gap-1 ${isDarkMode ? "bg-red-900/30 border-red-500/30 text-red-300" : "bg-red-100 border-red-300 text-red-700"} px-2 py-1 rounded-full text-xs font-medium border`}
                            >
                              <Clock className="w-2 h-2" />
                              {daysLeft}d
                            </div>
                          )}
                        </div>
                        <h3 className={`text-sm font-bold ${themeClasses.text} line-clamp-2 mb-1`}>{event.title}</h3>
                        <p className={`${themeClasses.textMuted} text-xs line-clamp-1`}>
                          {event.description || "No description available"}
                        </p>
                      </div>

                      {/* Event Details */}
                      <div className="p-3">
                        <div className="space-y-1 mb-3">
                          <div className={`flex items-center gap-2 text-xs ${themeClasses.textSecondary}`}>
                            <Calendar className="w-2 h-2 text-indigo-500" />
                            {new Date(event.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </div>
                          <div className={`flex items-center gap-2 text-xs ${themeClasses.textSecondary}`}>
                            <Users className="w-2 h-2 text-blue-500" />
                            {event.registeredUsers?.length || 0} registered
                          </div>
                        </div>

                        {/* Prize Pool */}
                        {event.prizePool && (
                          <div className="mb-3">
                            <div className={`text-lg font-bold ${themeClasses.text}`}>
                              ₹ {event.prizePool.toLocaleString()}
                            </div>
                            <div className="text-indigo-500 text-xs">Prize Pool</div>
                          </div>
                        )}

                        {/* Registration Status */}
                        <div
                          className={`text-xs px-2 py-1 rounded text-center font-medium ${isUserRegistered(event)
                              ? isDarkMode
                                ? "bg-green-900/30 text-green-300"
                                : "bg-green-100 text-green-700"
                              : isDarkMode
                                ? "bg-indigo-900/30 text-indigo-300"
                                : "bg-indigo-100 text-indigo-700"
                            }`}
                        >
                          {isUserRegistered(event) ? "✓ Registered" : "Click to Register"}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Right Panel - Event Details (70%) */}
          <div className="w-[70%] overflow-y-auto hide-scrollbar">
            {selectedEvent ? (
              <div className="p-8">
                {detailsLoading ? (
                  <div className="flex justify-center items-center py-20">
                    <Loader2 className="animate-spin text-indigo-500 w-8 h-8" />
                  </div>
                ) : (
                  <div className="space-y-8">
                    {/* Event Header */}
                    <div
                      className={`bg-gradient-to-r ${eventTypeConfig[selectedEvent.eventType]?.gradient || eventTypeConfig.Other.gradient} rounded-2xl p-8 relative overflow-hidden`}
                    >
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12"></div>
                      </div>
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-4">
                            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                              {(() => {
                                const IconComponent =
                                  eventTypeConfig[selectedEvent.eventType]?.icon || eventTypeConfig.Other.icon
                                return <IconComponent className="w-8 h-8 text-white" />
                              })()}
                            </div>
                            <div>
                              <span className="text-white/80 text-lg font-medium">
                                {selectedEvent.eventType || "Event"}
                              </span>
                              <div className="flex items-center gap-4 mt-1">
                                <div className="flex items-center gap-1 text-white/70 text-sm">
                                  <Eye className="w-4 h-4" />
                                  {selectedEvent.views || 0}
                                </div>
                                <div className="flex items-center gap-1 text-white/70 text-sm">
                                  <Users className="w-4 h-4" />
                                  {selectedEvent.registeredUsers?.length || 0}
                                </div>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedEvent(null)
                              window.history.pushState(null, "", "/events")
                            }}
                            className="text-white/60 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                        <h1 className="text-4xl font-bold text-white mb-4 leading-tight">{selectedEvent.title}</h1>
                        <p className="text-white/90 text-lg mb-6">
                          {selectedEvent.description || "No description available"}
                        </p>
                        <div className="flex flex-wrap gap-3">
                          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                            <Calendar className="w-4 h-4" />
                            <span className="font-medium">
                              {new Date(selectedEvent.date).toLocaleDateString("en-US", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                          {selectedEvent.prizePool && (
                            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                              <Trophy className="w-4 h-4" />
                              <span className="font-medium">₹ {selectedEvent.prizePool.toLocaleString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* Main Content */}
                      <div className="lg:col-span-2 space-y-6">
                        {/* Event Details */}
                        <div className={`${themeClasses.card} border rounded-2xl p-6`}>
                          <div className="flex items-center gap-3 mb-6">
                            <Sparkles className="w-6 h-6 text-indigo-500" />
                            <h2 className={`text-2xl font-bold ${themeClasses.text}`}>Event Details</h2>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div
                              className={`flex items-center gap-4 p-4 ${isDarkMode ? "bg-gray-800/30" : "bg-gray-50"} rounded-xl border ${isDarkMode ? "border-gray-700/50" : "border-gray-200"}`}
                            >
                              <div className={`p-2 ${isDarkMode ? "bg-indigo-900/30" : "bg-indigo-100"} rounded-lg`}>
                                <Calendar className="w-5 h-5 text-indigo-500" />
                              </div>
                              <div>
                                <div className={`font-semibold ${themeClasses.text}`}>Date & Time</div>
                                <div className={`${themeClasses.textMuted} text-sm`}>
                                  {new Date(selectedEvent.date).toLocaleString()}
                                </div>
                              </div>
                            </div>
                            {selectedEvent.venue && (
                              <div
                                className={`flex items-center gap-4 p-4 ${isDarkMode ? "bg-gray-800/30" : "bg-gray-50"} rounded-xl border ${isDarkMode ? "border-gray-700/50" : "border-gray-200"}`}
                              >
                                <div
                                  className={`p-2 ${isDarkMode ? "bg-emerald-900/30" : "bg-emerald-100"} rounded-lg`}
                                >
                                  <MapPin className="w-5 h-5 text-emerald-500" />
                                </div>
                                <div>
                                  <div className={`font-semibold ${themeClasses.text}`}>Venue</div>
                                  <div className={`${themeClasses.textMuted} text-sm`}>{selectedEvent.venue}</div>
                                </div>
                              </div>
                            )}
                            <div
                              className={`flex items-center gap-4 p-4 ${isDarkMode ? "bg-gray-800/30" : "bg-gray-50"} rounded-xl border ${isDarkMode ? "border-gray-700/50" : "border-gray-200"}`}
                            >
                              <div className={`p-2 ${isDarkMode ? "bg-purple-900/30" : "bg-purple-100"} rounded-lg`}>
                                <Globe className="w-5 h-5 text-purple-500" />
                              </div>
                              <div>
                                <div className={`font-semibold ${themeClasses.text}`}>Mode</div>
                                <div className={`${themeClasses.textMuted} text-sm capitalize`}>
                                  {selectedEvent.mode || "Online"}
                                </div>
                              </div>
                            </div>
                            {selectedEvent.createdBy && (
                              <div
                                className={`flex items-center gap-4 p-4 ${isDarkMode ? "bg-gray-800/30" : "bg-gray-50"} rounded-xl border ${isDarkMode ? "border-gray-700/50" : "border-gray-200"}`}
                              >
                                <div className={`p-2 ${isDarkMode ? "bg-orange-900/30" : "bg-orange-100"} rounded-lg`}>
                                  <User className="w-5 h-5 text-orange-500" />
                                </div>
                                <div>
                                  <div className={`font-semibold ${themeClasses.text}`}>Organizer</div>
                                  <div className={`${themeClasses.textMuted} text-sm`}>
                                    {selectedEvent.createdBy.name || "Unknown"}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                          {selectedEvent.eligibility && (
                            <div className={`mt-6 pt-6 border-t ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
                              <h4 className={`font-semibold ${themeClasses.text} mb-2`}>Eligibility</h4>
                              <p className={`${themeClasses.textSecondary} text-sm`}>{selectedEvent.eligibility}</p>
                            </div>
                          )}

                          {selectedEvent.rules && (
                            <div className={`mt-4`}>
                              <h4 className={`font-semibold ${themeClasses.text} mb-2`}>Rules & Guidelines</h4>
                              <p className={`${themeClasses.textSecondary} text-sm`}>{selectedEvent.rules}</p>
                            </div>
                          )}

                          {/* Owner Actions */}
                          {user && selectedEvent.createdBy && selectedEvent.createdBy._id === user._id && (
                            <div className={`mt-6 pt-6 border-t ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
                              <div className="flex flex-wrap gap-3">
                                <button
                                  onClick={() => navigate(`/events/edit/${selectedEvent._id}`)}
                                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                                >
                                  <Edit3 className="w-4 h-4" />
                                  Edit Event
                                </button>
                                <button
                                  onClick={() => handleDelete(selectedEvent._id)}
                                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Delete Event
                                </button>
                                <button
                                  onClick={() => navigate(`/events/${selectedEvent._id}/add-feedback`)}
                                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                                >
                                  <MessageSquare className="w-4 h-4" />
                                  Add Feedback
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Feedback Section */}
                        <div className={`${themeClasses.card} border rounded-2xl p-6`}>
                          <div className="flex items-center gap-3 mb-6">
                            <MessageSquare className="w-6 h-6 text-indigo-500" />
                            <h2 className={`text-2xl font-bold ${themeClasses.text}`}>User Feedback</h2>
                          </div>
                          {feedbacks.length > 0 ? (
                            <div className="space-y-4 max-h-96 overflow-y-auto hide-scrollbar">
                              {feedbacks.map((feedback) => (
                                <div
                                  key={feedback._id}
                                  className={`p-4 ${isDarkMode ? "bg-gray-800/30 border-gray-700/50" : "bg-gray-50 border-gray-200"} border rounded-xl`}
                                >
                                  <div className="flex items-start justify-between mb-3">
                                    <div>
                                      <div className={`font-semibold ${themeClasses.text}`}>
                                        {feedback.user?.username || "Anonymous"}
                                      </div>
                                      <div className={`text-sm ${themeClasses.textMuted}`}>
                                        {new Date(feedback.createdAt).toLocaleDateString()}
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      {renderStars(feedback.rating)}
                                      <span className={`ml-2 text-sm font-medium ${themeClasses.textSecondary}`}>
                                        {feedback.rating}/5
                                      </span>
                                    </div>
                                  </div>
                                  <p className={`${themeClasses.textSecondary} mb-3`}>{feedback.review}</p>
                                  {user && feedback.user && feedback.user._id === user._id && (
                                    <button
                                      onClick={() => handleDeleteFeedback(feedback._id)}
                                      className="text-red-500 hover:text-red-400 hover:underline text-sm transition-colors"
                                    >
                                      Delete
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-12">
                              <MessageSquare className={`w-16 h-16 mx-auto mb-4 ${themeClasses.textMuted}`} />
                              <p className={`${themeClasses.textMuted} text-lg`}>No feedback yet</p>
                              <p className={`${themeClasses.textMuted} text-sm`}>
                                Be the first to share your thoughts!
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Sidebar */}
                      <div className="space-y-6">
                        {/* Registration Card */}
                        <div className={`${themeClasses.card} border rounded-2xl p-6 shadow-2xl`}>
                          <div className="text-center mb-6">
                            <div className={`text-4xl font-bold ${themeClasses.text} mb-2`}>
                              {selectedEvent.prizePool ? `₹ ${selectedEvent.prizePool.toLocaleString()}` : "Free"}
                            </div>
                            {selectedEvent.prizePool && <div className="text-indigo-500">Prize Pool</div>}
                          </div>
                          <div className="space-y-4 mb-6">
                            <div
                              className={`flex justify-between items-center p-3 ${isDarkMode ? "bg-gray-800/30" : "bg-gray-50"} rounded-lg`}
                            >
                              <span className={themeClasses.textMuted}>Registered</span>
                              <div className="flex items-center gap-2">
                                <span className={`font-semibold ${themeClasses.text}`}>
                                  {selectedEvent.registeredUsers?.length || 0}
                                </span>
                                {(selectedEvent.registeredUsers?.length || 0) > 50 && (
                                  <TrendingUp className="w-4 h-4 text-green-500" />
                                )}
                              </div>
                            </div>
                            <div
                              className={`flex justify-between items-center p-3 ${isDarkMode ? "bg-gray-800/30" : "bg-gray-50"} rounded-lg`}
                            >
                              <span className={themeClasses.textMuted}>Deadline</span>
                              <span className={`font-semibold ${themeClasses.text} text-sm`}>
                                {selectedEvent.registrationEnd
                                  ? new Date(selectedEvent.registrationEnd).toLocaleDateString()
                                  : "Open"}
                              </span>
                            </div>
                            {selectedEvent.teamMin && selectedEvent.teamMax && (
                              <div
                                className={`flex justify-between items-center p-3 ${isDarkMode ? "bg-gray-800/30" : "bg-gray-50"} rounded-lg`}
                              >
                                <span className={themeClasses.textMuted}>Team Size</span>
                                <span className={`font-semibold ${themeClasses.text}`}>
                                  {selectedEvent.teamMin} - {selectedEvent.teamMax}
                                </span>
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => handleRegister(selectedEvent._id)}
                            disabled={
                              isUserRegistered(selectedEvent) ||
                              registering[selectedEvent._id] ||
                              getDaysLeft(selectedEvent.date) < 0
                            }
                            className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 ${isUserRegistered(selectedEvent)
                                ? isDarkMode
                                  ? "bg-green-900/30 border border-green-500/30 text-green-300 cursor-not-allowed"
                                  : "bg-green-100 border border-green-300 text-green-700 cursor-not-allowed"
                                : registering[selectedEvent._id]
                                  ? isDarkMode
                                    ? "bg-indigo-900/30 border border-indigo-500/30 text-indigo-300 cursor-not-allowed animate-pulse"
                                    : "bg-indigo-100 border border-indigo-300 text-indigo-700 cursor-not-allowed animate-pulse"
                                  : getDaysLeft(selectedEvent.date) < 0
                                    ? isDarkMode
                                      ? "bg-gray-800/30 border border-gray-600/30 text-gray-500 cursor-not-allowed"
                                      : "bg-gray-200 border border-gray-300 text-gray-500 cursor-not-allowed"
                                    : themeClasses.primaryButton + " shadow-lg hover:shadow-indigo-500/25"
                              }`}
                          >
                            {isUserRegistered(selectedEvent)
                              ? "✓ Already Registered"
                              : registering[selectedEvent._id]
                                ? "Registering..."
                                : getDaysLeft(selectedEvent.date) < 0
                                  ? "Registration Closed"
                                  : selectedEvent.participationType === "Team"
                                    ? "Find Team"
                                    : "Register Now"}
                          </button>
                          {selectedEvent.participationType === "Team" && (
                            <button
                              onClick={() => {
                                navigate(`/events/${selectedEvent._id}/team-room`)
                              }}
                              className={`w-full py-2 rounded-lg font-semibold transition-all duration-300 ${themeClasses.button} mt-2`}
                            >
                              <Users className="w-4 h-4" />
                              {isUserRegistered(selectedEvent) ? "Team Room" : "Find Team"}
                            </button>
                          )}
                          <div className="flex gap-2 mt-4">
                            <button
                              onClick={() => shareToWhatsApp(selectedEvent)}
                              className={`flex-1 flex items-center justify-center gap-2 py-3 ${themeClasses.button} rounded-lg transition-colors`}
                            >
                              <Share2 className="w-4 h-4" />
                              Share
                            </button>
                            <button
                              className={`flex-1 flex items-center justify-center gap-2 py-3 ${themeClasses.button} rounded-lg transition-colors`}
                            >
                              <Bookmark className="w-4 h-4" />
                              Save
                            </button>
                          </div>
                        </div>

                        {/* Quick Stats */}
                        <div className={`${themeClasses.card} border rounded-2xl p-6`}>
                          <h3 className={`font-bold ${themeClasses.text} mb-4 flex items-center gap-2`}>
                            <TrendingUp className="w-5 h-5 text-indigo-500" />
                            Quick Stats
                          </h3>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className={themeClasses.textMuted}>Views</span>
                              <span className={`font-semibold ${themeClasses.text}`}>{selectedEvent.views || 0}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className={themeClasses.textMuted}>Registrations</span>
                              <span className={`font-semibold ${themeClasses.text}`}>
                                {selectedEvent.registrations || 0}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className={themeClasses.textMuted}>Comments</span>
                              <span className={`font-semibold ${themeClasses.text}`}>
                                {selectedEvent.commentsCount || 0}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* No Event Selected */
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div
                    className={`w-24 h-24 mx-auto mb-6 ${isDarkMode ? "bg-gray-800/30" : "bg-gray-100"} rounded-full flex items-center justify-center`}
                  >
                    <Sparkles className={`w-12 h-12 ${themeClasses.textMuted}`} />
                  </div>
                  <h3 className={`text-2xl font-bold ${themeClasses.text} mb-2`}>Select an Event</h3>
                  <p className={`${themeClasses.textMuted} max-w-md`}>
                    Choose an event from the list to view detailed information, register, and see feedback from other
                    participants.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {isMobile && <Footer />}
    </div>
  )
}

export default EventLanding;


