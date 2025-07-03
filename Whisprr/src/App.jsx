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
    console.log("🌐 App loaded. Path:", location.pathname);

    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    console.log("📦 Session:", session);
    console.log("❌ Error fetching session:", error);

    if (session) {
      const storedEmail = localStorage.getItem('emailAfterSignup');
      console.log("📧 Email in localStorage:", storedEmail);

      if (storedEmail) {
        console.log("🔁 Redirecting to /Login...");
        navigate('/Login');
      } else {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        console.log("🧾 Profile:", profile);
        console.log("❌ Profile fetch error:", profileError);

        if (profile && !profileError) {
          console.log("✅ Redirecting to /Chat");
          navigate('/Login');
        } else {
          console.log("❓ Unknown user, redirecting to /");
          navigate('/');
        }
      }
    } else {
      console.log("🚫 No session found. Staying on current page.");
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
