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
import React, { useEffect } from 'react';
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import Login from './pages/Login/Login.jsx';
import Chat from './pages/Chat/Chat.jsx';
import Signup from './pages/Signup/Signup.jsx';
import { supabase } from './config/supabaseclient';

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
  const handleRedirect = async () => {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      console.error('Error fetching session:', error.message);
      return;
    }

    if (session) {
      const storedEmail = localStorage.getItem('emailAfterSignup');

      if (storedEmail) {
        // Just signed up – go to /Login
        navigate('/Login');
      } else {
        // Already existing user – check profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile && !profileError) {
          navigate('/Chat');
        } else {
          // Something weird – fallback to /
          navigate('/');
        }
      }
    }
  };

  handleRedirect();
}, [navigate, location]);


  return (
    <Routes>
      <Route path='/' element={<Signup />} />
      <Route path='/Chat' element={<Chat />} />
      <Route path='/Login' element={<Login />} />
    </Routes>
  );
};

export default App;
