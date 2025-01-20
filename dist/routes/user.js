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
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const db_1 = require("../db");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const datavalidator_1 = require("../middlewares/datavalidator");
const auth_1 = require("../middlewares/auth");
const userRouter = express_1.default.Router();
exports.userRouter = userRouter;
dotenv_1.default.config();
const jwt_secret = process.env.JWt_KEY;
const saltrounds = process.env.saltround;
const app = (0, express_1.default)();
userRouter.post("/signup", datavalidator_1.dataValidator, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const result = yield db_1.userModal.findOne({
        email: data.email,
    });
    console.log(result);
    if (result) {
        res.status(409).json({
            message: "user with this email already exist",
        });
        return;
    }
    else {
        yield db_1.userModal.create({
            email: data.email,
            password: data.password,
            age: data.age,
        });
        res.status(201).json({
            message: "you have signed up",
            data: data,
        });
    }
}));
userRouter.post("/signin", datavalidator_1.dataValidator, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const result = yield db_1.userModal.findOne({ email: data.email });
    if (result) {
        if (result.password !== data.password) {
            res.status(401).json({
                message: "invalid password , please enter correct password",
            });
        }
        else {
            const token = jsonwebtoken_1.default.sign({ id: result._id }, jwt_secret);
            res.status(200).json({
                token: token,
                message: "you have signed succesfully",
            });
        }
    }
    else {
        res.status(401).json({
            message: "invalid email ,please sign up first "
        });
    }
}));
userRouter.get("/todos", auth_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield db_1.todoModal.find({ userId: req.userID });
        res.json({ todos: result, });
    }
    catch (err) {
        console.log("the error while fetching todos: ", err);
        res.status(400).json({ message: "error while fetching todos." });
    }
}));
