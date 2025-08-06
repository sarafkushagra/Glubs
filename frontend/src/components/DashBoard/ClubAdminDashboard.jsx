"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-toastify"
import { Users, Calendar, Globe, UserCheck, CheckCircle, X, Trash2, Mail, Clock, Activity, Bell, Settings, Home, Menu, ChevronRight, RefreshCw, AlertCircle, Loader, Search } from 'lucide-react'
import { CgProfile } from "react-icons/cg"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"

const EnhancedClubAdminDashboard = () => {
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
  })
  const [joinRequests, setJoinRequests] = useState([])
  const [clubMembers, setClubMembers] = useState({})
  const [clubEvents, setClubEvents] = useState({})

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
  })

  const userss = JSON.parse(localStorage.getItem("glubsUser") || "null")
  // Check if user is authenticated and has admin privileges
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

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    setLoading((prev) => ({ ...prev, dashboard: true }))
    setErrors((prev) => ({ ...prev, dashboard: null }))
    try {
      const data = await apiRequest("/club-admin/dashboard")
      setDashboardData(data)
    } catch (error) {
      setErrors((prev) => ({ ...prev, dashboard: error.message }))
      toast.error("Failed to load dashboard data")
      console.error("Dashboard fetch error:", error)
    } finally {
      setLoading((prev) => ({ ...prev, dashboard: false }))
    }
  }

  // Fetch join requests
  const fetchJoinRequests = async (status = "pending") => {
    setLoading((prev) => ({ ...prev, requests: true }))
    setErrors((prev) => ({ ...prev, requests: null }))
    try {
      const data = await apiRequest(`/club-admin/requests?status=${status}`)
      setJoinRequests(data.requests)
    } catch (error) {
      setErrors((prev) => ({ ...prev, requests: error.message }))
      toast.error("Failed to load join requests")
      console.error("Join requests fetch error:", error)
    } finally {
      setLoading((prev) => ({ ...prev, requests: false }))
    }
  }

  // Handle join request (accept/reject)
  const handleJoinRequest = async (requestId, action, rejectionReason = "") => {
    setLoading((prev) => ({ ...prev, action: true }))
    try {
      const response = await apiRequest(`/club-admin/requests/${requestId}`, {
        method: "PATCH",
        data: { action, rejectionReason },
      })

      toast.success(`Request ${action}ed successfully!`)

      // Refresh both requests and dashboard data
      await Promise.all([fetchJoinRequests(), fetchDashboardData()])
    } catch (error) {
      toast.error(`Failed to ${action} request: ${error.message}`)
      console.error(`Handle join request error:`, error)
    } finally {
      setLoading((prev) => ({ ...prev, action: false }))
    }
  }

  // Fetch club members - Fixed to use correct endpoint
  const fetchClubMembers = async (clubId) => {
    setLoading((prev) => ({ ...prev, members: true }))
    try {
      const data = await apiRequest(`/club-admin/clubs/${clubId}/members`)
      // Clear previous data and set only the current club's members
      setClubMembers({ [clubId]: data })
    } catch (error) {
      toast.error("Failed to load club members")
      console.error("Fetch club members error:", error)
    } finally {
      setLoading((prev) => ({ ...prev, members: false }))
    }
  }

  const fetchClubEvents = async (clubId) => {
    setLoading((prev) => ({ ...prev, events: true }))
    try {
      const data = await apiRequest(`/clubs/${clubId}/events`)
      setClubEvents({ [clubId]: data })
    } catch (error) {
      toast.error("Failed to load club events")
      console.error("Fetch club events error:", error)
    } finally {
      setLoading((prev) => ({ ...prev, events: false }))
    }
  }

  // Remove member from club
  const removeMember = async (clubId, memberId) => {
    if (!confirm("Are you sure you want to remove this member?")) return

    setLoading((prev) => ({ ...prev, action: true }))
    try {
      await apiRequest(`/club-admin/clubs/${clubId}/members/${memberId}`, {
        method: "DELETE",
      })

      toast.success("Member removed successfully!")
    
      // Immediately update the UI by removing the member from state
      setClubMembers((prev) => ({
        ...prev,
        [clubId]: {
          ...prev[clubId],
          members: prev[clubId].members.filter(member => member._id !== memberId)
        }
      }))
    
      fetchDashboardData() // Refresh dashboard stats
    } catch (error) {
      toast.error(`Failed to remove member: ${error.message}`)
      console.error("Remove member error:", error)
    } finally {
      setLoading((prev) => ({ ...prev, action: false }))
    }
  }

  // Initial data fetch
  useEffect(() => {
    const initializeData = async () => {
      await fetchDashboardData()
      await fetchJoinRequests()
    }
    initializeData()
  }, [])

  // Auto-refresh data every 30 seconds when on requests tab
  useEffect(() => {
    let interval
    if (activeTab === "requests") {
      interval = setInterval(() => {
        fetchJoinRequests()
      }, 30000) // 30 seconds
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [activeTab])

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

  // Render functions
  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Club Admin Dashboard</h1>
          <p className="text-gray-600">Manage your clubs and member requests</p>
        </div>
        <button
          onClick={fetchDashboardData}
          disabled={loading.dashboard}
          className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading.dashboard ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Error Messages */}
      {errors.dashboard && (
        <ErrorMessage message={`Dashboard Error: ${errors.dashboard}`} onRetry={fetchDashboardData} />
      )}

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
          onClick={() => setActiveTab("members")}
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
          title="Total Events"
          value={dashboardData.stats.totalEvents}
          icon={Calendar}
          color="purple"
          loading={loading.dashboard}
          onClick={() => setActiveTab("events")}
        />
      </div>

      {/* Quick Actions for Pending Requests */}
      {dashboardData.stats.pendingRequests > 0 && (
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-orange-900 mb-1">
                You have {dashboardData.stats.pendingRequests} pending join request
                {dashboardData.stats.pendingRequests > 1 ? "s" : ""}
              </h3>
              <p className="text-orange-700">Review and approve new club members</p>
            </div>
            <button
              onClick={() => setActiveTab("requests")}
              className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors shadow-lg"
            >
              Review Requests
            </button>
          </div>
        </div>
      )}

      {/* My Clubs */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">My Clubs</h3>
        {loading.dashboard ? (
          <LoadingSpinner />
        ) : dashboardData.clubs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboardData.clubs.map((club) => (
              <div
                key={club._id}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                    <Globe className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => {
                        fetchClubMembers(club._id)
                        setActiveTab("members")
                      }}
                      className="text-blue-600 hover:text-blue-700 text-xs font-medium px-2 py-1 border border-blue-200 rounded"
                    >
                      Members
                    </button>
                    <button
                      onClick={() => {
                        fetchClubEvents(club._id)
                        setActiveTab("events")
                      }}
                      className="text-green-600 hover:text-green-700 text-xs font-medium px-2 py-1 border border-green-200 rounded"
                    >
                      Events
                    </button>
                  </div>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{club.name}</h4>
                <p className="text-sm text-gray-600 mb-3">{club.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{club.members.length} members</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">{club.category}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-600">No clubs assigned</p>
            <p className="text-sm text-gray-500">Contact the main admin to get club admin permissions</p>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Events</h3>
        {loading.dashboard ? (
          <LoadingSpinner />
        ) : dashboardData.recentEvents.length > 0 ? (
          <div className="space-y-4">
            {dashboardData.recentEvents.map((event) => (
              <div key={event._id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{event.title}</h4>
                  <p className="text-sm text-gray-600">
                    Created by {event.createdBy?.username} • {new Date(event.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-600">No recent events</p>
          </div>
        )}
      </div>
    </div>
  )

  const renderRequests = () => (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Join Requests</h1>
          <p className="text-gray-600 mt-1">Review and manage club membership requests</p>
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
            onClick={() => fetchJoinRequests()}
            disabled={loading.requests}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading.requests ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {errors.requests && (
        <ErrorMessage message={`Error loading requests: ${errors.requests}`} onRetry={fetchJoinRequests} />
      )}

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">Pending Requests ({joinRequests.length})</h3>
        </div>

        {loading.requests ? (
          <LoadingSpinner />
        ) : joinRequests.length === 0 ? (
          <div className="p-12 text-center">
            <UserCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-600">No pending requests</p>
            <p className="text-sm text-gray-500">New join requests will appear here</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {joinRequests
              .filter(
                (request) =>
                  request.user?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  request.club?.name?.toLowerCase().includes(searchQuery.toLowerCase()),
              )
              .map((request) => (
                <div key={request._id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white font-semibold text-lg">
                          {request.user?.username?.charAt(0)?.toUpperCase() || "?"}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-lg">{request.user?.username}</h4>
                        <div className="flex items-center gap-2 text-gray-600 mt-1">
                          <Mail className="w-4 h-4" />
                          <span>{request.user?.email}</span>
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1">
                            <Globe className="w-4 h-4 text-blue-500" />
                            <span className="text-sm text-gray-600">Club: {request.club?.name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-gray-600">
                              {new Date(request.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        {request.user?.yearOfStudy && (
                          <div className="mt-1">
                            <span className="text-xs text-gray-500">
                              {request.user.yearOfStudy} • {request.user.department || "No department"}
                            </span>
                          </div>
                        )}
                        {request.message && (
                          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm text-gray-700">
                              <strong>Message:</strong> "{request.message}"
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleJoinRequest(request._id, "accept")}
                        disabled={loading.action}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Accept
                      </button>
                      <button
                        onClick={() => {
                          const reason = prompt("Reason for rejection (optional):")
                          if (reason !== null) {
                            handleJoinRequest(request._id, "reject", reason)
                          }
                        }}
                        disabled={loading.action}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
                      >
                        <X className="w-4 h-4" />
                        Reject
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

  // Added back the renderMembers function
  const renderMembers = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Club Members</h1>
        <p className="text-gray-600 mt-1">Manage members across all your clubs</p>
      </div>

      {Object.keys(clubMembers).length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-12 text-center">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-600">No club members loaded</p>
          <p className="text-sm text-gray-500">Click "View Members" on any club from the dashboard to see members</p>
        </div>
      ) : (
        Object.entries(clubMembers).map(([clubId, data]) => (
          <div key={clubId} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900">
                {data.club.name} Members ({data.members.length})
              </h3>
            </div>

            {loading.members ? (
              <LoadingSpinner />
            ) : data.members.length === 0 ? (
              <div className="p-12 text-center">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-600">No members yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Member
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Year of Study
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Department
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
                    {data.members.map((member) => (
                      <tr key={member._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-semibold text-sm">
                                {member.username?.charAt(0)?.toUpperCase()}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-semibold text-gray-900">{member.username}</div>
                              <div className="text-sm text-gray-500">{member.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {member.yearOfStudy || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {member.department || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(member.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => removeMember(clubId, member._id)}
                            disabled={loading.action}
                            className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  )

  const renderEvents = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Club Events</h1>
        <p className="text-gray-600 mt-1">Manage events across all your clubs</p>
      </div>

      {Object.keys(clubEvents).length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-12 text-center">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-600">No club events loaded</p>
          <p className="text-sm text-gray-500">Click "View Events" on any club from the dashboard to see events</p>
        </div>
      ) : (
        Object.entries(clubEvents).map(([clubId, events]) => (
          <div key={clubId} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900">
                Club Events ({events.length})
              </h3>
            </div>

            {loading.events ? (
              <LoadingSpinner />
            ) : events.length === 0 ? (
              <div className="p-12 text-center">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-600">No events yet</p>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                {events.map((event) => (
                  <div key={event._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h4>
                        <p className="text-gray-600 mb-2">{event.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>📅 {new Date(event.date).toLocaleDateString()}</span>
                          <span>👤 {event.createdBy?.username}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  )

  // Updated sidebar items to include members tab
  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: Activity },
    { id: "members", label: "Members", icon: Users },
    { id: "events", label: "Events", icon: Calendar },
    { id: "requests", label: "Join Requests", icon: UserCheck, badge: dashboardData.stats.pendingRequests },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return renderDashboard()
      case "requests":
        return renderRequests()
      case "members":
        return renderMembers()
      case "events":
        return renderEvents()
      case "settings":
        return (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Settings</h2>
              <p className="text-gray-600">Settings and preferences will be available here.</p>
            </div>
          </div>
        )
      default:
        return renderDashboard()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <div
          className={`${sidebarOpen ? "w-64" : "w-16"} bg-white shadow-xl transition-all duration-300 flex flex-col border-r border-gray-200 min-h-screen`}
        >
          {/* Logo */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                <Globe className="w-6 h-6 text-white" />
              </div>
              {sidebarOpen && (
                <div>
                  <h1 className="font-bold text-gray-900 text-lg">Club Admin</h1>
                  <p className="text-xs text-gray-500">Management Panel</p>
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
                <button onClick={() => navigate("/")} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Home className="w-6 h-6 text-gray-600" />
                </button>
                <h2 className="text-2xl font-semibold text-gray-900">
                  {sidebarItems.find((item) => item.id === activeTab)?.label}
                </h2>
              </div>
              <div className="flex items-center gap-4">
                <button
                  className="relative p-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                  onClick={() => setActiveTab("requests")}
                >
                  <Bell className="w-5 h-5" />
                  {dashboardData.stats.pendingRequests > 0 && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                  )}
                </button>
                <span className="font-semibold text-gray-700">Hi, {userss?.username || "Club Admin"}</span>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                  <CgProfile size={24} className="text-white" />
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 p-6 overflow-y-auto">{renderContent()}</main>
        </div>
      </div>
    </div>
  )
}

export default EnhancedClubAdminDashboard
