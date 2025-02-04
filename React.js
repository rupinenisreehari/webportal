const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Post Schema
const PostSchema = new mongoose.Schema({
    title: String,
    content: String,
    date: { type: Date, default: Date.now }
});
const Post = mongoose.model('Post', PostSchema);

// Admin Schema
const AdminSchema = new mongoose.Schema({
    username: String,
    password: String
});
const Admin = mongoose.model('Admin', AdminSchema);

// Middleware for authentication
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).send('Access denied');
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).send('Invalid token');
        req.user = decoded;
        next();
    });
};

// Admin Login
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(400).send('User not found');
    
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).send('Invalid credentials');
    
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
});

// Create Post (Protected Route)
app.post('/api/posts', verifyToken, async (req, res) => {
    const newPost = new Post(req.body);
    await newPost.save();
    res.send('Post created');
});

// Get All Posts
app.get('/api/posts', async (req, res) => {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
});

// Delete Post (Protected Route)
app.delete('/api/posts/:id', verifyToken, async (req, res) => {
    await Post.findByIdAndDelete(req.params.id);
    res.send('Post deleted');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
