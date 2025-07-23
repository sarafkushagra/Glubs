import { Route, Routes } from "react-router-dom";
import AuthCard from "./AuthCard/AuthCard";
import SignInForm from "./AuthCard/SignIn";
import SignUpForm from "./AuthCard/SignUp";
import LandingPage from "./Pages/Home";
import About from "./Pages/About";
import EventLanding from "./Events/EventLanding";
import EventDetails from "./Events/EventDetails";
import QRCodeGenerator from "./QR/QR_Generator";
import QRScanner from "./QR/QR_Scanner";
import MyProfile from "./Users/MyProfile";
import HostOpportunityPage from "./Hosts/HostLandingPage";
import ClubAdminDashboard from "./DashBoard/ClubAdminDashboard";
import ClubDetails from "./Clubs/ClubDetails";
import ClubMembers from "./Clubs/ClubMembers";
import ClubEvents from "./Clubs/ClubEvents";
import AllClubs from "./Clubs/AllClubs";
import EditClub from "./Clubs/EditClub";
import AddClub from "./Clubs/AddClub";
import AllUsers from "./Users/AllUsers";
import NotFound from "./Pages/NotFound";
import EmailVerificationPage from "./AuthCard/EmailVarificationPage";
import AddFeedback from "./Events/AddFeedback";
import UsersDetails from "./Users/UsersDetails";
import EditUser from "./Users/EditUser";
import ProtectedRoute from "./ProtectedRoute";
import UnauthorizedPage from "./AuthCard/UnauthorizedPage";
import ForgotPasswordEmail from "./AuthCard/ForgotPasswordEmailPage";
import VerifyOTPAndReset from "./AuthCard/VerifyOtpAndResetPage";
import ResetSuccess from "./AuthCard/ResetSuccess";
import EditFeedback from "./Events/EditFeedback";
import AddHostBasicDetails from "./Hosts/AddHostBasicDetails";
import EditHostBasicDetails from "./Hosts/EditHostBasicDetails";
import TeamRoomPage from "./Hosts/TeamRoomPage";
import Notifications from "./Notifications";
import DashboardPage from "./Features/Features";

{/*Explore Features */}
import AttendancePage from "./Features/Explore_Features/AttendancePage";
import EngagementPage from "./Features/Explore_Features/EngagementPage";
import BehaviorPage from "./Features/Explore_Features/BehaviorPage";
import ReachPage from "./Features/Explore_Features/ReachPage";
import FeedbackInsights from "./Features/Explore_Features/FeedbackInsights";
import EventTimeline from "./Features/Explore_Features/EventTimeline";
import LiveMetrics from "./Features/Explore_Features/LiveMetrics";
import GrowthAnalysis from "./Features/Explore_Features/GrowthAnalysis";
import UserDemographics from "./Features/Explore_Features/UserDemographics";
import RoleSelectionDialog from "./AuthCard/RoleSelectionDialog";


export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<About />} />

      <Route path="/auth" element={<AuthCard />} />
      <Route path="/auth/signin" element={<SignInForm />} />
      <Route path="/auth/signup" element={<SignUpForm />} />
      <Route path="/verify" element={<EmailVerificationPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordEmail />} />
      <Route path="/verify-otp" element={<VerifyOTPAndReset />} />
      <Route path="/reset-success" element={<ResetSuccess />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      {/* For Wrong URL */}
      <Route path="*" element={<NotFound />} />
      <Route path="/events" element={<EventLanding />} />
      <Route path="/clubs" element={<AllClubs />} />
      <Route path="/features" element={<DashboardPage />} />
      <Route path="/events/:eventId/team-room" element={<TeamRoomPage />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/role-selection" element={<RoleSelectionDialog />} />


      {/* All users allowed but after verification  */}
      <Route element={<ProtectedRoute />}>
        <Route path="/qr-gen" element={<QRCodeGenerator />} />
        <Route path="/qr-scan" element={<QRScanner />} />
        <Route path="/events/:eventId" element={<EventDetails />} />
        <Route path="/clubs/:clubId" element={<ClubDetails />} />
        <Route path="/users/edit/:id" element={<EditUser />} />
        <Route path="/events/:eventId/add-feedback" element={<AddFeedback />} />
        <Route path="/events/:eventId/edit-feedback/:feedbackId" element={<EditFeedback />} />
        <Route path="/clubs/:clubId/events" element={<ClubEvents />} />
        <Route path="/profile" element={<MyProfile />} />
        <Route path="/hosts" element={<HostOpportunityPage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["admin", "student"]} />}>

      </Route>

      <Route
        element={<ProtectedRoute allowedRoles={["admin", "club-admin"]} />}
      >
        <Route path="/events/add" element={<AddHostBasicDetails />} />
        <Route path="/events/edit/:id" element={<EditHostBasicDetails />} />
        <Route path="/clubs/edit/:clubId" element={<EditClub />} />
        <Route path="/clubs/add" element={<AddClub />} />
        <Route path="/clubs/:clubId/members" element={<ClubMembers />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={"admin"} />}>
        <Route path="/allusers" element={<AllUsers />} />
        <Route path="/clubadmin/dash" element={<ClubAdminDashboard />} />
        <Route path="/users/details/:id" element={<UsersDetails />} />
      </Route>

      {/* Explore Features */}
      <Route path="/AttendancePage" element={<AttendancePage />} />
      <Route path="/EngagementPage" element={<EngagementPage />} />
      <Route path="/BehaviorPage" element={<BehaviorPage />} />
      <Route path="/ReachPage" element={<ReachPage />} />
      <Route path="/FeedbackInsights" element={<FeedbackInsights />} />
      <Route path="/EventTimeline" element={<EventTimeline />} />
      <Route path="/LiveMetrics" element={<LiveMetrics />} />
      <Route path="/GrowthAnalysis" element={<GrowthAnalysis />} />
      <Route path="/UserDemographics" element={<UserDemographics />} />

      {/* For all users */}

    </Routes>
  );
}
