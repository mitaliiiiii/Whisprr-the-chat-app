
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
  
 useEffect(() => {
  const fetchUsers = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      console.log("No logged-in user found");
      return;
    }

    const currentUserId = session.user.id;

    // Step 1: Fetch all users
    const { data: allUsers, error: userError } = await supabase
      .from("profiles")
      .select("id, username");

    if (userError) {
      console.error("Error fetching users:", userError.message);
      return;
    }

    // Step 2: Fetch recent messages received by current user
    const { data: recentMessages, error: messageError } = await supabase
      .from("messages")
      .select("sender_id")
      .eq("receiver_id", currentUserId)
      .order("created_at", { ascending: false });

    if (messageError) {
      console.error("Error fetching messages:", messageError.message);
    }

    const senderIds = [...new Set(recentMessages?.map((msg) => msg.sender_id))];

    // Step 3: Prioritize those senders in user list
    const sortedUsers = [
      ...senderIds
        .map((id) => allUsers.find((user) => user.id === id))
        .filter(Boolean),
      ...allUsers.filter((user) => !senderIds.includes(user.id)),
    ];

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

