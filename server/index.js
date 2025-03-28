require("dotenv").config();
require("./cron");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { S3Client } = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");
const path = require("path");
const axios = require("axios");
const archiver = require("archiver");
const slugify = require("slugify");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: [
        "https://aleksandraphoto.com",
        "https://www.aleksandraphoto.com",
        "http://localhost:5173",
        "http://localhost:5000",
        "https://api.aleksandraphoto.com"
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["ETag"],
    credentials: true
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, "../src")));
app.use('/img', express.static(path.join(__dirname, '../src/img')));
app.use('/favicon', express.static(path.join(__dirname, '../src/favicon')));
app.use('/css', express.static(path.join(__dirname, '../src/css')));
app.use('/js', express.static(path.join(__dirname, '../src/js')));

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch(err => console.error("❌ Connection error:", err));

// ===================== MODELS =====================
const Review = mongoose.model("Review", new mongoose.Schema({
    name: String,
    message: String,
    status: { type: String, default: "pending" }
}));
const Client = require("./models/Client");

// ===================== AWS CONFIG =====================
const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

const storage = multerS3({
    s3,
    bucket: process.env.AWS_BUCKET_NAME,
    acl: 'public-read',
    metadata: (req, file, cb) => cb(null, { fieldName: file.fieldname }),
    key: (req, file, cb) => {
        const safeName = file.originalname
            .replace(/\s+/g, "_")
            .replace(/[^\w\-.]/gi, "");
        cb(null, `photos/${Date.now()}_${safeName}`);
    }
});
const upload = multer({ storage });

// ===================== UPLOAD ROUTE =====================
app.post('/upload', upload.fields([
    { name: 'heroImage', maxCount: 1 },
    { name: 'gallery' }
]), (req, res) => {
    if (!req.files || (!req.files.heroImage && !req.files.gallery)) {
        return res.status(400).json({ message: 'Files not uploaded!' });
    }

    const heroImageUrl = req.files.heroImage?.[0]?.location || null;
    const galleryUrls = req.files.gallery?.map(file => file.location) || [];

    res.json({ heroImageUrl, galleryUrls });
});

// ===================== CLIENT ROUTES =====================
app.post('/api/clients', async (req, res) => {

    try {
        const { title, slug, heroImage, gallery, pinCode } = req.body;
        // const slug = req.body.slug?.toLowerCase();

        if (!title || !slug || !heroImage || !gallery || !pinCode) {
            return res.status(400).json({ message: 'Please fill in all fields.' });
        }

        const safeSlug = slug.toLowerCase(); 

        const existingClient = await Client.findOne({ slug: safeSlug });
        if (existingClient) {
            return res.status(400).json({ message: 'Client with this name already exists.' });
        }

        const newClient = new Client({
            title,
            slug: safeSlug,
            heroImage,
            gallery,
            pinCode,
        });

        await newClient.save();

        const clientUrl = `https://api.aleksandraphoto.com/gallery/${newClient.slug}`;
        res.status(201).json({ message: 'Client gallery created!', clientUrl });

    } catch (error) {
        console.error("❌ Error creating client:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.get("/api/clients/:slug", async (req, res) => {
    try {
        const client = await Client.findOne({ slug: req.params.slug.toLowerCase() });
        if (!client) return res.status(404).json({ error: "Client not found" });
        res.json(client);
    } catch (error) {
        console.error("❌ Error retrieving client:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/clients/:slug/auth', async (req, res) => {
    try {
        const { pinCode } = req.body;
        const { slug } = req.params;

        if (!pinCode) return res.status(400).json({ message: 'Please enter the PIN code.' });

        console.log(`🔍 Authorization request for: ${slug}`);
        const client = await Client.findOne({ slug: slug.toLowerCase() });
        if (!client) return res.status(404).json({ message: 'Client not found' });
        if (client.pinCode !== pinCode) return res.status(403).json({ message: 'Incorrect PIN code.' });

        res.json({ message: 'Access granted!' });
    } catch (error) {
        console.error("❌ Error authorizing client:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.get("/gallery/:slug", (req, res) => {
    res.sendFile(path.join(__dirname, "../src/client-gallery.html"));
});

app.get("/api/download-zip/:slug", async (req, res) => {
    const { slug } = req.params;

    try {
        const client = await Client.findOne({ slug: slug.toLowerCase() });
        if (!client || !client.gallery?.length) {
            return res.status(404).json({ message: "Gallery not found" });
        }

        res.set({
            "Content-Type": "application/zip",
            "Content-Disposition": `attachment; filename="${slug}.zip"`
        });

        const archive = archiver("zip", { zlib: { level: 9 } });
        archive.pipe(res);

        for (let i = 0; i < client.gallery.length; i++) {
            try {
                const response = await axios.get(client.gallery[i], { responseType: "stream", timeout: 10000 });
                archive.append(response.data, { name: `photo_${i + 1}.jpg` });
            } catch (error) {
                console.error(`❌ Error downloading ${client.gallery[i]}:`, error.message);
            }
        }

        archive.finalize();
    } catch (error) {
        console.error("❌ ZIP error:", error);
        res.status(500).json({ message: "Error creating zip file" });
    }
});
app.get("/api/clients-list", async (req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });
    const now = new Date();

    // Видаляємо старі (більше 90 днів)
    const expiredClients = clients.filter(client => {
      const ageInMs = now - client.createdAt;
      return ageInMs > 90 * 24 * 60 * 60 * 1000;
    });

    if (expiredClients.length > 0) {
      const idsToDelete = expiredClients.map(c => c._id);
      await Client.deleteMany({ _id: { $in: idsToDelete } });
    }

    const activeClients = clients.filter(client => {
      const ageInMs = now - client.createdAt;
      return ageInMs <= 90 * 24 * 60 * 60 * 1000;
    });

    res.json(activeClients);
  } catch (error) {
    console.error("❌ Error loading clients list:", error);
    res.status(500).json({ message: "Error loading clients" });
  }
});

// ===================== REVIEWS =====================
app.get("/reviews", async (req, res) => {
    try {
        const reviews = await Review.find();
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

app.get("/reviews/approved", async (req, res) => {
    try {
        const reviews = await Review.find({ status: "approved" });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

app.post("/reviews", async (req, res) => {
    try {
        const newReview = new Review({ name: req.body.name, message: req.body.message });
        await newReview.save();
        res.status(201).json(newReview);
    } catch (error) {
        res.status(500).json({ message: "Error saving review" });
    }
});

app.put("/reviews/:id", async (req, res) => {
    try {
        const updated = await Review.findByIdAndUpdate(req.params.id, { status: "approved" }, { new: true });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: "Error updating review" });
    }
});

app.delete("/reviews/:id", async (req, res) => {
    try {
        await Review.findByIdAndDelete(req.params.id);
        res.json({ message: "Review deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting review" });
    }
});

// ===================== START SERVER =====================
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
