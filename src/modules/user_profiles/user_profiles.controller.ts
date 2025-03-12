import { Request, Response } from "express";
import UserService from "./user_profiles.service";

export class UserController {
  // Kullanıcı oluşturma
  public async createUser(req: Request, res: Response): Promise<void> {
    const result = await UserService.createUser(req.body);
    if (!result.success) {
      res.status(400).json({ message: result.message });
      return;
    }
    res.status(201).json({ message: "Kullanıcı başarıyla oluşturuldu.", user: result.user });
  }

  // Tüm kullanıcıları getir
  public async getAllUsers(req: Request, res: Response): Promise<void> {
    const result = await UserService.getAllUsers();
    if (!result.success) {
      res.status(404).json({ message: result.message });
      return;
    }
    res.status(200).json(result.users);
  }

  // ID ile kullanıcı getir
  public async getUserById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const result = await UserService.getUserById(id);
    if (!result.success) {
      res.status(404).json({ message: result.message });
      return;
    }
    res.status(200).json(result.user);
  }

  // Kullanıcıyı güncelle
  public async updateUser(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const result = await UserService.updateUser(id, req.body);
    if (!result.success) {
      res.status(400).json({ message: result.message });
      return;
    }
    res.status(200).json({ message: "Kullanıcı başarıyla güncellendi.", user: result.user });
  }

  // Kullanıcıyı sil
  public async deleteUser(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const result = await UserService.deleteUser(id);
    if (!result.success) {
      res.status(400).json({ message: result.message });
      return;
    }
    res.status(200).json({ message: "Kullanıcı başarıyla silindi." });
  }
}

export default new UserController();
