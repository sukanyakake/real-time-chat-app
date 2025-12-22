import React from 'react'
import { useAuthStore } from '../store/useAuthStore';

const ChatPage = () => {
  const {logout,isLogout,authUser}=useAuthStore()
  console.log(authUser)
  return (
    <div>
      <button className="btn" onClick={logout} disabled={isLogout}>Log out</button>
    </div>
  )
}

export default ChatPage
