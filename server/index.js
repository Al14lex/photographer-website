require('dotenv').config();
require('./cron');
const path = require("path");
const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const { S3Client } = require('@aws-sdk/client-s3');
const multer = require('multer');
const multerS3 = require('multer-s3');

const Client = require("./models/Client");

const app = express(); // ✅ Ініціалізуємо app ПЕРШИМ
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(cors({
    origin: "http://localhost:5173", 
    methods: ["GET", "POST"]
}));
app.use(express.json());

// 📌 Підключення до MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB (clients) підключено"))
  .catch((err) => console.error("❌ Помилка підключення до MongoDB:", err));

// 📌 Налаштування AWS S3
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// 📌 Налаштування Multer для завантаження файлів
const storage = multerS3({
  s3: s3,
  bucket: process.env.AWS_BUCKET_NAME,
  acl: 'public-read',
  metadata: (req, file, cb) => {
    cb(null, { fieldName: file.fieldname });
  },
  key: (req, file, cb) => {
    cb(null, `photos/${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

// 📌 Оновлений API для завантаження фото (підтримує multiple)
app.post('/upload', upload.fields([
  { name: 'heroImage', maxCount: 1 },
  { name: 'gallery', maxCount: 10 }
]), (req, res) => {
  if (!req.files || (!req.files.heroImage && !req.files.gallery)) {
    return res.status(400).json({ message: 'Файли не завантажені!' });
  }

  const heroImageUrl = req.files.heroImage ? req.files.heroImage[0].location : null;
  const galleryUrls = req.files.gallery ? req.files.gallery.map(file => file.location) : [];

  res.json({
    message: 'Файли успішно завантажені!',
    heroImageUrl,
    galleryUrls
  });
});


// 📌 Корінь серверу для перевірки роботи
app.get('/', (req, res) => {
  res.send('Сервер працює! 🚀');
});

// 📌 Ендпоінт для створення нового клієнта
app.post('/api/clients', async (req, res) => {
  console.log("DEBUG: req.body", req.body);

  try {
    const { title, heroImage, gallery, pinCode } = req.body;

    if (!title || !heroImage || !gallery || !pinCode) {
      return res.status(400).json({ message: 'Будь ласка, заповніть усі поля.' });
    }

    const existingClient = await Client.findOne({ title });
    if (existingClient) {
      return res.status(400).json({ message: 'Клієнт з таким ім’ям вже існує.' });
    }

    const newClient = new Client({ title, heroImage, gallery, pinCode });
    await newClient.save();

    res.status(201).json({
      message: 'Клієнтська галерея створена!',
      clientUrl: `/gallery/${encodeURIComponent(title)}`,
    });

  } catch (error) {
    console.error("❌ Помилка створення клієнта:", error);
    res.status(500).json({ message: 'Помилка сервера' });
  }
});


// 📌 Ендпоінт для отримання даних клієнта за title
app.get('/api/clients/:title', async (req, res) => {
    try {
        const { title } = req.params;
        const client = await Client.findOne({ title });
        if (!client) {
            return res.status(404).json({ message: 'Клієнта не знайдено' });
        }
        res.json({
            title: client.title,
            heroImage: client.heroImage,
            gallery: client.gallery
        });
    } catch (error) {
        console.error("❌ Помилка отримання клієнта:", error);
        res.status(500).json({ message: 'Помилка сервера' });
    }
});

// 📌 Ендпоінт для перевірки PIN-коду
app.post('/api/clients/:title/auth', async (req, res) => {
    try {
        const { title } = req.params;
        const { pinCode } = req.body;
        if (!pinCode) {
            return res.status(400).json({ message: 'Будь ласка, введіть PIN-код.' });
        }
        const client = await Client.findOne({ title });
        if (!client) {
            return res.status(404).json({ message: 'Клієнта не знайдено' });
        }
        if (client.pinCode !== pinCode) {
            return res.status(403).json({ message: 'Невірний PIN-код.' });
        }
        res.json({ message: 'Доступ дозволено!' });
    } catch (error) {
        console.error("❌ Помилка авторизації клієнта:", error);
        res.status(500).json({ message: 'Помилка сервера' });
    }
});

// 📌 Ендпоінт для завантаження `client-gallery.html`
app.get("/gallery/:title", (req, res) => {
    res.sendFile(path.join(__dirname, "../src/client-gallery.html"));
});
app.use(express.static(path.join(__dirname, "../src")));

// 📌 Запускаємо сервер
app.listen(PORT, () => {
  console.log(`✅ Сервер запущено на http://localhost:${PORT}`);
});
