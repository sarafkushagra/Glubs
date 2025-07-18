import React from 'react'
import { Route, Routes } from 'react-router-dom';
import AuthCard from './AuthCard/AuthCard';
import SignInForm from './AuthCard/SignIn';
import SignUpForm from './AuthCard/SignUp';
import LandingPage from './Pages/Home';
import About from './Pages/About';
import EventLanding from './Events/EventLanding';
import EventDetails from './Events/EventDetails';
import EditEvent from './Events/EditEvent';
import QRRegistration from './Features/QRRegistration';
import EventAnalytics from './Features/EventAnalytics';
import Organizers from './Features/Organizers';
import QRCodeGenerator from './QR/QR_Generator';
import QRScanner from './QR/QR_Scanner';
import MyProfile from './Users/MyProfile';
import HostOpportunityPage from "./Hosts/HostLandingPage";
import HostForm from "./Hosts/HostForm";
import AddEvent from './Events/AddEvent';
import Dashboard from './DashBoard/UserAdminDashboard';
import DashSwitch from './DashBoard/DashSwitch';
import ClubAdminDashboard from './DashBoard/AdminDashboard';
import ClubDetails from './Clubs/ClubDetails';
import ClubMembers from './Clubs/ClubMembers';
import ClubEvents from './Clubs/ClubEvents';
import AllClubs from './Clubs/AllClubs';
import EditClub from './Clubs/EditClub';
import AddClub from './Clubs/AddClub';
import AllUsers from './Users/AllUsers';
import NotFound from './Pages/NotFound';
import EmailVerificationPage from './AuthCard/EmailVarificationPage';
import AddFeedback from './Events/AddFeedback';
// import ProtectedRoute from './ProtectedRoute';
import UsersDetails from './Users/UsersDetails';
import EditUser from './Users/EditUser';
import ProtectedRoute from './ProtectedRoute';
import UnauthorizedPage from './AuthCard/UnauthorizedPage';
import ForgotPasswordEmail from './AuthCard/ForgotPasswordEmailPage';
import VerifyOTPAndReset from './AuthCard/VerifyOtpAndResetPage';
import ResetSuccess from './AuthCard/ResetSuccess';


export default function Router() {
  return (
    <Routes>
      <Route path='/' element={<LandingPage />} />

      <Route path='/auth' element={<AuthCard />} />
      <Route path='/auth/signin' element={<SignInForm />} />
      <Route path='/auth/signup' element={<SignUpForm />} />
      <Route path='/verify' element={<EmailVerificationPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordEmail />} />
      <Route path="/verify-otp" element={<VerifyOTPAndReset />} />
      <Route path="/reset-success" element={<ResetSuccess />} />
      <Route path='/unauthorized' element={<UnauthorizedPage />} />

      <Route element={<ProtectedRoute/>}>
        <Route path="/events" element={<EventLanding />} />
      </Route>



      <Route path='/events' element={<EventLanding />} />
      <Route path="/clubs" element={<AllClubs />} />
      <Route path="/features/qr-registration" element={<QRRegistration />} />
      <Route path="/features/event-analytics" element={<EventAnalytics />} />
      <Route path="/features/organizers" element={<Organizers />} />
      <Route path='/about' element={<About />} />
      <Route path="/host" element={<HostOpportunityPage />} />
      <Route path="/allusers" element={<AllUsers />} />
      <Route path="/users/details/:id" element={<UsersDetails />} />
      <Route path="/users/edit/:id" element={<EditUser />} />
      {/* For Wrong URL */}
      <Route path="*" element={<NotFound />} />

      {/* <Route element={<ProtectedRoute />}> */}
        <Route path="/clubadmin/dash" element={<ClubAdminDashboard />} />
        <Route path="/events/add" element={<AddEvent />} />
        <Route path="/events/:eventId" element={<EventDetails />} />
        <Route path="/events/:eventId/add-feedback" element={<AddFeedback />} />
        <Route path="/events/edit/:eventId" element={<EditEvent />} />
        <Route path="/qr-gen" element={<QRCodeGenerator />} />
        <Route path="/qr-scan" element={<QRScanner />} />
        <Route path="/clubs/:clubId" element={<ClubDetails />} />
        <Route path="/clubs/edit/:clubId" element={<EditClub />} />
        <Route path="/clubs/:clubId/events" element={<ClubEvents />} />
        <Route path="/clubs/add" element={<AddClub />} />
        <Route path="/clubs/:clubId/members" element={<ClubMembers />} />
        <Route path="/profile" element={<MyProfile />} />
        {/* DashBoard */}
        <Route path="/host/dash" element={<Dashboard />} />
        <Route path="/host/dashswitch" element={<DashSwitch />} />
        <Route path="/host/hostform" element={<HostForm />} />
      {/* </Route> */}
    </Routes>
  )
}
