require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Підключено до MongoDB"))
    .catch(err => console.error("❌ Помилка підключення:", err));

const reviewSchema = new mongoose.Schema({
    name: String,
    message: String,
    status: { type: String, default: "pending" } 
});

const Review = mongoose.model("Review", reviewSchema);

app.get("/", (req, res) => {
    res.send("Сервер працює! 🚀");
});

app.get("/reviews", async (req, res) => {
    try {
        const reviews = await Review.find();
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

app.delete("/reviews/:id", async (req, res) => {
    try {
        await Review.findByIdAndDelete(req.params.id);
        res.json({ message: "Відгук видалено" });
    } catch (error) {
        res.status(500).json({ message: "Помилка видалення" });
    }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`🚀 Сервер працює на порту ${PORT}`);
});
