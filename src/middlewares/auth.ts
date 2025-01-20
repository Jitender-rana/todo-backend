import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { Request,Response,NextFunction } from "express";
dotenv.config();
const secretkey=process.env.JWt_KEY;

interface authenticatedRequest extends Request{
    userID?: string,
}

function authMiddleware(req: authenticatedRequest,res: Response,next:NextFunction){
    try{const myauthHeader=req.headers.authorization;
        console.log(JSON.stringify(myauthHeader));
    if(!myauthHeader || ! myauthHeader.startsWith("Bearer")){
        res.status(401).json({message: "Token is required"});
        return;

    }
    const token=myauthHeader.split(" ")[1];
    const decodeddata=jwt.verify(token,secretkey!) as JwtPayload;
    if(decodeddata && typeof decodeddata==="object" && decodeddata.id){
        req.userID=decodeddata.id;
        next();
    }else{
        res.status(401).json({ message: "Invalid token 11" });
        return;
    }
   }catch(err){
    console.error("Error during authentication:", err);
    res.status(400).json({ message: "Invalid token 2" });
    return;

   }
}
export { authMiddleware , authenticatedRequest};



