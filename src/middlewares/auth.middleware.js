import jwt from "jsonwebtoken"
import User from "../models/user.model.js"


export function generateToken(user){
    return jwt.sign(
        {id: user._id, role: user.role},
            process.env.jwt_secret_key,
        { expiresIn: "24h"}
    );
}


export async function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({
            success: false,
            message: "Access denied. No token provided."
        });
    }

    const token= authHeader.split(" ") [1];
    try{
        const decoded= jwt.verify(token, process.env.jwt_secret_key);
        const user = await User.findById(decoded.id).select("-password");

        if(!user){
            return res.status(401).json({
                success: false,
                message: "invalid token. User no longer exists."
            });
        }

        req.user=user;
        next();

    } 
    catch(error) {
        return res.status(401).json({
            success: false,
            message: "invalid or expired token."
        });
    }
    
}


export async function isAdmin(req, res, next){
    if (req.user.role!== "admin"){
        return res.status(403).json({
            success: false,
            message: "access denied. Admins only."
        });
    }
    next();
}



export async function canVote(req, res, next){
    if(req.user.role ==="admin"){
        return res.status(403).json({
            success: false,
            message: "Admins are not allowed to vote."
        });
    }

    if (!req.user.isEligible){
        return res.status(403).json({
            success: false,
            message: " you must be eligible to vote."
        });
    }

    if (req.user.isVoted){
        return res.status(400).json({
            success: false,
            message: "you have already cast your vote."
        });

    }
    next();
}

