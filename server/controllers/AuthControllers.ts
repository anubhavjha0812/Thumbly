import { Request, Response } from "express";
import User from "../models/User.js";
import bcrypt from 'bcrypt';

//controllers for user registration

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
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}