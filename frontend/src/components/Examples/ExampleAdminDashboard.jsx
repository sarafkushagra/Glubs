/**
 * Example Admin Dashboard Component
 * Demonstrates best practices for dashboard implementation
 */

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AppProvider';
import { adminService } from '../../services/api.service';
import { Container, Card, Button, Spinner, SkeletonLoader, Alert } from '../UI';
import { handleApiError } from '../../utils/helpers';

export const ExampleAdminDashboard = () => {
  const { user } = useAuth();

  // State
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await adminService.getDashboard();
        setDashboardData(response.data.data);
      } catch (err) {
        const message = handleApiError(err);
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <Container>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <SkeletonLoader height="h-12" />
              </Card>
            ))}
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Welcome, {user?.username || 'Admin'}!
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert
            type="error"
            title="Error"
            message={error}
            onClose={() => setError('')}
          />
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Users"
            value={dashboardData?.totalUsers || 0}
            color="primary"
          />
          <StatCard
            title="Total Clubs"
            value={dashboardData?.totalClubs || 0}
            color="secondary"
          />
          <StatCard
            title="Total Events"
            value={dashboardData?.totalEvents || 0}
            color="accent"
          />
          <StatCard
            title="Total Registrations"
            value={dashboardData?.totalRegistrations || 0}
            color="success"
          />
        </div>

        {/* Pending Admins */}
        <Card>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Pending Admin Requests
            </h2>
            
            {dashboardData?.pendingAdmins?.length > 0 ? (
              <div className="space-y-3">
                {dashboardData.pendingAdmins.map((admin) => (
                  <AdminRequestItem key={admin._id} admin={admin} />
                ))}
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">
                No pending admin requests
              </p>
            )}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Recent Activity
            </h2>
            
            {dashboardData?.recentActivity?.length > 0 ? (
              <div className="space-y-3">
                {dashboardData.recentActivity.map((activity, index) => (
                  <ActivityItem key={index} activity={activity} />
                ))}
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">
                No recent activity
              </p>
            )}
          </div>
        </Card>
      </div>
    </Container>
  );
};

/**
 * StatCard Component
 */
const StatCard = ({ title, value, color = 'primary' }) => {
  const colorClasses = {
    primary: 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300',
    secondary: 'bg-secondary-50 dark:bg-secondary-900/20 text-secondary-700 dark:text-secondary-300',
    accent: 'bg-accent-50 dark:bg-accent-900/20 text-accent-700 dark:text-accent-300',
    success: 'bg-success-50 dark:bg-success-900/20 text-success-700 dark:text-success-300',
  };

  return (
    <Card className={colorClasses[color]}>
      <p className="text-sm font-medium opacity-75">{title}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </Card>
  );
};

/**
 * AdminRequestItem Component
 */
const AdminRequestItem = ({ admin }) => {
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);

  const handleApprove = async () => {
    try {
      setApproving(true);
      // Call API to approve
      // await adminService.approvePendingAdmin(admin._id);
      // Refresh dashboard
    } finally {
      setApproving(false);
    }
  };

  const handleReject = async () => {
    try {
      setRejecting(true);
      // Call API to reject
      // await adminService.rejectPendingAdmin(admin._id);
      // Refresh dashboard
    } finally {
      setRejecting(false);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg">
      <div>
        <p className="font-semibold text-gray-900 dark:text-white">
          {admin.username}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">{admin.email}</p>
      </div>
      <div className="flex gap-2">
        <Button
          variant="success"
          size="sm"
          loading={approving}
          onClick={handleApprove}
        >
          Approve
        </Button>
        <Button
          variant="error"
          size="sm"
          loading={rejecting}
          onClick={handleReject}
        >
          Reject
        </Button>
      </div>
    </div>
  );
};

/**
 * ActivityItem Component
 */
const ActivityItem = ({ activity }) => {
  const activityTypeColors = {
    user_signup: 'primary',
    club_created: 'secondary',
    event_created: 'accent',
    admin_approved: 'success',
  };

  return (
    <div className="flex items-start gap-3 p-3 border-l-4 border-primary-400">
      <div className="flex-grow">
        <p className="font-medium text-gray-900 dark:text-white">
          {activity.title}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {activity.description}
        </p>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-500 whitespace-nowrap">
        {new Date(activity.timestamp).toLocaleDateString()}
      </p>
    </div>
  );
};

export default ExampleAdminDashboard;
