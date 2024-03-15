'use client'
import { chatHrefConstructor } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/router';
import { FC, useEffect, useState } from 'react'

interface SideBarChatListProps{
    friends:User[]
    sessionId:string
}
const SideBarChatList:FC<SideBarChatListProps> = ({friends,sessionId}) => {
  // const router = useRouter();
  const pathname = usePathname();
  const [unseenMessage,setUnseenMessage] = useState<Message[]>([]);
  useEffect(()=>{
    if(pathname?.includes('chat')){
      setUnseenMessage((prev)=>{
        return prev.filter((msg)=>!pathname.includes(msg.senderId));
      })
    }
  },[pathname])
  return (
    <ul role='list' className=' max-h-[25rem] overflow-y-auto -mx-2 space-y-1'>
        {friends.sort().map((friend)=>{
            const unSeenMessagesCount = unseenMessage.filter((msg)=>msg.senderId===friend.id).length;
            return(<li key={friend.id} className="">
              <a className='text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold' href={`/dashboard/chat/${chatHrefConstructor(sessionId,friend.id)}`}>
                {friend.name}
                {unSeenMessagesCount>0 ? <div className='bg-indigo-600 font-medium text-xs text-white w-4 h-4 rounded-full flex justify-center items-center'>
                  {unSeenMessagesCount}
                </div>:null}
              </a>
            </li>)
        })}
    </ul>
  )
}

export default SideBarChatList