require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Дозволяємо фронтенду звертатись до сервера
app.use(cors());
app.use(express.json()); // Дозволяє отримувати JSON у запитах

app.get('/', (req, res) => {
    res.send('Сервер працює! 🚀');
});

// Запускаємо сервер
app.listen(PORT, () => {
    console.log(`✅ Сервер запущено на http://localhost:${PORT}`);
});
