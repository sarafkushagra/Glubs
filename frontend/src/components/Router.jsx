import React from 'react'
import { Route, Routes } from 'react-router-dom';
import AuthCard from './AuthCard/AuthCard';
import SignInForm from './AuthCard/SignIn';
import SignUpForm from './AuthCard/SignUp';
import LandingPage from './Pages/Home';
import OrganizerSignIn from './ClubAdmin/ClubAdmin';
import About from './Pages/About';
import EventLanding from './Events/EventLanding';
import EventDetails from './Events/EventDetails';
import EditEvent from './Events/EditEvent';
import QRRegistration from './Features/QRRegistration';
import EventAnalytics from './Features/EventAnalytics';
import Organizers from './Features/Organizers';
import QRCodeGenerator from './QR/QR_Generator';
import QRScanner from './QR/QR_Scanner';
import MyProfile from './Pages/MyProfile';
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

import NotFound from './Pages/NotFound';
import EmailVerificationPage from './AuthCard/EmailVarificationPage';

export default function Router() {
  return (
    <Routes>
      <Route path='/' element={<LandingPage />} />

      <Route path='/auth' element={<AuthCard />} />
      <Route path='/auth/signin' element={<SignInForm />} />
      <Route path='/auth/signup' element={<SignUpForm />} />
      <Route path='/verify' element={<EmailVerificationPage />} />

      <Route path='/events' element={<EventLanding />} />
      <Route path="/events/add" element={<AddEvent />} />
      <Route path="/events/:eventId" element={<EventDetails />} />
      <Route path="/events/edit/:eventId" element={<EditEvent />} />

      <Route path="/qr-gen" element={<QRCodeGenerator />} />
      <Route path="/qr-scan" element={<QRScanner />} />

      <Route path='/clubadmin/details' element={<OrganizerSignIn />} />

      <Route path="/clubs" element={<AllClubs />} />
      <Route path="/clubs/:clubId" element={<ClubDetails />} />
      <Route path="/clubs/edit/:clubId" element={<EditClub />} />
      <Route path="/clubs/add" element={<AddClub />} />
      <Route path="/clubs/:clubId/members" element={<ClubMembers />} />
      <Route path="/clubs/:clubId/events" element={<ClubEvents />} />
      
      <Route path="/features/qr-registration" element={<QRRegistration />} />
      <Route path="/features/event-analytics" element={<EventAnalytics />} />
      <Route path="/features/organizers" element={<Organizers />} />
      
      <Route path='/about' element={<About />} />

      <Route path="/host" element={<HostOpportunityPage />} />
      <Route path="/host/hostform" element={<HostForm />} />
{/* DashBoard */}
      <Route path="/clubadmin/dash" element={<ClubAdminDashboard />} />
      <Route path="/host/dash" element={<Dashboard />} />
      <Route path="/host/dashswitch" element={<DashSwitch/>} />

      <Route path="/dashboard/profile" element={<MyProfile />} />

{/* For Wrong URL */}
      <Route path ="*" element={<NotFound />} />
    </Routes>
  )
}
