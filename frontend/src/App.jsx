import React, { useEffect, useState } from 'react'
import { Routes,Route, Navigate } from 'react-router-dom'
import ChatPage from './pages/ChatPage'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import { useAuthStore } from './store/useAuthStore.js'
import PageLoader from './components/PageLoader.jsx'
import toast, { Toaster } from 'react-hot-toast';

const App = () => {
  const {checkAuth,isCheckingAuth,authUser}=useAuthStore()
  useEffect(()=>{
    checkAuth()
  },[checkAuth])
  console.log(authUser)
  if(isCheckingAuth){
    return <PageLoader/>
  }
  return (
    <div className='min-h-screen bg-slate-900 relative flex items-center justify-center p-4 overflow-hidden'>
            {/* DECORATORS - GRID BG & GLOW SHAPES */}
  <div className="absolute inset-0 bg-[linear-gradient(...)] bg-[size:14px_24px] pointer-events-none" />
<div className="absolute top-0 -left-4 size-96 bg-pink-500 opacity-20 blur-[100px] pointer-events-none" />
<div className="absolute bottom-0 -right-4 size-96 bg-cyan-500 opacity-20 blur-[100px] pointer-events-none" />
<Toaster/>


    <Routes>
      <Route path="/" element={authUser?<ChatPage />:<Navigate to="/login"/>}></Route>
      <Route path="/login" element={!authUser?<LoginPage/>:<Navigate to="/"/>}></Route>
      <Route path="/signup" element={!authUser?<SignUpPage/>:<Navigate to="/"/>}></Route>
    </Routes>
    </div>
  )
}

export default App
