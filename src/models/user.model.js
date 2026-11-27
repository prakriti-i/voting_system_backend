import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        dateOfBirth:{
            type: string,
            required:true
        },

        email: {
            type: String,
            unique: true
        },

        password: {
            type:string,
            required: true
        },

        phone: {
            type: string,
            required: true,
            unique: true
        },

        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user"
        },

        voterId: {
            type: String,
            required: true,
            unique: true
        },

        isVerified: {
            type: Boolean,
            default: false
        }, 

        isEligible: {
            type: Boolean,
            default: false
        },

        isVoted: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);


const User = mongoose.model("User", userSchema);

export default User;