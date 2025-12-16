# 🏠 Fountain of Peace AFH LLC

A professional, full-stack marketing website for an Adult Family Home (AFH) in Spanaway, WA. Built with Next.js and Express.js, featuring a dynamic image management system and secure admin dashboard.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![Express](https://img.shields.io/badge/Express.js-4.x-green)

## ✨ Features

### Public Website
- 🏡 **Home Page** - Hero banner slideshow, services overview, testimonials, and community gallery
- 📋 **Services Page** - Detailed care services with dynamic images
- 👥 **About Us** - Mission, vision, and team information
- 📝 **Admissions** - Step-by-step admissions process
- 📞 **Contact** - Contact form with inquiry submission

### Admin Dashboard (`/admin`)
- 🔐 **Secure Authentication** - JWT-based login system
- 🖼️ **Image Management** - Upload, preview, and delete images for:
  - Hero banner slideshow
  - Community gallery
  - Individual service sections
- 📤 **Multi-Upload** - Select and upload multiple images at once
- 🗑️ **Easy Deletion** - Hover to reveal delete button with confirmation modal

### User Experience
- 🎨 **Modern Design** - Clean, professional aesthetic with smooth animations
- 📱 **Responsive** - Works on all devices
- 🔔 **Toast Notifications** - Non-intrusive success/error messages
- ⚡ **Fast** - Optimized Next.js performance

## 🛠️ Tech Stack

| Frontend | Backend | Database |
|----------|---------|----------|
| Next.js 16 | Express.js | SQLite |
| React 19 | Multer (uploads) | Sequelize ORM |
| Tailwind CSS | JWT Auth | |
| Lucide Icons | bcrypt | |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/tonnyMj/fountainofpeaceLLC.git
   cd fountainofpeaceLLC
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # In client folder, create .env.local
   cp .env.example .env.local
   
   # In server folder, create .env
   cp .env.example .env
   ```

4. **Start the development servers**
   ```bash
   # Terminal 1: Start backend (from server folder)
   node server.js

   # Terminal 2: Start frontend (from client folder)
   npm run dev
   ```

5. **Open in browser**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Default Admin Credentials
```
Email: admin@fountainofpeace.com
Password: admin123
```
> ⚠️ **Important**: Change these credentials in production!

## 🌐 Deployment

### Backend (Railway)
1. Connect your GitHub repo to [Railway](https://railway.app)
2. Set root directory to `server`
3. Add environment variables:
   - `SECRET_KEY`: Your JWT secret
   - `FRONTEND_URLS`: Your Vercel frontend URL

### Frontend (Vercel)
1. Import repo to [Vercel](https://vercel.com)
2. Set root directory to `client`
3. Add environment variable:
   - `NEXT_PUBLIC_API_URL`: Your Railway backend URL

## 📁 Project Structure

```
fountainofpeaceLLC/
├── client/                 # Next.js frontend
│   ├── src/
│   │   ├── app/           # Pages (Home, About, Services, etc.)
│   │   ├── components/    # Reusable components
│   │   └── contexts/      # React contexts (Toast)
│   └── .env.example
│
├── server/                 # Express.js backend
│   ├── server.js          # Main server file
│   ├── uploads/           # Uploaded images
│   └── .env.example
│
└── README.md
```

## 🔧 Environment Variables

### Frontend (`client/.env.local`)
| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:5000` |

### Backend (`server/.env`)
| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `SECRET_KEY` | JWT signing secret | `supersecretkey123` |
| `FRONTEND_URLS` | Allowed CORS origins | `http://localhost:3000` |

## 📄 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/login` | User login | No |
| GET | `/api/images?type=` | Get images by type | No |
| POST | `/api/upload` | Upload images | Yes |
| DELETE | `/api/images/:filename` | Delete image | Yes |
| POST | `/api/contact` | Submit contact form | No |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 📞 Contact

**Fountain of Peace AFH LLC**
- 📍 21818 42nd Ave E, Spanaway, WA 98387
- 📧 fopeaceafh@gmail.com
- 📱 (253) 861-1691

---

Made with ❤️ for Fountain of Peace AFH LLC
