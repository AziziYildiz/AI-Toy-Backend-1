import { Request, Response } from "express";
import AuthService from "./auth.service";
import jwt from "jsonwebtoken";
import { UserModel } from "./auth.model";

interface CustomRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export class AuthController {
  // Kullanıcı kayıt olma
  public async register(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        res.status(400).json({ message: "Tüm alanlar zorunludur." });
        return;
      }

      // Kullanıcı var mı kontrol et
      const existingUser = await AuthService.findUserByEmail(email);
      if (existingUser.success) {
        res.status(400).json({ message: "Bu e-mail zaten kayıtlı." });
        return;
      }

      // Şifreyi hashle
      const hashedPassword = await AuthService.hashPassword(password);

      // Kullanıcı oluştur
      const newUser = await UserModel.create({ name, email, password: hashedPassword });

      res.status(201).json({ message: "Kullanıcı başarıyla kaydedildi." });
    } catch (error) {
      console.error("Register error:", error);
      res.status(500).json({ message: "Sunucu hatası." });
    }
  }

  // Kullanıcı giriş yapma
  public async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ message: "E-mail ve şifre gereklidir." });
        return;
      }

      // Kullanıcıyı bul
      const result = await AuthService.findUserByEmail(email);
      if (!result.success || !result.user) {
        res.status(401).json({ message: "Geçersiz kimlik bilgileri." });
        return;
      }

      const user = result.user;

      // Şifreyi doğrula
      const isPasswordValid = await AuthService.verifyPassword(password, user.password);
      if (!isPasswordValid) {
        res.status(401).json({ message: "Geçersiz kimlik bilgileri." });
        return;
      }

      // Token oluştur
      const accessToken = AuthService.generateAccessToken(user);
      const refreshToken = AuthService.generateRefreshToken(user);

      res.status(200).json({ message: "Giriş başarılı", accessToken, refreshToken });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Sunucu hatası." });
    }
  }

  // Token yenileme (Refresh Token)
  public async handleRefreshToken(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        res.status(401).json({ message: "Refresh token eksik." });
        return;
      }

      jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET_KEY || "defaultRefreshSecretKey",
        async (err: jwt.VerifyErrors | null, decoded: any) => {
          if (err) {
            res.status(401).json({ message: "Geçersiz veya süresi dolmuş refresh token." });
            return;
          }

          // Kullanıcıyı tekrar bul
          const result = await AuthService.findUserById(decoded.userId);
          if (!result.success || !result.user) {
            res.status(403).json({ message: "Yetkisiz erişim." });
            return;
          }

          const user = result.user;

          // Yeni Access Token oluştur
          const newAccessToken = AuthService.generateAccessToken(user);

          res.status(200).json({ message: "Token yenilendi", accessToken: newAccessToken });
        }
      );
    } catch (error) {
      console.error("Refresh Token error:", error);
      res.status(500).json({ message: "Sunucu hatası." });
    }
  }

  // Kullanıcı çıkış yapma
  public async logout(req: Request, res: Response): Promise<void> {
    try {
      res.status(200).json({ message: "Çıkış başarılı" });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({ message: "Sunucu hatası." });
    }
  }

  // Kullanıcı doğrulama
  public async verifyUser(req: CustomRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Yetkisiz erişim." });
        return;
      }
      res.status(200).json({ user: req.user });
    } catch (error) {
      console.error("Verify user error:", error);
      res.status(500).json({ message: "Sunucu hatası." });
    }
  }
}

export default new AuthController();
