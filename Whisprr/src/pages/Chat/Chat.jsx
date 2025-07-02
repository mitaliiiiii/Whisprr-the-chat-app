import React, { useState, useEffect } from 'react';
import './Chat.css';
import Navbar from '../../components/Navbar/Navbar';
import assets from '../../assets/assets.js';
import Leftside from '../../components/chatpage/Leftside.jsx';
import Rightsidebottom from '../../components/chatpage/Rightsidebottom.jsx';
import Rightsideupper from '../../components/chatpage/Rightsideupper.jsx';
import { supabase } from '../../config/supabaseclient';

const Chat = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // Fetch logged-in user once
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    };
    fetchCurrentUser();
  }, []);

  return (
    <>
      <Navbar />
      <div className="outsidebox">
        <div className="outsideborder">
          <img src={assets.starsImg} alt="" className='stars' />
          <div className="1"><img src={assets.cloud} alt="" className='cloud clouddd1' /></div>
          <div className="1"><img src={assets.cloud} alt="" className='cloud clouddd2' /></div>

          <Leftside setSelectedUser={setSelectedUser} />

          <div className="rightside">
            <Rightsideupper
              selectedUser={selectedUser}
              currentUserId={currentUser?.id}
            />
            <Rightsidebottom
              selectedUser={selectedUser}
              currentUser={currentUser}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
