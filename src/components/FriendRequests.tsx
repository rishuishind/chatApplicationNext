'use client'

import { Check, UserPlus, X } from "lucide-react"
import { FC, useState } from "react"

interface FriendRequestsProps{
    incomingFriendRequest:IncomingFriendRequest[],
    sessionId:string
}

const FriendRequests:FC<FriendRequestsProps> = ({incomingFriendRequest,sessionId}) => {

    const [friendRequest,setFriendRequest] = useState<IncomingFriendRequest[]>(incomingFriendRequest)
  return (
    <>
    {friendRequest.length===0 ? (<p className="text-sm text-zinc-400">Nothing to show here...</p>):(friendRequest.map((request)=><div key={request.senderId} className="flex gap-4 items-center">
        <UserPlus className="text-black"/>
        <div className="flex flex-col">
            <p className=" font-medium text-lg">{request.senderName}</p>
            <p className=" font-light text-sm">{request.senderEmail}</p>
        </div>

        <button aria-label="accept-friend" className="w-8 h-8 bg-indigo-600 hover:bg-indigo-700 grid place-items-center rounded-full transition hover:shadow-md"><Check className="font-semibold text-white w-3/4 h-3/4"/></button>

        <button aria-label="deny-friend" className="w-8 h-8 bg-red-600 hover:bg-red-700 grid place-items-center rounded-full transition hover:shadow-md"><X className="font-semibold text-white w-3/4 h-3/4"/></button>

    </div>))}
    </>
  )
}

export default FriendRequests