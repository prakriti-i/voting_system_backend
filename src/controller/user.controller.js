import User from "../models/user.model"
import bcrypt from "bcrypt"

export async function createUser(req, res){
   try{
     const {name, dateOfBirth, email, password, phone, voterId} = req.body;

     const regexExpression = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9._]+\.[A-Za-z]{2,}$/ ;
    if (regexExpression.test(email) === false){
        return res.status(400).json({message: "Invalid email format"});
    }

     if(!name || !dateOfBirth || !email || !password || !phone || !voterId){
        return res.status(400).json({
            success: false,
            message: "All fields are requiered"
        });
        
     }

     const existingUser = await User.findOne({email: email}, {phone: phone}, {voterId: voterId});
     
     if (existingUser){
        return res.status(409).json({
            success: fals,
            message: "user already exists"
        });
     }

     const hashedPassword = await bcrypt.hash(password, 10);

     const newUser = await User.create({
        name: name,
        dateOfBirth: dateOfBirth,
        email: email,
        password: hashedPassword,
        phone: phone,
        voterId: voterId
     });

    const userResponse = newUser.toObject();
    delete userResponse.password;
 
    return res.status(201).json({
        success: true,
        message: "User created successfully",
        user: userResponse
    })

    }
    catch(error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }

}


export async function getAllUsers(req, res) {
    try {
        const users = await User.find().select("-password");

        return res.status(200).json({
            success: true,
            data: users
        });

    } 
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}




export async function getUserById(req,res){
    try{
        const {id} = req.params;
        const user = await User.findById(id).select("-password");

        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "User fetched successfully",
            data: user
        });
    }

    catch (error){

        res.status(500).json({
            success: "false",
            message: "Internal Server Error"
        });
    }
};


export async function deleteUser(req, res) {
    try {
        const { id } = req.params;

        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}


export async function updateEligibility(req, res) {
    try {
        const { id } = req.params;

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (!user.isVerified) {
            return res.status(400).json({
                success: false,
                message: "User must be verified first"
            });
        }

        const dob = new Date(user.dateOfBirth);
        const today = new Date();

        let age = today.getFullYear() - dob.getFullYear();

        const hasBirthdayPassed =
            today.getMonth() > dob.getMonth() ||
            (
                today.getMonth() === dob.getMonth() &&
                today.getDate() >= dob.getDate()
            );

        if (!hasBirthdayPassed) {
            age--;
        }

        user.isEligible = age >= 18;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Eligibility updated successfully",
            isEligible: user.isEligible
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}


export async function getVotingStatus(req, res) {
    try {
        const { id } = req.params;

        const user = await User.findById(id)
            .select("name isEligible isVoted");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            votingStatus: {
                name: user.name,
                isEligible: user.isEligible,
                isVoted: user.isVoted
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
