import {z} from 'zod';


export const usernameSchema = z.string().min(2,"username should be atleast of 2 characters").max(200,"username should be atmost of 20 characters").regex(/^[A-Za-z0-9 _]+$/,'no special characters are allowed in the username').transform((username)=>{return username.toLowerCase().replace(/\s+/g, '');})

export const signUpSchema = z.object({
    username:usernameSchema,
    email:z.string().email(),
    password:z.string()
})

