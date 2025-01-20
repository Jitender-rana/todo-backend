"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const secretkey = process.env.JWt_KEY;
function authMiddleware(req, res, next) {
    try {
        const myauthHeader = req.headers.authorization;
        console.log(JSON.stringify(myauthHeader));
        if (!myauthHeader || !myauthHeader.startsWith("Bearer")) {
            res.status(401).json({ message: "Token is required" });
            return;
        }
        const token = myauthHeader.split(" ")[1];
        const decodeddata = jsonwebtoken_1.default.verify(token, secretkey);
        if (decodeddata && typeof decodeddata === "object" && decodeddata.id) {
            req.userID = decodeddata.id;
            next();
        }
        else {
            res.status(401).json({ message: "Invalid token 11" });
            return;
        }
    }
    catch (err) {
        console.error("Error during authentication:", err);
        res.status(400).json({ message: "Invalid token 2" });
        return;
    }
}
