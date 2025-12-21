import React, { useState } from 'react'
import { Routes,Route } from 'react-router-dom'
import ChatPage from './pages/ChatPage'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import { useAuthStore } from './store/useAuthStore.js'

const App = () => {
  const {isLoggedIn,login}=useAuthStore()
  console.log(isLoggedIn)
  return (
    <div className='min-h-screen bg-slate-900 relative flex items-center justify-center p-4 overflow-hidden'>
            {/* DECORATORS - GRID BG & GLOW SHAPES */}
  <div className="absolute inset-0 bg-[linear-gradient(...)] bg-[size:14px_24px] pointer-events-none" />
<div className="absolute top-0 -left-4 size-96 bg-pink-500 opacity-20 blur-[100px] pointer-events-none" />
<div className="absolute bottom-0 -right-4 size-96 bg-cyan-500 opacity-20 blur-[100px] pointer-events-none" />


    <button className='btn btn-primary' onClick={login}>{isLoggedIn?"Login in":"Logout"}</button>

    <Routes>
      <Route path="/" element={<ChatPage />}></Route>
      <Route path="/login" element={<LoginPage/>}></Route>
      <Route path="/signup" element={<SignUpPage/>}></Route>
    </Routes>
    </div>
  )
}

export default App
