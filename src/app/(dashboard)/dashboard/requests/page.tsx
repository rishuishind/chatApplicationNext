import FriendRequests from "@/components/FriendRequests";
import { authOptions } from "@/lib/auth"
import { fetchRedis } from "@/lib/helpers/redis";
import { getServerSession } from "next-auth"
import { notFound } from "next/navigation";

const page = async () => {
    const session = await getServerSession(authOptions);
    const incomingSenderIds = (await fetchRedis('smembers',`user:${session?.user.id}:incoming_friend_request`)) as string[];

    const incomingFriendRequests = await Promise.all(
        incomingSenderIds.map( async (senderId)=>{
            const sender = (await fetchRedis('get',`user:${senderId}`)) as string
            const senderParsed = JSON.parse(sender) as User
            return {senderId,
                senderEmail:senderParsed.email,
                senderName:senderParsed.name
            }
        })
    )
    if(!session) notFound();
  return (
    <main className='pt-8'>
        <h1 className='font-bold text-5xl mb-8'>Add a friend</h1>
        <div className="flex flex-col gap-4">
            <FriendRequests incomingFriendRequest={incomingFriendRequests} sessionId={session.user.id}/>
        </div>
    </main>
  )
}

export default page