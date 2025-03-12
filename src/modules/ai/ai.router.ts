import { Router } from "express";
import multer from "multer";
import AIController from "./ai.controller";

const router = Router();
const upload = multer({ dest: "uploads/" });

router.post("/process-audio", upload.single("audio"), AIController.processAudio);

export default router;
