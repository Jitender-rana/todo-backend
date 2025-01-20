import express from "express";
import { Request,Response,NextFunction } from "express";
import {z} from "zod";



const mySchema=z.object({
    email: z.string().min(1,{message: "Name cannot be empty"}).email({message: "Invalid email format"}),
    password: z.string().min(4,{message: "Password must be of 4 character"}),
    age: z.number().optional(),


});
type userPayloadSchema=z.infer<typeof mySchema>;


function dataValidator(req: Request,res: Response,next: NextFunction){
    try{
        req.body=mySchema.parse(req.body)
        next();

    }catch(error){
        console.log("There is error"+error);
        if(error instanceof z.ZodError){
            console.log(`the error is :  ${error.errors[0].message}`)
            res.status(400).json({
                message: "validation error ",
                error: error.errors,
                
            
            })
            return;
        }
        res.status(500).json({
            message: "unexpected error occurred",
        })


    }

}
export {dataValidator,userPayloadSchema};