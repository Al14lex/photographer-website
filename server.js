require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Підключення до MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ Підключено до MongoDB"))
.catch(err => console.error("❌ Помилка підключення:", err));

// Створення моделі відгуків
const reviewSchema = new mongoose.Schema({
    name: String,
    message: String,
    status: { type: String, default: "pending" } // Додаємо статус: pending або approved
});

const Review = mongoose.model("Review", reviewSchema);

// Головна сторінка API
app.get("/", (req, res) => {
    res.send("Сервер працює! 🚀");
});

// 📌 **Отримати всі відгуки (і pending, і approved)**
app.get("/reviews", async (req, res) => {
    try {
        const reviews = await Review.find();
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: "Помилка сервера" });
    }
});

// 📌 **Отримати тільки схвалені відгуки**
app.get("/reviews/approved", async (req, res) => {
    try {
        const approvedReviews = await Review.find({ status: "approved" });
        res.json(approvedReviews);
    } catch (error) {
        res.status(500).json({ message: "Помилка сервера" });
    }
});

// 📌 **Додати новий відгук (POST)**
app.post("/reviews", async (req, res) => {
    try {
        const newReview = new Review({
            name: req.body.name,
            message: req.body.message,
            status: "pending"
        });
        await newReview.save();
        res.status(201).json(newReview);
    } catch (error) {
        res.status(500).json({ message: "Помилка збереження відгуку" });
    }
});

// 📌 **Схвалити відгук (PUT)**
app.put("/reviews/:id", async (req, res) => {
    try {
        const updatedReview = await Review.findByIdAndUpdate(
            req.params.id,
            { status: "approved" },
            { new: true }
        );
        res.json(updatedReview);
    } catch (error) {
        res.status(500).json({ message: "Помилка оновлення статусу" });
    }
});

// 📌 **Видалити відгук (DELETE)**
app.delete("/reviews/:id", async (req, res) => {
    try {
        await Review.findByIdAndDelete(req.params.id);
        res.json({ message: "Відгук видалено" });
    } catch (error) {
        res.status(500).json({ message: "Помилка видалення" });
    }
});

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Сервер працює на порту ${PORT}`);
});
