import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import AuthService from "../modules/auth/auth.service";
import { IUser } from "../modules/auth/auth.model";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Yetkilendirme başarısız. Token eksik." });
    return;
  }

  const token = authHeader.split(" ")[1]; // "Bearer <token>" formatından token'ı ayıkla

  if (!process.env.JWT_SECRET_KEY) {
    console.error("JWT_SECRET_KEY tanımlı değil.");
    res.status(500).json({ message: "Sunucu iç hatası" });
    return;
  }

  try {
    // Token doğrulama
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY) as jwt.JwtPayload;

    if (!decoded || !decoded.userId) {
      res.status(401).json({ message: "Geçersiz token." });
      return;
    }

    // Kullanıcıyı ID ile bul
    const result = await AuthService.findUserById(decoded.userId);

    if (!result.success || !result.user) {
      res.status(403).json({ message: "Yetkilendirme başarısız. Kullanıcı bulunamadı." });
      return;
    }

    const user: IUser = result.user;

    // Kullanıcıyı `req.user` içine ekleyelim
    req.user = { id: user.id.toString(), email: user.email };

    next();
  } catch (error) {
    console.error("Token doğrulama hatası:", error);
    res.status(401).json({ message: "Geçersiz veya süresi dolmuş token." });
  }
};
