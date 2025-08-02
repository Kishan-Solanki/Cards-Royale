import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
   username: {
      type: String,
      required: [true, 'Provide username'],
      unique: true
   },
   email: {
      type: String,
      required: [true, 'Provide email'],
      unique: true
   },
   password: {
      type: String,
      required: [true, 'Provide email'],
   },
   currentToken : {
      type : String,
      default : "default",
   },
   isVerified: {
      type: Boolean,
      default: false,
   },
   isAdmin: {
      type: Boolean,
      default: false,
   },
   profileImageURL: {
      type: String,
      default: 'https://res.cloudinary.com/divwkpavu/image/upload/v1749458831/default_qtcr88.jpg'
   },
   gameMoney: {
      type: Number,
      default: 100000
   },
   verifyCode: String,
   verifyCodeExpiry: Date,
   forgotPasswordCode: String,
   forgotPasswordExpiry: Date,
   Friends: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User'
      }
   ],
   FriendRequests: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User'
      }
   ],
   gameInvites: [
      {
         inviter: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
         },
         roomId: {
            type: String,
            required: true
         },
         gameType: {
            type: String,
            required: true,
            enum: ['Teen Patti', 'Mindi', 'Rummy'], 
            default: 'Teen Patti'
         },
         createdAt: {
            type: Date,
            default: Date.now,
            expires: 3600 // 1 hour (3600 seconds)
         }
      }
   ]

}, { timestamps: true })

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User