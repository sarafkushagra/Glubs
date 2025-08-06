"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Clock, CheckCircle, XCircle, Globe, RefreshCw } from "lucide-react"
import { toast } from "react-toastify"
import { FaHome } from "react-icons/fa";
import { Link } from "react-router-dom"

const MyJoinRequests = () => {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMyRequests()
  }, [])

  const fetchMyRequests = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/clubs/my/requests`, {
        withCredentials: true,
      })
      setRequests(response.data.requests)
    } catch (error) {
      console.error("Failed to fetch join requests:", error)
      toast.error("Failed to load your join requests")
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-500" />
      case "accepted":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "accepted":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading your requests...</span>
      </div>
    )
  }

  return (
    <>
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <Link to="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
            <FaHome size={32} />
            </Link>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Club Join Requests</h2>
          <p className="text-gray-600">Track the status of your club membership applications</p>
        </div>
        <button
          onClick={fetchMyRequests}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-600">No join requests</p>
          <p className="text-sm text-gray-500">Your club join requests will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <div
              key={request._id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                    <Globe className="w-6 h-6 text-white" />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{request.club.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{request.club.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                      <span>Category: {request.club.category}</span>
                      <span>•</span>
                      <span>Requested: {new Date(request.createdAt).toLocaleDateString()}</span>
                    </div>

                    {request.message && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-gray-700">
                          <strong>Your message:</strong> "{request.message}"
                        </p>
                      </div>
                    )}

                    {request.status === "rejected" && request.rejectionReason && (
                      <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-200">
                        <p className="text-sm text-red-700">
                          <strong>Rejection reason:</strong> {request.rejectionReason}
                        </p>
                      </div>
                    )}

                    {request.reviewedBy && request.reviewedAt && (
                      <p className="text-xs text-gray-500 mt-2">
                        Reviewed by {request.reviewedBy.username} on {new Date(request.reviewedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {getStatusIcon(request.status)}
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </>
  )
}

export default MyJoinRequests
