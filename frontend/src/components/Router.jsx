    import React from 'react'
    import { Route, Routes } from 'react-router-dom';
    import AuthCard from './AuthCard/AuthCard'; 
    import SignInForm from './AuthCard/SignIn';
    import SignUpForm from './AuthCard/SignUp';
    import LandingPage from './Pages/Home';
    import OrganizerSignIn from './ClubAdmin/ClubAdmin';
    import About from './Pages/About';
    import EventLanding from './Events/EventLanding';
    import QRRegistration from './Pages/Features/QRRegistration';
    import EventAnalytics from './Pages/Features/EventAnalytics';
    
export default function Router() {
  return (
   <Routes>
        <Route path='/auth' element={<AuthCard />} />
        <Route path='/auth/signin' element={<SignInForm />} />
        <Route path='/auth/signup' element={<SignUpForm />} />
        <Route path='/events' element={<EventLanding />} />
        <Route path='/' element={<LandingPage />} />
        <Route path='/clubadmin/details' element={<OrganizerSignIn />} />
        <Route path="/features/qr-registration" element={<QRRegistration />} />
        <Route path="/features/event-analytics" element={<EventAnalytics />} />
        
        
        <Route path='/about' element={<About/>}/>
      </Routes>
  )
}
