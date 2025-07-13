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
import QRRegistration from './Pages/Features/QRRegistration';
import EventAnalytics from './Pages/Features/EventAnalytics';
import Organizers from './Pages/Organizers';
import QRCodeGenerator from './QR/QR_Generator';
import QRScanner from './QR/QR_Scanner';
import HostOpportunityPage from "./Events/HostOpportunityPage";
import HostBasicDetails from "./Events/HostBasicDetails";
import MyProfile from './Pages/SideBar/SideBar_Contents/MyProfile';



export default function Router() {
  return (
    <Routes>
      <Route path='/auth' element={<AuthCard />} />
      <Route path='/auth/signin' element={<SignInForm />} />
      <Route path='/auth/signup' element={<SignUpForm />} />
      <Route path='/events' element={<EventLanding />} />
      <Route path="/events/:eventId" element={<EventDetails />} />
      <Route path="/event/edit/:eventId" element={<EditEvent />} />
      <Route path='/' element={<LandingPage />} />
      <Route path='/clubadmin/details' element={<OrganizerSignIn />} />
      <Route path="/features/qr-registration" element={<QRRegistration />} />
      <Route path="/features/event-analytics" element={<EventAnalytics />} />
      <Route path="/organizers" element={<Organizers />} />
      <Route path="/qr-gen" element={<QRCodeGenerator />} />
      <Route path="/qr-scan" element={<QRScanner />} />
      <Route path='/about' element={<About />} />
      <Route path="/host" element={<HostOpportunityPage />} />
      <Route path="/host/basic-details" element={<HostBasicDetails />} />
      <Route path="/dashboard/profile" element={<MyProfile />} />
    </Routes>
  )
}
