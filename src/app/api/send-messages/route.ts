import dbConnect from "@/lib/dbConnect";
import UserModel, { Message } from "@/models/user.model";
import { MessageSchema } from "@/schemas/MessageSchema";
import { getServerSession } from "next-auth";

async function sendMessages(request: Request) {
  await dbConnect();
  try {
    const body = await request.json();
    const session = await getServerSession();
    const user = session?.user;

    if (!session || !user) {
      return Response.json(
        {
          success: false,
          message: "user not authenticated",
        },
        { status: 403 }
      );
    }

    const MessageQuery = { content: body.content, createdAt: new Date() };

    const validation = MessageSchema.safeParse(MessageQuery);
    if (!validation.success) {
      return Response.json(
        {
          success: false,
          message:
            "(input validation failed) please provide correct fields for sending messages",
        },
        { status: 400 }
      );
    }

    const { content, createdAt } = validation.data;

    const username = body.username;

    const userFound = await UserModel.findOne({ username });

    if (!userFound) {
      return Response.json(
        {
          success: false,
          message: "(user not found) sending messages task failed",
        },
        { status: 404 }
      );
    }

    if (!userFound.isAcceptingMessages) {
      return Response.json(
        {
          success: false,
          message:
            "(task failed) the reciever is not accepting messages currently, please try again later.",
        },
        { status: 400 }
      );
    }

    const message = { content, createdAt };

    userFound.messages.push(message as Message);

    await userFound.save();

    return Response.json(
      {
        success: true,
        message: "(message sent successfully) task successfull",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("error occured while sending the message ", error);
    return Response.json(
      {
        success: true,
        message: "error occured while sending the message",
      },
      { status: 500 }
    );
  }
}

export { sendMessages as POST };
