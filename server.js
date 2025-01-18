const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.set('view engine', 'ejs');

// Enable the public folder for static assets
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));


// Connect to MongoDB
mongoose.connect("mongodb+srv://chimaobi:chimaobi@uchman-cluster.tnonfsw.mongodb.net/?retryWrites=true&w=majority&appName=Uchman-Cluster", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// MongoDB Schema and Model
const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  review: { type: String, required: true },
  imageUrl: { type: String, default: "/public/images/profile.png" },
});

const Review = mongoose.model("Review", reviewSchema);

// Routes
app.get("/reviews", async (req, res) => {
  try {
    const reviews = await Review.find();
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Error fetching reviews" });
  }
});

app.get('/', (req, res)=>{
  res.render("index")
});

app.post("/reviews", async (req, res) => {
  try {
    const { name, review, imageUrl } = req.body;
    const newReview = new Review({ name, review, imageUrl });
    const savedReview = await newReview.save();
    res.status(201).json(savedReview);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error saving review" });
  }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
