import { UserModel } from "./auth.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

class AuthService {
  // Kullanıcıyı email'e göre bulma
  public async findUserByEmail(email: string) {
    try {
      const user = await UserModel.findOne({ email }).select("+password");
      if (!user) return { success: false, user: null };
      return { success: true, user };
    } catch (error) {
      return { success: false, error };
    }
  }

  // Kullanıcıyı ID'ye göre bulma
  public async findUserById(userId: string) {
    try {
      const user = await UserModel.findById(userId);
      if (!user) return { success: false, user: null };
      return { success: true, user };
    } catch (error) {
      return { success: false, error };
    }
  }

  // Şifreyi hashleme
  public async hashPassword(password: string) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  // Şifre doğrulama
  public async verifyPassword(inputPassword: string, hashedPassword: string) {
    return await bcrypt.compare(inputPassword, hashedPassword);
  }

  // JWT Access Token oluşturma
  public generateAccessToken(user: any) {
    return jwt.sign(
      { userId: user._id.toString(), email: user.email },
      process.env.JWT_SECRET_KEY || "defaultSecretKey",
      { expiresIn: "2h" }
    );
  }

  // JWT Refresh Token oluşturma
  public generateRefreshToken(user: any) {
    return jwt.sign(
      { userId: user._id.toString() },
      process.env.JWT_REFRESH_SECRET_KEY || "defaultRefreshSecretKey",
      { expiresIn: "1d" }
    );
  }
}

export default new AuthService();
