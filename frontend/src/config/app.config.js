/**
 * Application Configuration
 * Centralized configuration for the entire app
 */

export const APP_CONFIG = {
  // API Configuration
  api: {
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
    timeout: 10000,
    endpoints: {
      // Auth
      auth: {
        signup: '/users/signup',
        signin: '/users/signin',
        verifyOtp: '/users/verify-otp',
        resendOtp: '/users/resend-otp',
        forgotPassword: '/users/forgot-password',
        resetPassword: '/users/reset-password',
        logout: '/users/logout',
        refreshToken: '/users/refresh-token',
      },
      // Users
      users: {
        profile: '/users/profile',
        updateProfile: '/users/profile',
        getUser: '/users/:id',
        listUsers: '/users',
        requestClubAdmin: '/users/request-club-admin',
        getMyJoinRequests: '/users/my-join-requests',
        getMyClubs: '/users/my-clubs',
      },
      // Events
      events: {
        list: '/event',
        create: '/event',
        get: '/event/:id',
        update: '/event/:id',
        delete: '/event/:id',
        register: '/event/:id/register',
        getEvents: '/event/user/my-events',
        getClubEvents: '/event/club/:clubId',
        addFeedback: '/event/:id/feedback',
        getFeedback: '/event/:id/feedback',
      },
      // Clubs
      clubs: {
        list: '/clubs',
        create: '/clubs',
        get: '/clubs/:id',
        update: '/clubs/:id',
        delete: '/clubs/:id',
        joinRequest: '/clubs/:id/join-request',
        getJoinRequests: '/clubs/:id/join-requests',
        approveJoinRequest: '/clubs/:id/approve-join-request/:userId',
        rejectJoinRequest: '/clubs/:id/reject-join-request/:userId',
        getMembers: '/clubs/:id/members',
        removeAdmin: '/clubs/:id/remove-admin/:userId',
      },
      // Teams
      teams: {
        create: '/teams',
        get: '/teams/:id',
        join: '/teams/:id/join/:inviteCode',
        leave: '/teams/:id/leave',
        addMember: '/teams/:id/add-member',
        removeMember: '/teams/:id/remove-member/:userId',
        getInvites: '/teams/invites',
        respondInvite: '/teams/:id/invite-response',
      },
      // Payments
      payments: {
        create: '/api/payments/create',
        verify: '/api/payments/verify',
        getHistory: '/api/payments/history',
      },
      // Admin
      admin: {
        getDashboard: '/admin/dashboard',
        approvePendingAdmin: '/admin/approve-pending-admin/:userId',
        rejectPendingAdmin: '/admin/reject-pending-admin/:userId',
        listPendingAdmins: '/admin/pending-admins',
        getUsers: '/admin/users',
        getEvents: '/admin/events',
        getClubs: '/admin/clubs',
      },
      // Club Admin
      clubAdmin: {
        getDashboard: '/club-admin/dashboard',
        getMembers: '/club-admin/members',
        getEvents: '/club-admin/events',
      },
      // Notifications
      notifications: {
        list: '/api/notifications',
        markRead: '/api/notifications/:id/read',
        markAllRead: '/api/notifications/mark-all-read',
        delete: '/api/notifications/:id',
      },
      // QR
      qr: {
        generate: '/qr/generate',
        scan: '/qr/scan',
      },
      // Attendance
      attendance: {
        markAttendance: '/attendance/mark',
        getReport: '/attendance/report/:eventId',
      },
    },
  },

  // Storage Keys
  storage: {
    user: 'glubsUser',
    token: 'glubsToken',
    theme: 'glubsTheme',
    notifications: 'glubsNotifications',
  },

  // Feature Flags
  features: {
    darkMode: true,
    notifications: true,
    socialSharing: true,
    advancedAnalytics: true,
    qrAttendance: true,
  },

  // Defaults
  defaults: {
    itemsPerPage: 10,
    debounceDelay: 300,
    toastTimeout: 3000,
  },
};

// Get full API URL with path
export const getApiUrl = (path) => {
  const baseURL = APP_CONFIG.api.baseURL;
  return `${baseURL}${path}`;
};

// Get socket URL
export const getSocketUrl = () => {
  return APP_CONFIG.api.baseURL.replace(/\/api\/?$/, '');
};
