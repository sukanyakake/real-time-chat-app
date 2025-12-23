import React, { useEffect } from 'react'
import { useChatStore } from '../store/useChatStore'
import { useAuthStore } from '../store/useAuthStore'
import ChatHeader from './ChatHeader'
import NoChatHistoryPlaceholder from './NoChatHistoryPlaceholder'
import MessagesLoadingSkeleton from './MessagesLoadingSkeleton'


const ChatContainer = () => {
  const {selectedUser,getMessagesByUserId,messages,isMessagesLoading}=useChatStore()
  const {authUser}=useAuthStore()
  useEffect(()=>{
    getMessagesByUserId(selectedUser._id)
  },[getMessagesByUserId,selectedUser])
  const AmOrPm=(date)=>{
    const hrs=date.getHours()
    if(hrs>12){
      return "PM"
    }else{
      return "AM"
    }
  }
  return (
    <>
      <ChatHeader/>
      <div className='flex-1 px-6 overflow-y-auto py-8'>
        {messages.length>0  && !isMessagesLoading?(
         <div className='max-w-3xl mx-auto space-y-6'>
            {messages.map(msg=>(
              <div key={msg._id} className={`chat ${msg.senderId===authUser._id?"chat-end":"chat-start"}`}>
                  <div className={`chat-bubble relative ${msg.senderId===authUser._id?"bg-cyan-600 text-white":"bg-slate-800 text-slate-200"}`}>
                      {msg.image && (<img src={msg.image} alt="Shared" className="rounded-lg h-48 object-cover"/>)}
                      {msg.text && <p className='mt-2'>{msg.text}</p>}
                      <p className='text-xs mt-1 opacity-75 flex items-center gap-1'>
                        {`${new Date(msg.createdAt).toISOString().slice(11,16)} ${AmOrPm(new Date(msg.createdAt))}` }
                      </p>
                  </div>
                </div>
            ))}
          </div>
        ):isMessagesLoading?(
          <MessagesLoadingSkeleton/>
        ):(<NoChatHistoryPlaceholder name={selectedUser.fullName}/>)}
      </div>
    </>
  )
}

export default ChatContainer
