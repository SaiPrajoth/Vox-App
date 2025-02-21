import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import { UsernameSchema } from "@/schemas/signUpSchema";
import {z} from 'zod';

const usernameQuery = z.object({
    username:UsernameSchema
})


async function extractAndGenerateUniqueUsername(username: string) {
    // Validate and transform the input username
    // const parsedUsername = UsernameSchema.parse(username);
  
    // Extract alphabetic prefix as root username
    const match = username.match(/^[a-zA-Z]+/);
    const rootUsername = match ? match[0].toLowerCase() : null;
  
    if (!rootUsername) {
      throw new Error(
        "Invalid username format. Root username cannot be extracted."
      );
    }
  
    // Ensure root username has at least 2 characters
    if (rootUsername.length < 2) {
      throw new Error("Root username must be at least 2 characters.");
    }
  
    while (true) {
      const randomNum = Math.floor(Math.random() * 100000);
  
      // Randomly choose one of the two formats
      let suggestion =
        Math.random() > 0.5
          ? `${rootUsername}_${randomNum}`
          : `${rootUsername}${randomNum}`;
  
      // Enforce max length of 20 characters
      if (suggestion.length > 20) {
        suggestion = suggestion.slice(0, 20);
      }
  
      // Validate final suggestion with UsernameSchema
      suggestion = UsernameSchema.parse(suggestion);
  
      const userExists = await UserModel.findOne({ username: suggestion });
      if (!userExists) return suggestion;
    }
  }



async function checkUsernameUnique(request:Request) {
    await dbConnect();
    try {
        const {searchParams} = new URL(request.url);

        const query = {username:searchParams.get('username')};
        const validation = usernameQuery.safeParse(query);


        if(!validation.success){
            const errors = validation.error.format().username?._errors || [];
            return Response.json({
                success:false,
                message: errors.length>0?errors.join(','):'invalid query params'
            },{status:400})
        }

        const username = validation.data.username;

        const user = await UserModel.findOne({username,isVerified:true});

        if(user){
            const recommendations = await extractAndGenerateUniqueUsername(username);
            return Response.json({
                success:false,
                message: `username already taken : recommendations ${recommendations}`
            },{status:409})
        }

        return Response.json({
            success:true,
            message: `${username} : username is unique`
        },{status:200})
    } catch (error) {
        console.error('error occured while checking the username availability ',error);
        return Response.json({
            success:false,
            message: "error occured while checking the username availability"
        },{status:500})
    }
}

export {checkUsernameUnique as GET}
