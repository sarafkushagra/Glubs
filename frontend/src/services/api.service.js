/**
 * Centralized API Service
 * Single source of truth for all API calls
 */

import axios from 'axios';
import { APP_CONFIG } from '../config/app.config';

// Create axios instance with default config
const api = axios.create({
  baseURL: APP_CONFIG.api.baseURL,
  timeout: APP_CONFIG.api.timeout,
  withCredentials: true,
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(APP_CONFIG.storage.token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle responses and errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle specific status codes
    if (error.response?.status === 401) {
      // Unauthorized - likely token expired
      localStorage.removeItem(APP_CONFIG.storage.token);
      localStorage.removeItem(APP_CONFIG.storage.user);
      window.dispatchEvent(new Event('authUpdate'));
    }

    // Return consistent error format
    const errorData = {
      message: error.response?.data?.message || error.message || 'An error occurred',
      status: error.response?.status,
      data: error.response?.data,
      originalError: error,
    };

    return Promise.reject(errorData);
  }
);

/**
 * Auth API Service
 */
export const authService = {
  signup: (data) => api.post(APP_CONFIG.api.endpoints.auth.signup, data),
  signin: (data) => api.post(APP_CONFIG.api.endpoints.auth.signin, data),
  verifyOtp: (data) => api.post(APP_CONFIG.api.endpoints.auth.verifyOtp, data),
  resendOtp: (data) => api.post(APP_CONFIG.api.endpoints.auth.resendOtp, data),
  forgotPassword: (data) => api.post(APP_CONFIG.api.endpoints.auth.forgotPassword, data),
  resetPassword: (data) => api.post(APP_CONFIG.api.endpoints.auth.resetPassword, data),
  logout: () => api.post(APP_CONFIG.api.endpoints.auth.logout),
  refreshToken: () => api.post(APP_CONFIG.api.endpoints.auth.refreshToken),
};

/**
 * User API Service
 */
export const userService = {
  getProfile: () => api.get(APP_CONFIG.api.endpoints.users.profile),
  updateProfile: (data) => api.put(APP_CONFIG.api.endpoints.users.updateProfile, data),
  getUser: (id) => api.get(APP_CONFIG.api.endpoints.users.getUser.replace(':id', id)),
  listUsers: (params) => api.get(APP_CONFIG.api.endpoints.users.listUsers, { params }),
  requestClubAdmin: (data) => api.post(APP_CONFIG.api.endpoints.users.requestClubAdmin, data),
  getMyJoinRequests: () => api.get(APP_CONFIG.api.endpoints.users.getMyJoinRequests),
  getMyClubs: () => api.get(APP_CONFIG.api.endpoints.users.getMyClubs),
};

/**
 * Event API Service
 */
export const eventService = {
  list: (params) => api.get(APP_CONFIG.api.endpoints.events.list, { params }),
  create: (data) => api.post(APP_CONFIG.api.endpoints.events.create, data),
  get: (id) => api.get(APP_CONFIG.api.endpoints.events.get.replace(':id', id)),
  update: (id, data) => api.put(APP_CONFIG.api.endpoints.events.update.replace(':id', id), data),
  delete: (id) => api.delete(APP_CONFIG.api.endpoints.events.delete.replace(':id', id)),
  register: (id, data) => api.post(APP_CONFIG.api.endpoints.events.register.replace(':id', id), data),
  getMyEvents: () => api.get(APP_CONFIG.api.endpoints.events.getEvents),
  getClubEvents: (clubId) => api.get(APP_CONFIG.api.endpoints.events.getClubEvents.replace(':clubId', clubId)),
  addFeedback: (id, data) => api.post(APP_CONFIG.api.endpoints.events.addFeedback.replace(':id', id), data),
  getFeedback: (id) => api.get(APP_CONFIG.api.endpoints.events.getFeedback.replace(':id', id)),
};

/**
 * Club API Service
 */
export const clubService = {
  list: (params) => api.get(APP_CONFIG.api.endpoints.clubs.list, { params }),
  create: (data) => api.post(APP_CONFIG.api.endpoints.clubs.create, data),
  get: (id) => api.get(APP_CONFIG.api.endpoints.clubs.get.replace(':id', id)),
  update: (id, data) => api.put(APP_CONFIG.api.endpoints.clubs.update.replace(':id', id), data),
  delete: (id) => api.delete(APP_CONFIG.api.endpoints.clubs.delete.replace(':id', id)),
  requestJoin: (id) => api.post(APP_CONFIG.api.endpoints.clubs.joinRequest.replace(':id', id)),
  getJoinRequests: (id) => api.get(APP_CONFIG.api.endpoints.clubs.getJoinRequests.replace(':id', id)),
  approveJoinRequest: (clubId, userId) =>
    api.post(
      APP_CONFIG.api.endpoints.clubs.approveJoinRequest
        .replace(':id', clubId)
        .replace(':userId', userId)
    ),
  rejectJoinRequest: (clubId, userId) =>
    api.post(
      APP_CONFIG.api.endpoints.clubs.rejectJoinRequest
        .replace(':id', clubId)
        .replace(':userId', userId)
    ),
  getMembers: (id) => api.get(APP_CONFIG.api.endpoints.clubs.getMembers.replace(':id', id)),
  removeAdmin: (clubId, userId) =>
    api.post(
      APP_CONFIG.api.endpoints.clubs.removeAdmin
        .replace(':id', clubId)
        .replace(':userId', userId)
    ),
};

/**
 * Team API Service
 */
export const teamService = {
  create: (data) => api.post(APP_CONFIG.api.endpoints.teams.create, data),
  get: (id) => api.get(APP_CONFIG.api.endpoints.teams.get.replace(':id', id)),
  join: (id, inviteCode) =>
    api.post(
      APP_CONFIG.api.endpoints.teams.join.replace(':id', id).replace(':inviteCode', inviteCode)
    ),
  leave: (id) => api.post(APP_CONFIG.api.endpoints.teams.leave.replace(':id', id)),
  addMember: (id, data) => api.post(APP_CONFIG.api.endpoints.teams.addMember.replace(':id', id), data),
  removeMember: (id, userId) =>
    api.delete(
      APP_CONFIG.api.endpoints.teams.removeMember.replace(':id', id).replace(':userId', userId)
    ),
  getInvites: () => api.get(APP_CONFIG.api.endpoints.teams.getInvites),
  respondInvite: (id, data) =>
    api.post(APP_CONFIG.api.endpoints.teams.respondInvite.replace(':id', id), data),
};

/**
 * Payment API Service
 */
export const paymentService = {
  create: (data) => api.post(APP_CONFIG.api.endpoints.payments.create, data),
  verify: (data) => api.post(APP_CONFIG.api.endpoints.payments.verify, data),
  getHistory: (params) => api.get(APP_CONFIG.api.endpoints.payments.getHistory, { params }),
};

/**
 * Admin API Service
 */
export const adminService = {
  getDashboard: () => api.get(APP_CONFIG.api.endpoints.admin.getDashboard),
  approvePendingAdmin: (userId) =>
    api.post(APP_CONFIG.api.endpoints.admin.approvePendingAdmin.replace(':userId', userId)),
  rejectPendingAdmin: (userId) =>
    api.post(APP_CONFIG.api.endpoints.admin.rejectPendingAdmin.replace(':userId', userId)),
  listPendingAdmins: () => api.get(APP_CONFIG.api.endpoints.admin.listPendingAdmins),
  getUsers: (params) => api.get(APP_CONFIG.api.endpoints.admin.getUsers, { params }),
  getEvents: (params) => api.get(APP_CONFIG.api.endpoints.admin.getEvents, { params }),
  getClubs: (params) => api.get(APP_CONFIG.api.endpoints.admin.getClubs, { params }),
};

/**
 * Club Admin API Service
 */
export const clubAdminService = {
  getDashboard: () => api.get(APP_CONFIG.api.endpoints.clubAdmin.getDashboard),
  getMembers: (params) => api.get(APP_CONFIG.api.endpoints.clubAdmin.getMembers, { params }),
  getEvents: (params) => api.get(APP_CONFIG.api.endpoints.clubAdmin.getEvents, { params }),
};

/**
 * Notification API Service
 */
export const notificationService = {
  list: () => api.get(APP_CONFIG.api.endpoints.notifications.list),
  markRead: (id) => api.put(APP_CONFIG.api.endpoints.notifications.markRead.replace(':id', id)),
  markAllRead: () => api.put(APP_CONFIG.api.endpoints.notifications.markAllRead),
  delete: (id) => api.delete(APP_CONFIG.api.endpoints.notifications.delete.replace(':id', id)),
};

/**
 * QR API Service
 */
export const qrService = {
  generate: (data) => api.post(APP_CONFIG.api.endpoints.qr.generate, data),
  scan: (data) => api.post(APP_CONFIG.api.endpoints.qr.scan, data),
};

/**
 * Attendance API Service
 */
export const attendanceService = {
  mark: (data) => api.post(APP_CONFIG.api.endpoints.attendance.markAttendance, data),
  getReport: (eventId) =>
    api.get(APP_CONFIG.api.endpoints.attendance.getReport.replace(':eventId', eventId)),
};

// Export raw axios instance for custom requests if needed
export default api;
