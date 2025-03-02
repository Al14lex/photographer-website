const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true }, // Ім'я клієнта (і частина URL)
  heroImage: { type: String, required: true }, // URL фото для hero
  gallery: [{ type: String, required: true }], // Масив URL-адрес фото
  pinCode: { type: String, required: true }, // Пін-код для доступу
  createdAt: { type: Date, default: Date.now }, // Дата створення (для автоочищення)
});

// Створюємо модель на основі схеми
const Client = mongoose.model("Client", clientSchema);

module.exports = Client;
