"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.todoRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middlewares/auth");
const db_1 = require("../db");
const todoRouter = express_1.default.Router();
exports.todoRouter = todoRouter;
const todovalidator_1 = require("../middlewares/todovalidator");
todoRouter.post("/create-todo", auth_1.authMiddleware, todovalidator_1.tododatavalidatorMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = req.body;
        const userid = req.userID;
        const todoResult = yield db_1.todoModal.create({
            userId: userid,
            title: result.title,
            description: result.description,
            done: result.done
        });
        console.log("in the actual create todo the data is : " + todoResult);
        res.status(201).json({
            result: todoResult,
            message: "todo created successfully"
        });
    }
    catch (err) {
        console.log("error while creating todo", err);
        res.status(400).json({ message: "error while creating to-do" });
    }
}));
todoRouter.put("/update-todo", auth_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { todoId, title, description, completed } = req.body;
        if (!todoId) {
            res.status(400).json({ message: "todoId is required" });
            return;
        }
        const updatedTodo = yield db_1.todoModal.findOneAndUpdate({ _id: todoId, userId: req.userID }, { title, description, completed }, { new: true });
        if (!updatedTodo) {
            res.status(404).json({ message: "Todo not found or you don't have permission to update it" });
            return;
        }
        res.status(200).json({
            message: "Todo updated successfully",
            todo: updatedTodo,
        });
    }
    catch (err) {
        console.error("Error while updating todo:", err);
        res.status(500).json({ message: "Error while updating the to-do" });
    }
}));
todoRouter.delete("/delete-todo", auth_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { todoId } = req.body;
        if (!todoId) {
            res.status(400).json({ message: "todoId is required" });
            return;
        }
        const deletedTodo = yield db_1.todoModal.findOneAndDelete({
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
    }
    catch (err) {
        console.error("Error while deleting todo:", err);
        res.status(500).json({ message: "Error while deleting the to-do" });
    }
}));
