import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { fetchRedis } from "@/lib/helpers/redis";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { addFriendValidator } from "@/lib/validations/add-friend";
import { getServerSession } from "next-auth";
import { z } from "zod";

export async function POST(req:Request){

    try {
        const body = await req.json();
    const {email:emailToAdd} = addFriendValidator.parse(body.email);

    const RESTResponseData=await fetch(`${process.env.UPSTASH_REDIS_REST_URL}/get/user:email:${emailToAdd}`,{
        headers:{
            Authorization:`Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
        },
        cache:'no-store'
    })
    const data = (await RESTResponseData.json()) as {result:string};
    const idToAdd = data.result;
    if(!idToAdd){
        return new Response('This person does not exist',{status:400});
    }
    const session = await getServerSession(authOptions);
    if(!session){
        return new Response('Unauthorized',{status:401});
    }
    if(idToAdd===session.user.id){
        return new Response('You cannot add yourself as a friend',{status:400});
    }
    //check if user is already added?
    const isAlreadyAdded = (await fetchRedis('sismember',`user:${idToAdd}:incoming_friend_request`,session.user.id)) as 0|1;

    const isAlreadyFriends = (await fetchRedis('sismember',`user:${session.user.id}:friends`,idToAdd)) as 0|1
    if(isAlreadyAdded){
        return new Response('Friend request already sent',{status:400});
    }
    if(isAlreadyFriends){
        return new Response('Already friends with this user',{status:400});
    }

    //Request is validated now sending it to the user
    pusherServer.trigger(toPusherKey(`user:${idToAdd}:incoming_friend_request`),'incoming_friend_request',{
        senderId:session.user.id,
        senderEmail:session.user.email,
        senderName:session.user.name,
    })
    db.sadd(`user:${idToAdd}:incoming_friend_request`,session.user.id);
    return new Response('OK');
    } catch (error) {
        if(error instanceof z.ZodError){
            return new Response('Invalid Request Payload',{status:422});
        }
        return new Response('Invalid Request',{status:400});
    }
}