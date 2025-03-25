const mongoose = require("mongoose");
const slugify = require("slugify");

const clientSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true }, 
  heroImage: { type: String, required: true },
  gallery: [{ type: String, required: true }],
  pinCode: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Client = mongoose.models.Client || mongoose.model("Client", clientSchema);
module.exports = Client;
