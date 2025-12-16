const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database Setup (SQLite)
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'database.sqlite'),
  logging: false, // Set to console.log to see SQL queries
});

// Models
const Inquiry = sequelize.define('Inquiry', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  tourDate: {
    type: DataTypes.STRING, // Storing as string for simplicity, can be DATE
    allowNull: true,
  },
});

// Mock Email Notification
const sendNotification = (data) => {
  console.log('---------------------------------------------------');
  console.log('📨 NEW INQUIRY RECEIVED');
  console.log(`Name: ${data.name}`);
  console.log(`Email: ${data.email}`);
  console.log(`Phone: ${data.phone}`);
  console.log(`Tour Date: ${data.tourDate}`);
  console.log(`Message: ${data.message}`);
  console.log('---------------------------------------------------');
};

const multer = require('multer');

// ... imports

// Multer Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, 'image-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const SECRET_KEY = "supersecretkey123"; // In production, use process.env.SECRET_KEY

// User Model
const User = sequelize.define('User', {
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false }
});

// Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// ... inside sequelize sync ...
// Seed Admin User
const seedAdmin = async () => {
  const adminEmail = 'admin@fountainofpeace.com';
  const existingUser = await User.findOne({ where: { email: adminEmail } });
  if (!existingUser) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await User.create({ email: adminEmail, password: hashedPassword });
    console.log('Admin user created: admin@fountainofpeace.com / admin123');
  }
};

// Image Model
// Types: 'hero', 'gallery', 'service_supervision', 'service_healthcare', 'service_adl', 'service_meals', 'service_housekeeping', 'service_social'
const Image = sequelize.define('Image', {
  filename: { type: DataTypes.STRING, allowNull: false },
  type: { type: DataTypes.STRING, allowNull: false, defaultValue: 'gallery' }
});

// Seed default service images
const seedServiceImages = async () => {
  const serviceImages = [
    { filename: 'service_supervision.png', type: 'service_supervision' },
    { filename: 'service_healthcare.png', type: 'service_healthcare' },
    { filename: 'service_adl.png', type: 'service_adl' },
    { filename: 'service_meals.png', type: 'service_meals' },
    { filename: 'service_housekeeping.png', type: 'service_housekeeping' },
  ];

  for (const img of serviceImages) {
    const existing = await Image.findOne({ where: { type: img.type } });
    if (!existing) {
      await Image.create(img);
      console.log(`Seeded default image for ${img.type}`);
    }
  }
};

// Login Route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(400).json({ error: 'User not found' });

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(400).json({ error: 'Invalid password' });

  const token = jwt.sign({ email: user.email }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ token });
});

// GET /api/images - List images by type
app.get('/api/images', async (req, res) => {
  try {
    const { type } = req.query;
    const whereClause = type ? { type } : {};

    // If we have an Image model, query it.
    // For backwards compatibility with existing files (if any weren't in DB), we might miss them,
    // but for this task we assume we are moving to DB-based tracking.
    const images = await Image.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']]
    });

    const imageUrls = images.map(img => `/uploads/${img.filename}`);
    res.json(imageUrls);
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /api/upload - Handle multiple image uploads
app.post('/api/upload', authenticateToken, upload.array('images', 10), async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No files uploaded.' });
  }

  const type = req.body.type || 'gallery'; // Default to gallery
  const uploadedFiles = [];

  try {
    // Iterate over all uploaded files and save to DB
    for (const file of req.files) {
      await Image.create({
        filename: file.filename,
        type: type
      });
      uploadedFiles.push(`/uploads/${file.filename}`);
    }

    console.log(`Successfully saved ${uploadedFiles.length} images of type: ${type}`);

    res.json({
      message: 'Files uploaded successfully',
      filePaths: uploadedFiles,
      type: type,
      count: uploadedFiles.length
    });
  } catch (error) {
    console.error('Error saving images to DB:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// DELETE /api/images/:filename - Delete an image
app.delete('/api/images/:filename', authenticateToken, async (req, res) => {
  const filename = req.params.filename;

  try {
    // 1. Find the record
    const image = await Image.findOne({ where: { filename } });
    if (!image) {
      // Return success even if not found (idempotent) to avoid client-side 404 errors
      return res.json({ message: 'Image already deleted/not found' });
    }

    // 2. Delete from Database
    await image.destroy();

    // 3. Delete file from filesystem
    const filePath = path.join(__dirname, 'uploads', filename);
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Error deleting file:', err);
        // Even if file missing, we deleted DB record, so success mostly
      }
    });

    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/gallery endpoint replaced by /api/images

// POST /api/contact - Handle contact form submissions
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, message, tourDate } = req.body;

    // Basic validation
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and Email are required.' });
    }

    // Save to database
    const newInquiry = await Inquiry.create({
      name,
      email,
      phone,
      message,
      tourDate,
    });

    // Send notification (mock)
    sendNotification(newInquiry);

    res.status(201).json({ message: 'Inquiry received successfully.', data: newInquiry });
  } catch (error) {
    console.error('Error creating inquiry:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/inquiries - List all inquiries (Admin view - Unsecured for demo)
app.get('/api/inquiries', async (req, res) => {
  try {
    const inquiries = await Inquiry.findAll({
      order: [['createdAt', 'DESC']],
    });
    res.json(inquiries);
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Sync Database and Start Server
sequelize.sync({ alter: true })
  .then(async () => {
    console.log('Database synced successfully.');
    await seedAdmin(); // Create default admin
    await seedServiceImages(); // Seed default service images
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to sync database:', err);
  });
