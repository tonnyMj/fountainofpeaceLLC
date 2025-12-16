const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
const fs = require('fs');

// Load environment variables
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration
const allowedOrigins = process.env.FRONTEND_URLS
  ? process.env.FRONTEND_URLS.split(',')
  : ['http://localhost:3000'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(bodyParser.json());

// Database Setup (Postgres for Prod, SQLite for Dev)
let sequelize;
if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false
  });
} else {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, 'database.sqlite'),
    logging: false,
  });
}

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
const cloudinary = require('cloudinary').v2;

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer Config - Use memory storage for Cloudinary
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Helper to upload buffer to Cloudinary
const uploadToCloudinary = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: `fountainofpeace/${folder}` },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
};

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const SECRET_KEY = process.env.SECRET_KEY || "supersecretkey123";

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

// Image Model - Now stores full Cloudinary URL
// Types: 'hero', 'gallery', 'service_supervision', 'service_healthcare', 'service_adl', 'service_meals', 'service_housekeeping', 'service_social'
const Image = sequelize.define('Image', {
  filename: { type: DataTypes.STRING, allowNull: false }, // Now stores full Cloudinary URL
  publicId: { type: DataTypes.STRING, allowNull: true }, // Cloudinary public_id for deletion
  type: { type: DataTypes.STRING, allowNull: false, defaultValue: 'gallery' }
});

// Seed default service images
const seedServiceImages = async () => {
  const serviceImages = [
    { filename: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=600', type: 'service_supervision' },
    { filename: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=600', type: 'service_healthcare' },
    { filename: 'https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?auto=format&fit=crop&q=80&w=600', type: 'service_adl' },
    { filename: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=600', type: 'service_meals' },
    { filename: 'https://images.unsplash.com/photo-1581578731117-104f2a41272c?auto=format&fit=crop&q=80&w=600', type: 'service_housekeeping' },
    { filename: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=600', type: 'service_social' },
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

    const images = await Image.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']]
    });

    // Return full URLs directly (now stored as full Cloudinary URLs)
    const imageUrls = images.map(img => img.filename);
    res.json(imageUrls);
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /api/upload - Handle multiple image uploads to Cloudinary
app.post('/api/upload', authenticateToken, upload.array('images', 10), async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No files uploaded.' });
  }

  const type = req.body.type || 'gallery';
  const uploadedFiles = [];

  try {
    for (const file of req.files) {
      // Upload to Cloudinary
      const result = await uploadToCloudinary(file.buffer, type);

      await Image.create({
        filename: result.secure_url, // Store full Cloudinary URL
        publicId: result.public_id,  // Store for deletion
        type: type
      });
      uploadedFiles.push(result.secure_url);
    }

    console.log(`Successfully uploaded ${uploadedFiles.length} images of type: ${type} to Cloudinary`);

    res.json({
      message: 'Files uploaded successfully',
      filePaths: uploadedFiles,
      type: type,
      count: uploadedFiles.length
    });
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// DELETE /api/images/:filename - Delete an image from Cloudinary
app.delete('/api/images/:filename', authenticateToken, async (req, res) => {
  const filename = req.params.filename;

  try {
    // Find by filename (which is now the full URL) or by publicId
    const image = await Image.findOne({
      where: {
        [Sequelize.Op.or]: [
          { filename: { [Sequelize.Op.like]: `%${filename}%` } },
          { publicId: { [Sequelize.Op.like]: `%${filename}%` } }
        ]
      }
    });

    if (!image) {
      return res.json({ message: 'Image already deleted/not found' });
    }

    // Delete from Cloudinary if publicId exists
    if (image.publicId) {
      try {
        await cloudinary.uploader.destroy(image.publicId);
      } catch (cloudErr) {
        console.error('Cloudinary deletion error:', cloudErr);
      }
    }

    // Delete from Database
    await image.destroy();

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
