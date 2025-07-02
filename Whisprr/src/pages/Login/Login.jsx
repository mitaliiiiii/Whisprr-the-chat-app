
import React, { useState, useEffect } from "react";
import "./Login.css";
import Navbar from "../../components/Navbar/Navbar.jsx";
import assets from "../../assets/assets.js";
import { supabase } from "../../config/supabaseclient.js";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const emailAfterSignup = localStorage.getItem("emailAfterSignup");
    if (emailAfterSignup) {
      setEmail(emailAfterSignup);
    }
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    setMessage("");

    if (!email || !username) {
      setMessage("Enter both email and username.");
      setMessageType("error");
      setLoading(false);
      return;
    }

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      setMessage("Please click the email link before logging in.");
      setMessageType("error");
      setLoading(false);
      return;
    }

    const user = session.user;

    const { data: profile, error: fetchError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      setMessage("Error fetching profile.");
      setMessageType("error");
      setLoading(false);
      return;
    }

    if (profile) {
      if (profile.username !== username || profile.email !== email) {
        setMessage("Username/email mismatch.");
        setMessageType("error");
        setLoading(false);
        return;
      }
      navigate("/Chat");
      setMessage("Logged in ✅");
    } else {
      const { error: insertError } = await supabase.from("profiles").insert({
        id: user.id,
        username,
        email,
      });

      if (insertError) {
        setMessage("Failed to create profile.");
        setMessageType("error");
        setLoading(false);
        return;
      }

      navigate("/Chat");
    }

    localStorage.removeItem("emailAfterSignup");
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <div className="Login">
        <div className="border">
          <div className="loginborder">
            <div className="loginheader">
              <span className="logintitle fontstyle">LOG IN</span>
              <div className="icons">
                <img src={assets.icons} alt="" />
              </div>
            </div>
            <div className="logincontent">
              {message && <div className={`message-box ${messageType}`}>{message}</div>}

              <span className="fontstyle">Username</span>
              <div className="inpu">
                <input
                  type="text"
                  className="input fontstyle"
                  placeholder="Enter your username"
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <span className="fontstyle">E-MAIL</span>
              <div className="inpu">
                <input
                  type="text"
                  className="input fontstyle"
                  value={email}
                  disabled
                />
              </div>

              <button className="submit fontstyle" onClick={handleLogin} disabled={loading}>
                {loading ? "Logging in..." : "SUBMIT"}
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

export default Login;
