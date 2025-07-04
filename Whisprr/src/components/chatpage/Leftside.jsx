
// import React, { useEffect, useState } from 'react';
// import "../../pages/Chat/Chat.css";
// import assets from '../../assets/assets';
// import { supabase } from '../../config/supabaseclient';

// export default function Leftside({ setSelectedUser }) {
//   const [users, setUsers] = useState([]);
//   const [onlineUserIds, setOnlineUserIds] = useState(new Set());

//   // 🟢 Fetch all users from 'profiles'
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

//   // ✅ Setup presence tracking for online status
//   useEffect(() => {
//     let channel;
//     let unsubscribe;

//     const setupPresence = async (user) => {
//       if (!user) {
//         console.log('❌ No user logged in for presence');
//         return;
//       }

//       channel = supabase.channel('online-users', {
//         config: {
//           presence: { key: user.id },
//         },
//       });

//       channel
//         .on('presence', { event: 'sync' }, () => {
//           const state = channel.presenceState();
//           const onlineIds = Object.keys(state);
//           console.log('✅ Online IDs:', onlineIds);
//           setOnlineUserIds(new Set(onlineIds));
//         })
//         .subscribe(async (status) => {
//           if (status === 'SUBSCRIBED') {
//             await channel.track({});
//           }
//         });
//     };

//     const initPresence = async () => {
//       const { data: { session } } = await supabase.auth.getSession();

//       if (session?.user) {
//         setupPresence(session.user);
//       } else {
//         unsubscribe = supabase.auth.onAuthStateChange((event, session) => {
//           if (session?.user) {
//             setupPresence(session.user);
//           } else {
//             console.log('❌ Still no user from onAuthStateChange');
//           }
//         });
//       }
//     };

//     initPresence();

//     return () => {
//       if (channel) channel.unsubscribe();
//       if (unsubscribe) unsubscribe.data?.subscription?.unsubscribe();
//     };
//   }, []);
//   const handleLogout = async () => {
//   const { error } = await supabase.auth.signOut();
//   if (error) {
//     console.error("Logout error:", error.message);
//   } else {
//     // Redirect to login or homepage
//     window.location.href = '/';
//   }
// };

//   return (
//     <div className="leftside">
//       <div className="lefttop">
//         <span className='fontstylee cap'>ALL USERS</span>
//         <div className="menu">
//           <img src={assets.menu_icon} alt="" />
//           <div className="submenu">
//             <p className='fontstyle' onClick={handleLogout}>LOG OUT</p>
//           </div>
//         </div>
//       </div>

//       <div className="leftbox">
//         <div className="chatsearch">
//           <input type="text" className='searchin fontstyle' placeholder='Search Users' />
//           <img src={assets.search_icon} alt="" />
//         </div>

//         <div className='chatbox'>
//           {users.map((user) => (
//             <div
//               key={user.id}
//               className="chat"
//               onClick={() => setSelectedUser(user)} // 🔄 Notify parent of selected user
//               style={{ cursor: 'pointer' }}
//             >
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

  // ✅ Move user to top of list
  const moveUserToTop = (userId) => {
    setUsers((prevUsers) => {
      const index = prevUsers.findIndex((user) => user.id === userId);
      if (index === -1) return prevUsers;
      const updated = [...prevUsers];
      const [targetUser] = updated.splice(index, 1);
      return [targetUser, ...updated];
    });
  };

  // 🟢 Fetch all users from 'profiles'
  // useEffect(() => {
  //   const fetchUsers = async () => {
  //     const { data, error } = await supabase
  //       .from('profiles')
  //       .select('id, username');

  //     if (error) {
  //       console.error('Error fetching users:', error.message);
  //       return;
  //     }

  //     setUsers(data || []);
  //   };

  //   fetchUsers();
  // }, []);
  useEffect(() => {
  const fetchUsers = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const currentUserId = session?.user?.id;

    if (!currentUserId) return;

    // Get the latest message per user involving current user
    const { data: latestMessages, error } = await supabase
      .from("messages")
      .select("sender_id, receiver_id, created_at")
      .or(`sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching messages:", error.message);
      return;
    }

    const seen = new Set();
    const chatUserIds = [];

    // Pick the most recent message per user
    for (const msg of latestMessages) {
      const otherUserId =
        msg.sender_id === currentUserId ? msg.receiver_id : msg.sender_id;

      if (!seen.has(otherUserId)) {
        seen.add(otherUserId);
        chatUserIds.push(otherUserId);
      }
    }

    // Fetch user profiles in the same order
    const { data: usersData, error: userError } = await supabase
      .from("profiles")
      .select("id, username");

    if (userError) {
      console.error("Error fetching users:", userError.message);
      return;
    }

    // Sort users based on message activity
    const sortedUsers = chatUserIds
      .map((id) => usersData.find((u) => u.id === id))
      .filter(Boolean); // remove nulls

    setUsers(sortedUsers);
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

  // 🔄 Reorder user list when a message is received
  useEffect(() => {
    const channel = supabase
      .channel("message-updates")
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          const newMessage = payload.new;
          supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user?.id !== newMessage.sender_id) {
              moveUserToTop(newMessage.sender_id);
            }
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error.message);
    } else {
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
              onClick={() => setSelectedUser(user)}
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

