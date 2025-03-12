import express from "express";
import http from "http";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/database";
import router from "./modules/index";
import { errorHandler } from "./middleware/error.middleware";
import { loggerMiddleware } from "./middleware/logger.middleware";
import WebSocketGateway from "./modules/websocket/websocket.gateway";

// 📌 .env Dosyasını Yükle
dotenv.config();

// 📌 Express Uygulamasını Başlat
const app = express();

// 📌 Middleware'ler
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: process.env.CLIENT_URL || "*" })); // Mobil uygulamalar için CORS

// 📌 Logger Middleware (Gelen istekleri loglar)
app.use(loggerMiddleware);

// 📌 API Rotalarını Bağla
app.use("/api", router);

// 📌 Hata Yönetimi Middleware'i
app.use(errorHandler);

// 📌 HTTP Sunucusu Oluştur
const server = http.createServer(app);


// 📡 WebSocket Sunucusunu Başlat
WebSocketGateway.initialize(server);


// 📌 Veritabanına Bağlan
connectDB().then(() => {
  console.log("✅ Veritabanı bağlantısı başarılı.");
});

// 📌 Sunucuyu Dinle
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server ${PORT} portunda çalışıyor.`);
});
