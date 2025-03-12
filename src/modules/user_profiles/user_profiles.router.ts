import { Router } from "express";
import UserController from "./user_profiles.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

// 📌 Kullanıcı CRUD İşlemleri
router.post("/create", authMiddleware, UserController.createUser); // Kullanıcı oluştur
router.get("/getAll", authMiddleware, UserController.getAllUsers); // Tüm kullanıcıları getir
router.get("/get/:id", authMiddleware, UserController.getUserById); // Belirli bir kullanıcıyı getir
router.put("/update/:id", authMiddleware, UserController.updateUser); // Kullanıcıyı güncelle
router.delete("/delete/:id", authMiddleware, UserController.deleteUser); // Kullanıcıyı sil

export default router;
