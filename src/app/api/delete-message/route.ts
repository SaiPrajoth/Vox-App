import UserModel, { Message } from "@/models/user.model";
import { getServerSession } from "next-auth";

async function deleteMessage(request: Request) {
  try {
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

    const userId = user._id;

    const userFound = await UserModel.findById(userId);
    if (!userFound) {
      return Response.json(
        {
          success: false,
          message: "user not found",
        },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(request.url);
    const messageId = searchParams.get("messageId");

    const messageIndex = userFound.messages.findIndex(
      (msg: any) => msg._id.toString() === messageId
    );

    if (messageIndex === -1) {
      return Response.json(
        {
          success: false,
          message: "Message not found",
        },
        { status: 404 }
      );
    }

    // Remove the message from the array
    userFound.messages.splice(messageIndex, 1);
    await userFound.save();

    return Response.json(
      {
        success: true,
        message: "Message deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(`error occured while deleting messages `, error);
    return Response.json(
      {
        success: false,
        message: "error occured while deleting messages",
      },
      { status: 500 }
    );
  }
}
export {deleteMessage as DELETE}
