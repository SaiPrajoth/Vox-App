import {z} from 'zod';


export const MessageSchema = z.object({
    createdAt:z.date(),
    content:z.string().min(2,'message-content should atleast have 2 characters').max(200,'message-content should atmost have 200 characters')
})

