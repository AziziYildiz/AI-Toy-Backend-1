import { Router } from "express";
import DeviceController from "./device.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

router.post("/create", authMiddleware, DeviceController.createDevice);
router.get("/getAll", authMiddleware, DeviceController.getAllDevices);
router.get("/get/:id", authMiddleware, DeviceController.getDeviceById);
router.put("/update/:id", authMiddleware, DeviceController.updateDevice);
router.patch("/update-config/:deviceId", authMiddleware, DeviceController.updateDeviceConfig);
router.delete("/delete/:id", authMiddleware, DeviceController.deleteDevice);

export default router;
