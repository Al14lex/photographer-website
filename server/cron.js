const cron = require('node-cron');
const AWS = require('@aws-sdk/client-s3');
const mongoose = require("mongoose");
const Client = require("./models/Client");
require("dotenv").config();

// MongoDB connection (if not connected in index.js)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ CRON: Connected to MongoDB"))
  .catch((err) => console.error("❌ CRON: MongoDB connection error:", err));

// AWS S3 configuration
const s3 = new AWS.S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

 cron.schedule('0 3 * * *', async () => {
    // cron.schedule('*/1 * * * *', async () => {

    console.log('🔄 CRON: Checking and removing old clients...');

    const now = new Date();
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(now.getMonth() - 3);
        
        // const now = new Date();
        // const oneMinuteAgo = new Date(now.getTime() - 1 * 60 * 1000); // 1 хвилина тому


    try {
        const oldClients = await Client.find({ createdAt: { $lt: threeMonthsAgo } });
        // const oldClients = await Client.find({ createdAt: { $lt: oneMinuteAgo } });

        for (const client of oldClients) {
            for (const photoUrl of client.gallery) {
                const key = photoUrl.split('.com/')[1]; 
                const deleteParams = { Bucket: process.env.AWS_BUCKET_NAME, Key: key };

                try {
                    await s3.send(new AWS.DeleteObjectCommand(deleteParams));
                    console.log(`🗑 Deleted photo: ${photoUrl}`);
                } catch (s3Error) {
                    console.error(`❌ Error deleting photo from S3: ${photoUrl}`, s3Error);
                }
            }

            await Client.deleteOne({ _id: client._id });
            console.log(`🗑 Deleted client: ${client.title}`);
        }

        console.log('✅ CRON: Cleanup completed.');
    } catch (error) {
        console.error('❌ CRON: Error while deleting old clients:', error);
    }
});

console.log('✅ CRON: Started. Deleting old photos every day at 03:00 AM.');
