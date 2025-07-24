// "use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import Footer from "../Pages/Footer"
import Navbar from "../Pages/Navbar"
import {
  Calendar,
  MapPin,
  Users,
  Globe,
  Clock,
  User,
  Edit3,
  Trash2,
  MessageSquare,
  Star,
  ArrowLeft,
  Share2,
  Bookmark,
  BrainCircuit,
  Hammer,
  BookOpen,
  HelpCircle,
  Users2,
  Award,
  Palette,
  CalendarIcon,
  Loader2,
  Sparkles,
  TrendingUp,
  Eye,
  CheckCircle,
  AlertCircle,
  Mail,
} from "lucide-react"
import ShareButtons from "./ShareModel"
import ShareModal from "./ShareModel"

const EventDetails = () => {
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

  const { eventId } = useParams()
  const navigate = useNavigate()
  const [event, setEvent] = useState(null)
  const [feedbacks, setFeedbacks] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [registering, setRegistering] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)

  const [showShareModal, setShowShareModal] = useState(false)

  const eventTypeConfig = {
    Hackathon: {
      icon: BrainCircuit,
      gradient: "from-purple-600 to-indigo-700",
      accent: "purple",
    },
    Workshop: {
      icon: Hammer,
      gradient: "from-emerald-600 to-teal-700",
      accent: "emerald",
    },
    Seminar: {
      icon: BookOpen,
      gradient: "from-blue-600 to-cyan-700",
      accent: "blue",
    },
    Quiz: {
      icon: Award,
      gradient: "from-amber-600 to-orange-700",
      accent: "amber",
    },
    Conference: {
      icon: Users2,
      gradient: "from-indigo-600 to-purple-700",
      accent: "indigo",
    },
    "Case Study": {
      icon: HelpCircle,
      gradient: "from-pink-600 to-rose-700",
      accent: "pink",
    },
    "Creative Showcase": {
      icon: Palette,
      gradient: "from-orange-600 to-red-700",
      accent: "orange",
    },
    Other: {
      icon: CalendarIcon,
      gradient: "from-gray-600 to-slate-700",
      accent: "gray",
    },
  }

  useEffect(() => {
    fetchData()
  }, [eventId])

  const fetchData = async () => {
    try {
      const res = await axios.get(`${process.env.API_BASE_URL}/event/${eventId}`, { withCredentials: true })
      setEvent(res.data.event)
      setFeedbacks(res.data.feedbacks || [])
      try {
        const userRes = await axios.get(`${process.env.API_BASE_URL}/users/me`, { withCredentials: true })
        setUser(userRes.data.user)
      } catch {
        console.log("User not logged in")
      }
    } catch (err) {
      console.error(err)
      setError("Failed to load event details.")
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async () => {
    // If it's a team event, redirect to team room instead of direct registration
    if (event.participationType === "Team") {
      navigate(`/events/${eventId}/team-room`)
      return
    }

    // Existing individual registration logic
    try {
      setRegistering(true)
      await axios.post(`${process.env.API_BASE_URL}/event/${eventId}/register`, {}, { withCredentials: true })
      setEvent((prev) => ({
        ...prev,
        registeredUsers: [...(prev.registeredUsers || []), user._id],
      }))
      alert("Registered successfully!")
    } catch (err) {
      console.error(err)
      alert("Registration failed. Please ensure you are logged in.")
    } finally {
      setRegistering(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this event?")) return
    try {
      await axios.delete(`${process.env.API_BASE_URL}/event/${eventId}`, { withCredentials: true })
      navigate("/events")
    } catch {
      alert("Failed to delete event.")
    }
  }

  const handleDeleteFeedback = async (feedbackId) => {
    if (!window.confirm("Delete this feedback?")) return
    try {
      await axios.delete(`${process.env.API_BASE_URL}/feedback/${feedbackId}`, { withCredentials: true })
      setFeedbacks(feedbacks.filter((fb) => fb._id !== feedbackId))
    } catch {
      alert("Failed to delete feedback.")
    }
  }

  const isUserRegistered = () =>
    user && event && Array.isArray(event.registeredUsers) && event.registeredUsers.includes(user._id)

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

  if (error || !event) {
    return (
      <div className={`min-h-screen ${themeClasses.background}`}>
        <Navbar />
        <div className="text-center py-20">
          <div
            className={`${isDarkMode ? "bg-red-900/20 border-red-500/30" : "bg-red-100 border-red-300"} border rounded-xl p-8 max-w-md mx-auto`}
          >
            <p className={`${isDarkMode ? "text-red-300" : "text-red-700"} text-lg font-semibold`}>
              {error || "Event not found"}
            </p>
            <button
              onClick={() => navigate("/events")}
              className="mt-4 text-indigo-500 hover:text-indigo-400 hover:underline transition-colors"
            >
              Back to Events
            </button>
          </div>
        </div>
      </div>
    )
  }

  const config = eventTypeConfig[event.eventType] || eventTypeConfig.Other
  const IconComponent = config.icon
  const daysLeft = getDaysLeft(event.date)
  const isOwner = user && event.createdBy && event.createdBy._id === user._id
  console.log(user, event.createdBy);
  return (
    <div className={`min-h-screen ${themeClasses.background}`}>
      <Navbar />

      {/* Event Header */}
      <div className="max-w-6xl mx-auto px-4 pt-24 pb-8">
        <button
          onClick={() => navigate("/events")}
          className={`flex items-center gap-2 ${themeClasses.textMuted} hover:${themeClasses.text} mb-8 transition-colors group`}
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Events
        </button>

        <div className={`bg-gradient-to-r ${config.gradient} rounded-2xl p-8 md:p-12 mb-8 relative overflow-hidden`}>
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-24 -translate-x-24"></div>
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm">
                <IconComponent className="w-8 h-8 text-white" />
              </div>
              <div>
                <span className="text-white/80 text-lg font-medium">{event.eventType || "Event"}</span>
                {daysLeft <= 7 && daysLeft > 0 && (
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-4 h-4 text-red-300" />
                    <span className="text-red-300 text-sm font-medium">{daysLeft} days left</span>
                  </div>
                )}
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">{event.title}</h1>
            <p className="text-xl text-white/90 mb-8 max-w-3xl">{event.description || "No description available"}</p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <Calendar className="w-5 h-5" />
                <span className="font-medium">
                  {new Date(event.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <Users className="w-5 h-5" />
                <span className="font-medium">{event.registeredUsers?.length || 0} registered</span>
              </div>
              {event.views && (
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Eye className="w-5 h-5" />
                  <span className="font-medium">{event.views} views</span>
                </div>
              )}
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <Users className="w-4 h-4" />
                <span className="font-medium">
                  {event.participationType || "Individual"}
                  {event.participationType === "Team" &&
                    event.teamMin &&
                    event.teamMax &&
                    ` (${event.teamMin}-${event.teamMax})`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Event Details */}
            <div className={`${themeClasses.card} border rounded-2xl p-8`}>
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-6 h-6 text-indigo-500" />
                <h2 className={`text-2xl font-bold ${themeClasses.text}`}>Event Details</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div
                  className={`flex items-center gap-4 p-4 ${isDarkMode ? "bg-gray-800/30" : "bg-gray-50"} rounded-xl border ${isDarkMode ? "border-gray-700/50" : "border-gray-200"}`}
                >
                  <div className={`p-2 ${isDarkMode ? "bg-indigo-900/30" : "bg-indigo-100"} rounded-lg`}>
                    <Calendar className="w-5 h-5 text-indigo-500" />
                  </div>
                  <div>
                    <div className={`font-semibold ${themeClasses.text}`}>Date & Time</div>
                    <div className={`${themeClasses.textMuted} text-sm`}>{new Date(event.date).toLocaleString()}</div>
                  </div>
                </div>
                {event.venue && (
                  <div
                    className={`flex items-center gap-4 p-4 ${isDarkMode ? "bg-gray-800/30" : "bg-gray-50"} rounded-xl border ${isDarkMode ? "border-gray-700/50" : "border-gray-200"}`}
                  >
                    <div className={`p-2 ${isDarkMode ? "bg-emerald-900/30" : "bg-emerald-100"} rounded-lg`}>
                      <MapPin className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                      <div className={`font-semibold ${themeClasses.text}`}>Venue</div>
                      <div className={`${themeClasses.textMuted} text-sm`}>{event.venue}</div>
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
                    <div className={`${themeClasses.textMuted} text-sm capitalize`}>{event.mode || "Online"}</div>
                  </div>
                </div>
                {event.createdBy && (
                  <div
                    className={`flex items-center gap-4 p-4 ${isDarkMode ? "bg-gray-800/30" : "bg-gray-50"} rounded-xl border ${isDarkMode ? "border-gray-700/50" : "border-gray-200"}`}
                  >
                    <div className={`p-2 ${isDarkMode ? "bg-orange-900/30" : "bg-orange-100"} rounded-lg`}>
                      <User className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <div className={`font-semibold ${themeClasses.text}`}>Organizer</div>
                      <div className={`${themeClasses.textMuted} text-sm`}>
                        {event.createdBy?.username.toUpperCase() || "Unknown"}
                      </div>
                    </div>
                  </div>
                )}
                {event.eligibility && (
                  <div
                    className={`flex items-start gap-4 p-4 ${isDarkMode ? "bg-gray-800/30" : "bg-gray-50"} rounded-xl border ${isDarkMode ? "border-gray-700/50" : "border-gray-200"} col-span-2`}
                  >
                    <div className={`p-2 ${isDarkMode ? "bg-blue-900/30" : "bg-blue-100"} rounded-lg`}>
                      <CheckCircle className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <div className={`font-semibold ${themeClasses.text}`}>Eligibility</div>
                      <div className={`${themeClasses.textMuted} text-sm mt-1`}>{event.eligibility}</div>
                    </div>
                  </div>
                )}

                {event.rules && (
                  <div
                    className={`flex items-start gap-4 p-4 ${isDarkMode ? "bg-gray-800/30" : "bg-gray-50"} rounded-xl border ${isDarkMode ? "border-gray-700/50" : "border-gray-200"} col-span-2`}
                  >
                    <div className={`p-2 ${isDarkMode ? "bg-yellow-900/30" : "bg-yellow-100"} rounded-lg`}>
                      <AlertCircle className="w-5 h-5 text-yellow-500" />
                    </div>
                    <div>
                      <div className={`font-semibold ${themeClasses.text}`}>Rules & Guidelines</div>
                      <div className={`${themeClasses.textMuted} text-sm mt-1`}>{event.rules}</div>
                    </div>
                  </div>
                )}

                {(event.contactEmail || event.contactPhone) && (
                  <div
                    className={`flex items-start gap-4 p-4 ${isDarkMode ? "bg-gray-800/30" : "bg-gray-50"} rounded-xl border ${isDarkMode ? "border-gray-700/50" : "border-gray-200"} col-span-2`}
                  >
                    <div className={`p-2 ${isDarkMode ? "bg-green-900/30" : "bg-green-100"} rounded-lg`}>
                      <Mail className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <div className={`font-semibold ${themeClasses.text}`}>Contact Information</div>
                      <div className={`${themeClasses.textMuted} text-sm mt-1 space-y-1`}>
                        {event.contactEmail && <div>Email: {event.contactEmail}</div>}
                        {event.contactPhone && <div>Phone: {event.contactPhone}</div>}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Categories */}
              {event.categories && event.categories.length > 0 && (
                <div className="mt-8">
                  <h3 className={`font-semibold ${themeClasses.text} mb-4`}>Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {event.categories.map((category, idx) => (
                      <span
                        key={idx}
                        className={`px-4 py-2 ${isDarkMode ? "bg-indigo-900/30 border-indigo-500/30 text-indigo-300" : "bg-indigo-100 border-indigo-300 text-indigo-700"} border rounded-full text-sm font-medium`}
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Owner Actions */}
              {isOwner && (
                <div className={`mt-8 pt-6 border-t ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => navigate(`/events/edit/${eventId}`)}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit Event
                    </button>
                    <button
                      onClick={handleDelete}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Event
                    </button>
                    <button
                      onClick={() => navigate(`/events/${eventId}/add-feedback`)}
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
            <div className={`${themeClasses.card} border rounded-2xl p-8`}>
              <div className="flex items-center gap-3 mb-6">
                <MessageSquare className="w-6 h-6 text-indigo-500" />
                <h2 className={`text-2xl font-bold ${themeClasses.text}`}>User Feedback</h2>
              </div>
              {feedbacks.length > 0 ? (
                <div className="space-y-4 hide-scrollbar">
                  {feedbacks.map((feedback) => (
                    <div
                      key={feedback._id}
                      className={`p-6 ${isDarkMode ? "bg-gray-800/30 border-gray-700/50" : "bg-gray-50 border-gray-200"} border rounded-xl`}
                    >
                      <div className="flex items-start justify-between mb-4">
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
                      <p className={`${themeClasses.textSecondary} mb-4`}>{feedback.review}</p>
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
                  <p className={`${themeClasses.textMuted}`}>Be the first to share your thoughts!</p>
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
                  {event.prizePool ? `₹ ${event.prizePool.toLocaleString()}` : "Free"}
                </div>
                {event.prizePool && <div className="text-indigo-500">Prize Pool</div>}
              </div>
              <div className="space-y-4 mb-6">
                <div
                  className={`flex justify-between items-center p-3 ${isDarkMode ? "bg-gray-800/30" : "bg-gray-50"} rounded-lg`}
                >
                  <span className={themeClasses.textMuted}>Registered</span>
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold ${themeClasses.text}`}>{event.registeredUsers?.length || 0}</span>
                    {(event.registeredUsers?.length || 0) > 50 && <TrendingUp className="w-4 h-4 text-green-500" />}
                  </div>
                </div>
                <div
                  className={`flex justify-between items-center p-3 ${isDarkMode ? "bg-gray-800/30" : "bg-gray-50"} rounded-lg`}
                >
                  <span className={themeClasses.textMuted}>Deadline</span>
                  <span className={`font-semibold ${themeClasses.text} text-sm`}>
                    {event.registrationEnd ? new Date(event.registrationEnd).toLocaleDateString() : "Open"}
                  </span>
                </div>
                {event.teamMin && event.teamMax && (
                  <div
                    className={`flex justify-between items-center p-3 ${isDarkMode ? "bg-gray-800/30" : "bg-gray-50"} rounded-lg`}
                  >
                    <span className={themeClasses.textMuted}>Team Size</span>
                    <span className={`font-semibold ${themeClasses.text}`}>
                      {event.teamMin} - {event.teamMax}
                    </span>
                  </div>
                )}
              </div>
              <button
                onClick={handleRegister}
                disabled={isUserRegistered() || registering || daysLeft < 0}
                className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 ${isUserRegistered()
                  ? isDarkMode
                    ? "bg-green-900/30 border border-green-500/30 text-green-300 cursor-not-allowed"
                    : "bg-green-100 border border-green-300 text-green-700 cursor-not-allowed"
                  : registering
                    ? isDarkMode
                      ? "bg-indigo-900/30 border border-indigo-500/30 text-indigo-300 cursor-not-allowed animate-pulse"
                      : "bg-indigo-100 border border-indigo-300 text-indigo-700 cursor-not-allowed animate-pulse"
                    : daysLeft < 0
                      ? isDarkMode
                        ? "bg-gray-800/30 border border-gray-600/30 text-gray-500 cursor-not-allowed"
                        : "bg-gray-200 border border-gray-300 text-gray-500 cursor-not-allowed"
                      : themeClasses.primaryButton + " shadow-lg hover:shadow-indigo-500/25"
                  }`}
              >
                {isUserRegistered()
                  ? "✓ Already Registered"
                  : registering
                    ? "Registering..."
                    : daysLeft < 0
                      ? "Registration Closed"
                      : event.participationType === "Team"
                        ? "Find Team"
                        : "Register Now"}
              </button>
              {event.participationType === "Team" && (
                <button
                  onClick={() => navigate(`/events/${eventId}/team-room`)}
                  className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 mt-3 ${themeClasses.button} border`}
                >
                  <Users className="w-4 h-4 inline mr-2" />
                  {isUserRegistered() ? "Team Room" : "Find Team"}
                </button>
              )}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setShowShareModal(true)}
                  className="w-full py-2 rounded-lg font-semibold transition-all duration-300 text-sm bg-blue-600 text-white hover:bg-blue-700"
                >
                  <Share2 className="w-4 h-4 inline mr-2" />
                  Share Event
                </button>

                {showShareModal && (
                  <ShareModal event={event} onClose={() => setShowShareModal(false)} />
                )}

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
                  <span className={`font-semibold ${themeClasses.text}`}>{event.views || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={themeClasses.textMuted}>Registrations</span>
                  <span className={`font-semibold ${themeClasses.text}`}>{event.registrations || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={themeClasses.textMuted}>Comments</span>
                  <span className={`font-semibold ${themeClasses.text}`}>{event.commentsCount || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default EventDetails;





// "use client"
// import { useEffect, useState } from "react"
// import { useParams, useNavigate } from "react-router-dom"
// import axios from "axios"
// import Footer from "../Pages/Footer"
// import Navbar from "../Pages/Navbar"
// import {
//   Calendar,
//   MapPin,
//   Users,
//   Globe,
//   Clock,
//   User,
//   Edit3,
//   Trash2,
//   MessageSquare,
//   Star,
//   ArrowLeft,
//   Share2,
//   Bookmark,
//   BrainCircuit,
//   Hammer,
//   BookOpen,
//   HelpCircle,
//   Users2,
//   Award,
//   Palette,
//   CalendarIcon,
//   Loader2,
//   Sparkles,
//   TrendingUp,
//   Eye,
//   CheckCircle,
//   AlertCircle,
//   Mail,
//   UserPlus,
//   Crown,
// } from "lucide-react"

// const EventDetails = () => {
//   // Custom styles for hiding scrollbars
//   const scrollbarHideStyles = `
//     .hide-scrollbar {
//       -ms-overflow-style: none;
//       scrollbar-width: none;
//     }
//     .hide-scrollbar::-webkit-scrollbar {
//       display: none;
//     }
//   `

//   // Add this style tag to the document head
//   if (typeof document !== "undefined") {
//     const styleSheet = document.createElement("style")
//     styleSheet.innerText = scrollbarHideStyles
//     document.head.appendChild(styleSheet)
//   }

//   const { eventId } = useParams()
//   const navigate = useNavigate()
//   const [event, setEvent] = useState(null)
//   const [feedbacks, setFeedbacks] = useState([])
//   const [user, setUser] = useState(null)
//   const [userTeam, setUserTeam] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const [registering, setRegistering] = useState(false)
//   const [isDarkMode, setIsDarkMode] = useState(true)

//   const eventTypeConfig = {
//     Hackathon: {
//       icon: BrainCircuit,
//       gradient: "from-purple-600 to-indigo-700",
//       accent: "purple",
//     },
//     Workshop: {
//       icon: Hammer,
//       gradient: "from-emerald-600 to-teal-700",
//       accent: "emerald",
//     },
//     Seminar: {
//       icon: BookOpen,
//       gradient: "from-blue-600 to-cyan-700",
//       accent: "blue",
//     },
//     Quiz: {
//       icon: Award,
//       gradient: "from-amber-600 to-orange-700",
//       accent: "amber",
//     },
//     Conference: {
//       icon: Users2,
//       gradient: "from-indigo-600 to-purple-700",
//       accent: "indigo",
//     },
//     "Case Study": {
//       icon: HelpCircle,
//       gradient: "from-pink-600 to-rose-700",
//       accent: "pink",
//     },
//     "Creative Showcase": {
//       icon: Palette,
//       gradient: "from-orange-600 to-red-700",
//       accent: "orange",
//     },
//     Other: {
//       icon: CalendarIcon,
//       gradient: "from-gray-600 to-slate-700",
//       accent: "gray",
//     },
//   }

//   useEffect(() => {
//     fetchData()
//   }, [eventId])

//   const fetchData = async () => {
//     try {
//       const res = await axios.get(`http://localhost:3000/event/${eventId}`, { withCredentials: true })
//       setEvent(res.data.event)
//       setFeedbacks(res.data.feedbacks || [])

//       try {
//         const userRes = await axios.get("http://localhost:3000/users/me", { withCredentials: true })
//         setUser(userRes.data.user)

//         // If it's a team event, check if user has a team
//         if (res.data.event.participationType === "Team") {
//           try {
//             const teamRes = await axios.get(
//               `http://localhost:3000/teams/user/${userRes.data.user._id}/event/${eventId}`,
//               {
//                 withCredentials: true,
//               },
//             )
//             setUserTeam(teamRes.data.team)
//           } catch (err) {
//             console.log("User doesn't have a team")
//           }
//         }
//       } catch {
//         console.log("User not logged in")
//       }
//     } catch (err) {
//       console.error(err)
//       setError("Failed to load event details.")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleRegister = async () => {
//     // If it's a team event, redirect to team room instead of direct registration
//     if (event.participationType === "Team") {
//       navigate(`/events/${eventId}/team-room`)
//       return
//     }

//     // Existing individual registration logic
//     try {
//       setRegistering(true)
//       await axios.post(`http://localhost:3000/event/${eventId}/register`, {}, { withCredentials: true })
//       setEvent((prev) => ({
//         ...prev,
//         registeredUsers: [...(prev.registeredUsers || []), user._id],
//       }))
//       alert("Registered successfully!")
//     } catch (err) {
//       console.error(err)
//       alert("Registration failed. Please ensure you are logged in.")
//     } finally {
//       setRegistering(false)
//     }
//   }

//   const handleDelete = async () => {
//     if (!window.confirm("Are you sure you want to delete this event?")) return
//     try {
//       await axios.delete(`http://localhost:3000/event/${eventId}`, { withCredentials: true })
//       navigate("/events")
//     } catch {
//       alert("Failed to delete event.")
//     }
//   }

//   const handleDeleteFeedback = async (feedbackId) => {
//     if (!window.confirm("Delete this feedback?")) return
//     try {
//       await axios.delete(`http://localhost:3000/feedback/${feedbackId}`, { withCredentials: true })
//       setFeedbacks(feedbacks.filter((fb) => fb._id !== feedbackId))
//     } catch {
//       alert("Failed to delete feedback.")
//     }
//   }

//   const isUserRegistered = () =>
//     user && event && Array.isArray(event.registeredUsers) && event.registeredUsers.includes(user._id)

//   const getDaysLeft = (date) => {
//     const eventDate = new Date(date)
//     const today = new Date()
//     const diffTime = eventDate - today
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
//     return diffDays
//   }

//   const renderStars = (rating) => {
//     return Array.from({ length: 5 }, (_, i) => (
//       <Star
//         key={i}
//         className={`w-4 h-4 ${i < rating ? "text-amber-400 fill-current" : isDarkMode ? "text-gray-600" : "text-gray-300"}`}
//       />
//     ))
//   }

//   const shareToWhatsApp = (event) => {
//     const eventUrl = `${window.location.origin}/events/${event._id}`
//     const message = `🎉 *${event.title}* - Amazing Event Alert! 🎉

// 📅 *Date:* ${new Date(event.date).toLocaleDateString("en-US", {
//       weekday: "long",
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     })}

// 📍 *Mode:* ${event.mode || "Online"}
// ${event.venue ? `🏢 *Venue:* ${event.venue}\n` : ""}
// ${event.prizePool ? `💰 *Prize Pool:* ₹${event.prizePool.toLocaleString()}\n` : ""}
// 👥 *Participation:* ${event.participationType || "Individual"}
// ${event.participationType === "Team" ? `👥 *Team Size:* ${event.teamMin}-${event.teamMax} members\n` : ""}

// 📝 *Description:*
// ${event.description ? event.description.substring(0, 150) + "..." : "Join this exciting event!"}

// 🔗 *Register Now:* ${eventUrl}

// #Glubs #Events #${event.eventType || "Competition"} #StudentLife`

//     const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
//     window.open(whatsappUrl, "_blank")
//   }

//   const themeClasses = {
//     background: isDarkMode
//       ? "bg-gradient-to-br from-black via-gray-900 to-indigo-900"
//       : "bg-gradient-to-br from-blue-50 via-white to-indigo-100",
//     text: isDarkMode ? "text-white" : "text-gray-900",
//     textSecondary: isDarkMode ? "text-gray-300" : "text-gray-600",
//     textMuted: isDarkMode ? "text-gray-400" : "text-gray-500",
//     card: isDarkMode
//       ? "bg-gray-900/40 backdrop-blur-sm border-gray-700"
//       : "bg-white/80 backdrop-blur-sm border-gray-200",
//     input: isDarkMode
//       ? "bg-gray-800/50 border-gray-700 text-white placeholder-gray-400"
//       : "bg-white/70 border-gray-300 text-gray-900 placeholder-gray-500",
//     button: isDarkMode
//       ? "bg-gray-800/50 border-gray-700 text-white hover:bg-gray-700/50"
//       : "bg-white/70 border-gray-300 text-gray-700 hover:bg-gray-100",
//     primaryButton:
//       "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white",
//   }

//   if (loading) {
//     return (
//       <div className={`min-h-screen ${themeClasses.background}`}>
//         <Navbar />
//         <div className="flex justify-center items-center py-20">
//           <div className="relative">
//             <Loader2 className="animate-spin text-indigo-500 w-12 h-12" />
//             <div className="absolute inset-0 bg-indigo-500/20 rounded-full animate-ping"></div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   if (error || !event) {
//     return (
//       <div className={`min-h-screen ${themeClasses.background}`}>
//         <Navbar />
//         <div className="text-center py-20">
//           <div
//             className={`${isDarkMode ? "bg-red-900/20 border-red-500/30" : "bg-red-100 border-red-300"} border rounded-xl p-8 max-w-md mx-auto`}
//           >
//             <p className={`${isDarkMode ? "text-red-300" : "text-red-700"} text-lg font-semibold`}>
//               {error || "Event not found"}
//             </p>
//             <button
//               onClick={() => navigate("/events")}
//               className="mt-4 text-indigo-500 hover:text-indigo-400 hover:underline transition-colors"
//             >
//               Back to Events
//             </button>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   const config = eventTypeConfig[event.eventType] || eventTypeConfig.Other
//   const IconComponent = config.icon
//   const daysLeft = getDaysLeft(event.date)
//   const isOwner = user && event.createdBy && event.createdBy._id === user._id

//   return (
//     <div className={`min-h-screen ${themeClasses.background}`}>
//       <Navbar />
//       {/* Event Header */}
//       <div className="max-w-6xl mx-auto px-4 pt-24 pb-8">
//         <button
//           onClick={() => navigate("/events")}
//           className={`flex items-center gap-2 ${themeClasses.textMuted} hover:${themeClasses.text} mb-8 transition-colors group`}
//         >
//           <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
//           Back to Events
//         </button>
//         <div className={`bg-gradient-to-r ${config.gradient} rounded-2xl p-6 md:p-12 mb-8 relative overflow-hidden`}>
//           {/* Background Pattern */}
//           <div className="absolute inset-0 opacity-10">
//             <div className="absolute top-0 right-0 w-32 md:w-64 h-32 md:h-64 bg-white rounded-full -translate-y-16 md:-translate-y-32 translate-x-16 md:translate-x-32"></div>
//             <div className="absolute bottom-0 left-0 w-24 md:w-48 h-24 md:h-48 bg-white rounded-full translate-y-12 md:translate-y-24 -translate-x-12 md:-translate-x-24"></div>
//           </div>
//           <div className="relative z-10">
//             <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
//               <div className="bg-white/20 p-3 md:p-4 rounded-xl backdrop-blur-sm">
//                 <IconComponent className="w-6 h-6 md:w-8 md:h-8 text-white" />
//               </div>
//               <div>
//                 <span className="text-white/80 text-base md:text-lg font-medium">{event.eventType || "Event"}</span>
//                 {daysLeft <= 7 && daysLeft > 0 && (
//                   <div className="flex items-center gap-2 mt-1">
//                     <Clock className="w-4 h-4 text-red-300" />
//                     <span className="text-red-300 text-sm font-medium">{daysLeft} days left</span>
//                   </div>
//                 )}
//               </div>
//             </div>
//             <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-white mb-4 md:mb-6 leading-tight">
//               {event.title}
//             </h1>
//             <p className="text-lg md:text-xl text-white/90 mb-6 md:mb-8 max-w-3xl">
//               {event.description || "No description available"}
//             </p>
//             <div className="flex flex-wrap gap-3 md:gap-4">
//               <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 md:px-4 py-2 rounded-full">
//                 <Calendar className="w-4 md:w-5 h-4 md:h-5" />
//                 <span className="font-medium text-sm md:text-base">
//                   {new Date(event.date).toLocaleDateString("en-US", {
//                     weekday: "long",
//                     year: "numeric",
//                     month: "long",
//                     day: "numeric",
//                   })}
//                 </span>
//               </div>
//               <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 md:px-4 py-2 rounded-full">
//                 <Users className="w-4 md:w-5 h-4 md:h-5" />
//                 <span className="font-medium text-sm md:text-base">
//                   {event.registeredUsers?.length || 0} registered
//                 </span>
//               </div>
//               {event.views && (
//                 <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 md:px-4 py-2 rounded-full">
//                   <Eye className="w-4 md:w-5 h-4 md:h-5" />
//                   <span className="font-medium text-sm md:text-base">{event.views} views</span>
//                 </div>
//               )}
//               <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 md:px-4 py-2 rounded-full">
//                 <Users className="w-4 h-4" />
//                 <span className="font-medium text-sm md:text-base">
//                   {event.participationType || "Individual"}
//                   {event.participationType === "Team" &&
//                     event.teamMin &&
//                     event.teamMax &&
//                     ` (${event.teamMin}-${event.teamMax})`}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Content Grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
//           {/* Main Content */}
//           <div className="lg:col-span-2 space-y-6 md:space-y-8">
//             {/* Event Details */}
//             <div className={`${themeClasses.card} border rounded-2xl p-6 md:p-8`}>
//               <div className="flex items-center gap-3 mb-6">
//                 <Sparkles className="w-6 h-6 text-indigo-500" />
//                 <h2 className={`text-xl md:text-2xl font-bold ${themeClasses.text}`}>Event Details</h2>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
//                 <div
//                   className={`flex items-center gap-4 p-4 ${isDarkMode ? "bg-gray-800/30" : "bg-gray-50"} rounded-xl border ${isDarkMode ? "border-gray-700/50" : "border-gray-200"}`}
//                 >
//                   <div className={`p-2 ${isDarkMode ? "bg-indigo-900/30" : "bg-indigo-100"} rounded-lg`}>
//                     <Calendar className="w-5 h-5 text-indigo-500" />
//                   </div>
//                   <div>
//                     <div className={`font-semibold ${themeClasses.text}`}>Date & Time</div>
//                     <div className={`${themeClasses.textMuted} text-sm`}>{new Date(event.date).toLocaleString()}</div>
//                   </div>
//                 </div>
//                 {event.venue && (
//                   <div
//                     className={`flex items-center gap-4 p-4 ${isDarkMode ? "bg-gray-800/30" : "bg-gray-50"} rounded-xl border ${isDarkMode ? "border-gray-700/50" : "border-gray-200"}`}
//                   >
//                     <div className={`p-2 ${isDarkMode ? "bg-emerald-900/30" : "bg-emerald-100"} rounded-lg`}>
//                       <MapPin className="w-5 h-5 text-emerald-500" />
//                     </div>
//                     <div>
//                       <div className={`font-semibold ${themeClasses.text}`}>Venue</div>
//                       <div className={`${themeClasses.textMuted} text-sm`}>{event.venue}</div>
//                     </div>
//                   </div>
//                 )}
//                 <div
//                   className={`flex items-center gap-4 p-4 ${isDarkMode ? "bg-gray-800/30" : "bg-gray-50"} rounded-xl border ${isDarkMode ? "border-gray-700/50" : "border-gray-200"}`}
//                 >
//                   <div className={`p-2 ${isDarkMode ? "bg-purple-900/30" : "bg-purple-100"} rounded-lg`}>
//                     <Globe className="w-5 h-5 text-purple-500" />
//                   </div>
//                   <div>
//                     <div className={`font-semibold ${themeClasses.text}`}>Mode</div>
//                     <div className={`${themeClasses.textMuted} text-sm capitalize`}>{event.mode || "Online"}</div>
//                   </div>
//                 </div>
//                 {event.createdBy && (
//                   <div
//                     className={`flex items-center gap-4 p-4 ${isDarkMode ? "bg-gray-800/30" : "bg-gray-50"} rounded-xl border ${isDarkMode ? "border-gray-700/50" : "border-gray-200"}`}
//                   >
//                     <div className={`p-2 ${isDarkMode ? "bg-orange-900/30" : "bg-orange-100"} rounded-lg`}>
//                       <User className="w-5 h-5 text-orange-500" />
//                     </div>
//                     <div>
//                       <div className={`font-semibold ${themeClasses.text}`}>Organizer</div>
//                       <div className={`${themeClasses.textMuted} text-sm`}>{event.createdBy.name || "Unknown"}</div>
//                     </div>
//                   </div>
//                 )}
//                 {event.eligibility && (
//                   <div
//                     className={`flex items-start gap-4 p-4 ${isDarkMode ? "bg-gray-800/30" : "bg-gray-50"} rounded-xl border ${isDarkMode ? "border-gray-700/50" : "border-gray-200"} col-span-1 md:col-span-2`}
//                   >
//                     <div className={`p-2 ${isDarkMode ? "bg-blue-900/30" : "bg-blue-100"} rounded-lg`}>
//                       <CheckCircle className="w-5 h-5 text-blue-500" />
//                     </div>
//                     <div>
//                       <div className={`font-semibold ${themeClasses.text}`}>Eligibility</div>
//                       <div className={`${themeClasses.textMuted} text-sm mt-1`}>{event.eligibility}</div>
//                     </div>
//                   </div>
//                 )}
//                 {event.rules && (
//                   <div
//                     className={`flex items-start gap-4 p-4 ${isDarkMode ? "bg-gray-800/30" : "bg-gray-50"} rounded-xl border ${isDarkMode ? "border-gray-700/50" : "border-gray-200"} col-span-1 md:col-span-2`}
//                   >
//                     <div className={`p-2 ${isDarkMode ? "bg-yellow-900/30" : "bg-yellow-100"} rounded-lg`}>
//                       <AlertCircle className="w-5 h-5 text-yellow-500" />
//                     </div>
//                     <div>
//                       <div className={`font-semibold ${themeClasses.text}`}>Rules & Guidelines</div>
//                       <div className={`${themeClasses.textMuted} text-sm mt-1`}>{event.rules}</div>
//                     </div>
//                   </div>
//                 )}
//                 {(event.contactEmail || event.contactPhone) && (
//                   <div
//                     className={`flex items-start gap-4 p-4 ${isDarkMode ? "bg-gray-800/30" : "bg-gray-50"} rounded-xl border ${isDarkMode ? "border-gray-700/50" : "border-gray-200"} col-span-1 md:col-span-2`}
//                   >
//                     <div className={`p-2 ${isDarkMode ? "bg-green-900/30" : "bg-green-100"} rounded-lg`}>
//                       <Mail className="w-5 h-5 text-green-500" />
//                     </div>
//                     <div>
//                       <div className={`font-semibold ${themeClasses.text}`}>Contact Information</div>
//                       <div className={`${themeClasses.textMuted} text-sm mt-1 space-y-1`}>
//                         {event.contactEmail && <div>Email: {event.contactEmail}</div>}
//                         {event.contactPhone && <div>Phone: {event.contactPhone}</div>}
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//               {/* Categories */}
//               {event.categories && event.categories.length > 0 && (
//                 <div className="mt-8">
//                   <h3 className={`font-semibold ${themeClasses.text} mb-4`}>Categories</h3>
//                   <div className="flex flex-wrap gap-2">
//                     {event.categories.map((category, idx) => (
//                       <span
//                         key={idx}
//                         className={`px-4 py-2 ${isDarkMode ? "bg-indigo-900/30 border-indigo-500/30 text-indigo-300" : "bg-indigo-100 border-indigo-300 text-indigo-700"} border rounded-full text-sm font-medium`}
//                       >
//                         {category}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//               )}
//               {/* Owner Actions */}
//               {isOwner && (
//                 <div className={`mt-8 pt-6 border-t ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
//                   <div className="flex flex-wrap gap-3">
//                     <button
//                       onClick={() => navigate(`/events/edit/${eventId}`)}
//                       className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
//                     >
//                       <Edit3 className="w-4 h-4" />
//                       Edit Event
//                     </button>
//                     <button
//                       onClick={handleDelete}
//                       className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
//                     >
//                       <Trash2 className="w-4 h-4" />
//                       Delete Event
//                     </button>
//                     <button
//                       onClick={() => navigate(`/events/${eventId}/add-feedback`)}
//                       className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
//                     >
//                       <MessageSquare className="w-4 h-4" />
//                       Add Feedback
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Feedback Section */}
//             <div className={`${themeClasses.card} border rounded-2xl p-6 md:p-8`}>
//               <div className="flex items-center gap-3 mb-6">
//                 <MessageSquare className="w-6 h-6 text-indigo-500" />
//                 <h2 className={`text-xl md:text-2xl font-bold ${themeClasses.text}`}>User Feedback</h2>
//               </div>
//               {feedbacks.length > 0 ? (
//                 <div className="space-y-4 hide-scrollbar">
//                   {feedbacks.map((feedback) => (
//                     <div
//                       key={feedback._id}
//                       className={`p-4 md:p-6 ${isDarkMode ? "bg-gray-800/30 border-gray-700/50" : "bg-gray-50 border-gray-200"} border rounded-xl`}
//                     >
//                       <div className="flex items-start justify-between mb-4">
//                         <div>
//                           <div className={`font-semibold ${themeClasses.text}`}>
//                             {feedback.user?.username || "Anonymous"}
//                           </div>
//                           <div className={`text-sm ${themeClasses.textMuted}`}>
//                             {new Date(feedback.createdAt).toLocaleDateString()}
//                           </div>
//                         </div>
//                         <div className="flex items-center gap-1">
//                           {renderStars(feedback.rating)}
//                           <span className={`ml-2 text-sm font-medium ${themeClasses.textSecondary}`}>
//                             {feedback.rating}/5
//                           </span>
//                         </div>
//                       </div>
//                       <p className={`${themeClasses.textSecondary} mb-4`}>{feedback.review}</p>
//                       {user && feedback.user && feedback.user._id === user._id && (
//                         <button
//                           onClick={() => handleDeleteFeedback(feedback._id)}
//                           className="text-red-500 hover:text-red-400 hover:underline text-sm transition-colors"
//                         >
//                           Delete
//                         </button>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="text-center py-12">
//                   <MessageSquare className={`w-16 h-16 mx-auto mb-4 ${themeClasses.textMuted}`} />
//                   <p className={`${themeClasses.textMuted} text-lg`}>No feedback yet</p>
//                   <p className={`${themeClasses.textMuted}`}>Be the first to share your thoughts!</p>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Sidebar */}
//           <div className="space-y-6">
//             {/* Registration Card */}
//             <div className={`${themeClasses.card} border rounded-2xl p-6 shadow-2xl`}>
//               <div className="text-center mb-6">
//                 <div className={`text-3xl md:text-4xl font-bold ${themeClasses.text} mb-2`}>
//                   {event.prizePool ? `₹ ${event.prizePool.toLocaleString()}` : "Free"}
//                 </div>
//                 {event.prizePool && <div className="text-indigo-500">Prize Pool</div>}
//               </div>
//               <div className="space-y-4 mb-6">
//                 <div
//                   className={`flex justify-between items-center p-3 ${isDarkMode ? "bg-gray-800/30" : "bg-gray-50"} rounded-lg`}
//                 >
//                   <span className={themeClasses.textMuted}>Registered</span>
//                   <div className="flex items-center gap-2">
//                     <span className={`font-semibold ${themeClasses.text}`}>{event.registeredUsers?.length || 0}</span>
//                     {(event.registeredUsers?.length || 0) > 50 && <TrendingUp className="w-4 h-4 text-green-500" />}
//                   </div>
//                 </div>
//                 <div
//                   className={`flex justify-between items-center p-3 ${isDarkMode ? "bg-gray-800/30" : "bg-gray-50"} rounded-lg`}
//                 >
//                   <span className={themeClasses.textMuted}>Deadline</span>
//                   <span className={`font-semibold ${themeClasses.text} text-sm`}>
//                     {event.registrationEnd ? new Date(event.registrationEnd).toLocaleDateString() : "Open"}
//                   </span>
//                 </div>
//                 {event.teamMin && event.teamMax && (
//                   <div
//                     className={`flex justify-between items-center p-3 ${isDarkMode ? "bg-gray-800/30" : "bg-gray-50"} rounded-lg`}
//                   >
//                     <span className={themeClasses.textMuted}>Team Size</span>
//                     <span className={`font-semibold ${themeClasses.text}`}>
//                       {event.teamMin} - {event.teamMax}
//                     </span>
//                   </div>
//                 )}
//               </div>

//               {/* Enhanced Registration Logic */}
//               {event.participationType === "Team" ? (
//                 <div className="space-y-4">
//                   {/* Team Status Card */}
//                   {userTeam ? (
//                     <div className={`${themeClasses.card} border rounded-xl p-4 mb-4`}>
//                       <div className="flex items-center justify-between mb-3">
//                         <div className="flex items-center gap-2">
//                           <Users className="w-5 h-5 text-indigo-500" />
//                           <span className={`font-semibold ${themeClasses.text}`}>{userTeam.name}</span>
//                           {userTeam.leader._id === user?._id && <Crown className="w-4 h-4 text-yellow-500" />}
//                         </div>
//                         <span className={`text-sm ${themeClasses.textMuted}`}>
//                           {userTeam.members.length}/{event.teamMax} members
//                         </span>
//                       </div>

//                       <div className="flex flex-wrap gap-2 mb-3">
//                         {userTeam.members.slice(0, 3).map((member, index) => (
//                           <div
//                             key={member._id}
//                             className={`flex items-center gap-1 px-2 py-1 ${
//                               isDarkMode ? "bg-gray-800/50" : "bg-gray-100"
//                             } rounded-full text-xs`}
//                           >
//                             <div
//                               className={`w-4 h-4 rounded-full ${
//                                 isDarkMode ? "bg-indigo-600" : "bg-indigo-500"
//                               } flex items-center justify-center text-white text-xs font-semibold`}
//                             >
//                               {member.username.charAt(0).toUpperCase()}
//                             </div>
//                             <span className={themeClasses.textSecondary}>{member.username}</span>
//                           </div>
//                         ))}
//                         {userTeam.members.length > 3 && (
//                           <span className={`text-xs ${themeClasses.textMuted}`}>
//                             +{userTeam.members.length - 3} more
//                           </span>
//                         )}
//                       </div>

//                       {/* Team Requirements Check */}
//                       <div className="space-y-2 text-sm">
//                         <div
//                           className={`flex items-center gap-2 ${
//                             userTeam.members.length >= event.teamMin ? "text-green-500" : "text-amber-500"
//                           }`}
//                         >
//                           {userTeam.members.length >= event.teamMin ? (
//                             <CheckCircle className="w-4 h-4" />
//                           ) : (
//                             <AlertCircle className="w-4 h-4" />
//                           )}
//                           Minimum members: {userTeam.members.length}/{event.teamMin}
//                         </div>
//                       </div>
//                     </div>
//                   ) : (
//                     <div
//                       className={`${themeClasses.card} border border-amber-500/30 rounded-xl p-4 bg-amber-500/10 mb-4`}
//                     >
//                       <div className="flex items-center gap-3 mb-3">
//                         <AlertCircle className="w-5 h-5 text-amber-500" />
//                         <span className={`font-semibold ${themeClasses.text}`}>No Team Found</span>
//                       </div>
//                       <p className={`text-sm ${themeClasses.textMuted}`}>
//                         This is a team event. You need to create or join a team before registering.
//                       </p>
//                     </div>
//                   )}

//                   {/* Registration Buttons */}
//                   <div className="space-y-3">
//                     {userTeam ? (
//                       <>
//                         {userTeam.members.length >= event.teamMin ? (
//                           <button
//                             onClick={() => navigate(`/events/${eventId}/team-room`)}
//                             disabled={userTeam.leader._id !== user?._id}
//                             className={`w-full py-4 rounded-xl font-semibold transition-all ${
//                               userTeam.leader._id === user?._id
//                                 ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-green-500/25 transform hover:scale-105"
//                                 : "bg-gray-600 text-gray-400 cursor-not-allowed"
//                             }`}
//                           >
//                             {userTeam.leader._id === user?._id ? (
//                               <>
//                                 <CheckCircle className="w-5 h-5 inline mr-2" />
//                                 Register Team for Event
//                               </>
//                             ) : (
//                               "Only Leader Can Register"
//                             )}
//                           </button>
//                         ) : (
//                           <div className={`p-4 border border-amber-500/30 rounded-xl bg-amber-500/10`}>
//                             <div className="flex items-center gap-3 mb-2">
//                               <AlertCircle className="w-5 h-5 text-amber-400" />
//                               <span className={`font-semibold ${themeClasses.text}`}>Need More Members</span>
//                             </div>
//                             <p className={`text-sm ${themeClasses.textMuted}`}>
//                               You need {event.teamMin - userTeam.members.length} more member
//                               {event.teamMin - userTeam.members.length > 1 ? "s" : ""} to register for this event.
//                             </p>
//                           </div>
//                         )}

//                         <button
//                           onClick={() => navigate(`/events/${eventId}/team-room`)}
//                           className={`w-full py-3 rounded-xl font-semibold transition-all ${themeClasses.card} border hover:border-indigo-500/50`}
//                         >
//                           <Users className="w-4 h-4 inline mr-2" />
//                           Manage Team
//                         </button>
//                       </>
//                     ) : (
//                       <button
//                         onClick={() => navigate(`/events/${eventId}/team-room`)}
//                         className={`w-full py-4 rounded-xl font-semibold transition-all transform hover:scale-105 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg hover:shadow-amber-500/25`}
//                       >
//                         <UserPlus className="w-4 h-4 inline mr-2" />
//                         Create or Join Team
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               ) : (
//                 // Individual Event Registration
//                 <button
//                   onClick={handleRegister}
//                   disabled={isUserRegistered() || registering || daysLeft < 0}
//                   className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 ${
//                     isUserRegistered()
//                       ? isDarkMode
//                         ? "bg-green-900/30 border border-green-500/30 text-green-300 cursor-not-allowed"
//                         : "bg-green-100 border border-green-300 text-green-700 cursor-not-allowed"
//                       : registering
//                         ? isDarkMode
//                           ? "bg-indigo-900/30 border border-indigo-500/30 text-indigo-300 cursor-not-allowed animate-pulse"
//                           : "bg-indigo-100 border border-indigo-300 text-indigo-700 cursor-not-allowed animate-pulse"
//                         : daysLeft < 0
//                           ? isDarkMode
//                             ? "bg-gray-800/30 border border-gray-600/30 text-gray-500 cursor-not-allowed"
//                             : "bg-gray-200 border border-gray-300 text-gray-500 cursor-not-allowed"
//                           : themeClasses.primaryButton + " shadow-lg hover:shadow-indigo-500/25"
//                   }`}
//                 >
//                   {isUserRegistered()
//                     ? "✓ Already Registered"
//                     : registering
//                       ? "Registering..."
//                       : daysLeft < 0
//                         ? "Registration Closed"
//                         : "Register Now"}
//                 </button>
//               )}

//               <div className="flex gap-2 mt-4">
//                 <button
//                   onClick={() => shareToWhatsApp(event)}
//                   className={`flex-1 flex items-center justify-center gap-2 py-3 ${themeClasses.button} rounded-lg transition-colors`}
//                 >
//                   <Share2 className="w-4 h-4" />
//                   Share
//                 </button>
//                 <button
//                   className={`flex-1 flex items-center justify-center gap-2 py-3 ${themeClasses.button} rounded-lg transition-colors`}
//                 >
//                   <Bookmark className="w-4 h-4" />
//                   Save
//                 </button>
//               </div>
//             </div>

//             {/* Quick Stats */}
//             <div className={`${themeClasses.card} border rounded-2xl p-6`}>
//               <h3 className={`font-bold ${themeClasses.text} mb-4 flex items-center gap-2`}>
//                 <TrendingUp className="w-5 h-5 text-indigo-500" />
//                 Quick Stats
//               </h3>
//               <div className="space-y-3">
//                 <div className="flex justify-between items-center">
//                   <span className={themeClasses.textMuted}>Views</span>
//                   <span className={`font-semibold ${themeClasses.text}`}>{event.views || 0}</span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className={themeClasses.textMuted}>Registrations</span>
//                   <span className={`font-semibold ${themeClasses.text}`}>{event.registrations || 0}</span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className={themeClasses.textMuted}>Comments</span>
//                   <span className={`font-semibold ${themeClasses.text}`}>{event.commentsCount || 0}</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </div>
//   )
// }

// export default EventDetails
