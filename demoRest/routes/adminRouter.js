import { Router } from "express";

const adminRouter = Router();
// adminRouter.post("/signup", validateAdminSignUp, authorSignup); //signup should go before the verifytoken middleware
// adminRouter.post("/login", validateAdminLogin, authorLogin);
// adminRouter.use(verifyToken);
// adminRouter.get("/posts", allPosts);
// adminRouter.post("/newpost", upload.single("file"), newPost);
// adminRouter.delete("/post/:postid/:", deletePost);
// adminRouter.put("/post/:postid/:", updatePost);
// adminRouter.get("/post/:postid", postById);

export default adminRouter;
