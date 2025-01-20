import express, { Request, Response } from "express";
import { authMiddleware , authenticatedRequest} from "../middlewares/auth";
import { userModal,todoModal } from "../db";
const todoRouter=express.Router();
import { tododatavalidatorMiddleware ,todotype } from "../middlewares/todovalidator";
todoRouter.post("/create-todo",authMiddleware,tododatavalidatorMiddleware,async(req:authenticatedRequest,res:Response)=>{
    try{
    const result: todotype=req.body;
    const userid=req.userID;
    const todoResult=await todoModal.create({
        userId: userid,
        title: result.title,
        description: result.description,
        done: result.done});
        console.log("in the actual create todo the data is : "+todoResult);
        res.status(201).json({
            result: todoResult,
            message: "todo created successfully"
        });
    }catch(err){
        console.log("error while creating todo",err);
        res.status(400).json({message: "error while creating to-do"})
    }





})
todoRouter.put("/update-todo",authMiddleware,async (req:authenticatedRequest,res:Response)=>{
    try {
        const { todoId, title, description, completed } = req.body;

        if (!todoId) {
           res.status(400).json({ message: "todoId is required" });
           return 
        }

        const updatedTodo = await todoModal.findOneAndUpdate(
            { _id: todoId, userId: req.userID }, 
            { title, description, completed },
            { new: true } 
        );

        if (!updatedTodo) {
            res.status(404).json({ message: "Todo not found or you don't have permission to update it" });
            return 
        }

        res.status(200).json({
            message: "Todo updated successfully",
            todo: updatedTodo,
        });
    } catch (err) {
        console.error("Error while updating todo:", err);
        res.status(500).json({ message: "Error while updating the to-do" });
    }
})

todoRouter.delete("/delete-todo",authMiddleware,async(req: authenticatedRequest,res: Response)=>{
    try {
        const { todoId } = req.body;

        if (!todoId) {
            res.status(400).json({ message: "todoId is required" });
            return;
        }

        const deletedTodo = await todoModal.findOneAndDelete({
            _id: todoId,
            userId: req.userID, 
        });

        if (!deletedTodo) {
            res.status(404).json({ message: "Todo not found or you don't have permission to delete it" });
            return;
        }

        res.status(200).json({
            message: "Todo deleted successfully",
            todo: deletedTodo,
        });
    } catch (err) {
        console.error("Error while deleting todo:", err);
        res.status(500).json({ message: "Error while deleting the to-do" });
    }

})
export  {todoRouter};