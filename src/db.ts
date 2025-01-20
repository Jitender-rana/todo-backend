import mongoose from "mongoose";
const schema=mongoose.Schema;

const userSchema= new schema({
    email: {type: String, unique: true},
    password: String,
    age: String,
})
const todoSchema=new schema({
    title: String,
    description: String,
    done: Boolean,
    userId: {type: schema.Types.ObjectId,ref: 'users'},


})
const userModal=mongoose.model("users",userSchema);
const todoModal=mongoose.model("todos",todoSchema);
export {userModal,todoModal};