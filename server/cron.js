const cron = require('node-cron');
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

// CRON завдання для видалення фото старших за 3 місяці
cron.schedule('*/1 * * * *',  async () => {
    const now = new Date();
    const threeMonthsAgo = new Date(now.setMonth(now.getMonth() - 3));

    // Перевірка всіх об'єктів у бакеті
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
    };

    try {
        const data = await s3.listObjectsV2(params).promise();
        data.Contents.forEach((object) => {
            const lastModified = new Date(object.LastModified);
            if (lastModified < threeMonthsAgo) {
                // Якщо файл старший ніж 3 місяці, видаляємо його
                const deleteParams = {
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: object.Key,
                };

                s3.deleteObject(deleteParams, (err, data) => {
                    if (err) {
                        console.log('Error deleting file:', err);
                    } else {
                        console.log('File deleted successfully:', object.Key);
                    }
                });
            }
        });
    } catch (err) {
        console.log('Error listing objects in bucket:', err);
    }
});

console.log('CRON task started for file deletion every day.');
