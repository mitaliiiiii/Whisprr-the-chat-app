// import React, { useEffect } from 'react';
// import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';
// import Login from './pages/Login/Login.jsx';
// import Chat from './pages/Chat/Chat.jsx';
// import { supabase } from './config/supabaseclient';

// const App = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     const handleRedirect = async () => {
//       const {
//         data: { session },
//         error,
//       } = await supabase.auth.getSession();

//       if (error) {
//         console.error('Error fetching session:', error.message);
//         return;
//       }

//       // If user signed up and is redirected, go to login to complete username step
//       if (session && location.pathname === '/') {
//         localStorage.setItem('emailAfterSignup', session.user.email);
//         navigate('/');
//       }
//     };

//     handleRedirect();
//   }, [navigate, location]);

//   return (
//     <Routes>
//       <Route path='/' element={<Login />} />
//       <Route path='/Chat' element={<Chat />} />
//     </Routes>
//   );
// };

// export default App;
// App.jsx
// src/App.jsx
import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Signup from './pages/Signup/Signup.jsx';
import Login  from './pages/Login/Login.jsx';
import Chat   from './pages/Chat/Chat.jsx';
import { supabase } from './config/supabaseclient.js';

const App = () => {
  const navigate  = useNavigate();
  const location  = useLocation();

  useEffect(() => {
    const checkSessionAndRoute = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Supabase session error:', error.message);
        return;
      }

      // ── 1. No active session ──────────────────────────────────────────────
      if (!session) {
        // Block unauthenticated users from visiting /Chat directly
        if (location.pathname.toLowerCase() === '/chat') {
          navigate('/', { replace: true });           // send them to Sign‑up
        }
        return;                                       // nothing more to do
      }

      // ── 2. Session exists ─────────────────────────────────────────────────
      // Ensure Login page has the email we got during signup
      if (!localStorage.getItem('emailAfterSignup')) {
        localStorage.setItem('emailAfterSignup', session.user.email);
      }

      // If user lands on root (/) while signed in, push them to /Login
      // so they complete / validate their profile before chatting.
      if (location.pathname === '/' || location.pathname === '') {
        navigate('/Login', { replace: true });
      }
    };

    checkSessionAndRoute();
  }, [location.pathname, navigate]);

  return (
    <Routes>
      <Route path='/'       element={<Signup />} />
      <Route path='/Login'  element={<Login  />} />
      <Route path='/Chat'   element={<Chat   />} />
    </Routes>
  );
};

export default App;
