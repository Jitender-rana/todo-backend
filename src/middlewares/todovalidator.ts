import { Request,Response,NextFunction } from "express";
import {string, z} from "zod";

const todoSchema=z.object({
    title: z.string().min(1,{message: "title for todo is required"}),
    description: z.string().optional(),
    done: z.boolean().optional(),
})
type todotype=z.infer<typeof todoSchema>;

function tododatavalidatorMiddleware(req: Request,res:Response,next: NextFunction){
    try{
        req.body=todoSchema.parse(req.body);
        console.log("in todo validator middleware the data is: "+req.body)
        next();

    }catch(err){
        console.log("error while handling the todo data sent by user",err);
        if(err instanceof z.ZodError){
            res.status(400).json({
                message: "inavalid data sent by user",
                error: err.errors,
            })
        }
        res.status(500).json({
            message: "unexpected error occurred while handling to-do data",
        })

    }

}
export {tododatavalidatorMiddleware, todotype};