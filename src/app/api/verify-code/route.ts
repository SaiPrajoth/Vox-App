import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import { UsernameSchema } from "@/schemas/signUpSchema";
import verifyCodeSchema from "@/schemas/VerifyCodeSchema";
import {z} from 'zod';

const usernameQuery= z.object({
  username:UsernameSchema
})

async function verifyCode(request: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const body = await request.json();
    const query = {  otp: body.otp };
    const query2 = {username: searchParams.get("username")}

    const validation = verifyCodeSchema.safeParse(query);
    const validationUsername = usernameQuery.safeParse(query2);
    if (!validation.success || !validationUsername.success) {
      return Response.json(
        {
          success: false,
          message:
            "(input validation failed) please provide correct OTP for verification process",
        },
        { status: 400 }
      );
    }

    const { otp } = validation.data;
    const {username} = validationUsername.data;

    const user = await UserModel.findOne({ username });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "(user not found) verification process failed",
        },
        { status: 404 }
      );
    }

    if(user.isVerified){
        return Response.json(
            {
              success: false,
              message: "(redudant task) user already verified",
            },
            { status: 403 }
          );
    }

    if (Date.now() > user.verifyCodeExpiry.getTime()) {
      return Response.json(
        {
          success: false,
          message: "(verification code expired) verification process failed",
        },
        { status: 400 }
      );
    }

    const codeCheck = user.verifyCode === otp;

    if (!codeCheck) {
      return Response.json(
        {
          success: false,
          message: "(incorrect verificaition code) verification process failed",
        },
        { status: 400 }
      );
    }

    user.isVerified = true;
    await user.save();

    return Response.json(
        {
          success: false,
          message: "user verified successfully",
        },
        { status: 200 }
      );

    
  } catch (error) {
    console.error('error occured while verifying the user ',error);
    return Response.json({
        success:false,
        message:"error occured while verifying the user "
    },{status:500})
  }
}


export {verifyCode as POST}
