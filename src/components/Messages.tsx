'use client'
import { pusherClient } from "@/lib/pusher";
import { cn, toPusherKey } from "@/lib/utils";
import { Message } from "@/lib/validations/messages";
import { format } from "date-fns";
import Image from "next/image";
import { FC, useEffect, useRef, useState } from "react"

interface MessagesProp{
    initialMessage:Message[]
    sessionId:string
    chatId:string
    sessionImg:string | null | undefined
    chatPartner:User
}
const Messages:FC<MessagesProp> = ({initialMessage,sessionId,chatPartner,sessionImg,chatId}) => {
    const scrollDownRef = useRef<HTMLDivElement | null>(null);
    const [messages,setMessages] = useState<Message[]>(initialMessage);
    useEffect(()=>{
      pusherClient.subscribe(toPusherKey(`chat:${chatId}`));
      const messageHandler=(message:Message)=>{
        console.log('Websocket are working here');
        setMessages(prev=>[message,...prev])
      }
      pusherClient.bind('incoming-message',messageHandler);
        return ()=>{
            pusherClient.unsubscribe(toPusherKey(`chat:${chatId}`));
            pusherClient.unbind('incoming-message',messageHandler);
        }
    },[chatId])
    console.log('is console working?');
  return (
    <div id="messages" className="flex flex-1 h-full flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
        <div ref={scrollDownRef}/>
        {messages.map((msg,idx)=>{
            const isCurrentUser = msg.senderId === sessionId;
            const hasNextMsgFromSameUser = messages[idx-1]?.senderId===messages[idx].senderId
            return <div id="chat-msg" key={`${msg.id}-${msg.timestamp}`}>
                <div className={cn('flex items-end',{'justify-end':isCurrentUser})}>
                    <div className={cn('flex flex-col space-y-2 text-base max-w-xs mx-2',{'order-1 items-end':isCurrentUser,'order-2 items-start':!isCurrentUser})}>
                        <span className={cn('px-4 py-2 rounded-lg inline-block',{'bg-indigo-600 text-white':isCurrentUser,'bg-gray-200 text-gray-900':!isCurrentUser,'rounded-br-none':!hasNextMsgFromSameUser && isCurrentUser,'rounded-bl-none':!hasNextMsgFromSameUser && !isCurrentUser})}>
                            {msg.text}{' '}
                            <span className="ml-2 text-xs text-gray-400">
                                {format(msg.timestamp,'HH:mm')}
                            </span>
                        </span>
                    </div>
                    <div className={cn('relative w-6 h-6',{
                        'order-2':isCurrentUser,
                        'order-1':!isCurrentUser,
                        'invisible':hasNextMsgFromSameUser
                    })}>
                        <Image fill src={isCurrentUser ? (sessionImg as string):chatPartner.image} alt="profile-picture" referrerPolicy="no-referrer" className="rounded-full"/>
                    </div>
                </div>
            </div>
        })}
    </div>
  )
}

export default Messages