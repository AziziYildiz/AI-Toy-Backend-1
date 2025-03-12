import { UserProfileModel, IUserProfile } from "./user_profiles.model";

class UserService {
  // Kullanıcı oluştur
  async createUser(userData: Partial<IUserProfile>) {
    try {
      const user = await UserProfileModel.create(userData);
      return { success: true, user };
    } catch (error) {
      console.error("Kullanıcı oluşturma hatası:", error);
      return { success: false, message: "Kullanıcı oluşturulamadı." };
    }
  }

  // Tüm kullanıcıları getir
  async getAllUsers() {
    try {
      const users = await UserProfileModel.find();
      return { success: true, users };
    } catch (error) {
      return { success: false, message: "Kullanıcılar alınamadı." };
    }
  }

  // Belirli bir kullanıcıyı ID ile getir
  async getUserById(userId: string) {
    try {
      const user = await UserProfileModel.findById(userId);
      if (!user) return { success: false, message: "Kullanıcı bulunamadı." };
      return { success: true, user };
    } catch (error) {
      return { success: false, message: "Kullanıcı bulunamadı." };
    }
  }

  // Kullanıcıyı güncelle
  async updateUser(userId: string, updatedData: Partial<IUserProfile>) {
    try {
      const updatedUser = await UserProfileModel.findByIdAndUpdate(userId, updatedData, { new: true });
      if (!updatedUser) return { success: false, message: "Kullanıcı bulunamadı." };
      return { success: true, user: updatedUser };
    } catch (error) {
      return { success: false, message: "Kullanıcı güncellenemedi." };
    }
  }

  // Kullanıcıyı sil
  async deleteUser(userId: string) {
    try {
      const deletedUser = await UserProfileModel.findByIdAndDelete(userId);
      if (!deletedUser) return { success: false, message: "Kullanıcı bulunamadı." };
      return { success: true, message: "Kullanıcı başarıyla silindi." };
    } catch (error) {
      return { success: false, message: "Kullanıcı silinemedi." };
    }
  }
}

export default new UserService();
