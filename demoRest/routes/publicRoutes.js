import { Router } from "express";
import {
  userLogin,
  userSignUp,
  validateLogin,
  validateSignUp,
} from "../controllers/controller.js";

const publicRouter = Router();
//use validate signup as middleware for sanitizing
publicRouter.post("/signup", validateSignUp, userSignUp);
publicRouter.post("/login", userLogin);

export default publicRouter;
