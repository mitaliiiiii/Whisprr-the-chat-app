// import React, { useEffect, useState } from 'react';
// import "../../pages/Chat/Chat.css";
// import assets from '../../assets/assets';
// import { supabase } from '../../config/supabaseclient';

// export default function Leftside() {
//   const [users, setUsers] = useState([]);
//   const [onlineUserIds, setOnlineUserIds] = useState(new Set());
//   const markUserOnline = async (userId) => {
//   const { error } = await supabase
//     .from("presence")
//     .upsert({
//       user_id: userId,
//       is_online: true,
//       updated_at: new Date().toISOString(),
//     });

//   if (error) {
//     console.error("⚠️ Failed to update presence:", error.message);
//   } else {
//     console.log("✅ User marked online");
//   }
// };
// useEffect(() => {
//   const checkSession = async () => {
//     const { data: { session }, error } = await supabase.auth.getSession();

//     if (error) {
//       console.error("❌ Error fetching session:", error.message);
//     } else if (!session) {
//       console.log("❌ No session found. User not logged in.");
//     } else {
//       console.log("✅ Logged-in session:", session);
//     }
//   };

//   checkSession();
// }, []);


//   useEffect(() => {
//     const fetchUsers = async () => {
//       const { data, error } = await supabase
//         .from('profiles')
//         .select('id, username');

//       if (error) {
//         console.error('Error fetching users:', error.message);
//         return;
//       }

//       setUsers(data || []);
//     };

//     fetchUsers();
//   }, []);

//   useEffect(() => {
//   let channel;
//   let unsubscribe;

//   const setupPresence = async (user) => {
//     if (!user) {
//       console.log('❌ No user logged in for presence');
//       return;
//     }

//     channel = supabase.channel('online-users', {
//       config: {
//         presence: { key: user.id },
//       },
//     });

//     channel
//       .on('presence', { event: 'sync' }, () => {
//         const state = channel.presenceState();
//         const onlineIds = Object.keys(state);
//         console.log('✅ Online IDs:', onlineIds);
//         setOnlineUserIds(new Set(onlineIds));
//       })
//       .subscribe(async (status) => {
//         if (status === 'SUBSCRIBED') {
//           await channel.track({});
//         }
//       });
//   };

//   const initPresence = async () => {
//     // Try session-based auth first
//     const {
//       data: { session },
//     } = await supabase.auth.getSession();

//     if (session?.user) {
//       setupPresence(session.user);
//     } else {
//       // Fallback: listen for auth state change
//       unsubscribe = supabase.auth.onAuthStateChange((event, session) => {
//         if (session?.user) {
//           setupPresence(session.user);
//         } else {
//           console.log('❌ Still no user from onAuthStateChange');
//         }
//       });
//     }
//   };

//   initPresence();

//   return () => {
//     if (channel) channel.unsubscribe();
//     if (unsubscribe) unsubscribe.data?.subscription?.unsubscribe();
//   };
// }, []);



//   return (
//     <div className="leftside">
//       <div className="lefttop">
//         <span className='fontstylee cap'>ALL USERS</span>
//         <div className="menu">
//           <img src={assets.menu_icon} alt="" />
//           <div className="submenu">
//             <p className='fontstyle'>LOG OUT</p>
//           </div>
//         </div>
//       </div>

//       <div className="leftbox">
//         <div className="chatsearch">
//           <input type="text" className='searchin fontstyle' placeholder='Search Users'/>
//           <img src={assets.search_icon} alt="" />
//         </div>

//         <div className='chatbox'>
//           {users.map((user) => (
//             <div key={user.id} className="chat">
//               <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//                 <p className='fontstyle'>{user.username}</p>
//                 {onlineUserIds.has(user.id) && (
//                   <span
//                     style={{
//                       width: '10px',
//                       height: '10px',
//                       borderRadius: '50%',
//                       backgroundColor: 'limegreen',
//                     }}
//                   />
//                 )}
//               </div>
//               <span className='fontstyle'>say hello</span>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useEffect, useState } from 'react';
import "../../pages/Chat/Chat.css";
import assets from '../../assets/assets';
import { supabase } from '../../config/supabaseclient';

export default function Leftside({ setSelectedUser }) {
  const [users, setUsers] = useState([]);
  const [onlineUserIds, setOnlineUserIds] = useState(new Set());

  // 🟢 Fetch all users from 'profiles'
  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username');

      if (error) {
        console.error('Error fetching users:', error.message);
        return;
      }

      setUsers(data || []);
    };

    fetchUsers();
  }, []);

  // ✅ Setup presence tracking for online status
  useEffect(() => {
    let channel;
    let unsubscribe;

    const setupPresence = async (user) => {
      if (!user) {
        console.log('❌ No user logged in for presence');
        return;
      }

      channel = supabase.channel('online-users', {
        config: {
          presence: { key: user.id },
        },
      });

      channel
        .on('presence', { event: 'sync' }, () => {
          const state = channel.presenceState();
          const onlineIds = Object.keys(state);
          console.log('✅ Online IDs:', onlineIds);
          setOnlineUserIds(new Set(onlineIds));
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            await channel.track({});
          }
        });
    };

    const initPresence = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        setupPresence(session.user);
      } else {
        unsubscribe = supabase.auth.onAuthStateChange((event, session) => {
          if (session?.user) {
            setupPresence(session.user);
          } else {
            console.log('❌ Still no user from onAuthStateChange');
          }
        });
      }
    };

    initPresence();

    return () => {
      if (channel) channel.unsubscribe();
      if (unsubscribe) unsubscribe.data?.subscription?.unsubscribe();
    };
  }, []);
  const handleLogout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Logout error:", error.message);
  } else {
    // Redirect to login or homepage
    window.location.href = '/';
  }
};

  return (
    <div className="leftside">
      <div className="lefttop">
        <span className='fontstylee cap'>ALL USERS</span>
        <div className="menu">
          <img src={assets.menu_icon} alt="" />
          <div className="submenu">
            <p className='fontstyle' onClick={handleLogout}>LOG OUT</p>
          </div>
        </div>
      </div>

      <div className="leftbox">
        <div className="chatsearch">
          <input type="text" className='searchin fontstyle' placeholder='Search Users' />
          <img src={assets.search_icon} alt="" />
        </div>

        <div className='chatbox'>
          {users.map((user) => (
            <div
              key={user.id}
              className="chat"
              onClick={() => setSelectedUser(user)} // 🔄 Notify parent of selected user
              style={{ cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <p className='fontstyle'>{user.username}</p>
                {onlineUserIds.has(user.id) && (
                  <span
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: 'limegreen',
                    }}
                  />
                )}
              </div>
              <span className='fontstyle'>say hello</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

