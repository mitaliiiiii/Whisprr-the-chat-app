import React, { useState } from 'react'
import './Chat.css'
import Navbar from '../../components/Navbar/Navbar'
import assets from '../../assets/assets.js';

const Chat = () => {
  
  return (
    
    <>
    <Navbar/>
    <div className="outsidebox">
      <div className="outsideborder">
                 <img src={assets.starsImg} alt="" className='stars' /> 
         <div className="1"><img src={assets.cloud} alt="" className='cloud clouddd1' /> </div>
         <div className="1"><img src={assets.cloud} alt="" className='cloud clouddd2' /> </div>
        <div className="leftside">
          <span className='fontstylee cap'>MY CHATS</span>
          <div className="leftbox">
            <div className="chatsearch">
              
              <input type="text" className='searchin fontstyle' name="" id="" placeholder='Search Chats'/>
              <img src={assets.search_icon}  alt="" /></div>
              <div className='chatbox'>
            <div className="chat"></div>
            <div className="chat"></div>
            <div className="chat"></div>
            <div className="chat"></div>
            <div className="chat"></div>
            <div className="chat"></div>
            <div className="chat"></div>
            <div className="chat"></div>
            <div className="chat"></div>
            <div className="chat"></div>
            <div className="chat"></div>
            <div className="chat"></div>
            <div className="chat"></div>
            <div className="chat"></div>
         
            <div className="chat"></div></div>
          </div>
        </div>
        
        <div className="rightside">
          <div className="upper">
            <div className="upbox">
              <div className="name fontstyle cap">NAME</div>


              <div className="msgs">
               <div className="msg "><span className="chatmsg fontstyle">hello</span></div>
               <div className="msg"></div>
               <div className="msg"></div>
               <div className="msg"></div>
              </div>
            </div>
          </div>


          <div className="bottom">
            <div className="bottombox">
              <input className='inputtext fontstyle' placeholder='Write your Message' type="text" />
              <button className='fontstyle cap sendbtn'>Send</button>
            </div>
          </div>


        </div>
      </div>
    </div>
    </>
  )
}

export default Chat
