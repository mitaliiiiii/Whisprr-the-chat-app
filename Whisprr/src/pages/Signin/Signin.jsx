import React from "react";
import "../Login/Login.css";
import Navbar from "../../components/Navbar/Navbar";
import assets from "../../assets/assets";
export default function Signin() {
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
              <span className="fontstyle">E-MAIL</span>
              <div className="inpu">
                <input
                  type="text"
                  className="input fontstyle"
                  placeholder="enter your Email"
                />
              </div>
              <span className="fontstyle">Password</span>
              <div className="inpu">
                <input
                  type="text"
                  className="input fontstyle"
                  placeholder="enter your Password"
                />
              </div>
              <button className="submit fontstyle" onClick={()=>console.log("hello submitted")}>SUBMIT</button>
              {/* <span className="fontstyle OR">OR</span> */}
              <button className="google-btn">
                <img src={assets.google} alt="Google" />
              </button>
            </div>
          </div>

          <img src={assets.starsImg} alt="" className="stars" />
          <img src={assets.cloud} alt="" className="cloud cloud1" />
          <img src={assets.cloud} alt="" className="cloud cloud2" />
          <img src={assets.cloud} alt="" className="cloud cloud3" />
          <img src={assets.cloud} alt="" className="cloud cloud4" />
        </div>
      </div>
    </>
  );
}
