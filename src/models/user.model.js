import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        dateOfBirth:{
            type: Date,
            required:true
        },

        email: {
            type: String,
            unique: true,
            lowercase: true,
            required: true
        },

        password: {
            type:String,
            required: true
        },

        phone: {
            type: String,
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