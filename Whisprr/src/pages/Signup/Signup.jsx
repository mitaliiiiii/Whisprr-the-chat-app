// src/pages/Signup.jsx
import React, { useState } from "react";
import "../Login/Login.css";
import Navbar from "../../components/Navbar/Navbar.jsx";
import assets from "../../assets/assets.js";
import { supabase } from "../../config/supabaseclient.js";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setLoading(true);
    setMessage("");

    if (!email) {
      setMessage("Please enter an email.");
      setMessageType("error");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
  email,
  options: {
    emailRedirectTo: `${window.location.origin}`,
  },
});


    if (error) {
      setMessage(error.message);
      setMessageType("error");
    } else {
      localStorage.setItem("emailAfterSignup", email);
      setMessage("Magic link sent to your email 📩");
      setMessageType("success");
    }

    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <div className="Login">
        <div className="border">
          <div className="loginborder">
            <div className="loginheader">
              <span className="logintitle fontstyle">SIGN UP</span>
              <div className="icons">
                <img src={assets.icons} alt="" />
              </div>
            </div>
            <div className="logincontent">
              {message && <div className={`message-box ${messageType}`}>{message}</div>}
              <span className="fontstyle">E-MAIL</span>
              <div className="inpu">
                <input
                  type="text"
                  className="input fontstyle"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button className="submit fontstyle" onClick={handleSignup} disabled={loading}>
                {loading ? "Sending..." : "SUBMIT"}
              </button>
            </div>
             <img src={assets.starsImg} alt="" className="stars" />
        <div className="1">
             <img src={assets.cloud} alt="" className="cloud cloud1" />
             <div className="cloud-shadow"></div>
           </div>
           <div className="2">
             <img src={assets.cloud} alt="" className="cloud cloud2" />
             <div className="cloud-shadow"></div>
           </div>
           <div className="3">
             <img src={assets.cloud} alt="" className="cloud cloud3" />
             <div className="cloud-shadow"></div>
           </div>
           <div className="4">
             <img src={assets.cloud} alt="" className="cloud cloud4" />
           <div className="cloud-shadow"></div>
           </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
