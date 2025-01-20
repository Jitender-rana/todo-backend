"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tododatavalidatorMiddleware = tododatavalidatorMiddleware;
const zod_1 = require("zod");
const todoSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, { message: "title for todo is required" }),
    description: zod_1.z.string().optional(),
    done: zod_1.z.boolean().optional(),
});
function tododatavalidatorMiddleware(req, res, next) {
    try {
        req.body = todoSchema.parse(req.body);
        console.log("in todo validator middleware the data is: " + req.body);
        next();
    }
    catch (err) {
        console.log("error while handling the todo data sent by user", err);
        if (err instanceof zod_1.z.ZodError) {
            res.status(400).json({
                message: "inavalid data sent by user",
                error: err.errors,
            });
        }
        res.status(500).json({
            message: "unexpected error occurred while handling to-do data",
        });
    }
}
