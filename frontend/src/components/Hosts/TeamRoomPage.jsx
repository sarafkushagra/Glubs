import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import Navbar from "../Pages/Navbar"
import Footer from "../Pages/Footer"
import {
  Users,
  Search,
  Plus,
  MessageSquare,
  UserPlus,
  UserMinus,
  Crown,
  GraduationCap,
  Building,
  Calendar,
  ArrowLeft,
  Loader2,
  AlertCircle,
  CheckCircle,
  X,
  Send,
  Clock,
  Trophy,
  Filter,
  ChevronDown,
  Edit3,
  Sparkles,
  Info,
} from "lucide-react"

const TeamRoomPage = () => {
  const { eventId } = useParams()
  const navigate = useNavigate()

  // State variables
  const [event, setEvent] = useState(null)
  const [userTeam, setUserTeam] = useState(null)
  const [availableUsers, setAvailableUsers] = useState([])
  const [teamRequests, setTeamRequests] = useState([])
  const [sentRequests, setSentRequests] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterYear, setFilterYear] = useState("All")
  const [filterDepartment, setFilterDepartment] = useState("All")
  const [showCreateTeam, setShowCreateTeam] = useState(false)
  const [showEditTeam, setShowEditTeam] = useState(false)
  const [teamName, setTeamName] = useState("")
  const [teamDescription, setTeamDescription] = useState("")
  const [selectedUser, setSelectedUser] = useState(null)
  const [requestMessage, setRequestMessage] = useState("")
  const [sendingRequest, setSendingRequest] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [activeTab, setActiveTab] = useState("find") // find, requests, team
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [showErrorAlert, setShowErrorAlert] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [isRegistering, setIsRegistering] = useState(false)

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
        .glass-effect {
          backdrop-filter: blur(20px);
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .gradient-border {
          background: linear-gradient(45deg, #6366f1, #8b5cf6, #ec4899);
          padding: 2px;
          border-radius: 16px;
        }
        .gradient-border-inner {
          background: rgba(17, 24, 39, 0.8);
          border-radius: 14px;
          padding: 1rem;
        }
        .animation-delay-75 {
          animation-delay: 75ms;
        }
        .animation-delay-150 {
          animation-delay: 150ms;
        }
        .animation-delay-300 {
          animation-delay: 300ms;
        }
        .animation-delay-500 {
          animation-delay: 500ms;
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
  }, [eventId])

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
      const userRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/users/me`, { withCredentials: true })
      setUser(userRes.data.user)

      // Fetch event details
      const eventRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/event/${eventId}`, { withCredentials: true })
      setEvent(eventRes.data.event)

      // Fetch user's team if exists
      try {
        const teamRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/teams/user/${userRes.data.user._id}/event/${eventId}`, {
          withCredentials: true,
        })
        setUserTeam(teamRes.data.team)
        setTeamName(teamRes.data.team.name)
        setTeamDescription(teamRes.data.team.description || "")
      } catch (err) {
        console.log("User doesn't have a team")
      }

      // Fetch available users
      const availableRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/users/available/${eventId}`, {
        withCredentials: true,
      })
      setAvailableUsers(availableRes.data.users)

      // Fetch team requests (received)
      const requestsRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/teams/requests/${eventId}`, {
        withCredentials: true,
      })
      setTeamRequests(requestsRes.data.requests)

      // Fetch sent requests
      const sentRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/teams/sent-requests/${eventId}`, {
        withCredentials: true,
      })
      setSentRequests(sentRes.data.requests)
    } catch (err) {
      console.error("Error fetching data:", err)
      showError("Failed to load data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Create a new team
  const createTeam = async () => {
    if (!teamName.trim()) {
      showError("Please enter a team name")
      return
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/teams`,
        {
          name: teamName,
          description: teamDescription,
          eventId,
          leaderId: user._id,
        },
        { withCredentials: true },
      )

      setUserTeam(res.data.team)
      setShowCreateTeam(false)
      fetchData()
      showSuccess("Team created successfully!")
    } catch (err) {
      console.error("Error creating team:", err)
      showError(err.response?.data?.message || "Error creating team. Please try again.")
    }
  }

  // Update team details
  const updateTeam = async () => {
    if (!teamName.trim()) {
      showError("Please enter a team name")
      return
    }

    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/teams/${userTeam._id}`,
        {
          name: teamName,
          description: teamDescription,
        },
        { withCredentials: true },
      )

      setShowEditTeam(false)
      fetchData()
      showSuccess("Team updated successfully!")
    } catch (err) {
      console.error("Error updating team:", err)
      showError(err.response?.data?.message || "Error updating team. Please try again.")
    }
  }

  // Send team invitation
  const sendTeamRequest = async (targetUserId, message = "") => {
    if (!userTeam) {
      showError("You need to create a team first!")
      return
    }

    if (userTeam.leader._id !== user._id) {
      showError("Only team leaders can send invitations!")
      return
    }

    if (userTeam.members.length >= event.teamMax) {
      showError("Your team is already full!")
      return
    }

    try {
      setSendingRequest(true)
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/teams/request`,
        {
          teamId: userTeam._id,
          targetUserId,
          eventId,
          message: message.trim(),
        },
        { withCredentials: true },
      )

      setSelectedUser(null)
      setRequestMessage("")
      fetchData()
      showSuccess("Team invitation sent successfully!")
    } catch (err) {
      console.error("Error sending team request:", err)
      showError(err.response?.data?.message || "Error sending invitation. Please try again.")
    } finally {
      setSendingRequest(false)
    }
  }

  // Respond to team request
  const respondToRequest = async (requestId, action) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/teams/request/${requestId}`, { action }, { withCredentials: true })

      showSuccess(`Request ${action === "accept" ? "accepted" : "rejected"} successfully!`)
      fetchData()
    } catch (err) {
      console.error("Error responding to request:", err)
      showError(err.response?.data?.message || "Error responding to request. Please try again.")
    }
  }

  // Leave team
  const leaveTeam = async () => {
    if (!window.confirm("Are you sure you want to leave this team?")) return

    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/teams/${userTeam._id}/member/${user._id}`, {
        withCredentials: true,
      })

      setUserTeam(null)
      fetchData()
      showSuccess("Left team successfully!")
    } catch (err) {
      console.error("Error leaving team:", err)
      showError(err.response?.data?.message || "Error leaving team. Please try again.")
    }
  }

  // Remove member from team
  const removeMember = async (memberId) => {
    if (!window.confirm("Are you sure you want to remove this member?")) return

    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/teams/${userTeam._id}/member/${memberId}`, {
        withCredentials: true,
      })

      fetchData()
      showSuccess("Member removed successfully!")
    } catch (err) {
      console.error("Error removing member:", err)
      showError(err.response?.data?.message || "Error removing member. Please try again.")
    }
  }

  // Register team for event
  const registerTeam = async () => {
    if (!userTeam) {
      showError("You need to be in a team to register!")
      return
    }

    if (userTeam.leader._id !== user._id) {
      showError("Only team leaders can register the team!")
      return
    }

    if (userTeam.members.length < event.teamMin) {
      showError(`Your team needs at least ${event.teamMin} members to register!`)
      return
    }

    try {
      setIsRegistering(true)
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/event/${eventId}/register-team`,
        { teamId: userTeam._id },
        { withCredentials: true },
      )

      showSuccess("Team registered successfully!")
      setTimeout(() => navigate(`/events/${eventId}`), 1500)
    } catch (err) {
      console.error("Error registering team:", err)
      showError(err.response?.data?.message || "Error registering team. Please try again.")
    } finally {
      setIsRegistering(false)
    }
  }

  // Filter users based on search and filters
  const filteredUsers = availableUsers.filter((u) => {
    const matchesSearch =
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesYear = filterYear === "All" || u.yearOfStudy === filterYear
    const matchesDepartment = filterDepartment === "All" || u.department === filterDepartment
    return matchesSearch && matchesYear && matchesDepartment && u._id !== user?._id
  })

  const years = ["All", "1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year"]
  const departments = ["All", ...new Set(availableUsers.map((u) => u.department).filter(Boolean))]

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

  // Check if event supports teams
  if (!event || event.participationType !== "Team") {
    return (
      <div className={themeClasses.background}>
        <Navbar />
        <div className="text-center py-20">
          <div className={`${themeClasses.card} border rounded-2xl p-12 max-w-md mx-auto shadow-2xl`}>
            <AlertCircle className={`w-20 h-20 mx-auto mb-6 ${themeClasses.textMuted}`} />
            <h3 className={`text-2xl font-bold ${themeClasses.text} mb-4`}>Team Room Not Available</h3>
            <p className={`${themeClasses.textMuted} mb-6`}>This event doesn't support team participation.</p>
            <button
              onClick={() => navigate(`/events/${eventId}`)}
              className={`${themeClasses.primaryButton} px-6 py-3 rounded-xl font-semibold transition-all`}
            >
              Back to Event
            </button>
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

      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(`/events/${eventId}`)}
            className={`flex items-center gap-2 ${themeClasses.textMuted} hover:${themeClasses.text} mb-6 transition-all group`}
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Event
          </button>

          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full blur-lg opacity-75 animate-pulse"></div>
                <div className="relative p-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full">
                  <Users className="w-10 h-10 text-white" />
                </div>
              </div>
              <div>
                <h1 className={`text-5xl font-bold ${themeClasses.text} mb-2`}>Team Room</h1>
                <div className="h-1 w-32 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mx-auto"></div>
              </div>
            </div>
            <p className={`${themeClasses.textSecondary} text-xl mb-6 max-w-2xl mx-auto`}>{event.title}</p>
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-sm">
              <div className={`flex items-center gap-2 ${themeClasses.textMuted}`}>
                <Users className="w-5 h-5 text-indigo-400" />
                <span>
                  Team Size: {event.teamMin} - {event.teamMax}
                </span>
              </div>
              <div className={`flex items-center gap-2 ${themeClasses.textMuted}`}>
                <Calendar className="w-5 h-5 text-purple-400" />
                <span>{new Date(event.date).toLocaleDateString()}</span>
              </div>
              {event.prizePool && (
                <div className={`flex items-center gap-2 ${themeClasses.textMuted}`}>
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  <span>₹{event.prizePool.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Team Status */}
          <div className="lg:col-span-1 space-y-6">
            {/* Current Team Card */}
            {userTeam ? (
              <div className="gradient-border">
                <div className="gradient-border-inner">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className={`text-2xl font-bold ${themeClasses.text} flex items-center gap-3`}>
                      <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      My Team
                    </h2>
                    {userTeam.leader._id === user._id && (
                      <div className="flex items-center gap-2">
                        <Crown className="w-6 h-6 text-yellow-400" />
                        <span className="text-yellow-400 text-sm font-medium">Leader</span>
                      </div>
                    )}
                  </div>
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className={`text-xl font-bold ${themeClasses.text}`}>{userTeam.name}</h3>
                      {userTeam.leader._id === user._id && (
                        <button
                          onClick={() => setShowEditTeam(true)}
                          className={`p-2 ${themeClasses.button} border rounded-lg transition-all hover:scale-105`}
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    {userTeam.description && (
                      <p className={`${themeClasses.textMuted} text-sm mb-4`}>{userTeam.description}</p>
                    )}
                  </div>

                  {/* Team Members */}
                  <div className="space-y-3 mb-6">
                    {userTeam.members.map((member, index) => (
                      <div
                        key={member._id}
                        className={`flex items-center justify-between p-4 ${isDarkMode ? "bg-gray-800/30" : "bg-gray-50"} rounded-xl border ${isDarkMode ? "border-gray-700/50" : "border-gray-200"} transition-all hover:scale-[1.02]`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div
                              className={`w-12 h-12 rounded-full bg-gradient-to-r ${
                                index % 3 === 0
                                  ? "from-indigo-500 to-purple-500"
                                  : index % 3 === 1
                                    ? "from-purple-500 to-pink-500"
                                    : "from-pink-500 to-red-500"
                              } flex items-center justify-center text-white font-bold text-lg shadow-lg`}
                            >
                              {member.username.charAt(0).toUpperCase()}
                            </div>
                            {member._id === userTeam.leader._id && (
                              <div className="absolute -top-1 -right-1 p-1 bg-yellow-400 rounded-full">
                                <Crown className="w-3 h-3 text-yellow-900" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className={`font-semibold ${themeClasses.text} flex items-center gap-2`}>
                              {member.username}
                              {member._id === user._id && (
                                <span className="px-2 py-1 bg-indigo-500/20 text-indigo-400 text-xs rounded-full">
                                  You
                                </span>
                              )}
                            </div>
                            <div className={`text-sm ${themeClasses.textMuted}`}>
                              {member.yearOfStudy} • {member.department || "No Department"}
                            </div>
                          </div>
                        </div>
                        {userTeam.leader._id === user._id && member._id !== user._id && (
                          <button
                            onClick={() => removeMember(member._id)}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all"
                            title="Remove member"
                          >
                            <UserMinus className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Team Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className={`p-4 ${isDarkMode ? "bg-gray-800/30" : "bg-gray-50"} rounded-xl text-center`}>
                      <div className={`text-2xl font-bold ${themeClasses.text}`}>{userTeam.members.length}</div>
                      <div className={`text-sm ${themeClasses.textMuted}`}>Members</div>
                    </div>
                    <div className={`p-4 ${isDarkMode ? "bg-gray-800/30" : "bg-gray-50"} rounded-xl text-center`}>
                      <div className={`text-2xl font-bold ${themeClasses.text}`}>
                        {event.teamMax - userTeam.members.length}
                      </div>
                      <div className={`text-sm ${themeClasses.textMuted}`}>Slots Left</div>
                    </div>
                  </div>

                  {/* Team Actions */}
                  <div className="space-y-3">
                    {userTeam.members.length >= event.teamMin ? (
                      <button
                        onClick={registerTeam}
                        disabled={userTeam.leader._id !== user._id || isRegistering}
                        className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                          userTeam.leader._id === user._id && !isRegistering
                            ? themeClasses.successButton + " transform hover:scale-105"
                            : "bg-gray-600 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        {isRegistering ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Registering...
                          </>
                        ) : userTeam.leader._id === user._id ? (
                          <>
                            <CheckCircle className="w-5 h-5" />
                            Register Team for Event
                          </>
                        ) : (
                          "Only Leader Can Register"
                        )}
                      </button>
                    ) : (
                      <div className={`p-4 border border-amber-500/30 rounded-xl bg-amber-500/10`}>
                        <div className="flex items-center gap-3 mb-2">
                          <AlertCircle className="w-5 h-5 text-amber-400" />
                          <span className={`font-semibold ${themeClasses.text}`}>Need More Members</span>
                        </div>
                        <p className={`text-sm ${themeClasses.textMuted}`}>
                          You need {event.teamMin - userTeam.members.length} more member
                          {event.teamMin - userTeam.members.length > 1 ? "s" : ""} to register for this event.
                        </p>
                      </div>
                    )}
                    {userTeam.leader._id !== user._id && (
                      <button
                        onClick={leaveTeam}
                        className={`w-full py-3 rounded-xl font-semibold transition-all ${themeClasses.dangerButton} flex items-center justify-center gap-2`}
                      >
                        <UserMinus className="w-4 h-4" />
                        Leave Team
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className={`${themeClasses.card} border rounded-2xl p-8 text-center shadow-xl`}>
                <div className="mb-6">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                    <Users className="w-10 h-10 text-white" />
                  </div>
                  <h3 className={`text-2xl font-bold ${themeClasses.text} mb-2`}>No Team Yet</h3>
                  <p className={`${themeClasses.textMuted} mb-6`}>
                    Create a team to start building your dream squad for this event.
                  </p>
                </div>
                <button
                  onClick={() => setShowCreateTeam(true)}
                  className={`${themeClasses.primaryButton} px-8 py-4 rounded-xl font-bold transition-all transform hover:scale-105 flex items-center gap-3 mx-auto`}
                >
                  <Plus className="w-5 h-5" />
                  Create Team
                </button>
              </div>
            )}

            {/* Team Requests */}
            {teamRequests.length > 0 && (
              <div className={`${themeClasses.card} border rounded-2xl p-6 shadow-xl`}>
                <h2 className={`text-xl font-bold ${themeClasses.text} mb-4 flex items-center gap-3`}>
                  <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                    <MessageSquare className="w-5 h-5 text-white" />
                  </div>
                  Team Invitations
                  <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">{teamRequests.length}</span>
                </h2>
                <div className="space-y-3 max-h-[400px] overflow-y-auto hide-scrollbar">
                  {teamRequests.map((request) => (
                    <div
                      key={request._id}
                      className={`p-4 ${isDarkMode ? "bg-gray-800/30" : "bg-gray-50"} rounded-xl border ${isDarkMode ? "border-gray-700/50" : "border-gray-200"}`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                            {request.from.username.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className={`font-semibold ${themeClasses.text}`}>{request.team.name}</div>
                            <div className={`text-sm ${themeClasses.textMuted}`}>from {request.from.username}</div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => respondToRequest(request._id, "accept")}
                            className="p-2 text-green-400 hover:text-green-300 hover:bg-green-500/10 rounded-lg transition-all"
                            title="Accept invitation"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => respondToRequest(request._id, "reject")}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all"
                            title="Reject invitation"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      {request.message && (
                        <p className={`text-sm ${themeClasses.textMuted} bg-gray-700/30 p-3 rounded-lg`}>
                          "{request.message}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sent Requests */}
            {sentRequests.length > 0 && userTeam && (
              <div className={`${themeClasses.card} border rounded-2xl p-6 shadow-xl`}>
                <h2 className={`text-xl font-bold ${themeClasses.text} mb-4 flex items-center gap-3`}>
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                    <Send className="w-5 h-5 text-white" />
                  </div>
                  Sent Invitations
                  <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full">{sentRequests.length}</span>
                </h2>
                <div className="space-y-3 max-h-[300px] overflow-y-auto hide-scrollbar">
                  {sentRequests.map((request) => (
                    <div
                      key={request._id}
                      className={`p-4 ${isDarkMode ? "bg-gray-800/30" : "bg-gray-50"} rounded-xl border ${isDarkMode ? "border-gray-700/50" : "border-gray-200"}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                          {request.to.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className={`font-semibold ${themeClasses.text}`}>{request.to.username}</div>
                          <div className={`text-sm ${themeClasses.textMuted} flex items-center gap-1`}>
                            <Clock className="w-3 h-3" /> Awaiting response
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Content - Find Teammates */}
          <div className="lg:col-span-2">
            <div className={`${themeClasses.card} border rounded-2xl p-8 shadow-2xl`}>
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <h2 className={`text-3xl font-bold ${themeClasses.text} flex items-center gap-3`}>
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                    <Search className="w-8 h-8 text-white" />
                  </div>
                  Find Teammates
                </h2>
                <div className={`text-lg ${themeClasses.textMuted} flex items-center gap-2`}>
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                  {filteredUsers.length} available
                </div>
              </div>

              {/* Search and Filters */}
              <div className="mb-8 space-y-6">
                <div className="relative">
                  <Search
                    className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${themeClasses.textMuted} w-5 h-5`}
                  />
                  <input
                    type="text"
                    placeholder="Search by name or email..."
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
                  Advanced Filters
                  <ChevronDown className={`w-5 h-5 transition-transform ${showFilters ? "rotate-180" : ""}`} />
                </button>
                {showFilters && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl border border-indigo-500/20">
                    <div>
                      <label className={`block text-sm font-semibold ${themeClasses.textSecondary} mb-3`}>
                        Year of Study
                      </label>
                      <select
                        value={filterYear}
                        onChange={(e) => setFilterYear(e.target.value)}
                        className={`w-full px-4 py-3 ${themeClasses.input} border rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all`}
                      >
                        {years.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={`block text-sm font-semibold ${themeClasses.textSecondary} mb-3`}>
                        Department
                      </label>
                      <select
                        value={filterDepartment}
                        onChange={(e) => setFilterDepartment(e.target.value)}
                        className={`w-full px-4 py-3 ${themeClasses.input} border rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all`}
                      >
                        {departments.map((dept) => (
                          <option key={dept} value={dept}>
                            {dept || "No Department"}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Users List */}
              <div className="space-y-4 max-h-[600px] overflow-y-auto hide-scrollbar">
                {filteredUsers.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full flex items-center justify-center">
                      <Users className="w-12 h-12 text-white" />
                    </div>
                    <h3 className={`text-2xl font-bold ${themeClasses.text} mb-4`}>No Users Found</h3>
                    <p className={`${themeClasses.textMuted} text-lg`}>
                      {availableUsers.length === 0
                        ? "All users are already in teams or registered."
                        : "Try adjusting your search filters."}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredUsers.map((availableUser, index) => {
                      const isRequestSent = sentRequests.some((req) => req.to._id === availableUser._id)
                      return (
                        <div
                          key={availableUser._id}
                          className={`p-6 ${isDarkMode ? "bg-gray-800/30" : "bg-gray-50"} rounded-2xl border ${isDarkMode ? "border-gray-700/50" : "border-gray-200"} ${themeClasses.cardHover} transition-all transform hover:scale-[1.02] shadow-lg`}
                        >
                          <div className="flex items-center gap-4 mb-4">
                            <div className="relative">
                              <div
                                className={`w-16 h-16 rounded-full bg-gradient-to-r ${
                                  index % 4 === 0
                                    ? "from-indigo-500 to-purple-500"
                                    : index % 4 === 1
                                      ? "from-purple-500 to-pink-500"
                                      : index % 4 === 2
                                        ? "from-pink-500 to-red-500"
                                        : "from-red-500 to-orange-500"
                                } flex items-center justify-center text-white font-bold text-xl shadow-lg`}
                              >
                                {availableUser.username.charAt(0).toUpperCase()}
                              </div>
                              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white"></div>
                            </div>
                            <div className="flex-1">
                              <div className={`font-bold text-lg ${themeClasses.text} mb-1`}>
                                {availableUser.username}
                              </div>
                              <div className={`text-sm ${themeClasses.textMuted}`}>{availableUser.email}</div>
                            </div>
                          </div>
                          <div className={`space-y-2 mb-6 text-sm ${themeClasses.textSecondary}`}>
                            <div className="flex items-center gap-3">
                              <GraduationCap className="w-4 h-4 text-indigo-400" />
                              <span>{availableUser.yearOfStudy}</span>
                            </div>
                            {availableUser.department && (
                              <div className="flex items-center gap-3">
                                <Building className="w-4 h-4 text-purple-400" />
                                <span>{availableUser.department}</span>
                              </div>
                            )}
                            {availableUser.age && (
                              <div className="flex items-center gap-3">
                                <Calendar className="w-4 h-4 text-pink-400" />
                                <span>{availableUser.age} years old</span>
                              </div>
                            )}
                          </div>
                          {userTeam && userTeam.leader._id === user._id && userTeam.members.length < event.teamMax ? (
                            isRequestSent ? (
                              <button
                                disabled
                                className="w-full py-3 rounded-xl font-semibold transition-all bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 cursor-not-allowed flex items-center justify-center gap-2"
                              >
                                <Clock className="w-5 h-5" />
                                Invitation Sent
                              </button>
                            ) : (
                              <button
                                onClick={() => setSelectedUser(availableUser)}
                                className={`w-full ${themeClasses.primaryButton} py-3 rounded-xl font-semibold transition-all transform hover:scale-105 flex items-center justify-center gap-2`}
                              >
                                <UserPlus className="w-5 h-5" />
                                Send Invitation
                              </button>
                            )
                          ) : (
                            <button
                              disabled
                              className="w-full py-3 rounded-xl font-semibold transition-all bg-gray-600/50 border border-gray-600/30 text-gray-400 cursor-not-allowed flex items-center justify-center gap-2"
                            >
                              {!userTeam ? (
                                <>
                                  <Plus className="w-4 h-4" /> Create Team First
                                </>
                              ) : userTeam.leader._id !== user._id ? (
                                <>
                                  <Info className="w-4 h-4" /> Not Team Leader
                                </>
                              ) : (
                                <>
                                  <AlertCircle className="w-4 h-4" /> Team Full
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Create Team Modal */}
        {showCreateTeam && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div
              className={`${themeClasses.card} border rounded-2xl p-8 w-full max-w-md shadow-2xl transform animate-in zoom-in-95`}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-2xl font-bold ${themeClasses.text} flex items-center gap-3`}>
                  <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
                    <Plus className="w-6 h-6 text-white" />
                  </div>
                  Create Team
                </h3>
                <button
                  onClick={() => setShowCreateTeam(false)}
                  className={`${themeClasses.textMuted} hover:${themeClasses.text} transition-colors p-2 hover:bg-gray-700/30 rounded-lg`}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-6">
                <div>
                  <label className={`block text-sm font-semibold ${themeClasses.textSecondary} mb-3`}>
                    Team Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="Enter your team name"
                    className={`w-full px-4 py-4 ${themeClasses.input} border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-semibold ${themeClasses.textSecondary} mb-3`}>
                    Team Description (Optional)
                  </label>
                  <textarea
                    value={teamDescription}
                    onChange={(e) => setTeamDescription(e.target.value)}
                    placeholder="Brief description of your team and goals"
                    rows={4}
                    className={`w-full px-4 py-4 ${themeClasses.input} border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none`}
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => setShowCreateTeam(false)}
                    className={`flex-1 ${themeClasses.button} border py-4 rounded-xl font-semibold transition-all`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={createTeam}
                    className={`flex-1 ${themeClasses.primaryButton} py-4 rounded-xl font-semibold transition-all transform hover:scale-105`}
                  >
                    Create Team
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Team Modal */}
        {showEditTeam && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div
              className={`${themeClasses.card} border rounded-2xl p-8 w-full max-w-md shadow-2xl transform animate-in zoom-in-95`}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-2xl font-bold ${themeClasses.text} flex items-center gap-3`}>
                  <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
                    <Edit3 className="w-6 h-6 text-white" />
                  </div>
                  Edit Team
                </h3>
                <button
                  onClick={() => setShowEditTeam(false)}
                  className={`${themeClasses.textMuted} hover:${themeClasses.text} transition-colors p-2 hover:bg-gray-700/30 rounded-lg`}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-6">
                <div>
                  <label className={`block text-sm font-semibold ${themeClasses.textSecondary} mb-3`}>
                    Team Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="Enter your team name"
                    className={`w-full px-4 py-4 ${themeClasses.input} border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-semibold ${themeClasses.textSecondary} mb-3`}>
                    Team Description (Optional)
                  </label>
                  <textarea
                    value={teamDescription}
                    onChange={(e) => setTeamDescription(e.target.value)}
                    placeholder="Brief description of your team and goals"
                    rows={4}
                    className={`w-full px-4 py-4 ${themeClasses.input} border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none`}
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => setShowEditTeam(false)}
                    className={`flex-1 ${themeClasses.button} border py-4 rounded-xl font-semibold transition-all`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={updateTeam}
                    className={`flex-1 ${themeClasses.successButton} py-4 rounded-xl font-semibold transition-all transform hover:scale-105`}
                  >
                    Update Team
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Send Request Modal */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div
              className={`${themeClasses.card} border rounded-2xl p-8 w-full max-w-md shadow-2xl transform animate-in zoom-in-95`}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-2xl font-bold ${themeClasses.text} flex items-center gap-3`}>
                  <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                    <Send className="w-6 h-6 text-white" />
                  </div>
                  Send Invitation
                </h3>
                <button
                  onClick={() => setSelectedUser(null)}
                  className={`${themeClasses.textMuted} hover:${themeClasses.text} transition-colors p-2 hover:bg-gray-700/30 rounded-lg`}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                    {selectedUser.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className={`font-bold text-lg ${themeClasses.text}`}>{selectedUser.username}</div>
                    <div className={`text-sm ${themeClasses.textMuted}`}>{selectedUser.email}</div>
                  </div>
                </div>
                <div
                  className={`text-sm ${themeClasses.textSecondary} p-4 bg-indigo-500/10 rounded-xl border border-indigo-500/20`}
                >
                  Inviting to join <span className="font-semibold text-indigo-400">"{userTeam?.name}"</span> for{" "}
                  <span className="font-semibold">{event.title}</span>
                </div>
              </div>
              <div className="mb-6">
                <label className={`block text-sm font-semibold ${themeClasses.textSecondary} mb-3`}>
                  Personal Message (Optional)
                </label>
                <textarea
                  value={requestMessage}
                  onChange={(e) => setRequestMessage(e.target.value)}
                  placeholder="Add a personal message to your invitation..."
                  rows={4}
                  className={`w-full px-4 py-4 ${themeClasses.input} border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none`}
                />
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setSelectedUser(null)}
                  className={`flex-1 ${themeClasses.button} border py-4 rounded-xl font-semibold transition-all`}
                >
                  Cancel
                </button>
                <button
                  onClick={() => sendTeamRequest(selectedUser._id, requestMessage)}
                  disabled={sendingRequest}
                  className={`flex-1 ${themeClasses.successButton} py-4 rounded-xl font-semibold transition-all transform hover:scale-105 flex items-center justify-center gap-2`}
                >
                  {sendingRequest ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Invitation
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default TeamRoomPage
