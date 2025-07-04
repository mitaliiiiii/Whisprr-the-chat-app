
// import React, { useState } from "react";
// import { supabase } from "../../config/supabaseclient";
// import assets from "../../assets/assets";
// import "../../pages/Chat/Chat.css";
// import { v4 as uuidv4 } from "uuid";

// export default function Rightsidebottom({ selectedUser, currentUser }) {
//   const [message, setMessage] = useState("");
//   const [imageFile, setImageFile] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);

//   const handleInputChange = (e) => {
//     setMessage(e.target.value);
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setImageFile(file);
//       setImagePreview(URL.createObjectURL(file));
//     }
//   };

//   // const sendMessage = async () => {
//   //   if (!message.trim() && !imageFile) return;

//   //   if (!currentUser) {
//   //     alert("User not logged in");
//   //     return;
//   //   }

//   //   let imageUrl = null;

//   //   if (imageFile) {
//   //     const fileExt = imageFile.name.split(".").pop();
//   //     const fileName = `${uuidv4()}.${fileExt}`;

//   //     const { error: uploadError } = await supabase.storage
//   //       .from("chat-images")
//   //       .upload(fileName, imageFile);

//   //     if (uploadError) {
//   //       console.error("Image upload failed:", uploadError.message);
//   //       return;
//   //     }

//   //     const { data } = supabase.storage
//   //       .from("chat-images")
//   //       .getPublicUrl(fileName);

//   //     imageUrl = data.publicUrl;
//   //   }

//   //   const { error: insertError } = await supabase.from("messages").insert({
//   //     sender_id: currentUser.id,
//   //     receiver_id: selectedUser.id,
//   //     content: message.trim() || null,
//   //     image_url: imageUrl,
//   //   });

//   //   if (insertError) {
//   //     console.error("Message insert failed:", insertError.message);
//   //   } else {
//   //     setMessage("");
//   //     setImageFile(null);
//   //     setImagePreview(null);
//   //   }
//   // };
// const sendMessage = async () => {
//   if (!message.trim() && !imageFile) return;

//   if (!currentUser) {
//     alert("User not logged in");
//     return;
//   }

//   let imageUrl = null;

//   if (imageFile) {
//     const fileExt = imageFile.name.split(".").pop();
//     const fileName = `${uuidv4()}.${fileExt}`;

//     const { error: uploadError } = await supabase.storage
//       .from("chat-images")
//       .upload(fileName, imageFile);

//     if (uploadError) {
//       console.error("Image upload failed:", uploadError.message);
//       return;
//     }

//     const { data } = supabase.storage
//       .from("chat-images")
//       .getPublicUrl(fileName);

//     imageUrl = data.publicUrl;
//   }

//   const { error: insertError } = await supabase.from("messages").insert({
//     sender_id: currentUser.id,
//     receiver_id: selectedUser.id,
//     content: message.trim() || null,
//     image_url: imageUrl,
//   });

//   if (insertError) {
//     console.error("Message insert failed:", insertError.message);
//   } else {
//     // ✅ Trigger Email Notification
//     console.log("Sending email to:", selectedUser.email);

//     try {
//       const response = await fetch("https://jklgcoahekvihhhluqus.functions.supabase.co/notifyUser", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           email: selectedUser?.email,
//           senderName: currentUser?.username || currentUser?.name || "Someone",
//           message: message.trim() || "[Image]",
//         }),
//       });

//       const result = await response.json();
//       console.log("Email notification response:", result);
//     } catch (err) {
//       console.error("Error sending email notification:", err);
//     }

//     // Reset UI
//     setMessage("");
//     setImageFile(null);
//     setImagePreview(null);
//   }
// };


//   return (
//     <div className="bottom">
//       <div className="bottombox">
//         <div className="inputbox">
//           <input
//             className="inputtext fontstyle"
//             placeholder="Write your Message"
//             type="text"
//             value={message}
//             onChange={handleInputChange}
//           />
//           <input
//             type="file"
//             id="image"
//             accept="image/png, image/jpg, image/jpeg"
//             hidden
//             onChange={handleFileChange}
//           />
//           <label htmlFor="image">
//             <img className="ime" src={assets.gallery_icon} alt="upload" />
//           </label>
//         </div>

//         {imagePreview && (
//           <div style={{ marginTop: "10px" }}>
//             <img
//               src={imagePreview}
//               alt="Preview"
//               style={{ maxWidth: "150px", borderRadius: "8px" }}
//             />
//           </div>
//         )}

//         <button className="fontstyle cap sendbtn" onClick={sendMessage}>
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }
import React, { useState, useEffect } from "react";
import { supabase } from "../../config/supabaseclient";
import assets from "../../assets/assets";
import "../../pages/Chat/Chat.css";
import { v4 as uuidv4 } from "uuid";

export default function Rightsidebottom({ selectedUser, currentUser }) {
  const [message, setMessage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedUserInfo, setSelectedUserInfo] = useState(null);

  // 📥 Fetch full info for selected user
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!selectedUser?.id) return;
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", selectedUser.id)
        .single();

      if (error) {
        console.error("Failed to fetch selected user info:", error);
        return;
      }

      setSelectedUserInfo(data);
    };

    fetchUserInfo();
  }, [selectedUser]);

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const sendMessage = async () => {
    if (!message.trim() && !imageFile) return;
    if (!currentUser) {
      alert("User not logged in");
      return;
    }
    if (!selectedUserInfo?.email) {
      console.warn("No email found for recipient.");
      return;
    }

    let imageUrl = null;

    if (imageFile) {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${uuidv4()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("chat-images")
        .upload(fileName, imageFile);

      if (uploadError) {
        console.error("Image upload failed:", uploadError.message);
        return;
      }

      const { data } = supabase.storage
        .from("chat-images")
        .getPublicUrl(fileName);

      imageUrl = data.publicUrl;
    }

    const { error: insertError } = await supabase.from("messages").insert({
      sender_id: currentUser.id,
      receiver_id: selectedUserInfo.id,
      content: message.trim() || null,
      image_url: imageUrl,
    });

    if (insertError) {
      console.error("Message insert failed:", insertError.message);
    } else {
      // ✅ Trigger email notification
      console.log("Sending email to:", selectedUserInfo.email);

      fetch("https://jklgcoahekvihhhluqus.functions.supabase.co/notifyUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: selectedUserInfo.email,
          senderName: currentUser.name || currentUser.username || "Someone",
          message: message.trim() || "[Image message]",
        }),
      })
        .then((res) => res.json())
        .then((res) => console.log("Email response:", res))
        .catch((err) => console.error("Email error:", err));

      // ✅ Reset
      setMessage("");
      setImageFile(null);
      setImagePreview(null);
    }
  };

  return (
    <div className="bottom">
      <div className="bottombox">
        <div className="inputbox">
          <input
            className="inputtext fontstyle"
            placeholder="Write your Message"
            type="text"
            value={message}
            onChange={handleInputChange}
          />
          <input
            type="file"
            id="image"
            accept="image/png, image/jpg, image/jpeg"
            hidden
            onChange={handleFileChange}
          />
          <label htmlFor="image">
            <img className="ime" src={assets.gallery_icon} alt="upload" />
          </label>
        </div>

        {imagePreview && (
          <div style={{ marginTop: "10px" }}>
            <img
              src={imagePreview}
              alt="Preview"
              style={{ maxWidth: "150px", borderRadius: "8px" }}
            />
          </div>
        )}

        <button className="fontstyle cap sendbtn" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}

