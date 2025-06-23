import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login/Login'
import Chat from './pages/Chat/Chat'
import Signin from './pages/Signin/Signin'
const App = () => {
  return (
    <>
      <Routes>
        <Route path ='/' element={<Login/>}/>
        <Route path='/Chat' element={<Chat/>} />
        <Route path='/signin' element={<Signin/>}/>
      </Routes>
    </>
  )
}

export default App
