    import React from 'react'
    import { Route, Routes } from 'react-router-dom';
    import AuthCard from './AuthCard/AuthCard'; 
    import SignInForm from './AuthCard/SignIn';
    import SignUpForm from './AuthCard/SignUp';
    import LandingPage from './Pages/Home';
    import OrganizerSignIn from './ClubAdmin/ClubAdmin';

export default function Router() {
  return (
   <Routes>
        <Route path='/auth' element={<AuthCard />} />
        <Route path='/auth/signin' element={<SignInForm />} />
        <Route path='/auth/signup' element={<SignUpForm />} />


        <Route path='/' element={<LandingPage />} />
        <Route path='/clubadmin/details' element={<OrganizerSignIn />} />
      </Routes>
  )
}
