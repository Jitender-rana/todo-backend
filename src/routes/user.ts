import express from "express";
import { userModal,todoModal }  from "../db";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import env from "dotenv";

import { dataValidator,userPayloadSchema} from "../middlewares/datavalidator";
import { authMiddleware , authenticatedRequest } from "../middlewares/auth";
const userRouter=express.Router();
env.config();
const jwt_secret=process.env.JWt_KEY;
const saltrounds=process.env.saltround;


const app=express();

userRouter.post("/signup", dataValidator,async (req: Request, res: Response) => {
    
    const data: userPayloadSchema=req.body;

    const result=await userModal.findOne({
        email: data.email,
    })
    console.log(result);
    if(result){
        res.status(409).json({
            message: "user with this email already exist",
        })
        return 

    }else{
        await userModal.create({
            email: data.email,
            password: data.password,
            age: data.age,

        })
    res.status(201).json({
        message: "you have signed up",
        data: data,
    })
}


})





userRouter.post("/signin",dataValidator,async(req: Request,res: Response)=>{
    const data=req.body;
    const result=await userModal.findOne({email: data.email});
    if(result){
        if(result.password!==data.password){
            res.status(401).json({
                message: "invalid password , please enter correct password",
            })
        }
        else{
            const token=jwt.sign({id: result._id},jwt_secret!);
            res.status(200).json({
                token: token,
                message: "you have signed succesfully",
            })
            
        }

    }else{
        res.status(401).json({
            message: "invalid email ,please sign up first "
        })
    }


})





userRouter.get("/todos",authMiddleware,async(req: authenticatedRequest,res: Response)=>{
    try{
    const result=await todoModal.find({userId: req.userID});
    res.json({todos: result,})
    }catch(err){
        console.log("the error while fetching todos: ",err);
        res.status(400).json({message: "error while fetching todos."})
    }

})
export {userRouter};