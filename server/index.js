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

app.use(cors({
    origin: ["https://aleksandraphoto.com", "https://www.aleksandraphoto.com", "http://localhost:5173", "http://localhost:5000", "https://api.aleksandraphoto.com"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["ETag"],
    credentials: true
}));


app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Expose-Headers", "ETag");
    next();
});


app.use(express.json());
app.use(express.static(path.join(__dirname, "../src")));
app.use('/img', express.static(path.join(__dirname, '../src/img')));
app.use('/favicon', express.static(path.join(__dirname, '../src/favicon')));
app.use('/css', express.static(path.join(__dirname, '../src/css')));
app.use('/js', express.static(path.join(__dirname, '../src/js')));

// Connecting to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch(err => console.error("❌ Connection error:", err));

// Review model
const reviewSchema = new mongoose.Schema({
    name: String,
    message: String,
    status: { type: String, default: "pending" }
});
const Review = mongoose.model("Review", reviewSchema);
// Client model
const Client = require("./models/Client");

// AWS S3 Configuration
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

// Serve the client page (static route)
app.get("/gallery/:title", (req, res) => {
    res.sendFile(path.join(__dirname, "../src", "client-gallery.html"));
});

// Photo upload
app.post('/upload', upload.fields([
    { name: 'heroImage', maxCount: 1 },
    { name: 'gallery'}
]), (req, res) => {
    if (!req.files || (!req.files.heroImage && !req.files.gallery)) {
        return res.status(400).json({ message: 'Files not uploaded!' });
    }

    const heroImageUrl = req.files.heroImage ? req.files.heroImage[0].location : null;
    const galleryUrls = req.files.gallery ? req.files.gallery.map(file => file.location) : [];

    res.json({ heroImageUrl, galleryUrls });
});

// Create a new client
app.post('/api/clients', async (req, res) => {
    try {
        const { title, heroImage, gallery, pinCode } = req.body;
        if (!title || !heroImage || !gallery || !pinCode) {
            return res.status(400).json({ message: 'Please fill in all fields.' });
        }

            const existingClient = await Client.findOne({ title });
    if (existingClient) {
      return res.status(400).json({ message: 'Client with this name already exists.' });
    }

        const newClient = new Client({ title, heroImage, gallery, pinCode });
        await newClient.save();

        const clientUrl = `https://api.aleksandraphoto.com/gallery/${encodeURIComponent(title)}`;

        res.status(201).json({ 
            message: 'Client gallery created!', 
            clientUrl 
        });
    } catch (error) {
        console.error("❌ Error creating client:", error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Get client data
app.get("/api/clients/:clientTitle", async (req, res) => {
    try {
        const clientTitle = req.params.clientTitle;
        const client = await Client.findOne({ title: clientTitle });

        if (client) {
            res.json(client);
        } else {
            res.status(404).json({ error: "Client not found" });
        }
    } catch (error) {
        console.error("❌ Error retrieving client:", error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Endpoint for PIN code verification
app.post('/api/clients/:clientTitle/auth', async (req, res) => {
    try {
        const { clientTitle } = req.params;
        const { pinCode } = req.body;
        if (!pinCode) {
            return res.status(400).json({ message: 'Please enter the PIN code.' });
        }
        console.log(`🔍Authorization request received for: ${clientTitle}`);
        const client = await Client.findOne({ title: clientTitle });
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }
        if (client.pinCode !== pinCode) {
            return res.status(403).json({ message: 'Incorrect PIN code.' });
        }
        res.json({ message: 'Access granted!' });
    } catch (error) {
        console.error("❌Error authorizing client:", error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Endpoint to upload `client-gallery.html`
app.get("/gallery/:clientTitle", (req, res) => {
    res.sendFile(path.join(__dirname, "../src/client-gallery.html"));
});

//=============================================Reviews====================
app.get("/reviews", async (req, res) => {
    try {
        const reviews = await Review.find();
        console.log("📤 Sending reviews:", reviews); 
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

app.get("/reviews/approved", async (req, res) => {
    try {
        const approvedReviews = await Review.find({ status: "approved" });
        res.json(approvedReviews);
    } catch (error) {
        res.status(500).json({ message: "Server error"});
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
        const updatedReview = await Review.findByIdAndUpdate(req.params.id, { status: "approved" }, { new: true });
        res.json(updatedReview);
    } catch (error) {
        res.status(500).json({ message: "Error updating status" });
    }
});

app.delete("/reviews/:id", async (req, res) => {
    try {
        await Review.findByIdAndDelete(req.params.id);
        res.json({ message: "Review deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting" });
    }
});

//  Старт сервера
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
