// import React, { useEffect, useState } from 'react';
// import "../../pages/Chat/Chat.css";
// import { supabase } from '../../config/supabaseclient';
// import assets from '../../assets/assets';

// export default function Rightsideupper({ selectedUser, currentUserId }) {
//   const [messages, setMessages] = useState([]);
//    const msgsEndRef = useRef(null); // 🔹 Ref to the bottom

//   const scrollToBottom = () => {
//     msgsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   useEffect(() => {
//   if (!selectedUser || !currentUserId) return;

//   const fetchMessages = async () => {
//     const { data, error } = await supabase
//       .from('messages')
//       .select('*')
//       .or(
//         `and(sender_id.eq.${currentUserId},receiver_id.eq.${selectedUser.id}),and(sender_id.eq.${selectedUser.id},receiver_id.eq.${currentUserId})`
//       )
//       .order('created_at', { ascending: true });

//     if (error) {
//       console.error("❌ Error fetching messages:", error.message);
//     } else {
//       setMessages(data);
//     }
//   };

//   fetchMessages();

//   const channel = supabase
//     .channel('realtime-messages')
//     .on(
//       'postgres_changes',
//       {
//         event: 'INSERT',
//         schema: 'public',
//         table: 'messages',
//       },
//       (payload) => {
//         const msg = payload.new;

//         const isRelevant =
//           (msg.sender_id === currentUserId && msg.receiver_id === selectedUser.id) ||
//           (msg.sender_id === selectedUser.id && msg.receiver_id === currentUserId);

//         if (isRelevant) {
//           setMessages((prev) => [...prev, msg]);
//         }
//       }
//     )
//     .subscribe();

//   return () => {
//     supabase.removeChannel(channel);
//   };
// }, [selectedUser, currentUserId]);
//  useEffect(() => {
//     scrollToBottom(); // 🔹 Scroll every time messages update
//   }, [messages]);

//   return (
//     <div className="upper">
//       <div className="upbox">
//         <div className="name fontstyle cap">
//           {selectedUser?.username || "Select User"}
//         </div>

//         <div className="msgs">
//           {messages.map((msg) => {
//             const isSender = msg.sender_id === currentUserId;
//             return (
//               <div key={msg.id} className={`msg ${isSender ? 'msg-s' : 'msg-r'}`}>
//   {msg.content && (
//     <span className="fontstyle">{msg.content}</span>
//   )}
//   <span
//     className={`time ${isSender ? 'time-s' : 'time-r'}`}
//   >
//     {new Date(msg.created_at).toLocaleTimeString([], {
//       hour: '2-digit',
//       minute: '2-digit',
//     })}
//   </span>
// </div>

//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useEffect, useRef, useState } from "react";
import "../../pages/Chat/Chat.css";
import { supabase } from "../../config/supabaseclient";

export default function Rightsideupper({ selectedUser, currentUserId }) {
  const [messages, setMessages] = useState([]);
  const msgsEndRef = useRef(null);

  const scrollToBottom = () => {
    msgsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!selectedUser || !currentUserId) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(
          `and(sender_id.eq.${currentUserId},receiver_id.eq.${selectedUser.id}),and(sender_id.eq.${selectedUser.id},receiver_id.eq.${currentUserId})`
        )
        .order("created_at", { ascending: true });

      if (error) {
        console.error("❌ Error fetching messages:", error.message);
      } else {
        setMessages(data);
      }
    };

    fetchMessages();

    const channel = supabase
      .channel("realtime-messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          const msg = payload.new;
          const isRelevant =
            (msg.sender_id === currentUserId &&
              msg.receiver_id === selectedUser.id) ||
            (msg.sender_id === selectedUser.id &&
              msg.receiver_id === currentUserId);

          if (isRelevant) {
            setMessages((prev) => [...prev, msg]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedUser, currentUserId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="upper">
      <div className="upbox">
        <div className="name fontstyle cap">
          {selectedUser?.username || "Select User"}
        </div>

        <div className="msgs">
          {messages.map((msg) => {
            const isSender = msg.sender_id === currentUserId;
            return (
              <div
                key={msg.id}
                className={`msg ${isSender ? "msg-s" : "msg-r"}`}
              >
                {msg.image_url && (
                  <img
                    src={msg.image_url}
                    alt="sent"
                    className="chat-image"
                    style={{
                      maxWidth: "200px",
                      borderRadius: "8px",
                      marginBottom: msg.content ? "5px" : "0",
                    }}
                  />
                )}
                {msg.content && (
                  <span className="fontstyle">{msg.content}</span>
                )}
                <span className={`time ${isSender ? "time-s" : "time-r"}`}>
                  {new Date(msg.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            );
          })}
          <div ref={msgsEndRef} />
        </div>
      </div>
    </div>
  );
}


