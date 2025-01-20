"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.todoModal = exports.userModal = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const schema = mongoose_1.default.Schema;
const userSchema = new schema({
    email: { type: String, unique: true },
    password: String,
    age: String,
});
const todoSchema = new schema({
    title: String,
    description: String,
    done: Boolean,
    userId: { type: schema.Types.ObjectId, ref: 'users' },
});
const userModal = mongoose_1.default.model("users", userSchema);
exports.userModal = userModal;
const todoModal = mongoose_1.default.model("todos", todoSchema);
exports.todoModal = todoModal;
