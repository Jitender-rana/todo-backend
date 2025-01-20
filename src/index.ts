import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

import {userRouter} from "./routes/user";
import { todoRouter } from "./routes/todos";

dotenv.config();
const app=express();
app.use(cors());

app.use(express.json());
const port=process.env.PORT;

app.use("/user",userRouter);
app.use("/todo",todoRouter);
async function main(){
await mongoose.connect(process.env.MONGO_URL!)
app.listen(port,()=>{
    console.log(`server listening on port ${port}`);
})
}
main();
