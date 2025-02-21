import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/authOptions";


async function getMessages() {
    await dbConnect();
    try {
        const session = await getServerSession(authOptions);
        const user = session?.user;

        if(!session || !user){
            return Response.json(
                {
                  success: false,
                  message: "user not authenticated"
                },
                { status: 403 }
              );
        };

        const userId = user._id;

        const userFound= await UserModel.findById(userId);

        if(!userFound){
            return Response.json(
                {
                  success: false,
                  message: 'user not found'
                },
                { status: 404 }
              );
        }

        const acceptingStatus = user.isAcceptingMessages;

        return Response.json(
            {
              success: false,
              message: '(task successfull) fetching user accepting-messages status',
              isAcceptingMessages:acceptingStatus
            },
            { status: 200 }
          );


       
    } catch (error) {
        console.error('error occured while fetching the user accepting messages status ',error);
        return Response.json(
            {
              success: false,
              message:'error occured while fetching the user accepting messages status'
            },
            { status: 500 }
          );
    }
    
}


async function updateMessages(request:Request) {
    await dbConnect();
    try {
        const body = await request.json();
        const session = await getServerSession(authOptions);
        const user = session?.user;

        if(!session || !user){
            return Response.json(
                {
                  success: false,
                  message: "user not authenticated"
                },
                { status: 403 }
              );
        };

        const userId = user._id;

        const userFound= await UserModel.findById(userId);

        if(!userFound){
            return Response.json(
                {
                  success: false,
                  message: 'user not found'
                },
                { status: 404 }
              );
        }

        userFound.isAcceptingMessages=body.isAcceptingMessages;
        await userFound.save();


        return Response.json(
            {
              success: false,
              message: '(task successfull) user accepting-messages status updated',
              
            },
            { status: 200 }
          );


       
    } catch (error) {
        console.error('error occured while updating the user accepting messages status ',error);
        return Response.json(
            {
              success: false,
              message:'error occured while updating the user accepting messages status'
            },
            { status: 500 }
          );
    }
    
}


export {getMessages as GET, updateMessages as POST}



