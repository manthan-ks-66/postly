import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { registerUser } from "../controllers/users.controller.js";

const router = Router();

// TODO: Question: why registerUser is passed as referance and in the controller it expects req, res parameters
// what's going on behind the scene with router 

router.route("/register").post(upload.single("avatar"), registerUser);

export default router;
