import React, { useState } from 'react'
import './Login.css'
import Navbar from '../../components/Navbar/Navbar.jsx'

import assets from '../../assets/assets.js';

const Login = () => {
  const[currstate , setcurrstate] = useState('LOG IN')
  return (<>
    <Navbar/>
    <div className='Login'>
      
      <div className='border'>
        <div className='loginborder'> 
          <div className='loginheader'>
            <span className='logintitle fontstyle'>{currstate}</span>
            <div className='icons'>
              <img src={assets.icons} alt="" />
            </div>
          </div>
          <div className='logincontent'>
            {currstate=='SIGN UP'?<div className='username'><span className='fontstyle'>Username</span>
            <div className="inpu"><input type="text"className='input fontstyle' placeholder='enter your username' /></div></div>: null}
            
            <span className='fontstyle'>E-MAIL</span>
            <div className="inpu"><input type="text"className='input fontstyle' placeholder='enter your Email' /></div>
            <span className='fontstyle'>Password</span>
            <div className="inpu"><input type="text"className='input fontstyle' placeholder='enter your Password' /></div>
            <button className='submit fontstyle'>SUBMIT</button>
            
            {currstate=='SIGN UP' ? <p className='fontstyle'>Already have Account ?<span className='fontstyle linkk'  onClick={()=>{setcurrstate('LOG IN')}}> LOG IN</span></p>  :<p className='fontstyle'>Dont have Account ?<span className='fontstyle linkk'  onClick={()=>{setcurrstate('SIGN UP')}}> SIGN UP</span></p>}
          </div>
        </div>
        
         <img src={assets.starsImg} alt="" className='stars' /> 
         <div className="1"><img src={assets.cloud} alt="" className='cloud cloud1' /> <div className="cloud-shadow"></div></div>
        <div className="2"><img src={assets.cloud} alt="" className='cloud cloud2' /><div className="cloud-shadow"></div> </div>
        <div className="3"><img src={assets.cloud} alt="" className='cloud cloud3' /><div className="cloud-shadow"></div> </div>
        <div className="4"><img src={assets.cloud} alt="" className='cloud cloud4' /><div className="cloud-shadow"></div> </div>
        
        
        

      </div>
    </div>
 </> )
}

export default Login
