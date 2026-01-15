import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import { io } from "socket.io-client"
import axios from "axios"

const NotificationContext = createContext()

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const SOCKET_URL = API_BASE_URL.replace("/api", "") // Assuming API is like http://localhost:3000

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [socket, setSocket] = useState(null)

    const fetchNotifications = useCallback(async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/notifications`, { withCredentials: true })
            const notifs = res.data.data?.notifications || []
            setNotifications(notifs)
            setUnreadCount(notifs.filter((n) => !n.isRead).length)
        } catch (err) {
            console.error("Error fetching notifications:", err)
        }
    }, [])

    useEffect(() => {
        const connectSocket = () => {
            const userData = localStorage.getItem("glubsUser")
            const user = userData ? JSON.parse(userData) : null

            if (user && user._id) {
                const newSocket = io(SOCKET_URL, {
                    withCredentials: true,
                })

                newSocket.on("connect", () => {
                    console.log("Connected to notification socket")
                    newSocket.emit("join", user._id)
                })

                newSocket.on("new_notification", (notification) => {
                    setNotifications((prev) => [notification, ...prev])
                    setUnreadCount((prev) => prev + 1)

                    if (Notification.permission === "granted") {
                        new Notification(notification.title, {
                            body: notification.message,
                            icon: "/logo.png"
                        })
                    }
                })

                setSocket(newSocket)
                fetchNotifications()

                return newSocket
            }
            return null
        }

        const socketInstance = connectSocket()

        // Listen for storage changes (login/logout from other tabs or same window)
        const handleStorageChange = () => {
            if (socketInstance) socketInstance.disconnect()
            connectSocket()
        }
        window.addEventListener("storage", handleStorageChange)

        // Custom event for login/logout in the same tab
        const handleAuthUpdate = () => {
            if (socket) socket.disconnect()
            connectSocket()
        }
        window.addEventListener("authUpdate", handleAuthUpdate)

        return () => {
            if (socketInstance) socketInstance.disconnect()
            window.removeEventListener("storage", handleStorageChange)
            window.removeEventListener("authUpdate", handleAuthUpdate)
        }
    }, [fetchNotifications])

    const markAsRead = async (id) => {
        try {
            await axios.put(`${API_BASE_URL}/notifications/${id}/read`, {}, { withCredentials: true })
            setNotifications((prev) =>
                prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
            )
            setUnreadCount((prev) => Math.max(0, prev - 1))
        } catch (err) {
            console.error("Error marking notification as read:", err)
        }
    }

    const markAllAsRead = async () => {
        try {
            await axios.put(`${API_BASE_URL}/notifications/mark-all-read`, {}, { withCredentials: true })
            setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
            setUnreadCount(0)
        } catch (err) {
            console.error("Error marking all as read:", err)
        }
    }

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                unreadCount,
                markAsRead,
                markAllAsRead,
                refreshNotifications: fetchNotifications,
            }}
        >
            {children}
        </NotificationContext.Provider>
    )
}

export const useNotifications = () => {
    const context = useContext(NotificationContext)
    if (!context) {
        throw new Error("useNotifications must be used within a NotificationProvider")
    }
    return context
}
