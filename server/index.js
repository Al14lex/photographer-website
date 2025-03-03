require("dotenv").config();
require("./cron");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { S3Client } = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 📌 Підключення до MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Підключено до MongoDB"))
    .catch(err => console.error("❌ Помилка підключення:", err));

// 📌 Модель для відгуків
const reviewSchema = new mongoose.Schema({
    name: String,
    message: String,
    status: { type: String, default: "pending" }
});
const Review = mongoose.model("Review", reviewSchema);

// 📌 Модель для клієнтів
const Client = require("./models/Client");

// 📌 Налаштування AWS S3
const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

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

const upload = multer({ storage });

// 📌 Ендпоінти для клієнтів
app.post('/upload', upload.fields([
    { name: 'heroImage', maxCount: 1 },
    { name: 'gallery', maxCount: 10 }
]), (req, res) => {
    if (!req.files || (!req.files.heroImage && !req.files.gallery)) {
        return res.status(400).json({ message: 'Файли не завантажені!' });
    }

    const heroImageUrl = req.files.heroImage ? req.files.heroImage[0].location : null;
    const galleryUrls = req.files.gallery ? req.files.gallery.map(file => file.location) : [];

    res.json({ heroImageUrl, galleryUrls });
});

app.post('/api/clients', async (req, res) => {
    try {
        const { title, heroImage, gallery, pinCode } = req.body;
        if (!title || !heroImage || !gallery || !pinCode) {
            return res.status(400).json({ message: 'Будь ласка, заповніть усі поля.' });
        }
        const newClient = new Client({ title, heroImage, gallery, pinCode });
        await newClient.save();
        res.status(201).json({ message: 'Клієнтська галерея створена!' });
    } catch (error) {
        res.status(500).json({ message: 'Помилка сервера' });
    }
});

// 📌 Ендпоінти для відгуків
app.get("/reviews", async (req, res) => {
    try {
        const reviews = await Review.find();
        console.log("📤 Відправляю відгуки:", reviews); // Додаємо лог на бекенді
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: "Помилка сервера" });
    }
});

app.get("/reviews/approved", async (req, res) => {
    try {
        const approvedReviews = await Review.find({ status: "approved" });
        res.json(approvedReviews);
    } catch (error) {
        res.status(500).json({ message: "Помилка сервера" });
    }
});

app.post("/reviews", async (req, res) => {
    try {
        const newReview = new Review({ name: req.body.name, message: req.body.message });
        await newReview.save();
        res.status(201).json(newReview);
    } catch (error) {
        res.status(500).json({ message: "Помилка збереження відгуку" });
    }
});

app.put("/reviews/:id", async (req, res) => {
    try {
        const updatedReview = await Review.findByIdAndUpdate(req.params.id, { status: "approved" }, { new: true });
        res.json(updatedReview);
    } catch (error) {
        res.status(500).json({ message: "Помилка оновлення статусу" });
    }
});

app.delete("/reviews/:id", async (req, res) => {
    try {
        await Review.findByIdAndDelete(req.params.id);
        res.json({ message: "Відгук видалено" });
    } catch (error) {
        res.status(500).json({ message: "Помилка видалення" });
    }
});

// 📌 Старт сервера
app.listen(PORT, () => {
    console.log(`🚀 Сервер працює на порту ${PORT}`);
});
