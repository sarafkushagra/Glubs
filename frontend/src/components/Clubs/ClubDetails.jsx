"use client"

import { useEffect, useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-toastify"
import Footer from "../Pages/Footer"
import Navbar from "../Pages/Navbar"
import { Card } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Users, Send, Loader } from "lucide-react"
import { useTheme } from "../Context/ThemeContext"

const getCategoryColor = (category) => {
  const colors = {
    Arts: "blue",
    Technology: "green",
    Environment: "green",
    Academic: "yellow",
    Sports: "red",
  }
  return colors[category] || "gray"
}

const AnimatedMemberCount = ({ count }) => {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    let start = 0
    const step = () => {
      if (start < count) {
        start += Math.ceil(count / 20)
        if (start > count) start = count
        setDisplay(start)
        setTimeout(step, 20)
      } else {
        setDisplay(count)
      }
    }
    step()
  }, [count])
  return <span>{display}</span>
}

const ClubJoinRequestForm = ({ club, onRequestSent, onCancel }) => {
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/clubs/${club._id}/join`,
        { message },
        { withCredentials: true },
      )

      toast.success("Join request sent successfully!")
      setMessage("")
      if (onRequestSent) onRequestSent()
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send join request")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full mx-4">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Request to Join {club.name}</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Message (Optional)</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell the club admin why you want to join..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows="4"
              maxLength="500"
            />
            <p className="text-xs text-gray-500 mt-1">{message.length}/500 characters</p>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {loading ? "Sending..." : "Send Request"}
            </button>

            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const ClubDetails = () => {
  const { clubId } = useParams()
  const [club, setClub] = useState(null)
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showJoinForm, setShowJoinForm] = useState(false)
  const [userMembershipStatus, setUserMembershipStatus] = useState(null)
  const navigate = useNavigate()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteReason, setDeleteReason] = useState("")
  const [deleting, setDeleting] = useState(false)
  const { theme } = useTheme()
  const isDarkMode = theme === "dark"

  const userData = JSON.parse(localStorage.getItem("glubsUser") || "null")

  useEffect(() => {
    const fetchClub = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/clubs/${clubId}`)
        setClub(res.data)
        setEvents(res.data.events || [])

        // Check if user is already a member or has pending request
        if (userData) {
          checkMembershipStatus()
        }
      } catch (err) {
        setError("Failed to fetch club details")
      } finally {
        setLoading(false)
      }
    }
    fetchClub()
  }, [clubId])

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/clubs/${clubId}/events`)
        setEvents(res.data || [])
      } catch (err) {
        setError("Failed to fetch events")
      }
    }
    fetchEvents()
  }, [clubId])

  const checkMembershipStatus = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/clubs/my/requests`, { withCredentials: true })
      const clubRequest = res.data.requests.find((req) => req.club._id === clubId)
      if (clubRequest) {
        setUserMembershipStatus(clubRequest.status)
      }
    } catch (err) {
      console.error("Failed to check membership status:", err)
    }
  }

  const handleJoinRequestSent = () => {
    setShowJoinForm(false)
    setUserMembershipStatus("pending")
    toast.success("Your join request has been sent to the club admin!")
  }

  if (loading)
    return (
      <div
        className={
          isDarkMode
            ? "flex justify-center items-center h-40 text-white"
            : "flex justify-center items-center h-40 text-gray-800"
        }
      >
        Loading...
      </div>
    )

  if (error)
    return <div className={isDarkMode ? "text-red-500 text-center mt-8" : "text-red-700 text-center mt-8"}>{error}</div>

  if (!club)
    return <div className={isDarkMode ? "text-center text-gray-400" : "text-center text-gray-500"}>Club not found.</div>

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this club?")) return
    try {
      const res = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/clubs/${clubId}`)
      if (res.status === 200) {
        navigate("/clubs")
      } else {
        alert("Failed to delete club.")
      }
    } catch (err) {
      alert("Error deleting club.")
    }
  }
  const isUserMember = userData?.memberOfClubs?.includes(clubId)
  const canApply = userData && !isUserMember &&  userMembershipStatus !== "pending"

  return (
    <div
      className={
        isDarkMode
          ? "min-h-screen bg-gradient-to-br from-black via-gray-900 to-indigo-800 relative"
          : "min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 relative"
      }
    >
      <Navbar />
      <div className="container mx-auto px-4 py-10 pt-28 relative z-10 min-h-[calc(100vh-80px)] flex flex-col">
        <div className="mb-10">
          <div className="mb-8 text-left">
            <h1
              className={
                isDarkMode
                  ? "text-5xl font-extrabold text-white mb-2 tracking-tight"
                  : "text-5xl font-extrabold text-gray-900 mb-2 tracking-tight"
              }
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              {club.name}
            </h1>
            {club.category && (
              <Badge color={getCategoryColor(club.category)} className="mb-2">
                {club.category}
              </Badge>
            )}
            <p className={isDarkMode ? "mb-6 text-gray-300 italic text-lg" : "mb-6 text-gray-600 italic text-lg"}>
              {club.description}
            </p>
            <div
              className={
                isDarkMode
                  ? "flex items-center gap-2 text-sm text-gray-400 mb-2"
                  : "flex items-center gap-2 text-sm text-gray-500 mb-2"
              }
            >
              <Users className="h-4 w-4" />
              <AnimatedMemberCount count={club.members ? club.members.length : 0} /> members
            </div>
            <div
              className={
                isDarkMode
                  ? "flex items-center gap-2 text-sm text-gray-400 mb-2"
                  : "flex items-center gap-2 text-sm text-gray-500 mb-2"
              }
            >
              <span>Created by: {club.createdBy?.username?.toUpperCase() || "Unknown"}</span>
            </div>

            <div className="flex gap-4 flex-wrap mt-4 mb-2 items-center">
              {(userData?.role === "admin" || userData?.role === "club-admin") && (
                <Button
                  onClick={() => navigate(`/clubs/edit/${club._id}`)}
                  className={
                    isDarkMode
                      ? "border border-indigo-400 text-indigo-200 bg-transparent rounded-md px-6 py-2 font-medium text-base transition-all duration-200 hover:bg-indigo-900/30 hover:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      : "border border-indigo-400 text-indigo-700 bg-transparent rounded-md px-6 py-2 font-medium text-base transition-all duration-200 hover:bg-indigo-100/30 hover:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  }
                >
                  Edit Club
                </Button>
              )}

              <Button
                onClick={() => navigate(`/clubs/${club._id}/members`)}
                className={
                  isDarkMode
                    ? "border border-indigo-400 text-indigo-200 bg-transparent rounded-md px-6 py-2 font-medium text-base transition-all duration-200 hover:bg-indigo-900/30 hover:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    : "border border-indigo-400 text-indigo-700 bg-transparent rounded-md px-6 py-2 font-medium text-base transition-all duration-200 hover:bg-indigo-100/30 hover:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                }
              >
                View Members
              </Button>

              {/* Join Club Button */}
              {canApply && (
                <Button
                  onClick={() => setShowJoinForm(true)}
                  className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-md px-6 py-2 font-medium text-base transition-all duration-200 hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl"
                >
                  <Send className="w-4 h-4" />
                  Apply for Club
                </Button>
              )}

              {/* Membership Status */}
              {isUserMember && <Badge className="bg-green-100 text-green-800 px-3 py-1">✓ Member</Badge>}

              {userMembershipStatus === "pending" && (
                <Badge className="bg-yellow-100 text-yellow-800 px-3 py-1">⏳ Request Pending</Badge>
              )}

              {userMembershipStatus === "rejected" && (
                <Badge className="bg-red-100 text-red-800 px-3 py-1">✗ Request Rejected</Badge>
              )}

              {(userData?.role === "admin" || userData?.role === "club-admin") && (
                <>
                  <span className="mx-2 hidden md:inline-block h-6 border-l border-gray-700"></span>
                  <Button
                    onClick={() => setShowDeleteModal(true)}
                    className={
                      isDarkMode
                        ? "border border-red-400 text-red-200 bg-transparent rounded-md px-6 py-2 font-medium text-base transition-all duration-200 hover:bg-red-900/30 hover:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-400 ml-0 md:ml-8"
                        : "border border-red-400 text-red-700 bg-transparent rounded-md px-6 py-2 font-medium text-base transition-all duration-200 hover:bg-red-100/30 hover:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-400 ml-0 md:ml-8"
                    }
                  >
                    Delete Club
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className={isDarkMode ? "border-t border-indigo-100 my-10" : "border-t border-indigo-200 my-10"}></div>

        <h2
          className={isDarkMode ? "text-2xl font-bold mb-6 text-indigo-200" : "text-2xl font-bold mb-6 text-indigo-700"}
        >
          Events Organized by {club.name}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {events.length > 0 ? (
            events.map((event, idx) => (
              <Link
                to={`/events/${event._id}`}
                key={event._id}
                className="block group fade-in w-full h-full"
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                <Card
                  className={`flex flex-col justify-between h-full ${isDarkMode ? "bg-gray-900/60" : "bg-white"} backdrop-blur-lg shadow-xl rounded-md p-7 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 group-hover:-translate-y-2 w-full min-h-[200px]`}
                >
                  <div>
                    <h3
                      className={
                        isDarkMode
                          ? "text-xl font-bold mb-1 text-gray-100 group-hover:text-indigo-300 transition"
                          : "text-xl font-bold mb-1 text-gray-900 group-hover:text-indigo-700 transition"
                      }
                    >
                      {event.title}
                    </h3>
                    <p
                      className={
                        isDarkMode
                          ? "text-gray-300 line-clamp-2 mb-2 min-h-[40px]"
                          : "text-gray-700 line-clamp-2 mb-2 min-h-[40px]"
                      }
                    >
                      {event.description}
                    </p>
                    <div className={isDarkMode ? "text-sm text-gray-400 mt-2" : "text-sm text-gray-500 mt-2"}>
                      {event.date ? new Date(event.date).toLocaleString() : ""}
                    </div>
                  </div>
                  <span
                    className={
                      isDarkMode
                        ? "inline-block mt-2 text-xs text-indigo-400 font-semibold group-hover:underline"
                        : "inline-block mt-2 text-xs text-indigo-700 font-semibold group-hover:underline"
                    }
                  >
                    View Event →
                  </span>
                </Card>
              </Link>
            ))
          ) : (
            <div
              className={isDarkMode ? "col-span-2 text-center text-gray-500" : "col-span-2 text-center text-gray-400"}
            >
              No events found for this club.
            </div>
          )}
        </div>
      </div>

      <Footer />

      {/* Join Request Form Modal */}
      {showJoinForm && (
        <ClubJoinRequestForm
          club={club}
          onRequestSent={handleJoinRequestSent}
          onCancel={() => setShowJoinForm(false)}
        />
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div
            className={
              isDarkMode
                ? "bg-gray-900/90 rounded-lg shadow-2xl p-8 max-w-md w-full relative animate-fade-in flex flex-col items-center"
                : "bg-white rounded-lg shadow-2xl p-8 max-w-md w-full relative animate-fade-in flex flex-col items-center"
            }
          >
            <h3 className={isDarkMode ? "text-xl font-bold text-white mb-4" : "text-xl font-bold text-gray-900 mb-4"}>
              Delete Club
            </h3>
            <p className={isDarkMode ? "text-gray-300 mb-2 text-center" : "text-gray-600 mb-2 text-center"}>
              Are you sure you want to delete this club? Please provide a reason for deletion.
            </p>
            <textarea
              className={
                isDarkMode
                  ? "w-full min-h-[80px] rounded-md p-2 bg-gray-800 text-gray-100 border border-gray-700 mb-4 focus:outline-none focus:ring-2 focus:ring-red-400"
                  : "w-full min-h-[80px] rounded-md p-2 bg-gray-100 text-gray-900 border border-gray-300 mb-4 focus:outline-none focus:ring-2 focus:ring-red-400"
              }
              placeholder="Reason for deletion..."
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
              disabled={deleting}
            />
            <div className="flex gap-4 mt-2">
              <Button
                onClick={async () => {
                  if (!deleteReason.trim()) {
                    alert("Reason is required.")
                    return
                  }
                  setDeleting(true)
                  try {
                    const res = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/clubs/${clubId}`)
                    if (res.status === 200) {
                      setShowDeleteModal(false)
                      navigate("/clubs")
                    } else {
                      alert("Failed to delete club.")
                    }
                  } catch (err) {
                    alert("Error deleting club.")
                  } finally {
                    setDeleting(false)
                  }
                }}
                className={
                  isDarkMode
                    ? "border border-red-400 text-red-200 bg-red-700/80 rounded-md px-6 py-2 font-medium text-base transition-all duration-200 hover:bg-red-900/80 hover:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-400"
                    : "border border-red-400 text-red-700 bg-red-100 rounded-md px-6 py-2 font-medium text-base transition-all duration-200 hover:bg-red-200 hover:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-400"
                }
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Confirm Delete"}
              </Button>
              <Button
                onClick={() => {
                  setShowDeleteModal(false)
                  setDeleteReason("")
                }}
                className={
                  isDarkMode
                    ? "border border-gray-400 text-gray-200 bg-gray-800/80 rounded-md px-6 py-2 font-medium text-base transition-all duration-200 hover:bg-gray-700/80 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    : "border border-gray-400 text-gray-700 bg-gray-100 rounded-md px-6 py-2 font-medium text-base transition-all duration-200 hover:bg-gray-200 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                }
                disabled={deleting}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .fade-in {
          opacity: 0;
          animation: fadeIn 0.7s forwards;
        }
        @keyframes fadeIn {
          to { opacity: 1; }
        }
        .animate-fade-in { 
          animation: fadeIn 0.3s; 
        }
      `}</style>
    </div>
  )
}

export default ClubDetails
