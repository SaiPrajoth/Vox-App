import mongoose,{Schema,Document} from 'mongoose'

export interface Message extends Document{
    createdAt:Date,
    content:string
}

interface User extends Document{
    username : string,
    email: string,
    password: string,
    isVerified:boolean,
    isAcceptingMessages:boolean,
    verifyCode:string,
    verifyCodeExpiry:Date,
    messages:Message[]
}

const MessageSchema : Schema<Message> = new Schema({
    createdAt:{
        type:Date,
        default : new Date()
    },
    content:{
        type:String,
        min:[2,'content should have atleast 2 characters'],
        max:[200,'content should have atmost 20 characters'],
        required:[true,'messages content is required']
        
    }
})

const UserSchema : Schema<User> = new Schema({
    username:{
        type:String,
        min:[2,'username should have atleast 2 characters'],
        max:[20,'username should have atmost 20 characters'],
        required:[true,'username is required']
    },
    email:{
        type:String,
        required:[true,'email is required'],
        match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,'please enter a valid email']

    },

    password:{
        type:String,
        required:[true,'password is required'],

    },
    isVerified:{
        type:Boolean,
        default:false
    },
    verifyCode:{
        type:String,
        required:[true,'verirication code is required']
    },
    verifyCodeExpiry:{
        type:Date,
        required:[true,'verificatioon code exipiration is required']
    },
    messages:[MessageSchema]

})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>('User',UserSchema))

export default UserModel;
