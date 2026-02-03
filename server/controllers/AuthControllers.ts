import { Request, Response } from "express";
import User from "../models/User.js";
import bcrypt from 'bcrypt';
import { error } from "node:console";

//controller for user registration

export const registerUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;
        //find user by email
        const user = await User.findOne({ email });

        if (user) {
            //if user found
            return res.status(400).json({ message: 'User already exist' });
        }

        //encrypt the pass
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save(); //data saved to db

        //setting data to session.
        req.session.isLoggedIn = true;
        req.session.userId = newUser._id;

        return res.json({
            message: 'Account created successfully',
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        })
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ message: error.message }); //potentail risk as human readable format
    }
}

//controller for USER Login

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        //find user by email
        const user = await User.findOne({ email });

        if (!user) {
            //if user not found
            return res.status(400).json({ message: 'Invalid email!' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Invalid password!' });
        }

        //setting data to session.
        req.session.isLoggedIn = true;
        req.session.userId = user._id;

        return res.json({
            message: 'Login successfull!',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        })
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ message: error.message }); //potentail risk as human readable format
    }
}

//controller for USER Log-Out
export const logoutUser = async(req:Request, res:Response)=>{
    req.session.destroy((error:any)=>{
        if (error){
            console.log(error)
            return res.status(500).json({message:error.message});
        }
    })
    return res.json({message: 'Logout successful'})
}

//controller for USER Verify LOGIN OR NOT
export const verifyUser = async(req:Request, res:Response)=>{
    try {
        const {userId} = req.session;
        const user = await User.findById(userId).select('-password')
        if (!user) {
            //if user not found
            return res.status(400).json({ message: 'Invalid user' });
        }
        return res.json({user});
        
    } catch (error:any) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};