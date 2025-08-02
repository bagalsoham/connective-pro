import { Router } from "express";
import { activeController } from "../controllers/posts.controllers.js";

const router = Router();

router.get("/", activeController);

export default router;