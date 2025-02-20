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


app.get("/", (req, res) => {
  res.send("Сервер працює! 🚀");
});


app.listen(5000, () => {
  console.log("🚀 Сервер працює на порту 5000");
});
