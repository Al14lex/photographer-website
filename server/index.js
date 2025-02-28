require('dotenv').config();
require('./cron'); 
const express = require('express');
const cors = require('cors');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const multer = require('multer');
const multerS3 = require('multer-s3');

const app = express();
const PORT = process.env.PORT || 5000;

// Дозволяємо фронтенду звертатись до сервера
// Якщо фронтенд на іншому домені, заміни '*' на конкретний домен, наприклад: 'http://localhost:3000'
app.use(cors());
app.use(express.json()); // Дозволяє отримувати JSON у запитах

// Налаштування AWS S3 (SDK v3)
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Налаштування Multer для завантаження файлів
const storage = multerS3({
  s3: s3,
  bucket: process.env.AWS_BUCKET_NAME,
  acl: 'public-read', // щоб фото були доступні за посиланням
  metadata: (req, file, cb) => {
    cb(null, { fieldName: file.fieldname });
  },
  key: (req, file, cb) => {
    cb(null, `photos/${Date.now()}_${file.originalname}`); // унікальне ім’я файлу
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Обмеження на розмір файлу (10 MB)
}).single('photo');

// Ендпоінт для завантаження фото
app.post('/upload', (req, res) => {
  upload(req, res, function (err) {
    if (err) {
      // Помилка завантаження файлу (наприклад, перевищення розміру)
      return res.status(400).send(err.message || 'Error occurred during file upload.');
    }

    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }

    // Якщо файл завантажено успішно, повертаємо URL до фото
    res.json({
      message: 'File uploaded successfully!',
      fileUrl: req.file.location, // URL на S3
    });
  });
});

// Корінь серверу для перевірки роботи
app.get('/', (req, res) => {
  res.send('Сервер працює! 🚀');
});

// Запускаємо сервер
app.listen(PORT, () => {
  console.log(`✅ Сервер запущено на http://localhost:${PORT}`);
});
