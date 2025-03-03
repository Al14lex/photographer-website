const cron = require('node-cron');
const AWS = require('@aws-sdk/client-s3');
const mongoose = require("mongoose");
const Client = require("./models/Client");
require("dotenv").config();

// Підключення до MongoDB (якщо не підключено в index.js)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ CRON: Підключено до MongoDB"))
  .catch((err) => console.error("❌ CRON: Помилка підключення до MongoDB:", err));

// Налаштування AWS S3
const s3 = new AWS.S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

//  cron.schedule('0 3 * * *', async () => {
    cron.schedule('*/1 * * * *', async () => {

    console.log('🔄 CRON: Перевірка та видалення старих клієнтів...');

    // const now = new Date();
    // const threeMonthsAgo = new Date();
    // threeMonthsAgo.setMonth(now.getMonth() - 3);
        
        const now = new Date();
        const oneMinuteAgo = new Date(now.getTime() - 1 * 60 * 1000); // 1 хвилина тому


    try {
        // Отримуємо всіх клієнтів, у яких `createdAt` більше 3 місяців
        // const oldClients = await Client.find({ createdAt: { $lt: threeMonthsAgo } });
        const oldClients = await Client.find({ createdAt: { $lt: oneMinuteAgo } });


        for (const client of oldClients) {
            // Видаляємо всі фото клієнта з S3
            for (const photoUrl of client.gallery) {
                const key = photoUrl.split('.com/')[1]; // Отримуємо ключ файлу S3
                const deleteParams = { Bucket: process.env.AWS_BUCKET_NAME, Key: key };

                try {
                    await s3.send(new AWS.DeleteObjectCommand(deleteParams));
                    console.log(`🗑 Видалено фото: ${photoUrl}`);
                } catch (s3Error) {
                    console.error(`❌ Помилка видалення фото з S3: ${photoUrl}`, s3Error);
                }
            }

            // Після видалення фото – видаляємо клієнта з бази
            await Client.deleteOne({ _id: client._id });
            console.log(`🗑 Видалено клієнта: ${client.title}`);
        }

        console.log('✅ CRON: Очищення завершено.');
    } catch (error) {
        console.error('❌ CRON: Помилка при видаленні старих клієнтів:', error);
    }
});

console.log('✅ CRON: Запущено. Видалення старих фото кожен день о 03:00 ночі.');
