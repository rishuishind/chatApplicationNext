'use client'

import { pusherClient } from "@/lib/pusher"
import { toPusherKey } from "@/lib/utils"
import axios from "axios"
import { Check, UserPlus, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { FC, useEffect, useState } from "react"

interface FriendRequestsProps{
    incomingFriendRequest:IncomingFriendRequest[],
    sessionId:string
}

const FriendRequests:FC<FriendRequestsProps> = ({incomingFriendRequest,sessionId}) => {

    const router = useRouter();
    const [friendRequest,setFriendRequest] = useState<IncomingFriendRequest[]>(incomingFriendRequest)

    useEffect(()=>{
        pusherClient.subscribe(toPusherKey(`user:${sessionId}:incoming_friend_request`));
        const friendRequestHandler=({senderId,senderEmail,senderName}:IncomingFriendRequest)=>{
            setFriendRequest((prev)=>[...prev,{senderId,senderEmail,senderName}])
        }
        pusherClient.bind('incoming_friend_request',friendRequestHandler);
        return ()=>{
            pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:incoming_friend_request`));
            pusherClient.unbind('incoming_friend_request',friendRequestHandler);
        }
    },[sessionId])

    const acceptFriend = async(senderId:string)=>{
        await axios.post('/api/friends/accept',{id:senderId});

        setFriendRequest((prev)=>prev.filter((req)=>req.senderId!==senderId));
        router.refresh();
    }

    const denyFriend = async(senderId:string)=>{
        await axios.post('/api/friends/deny',{id:senderId});

        setFriendRequest((prev)=>prev.filter((req)=>req.senderId!==senderId));
        router.refresh();
    }

    
  return (
    <>
    {friendRequest.length===0 ? (<p className="text-sm text-zinc-400">Nothing to show here...</p>):(friendRequest.map((request)=><div key={request.senderId} className="flex gap-4 items-center">
        <UserPlus className="text-black"/>
        <div className="flex flex-col">
            <p className=" font-medium text-lg">{request.senderName}</p>
            <p className=" font-light text-sm">{request.senderEmail}</p>
        </div>

        <button onClick={()=>acceptFriend(request.senderId)} aria-label="accept-friend" className="w-8 h-8 bg-indigo-600 hover:bg-indigo-700 grid place-items-center rounded-full transition hover:shadow-md"><Check className="font-semibold text-white w-3/4 h-3/4"/></button>

        <button onClick={()=>denyFriend(request.senderId)} aria-label="deny-friend" className="w-8 h-8 bg-red-600 hover:bg-red-700 grid place-items-center rounded-full transition hover:shadow-md"><X className="font-semibold text-white w-3/4 h-3/4"/></button>

    </div>))}
    </>
  )
}

export default FriendRequests