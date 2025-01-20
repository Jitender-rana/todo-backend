"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataValidator = dataValidator;
const zod_1 = require("zod");
const mySchema = zod_1.z.object({
    email: zod_1.z.string().min(1, { message: "Name cannot be empty" }).email({ message: "Invalid email format" }),
    password: zod_1.z.string().min(4, { message: "Password must be of 4 character" }),
    age: zod_1.z.number().optional(),
});
function dataValidator(req, res, next) {
    try {
        req.body = mySchema.parse(req.body);
        next();
    }
    catch (error) {
        console.log("There is error" + error);
        if (error instanceof zod_1.z.ZodError) {
            console.log(`the error is :  ${error.errors[0].message}`);
            res.status(400).json({
                message: "validation error ",
                error: error.errors,
            });
            return;
        }
        res.status(500).json({
            message: "unexpected error occurred",
        });
    }
}
