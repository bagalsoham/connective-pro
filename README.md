# Connective 🌐

A modern professional networking platform built with Next.js and Redux Toolkit. Connect, share, and grow your professional network with powerful features and a seamless user experience.

## ✨ Features

### 🔐 **Security & Authentication**
- **Token-based Authentication** - Secure JWT implementation
- **Password Encryption** - bcrypt hashing for maximum security
- **Protected Routes** - Role-based access control

### 📄 **Content Management**
- **PDF Export** - Generate and download professional documents
- **File Upload** - Support for images, documents, and media files
- **Rich Content Creation** - Create and share professional posts

### 🚀 **Performance & User Experience**
- **Server-Side Rendering** - Fast loading with Next.js
- **State Management** - Efficient data handling with Redux Toolkit
- **Responsive Design** - Optimized for all devices
- **Real-time Updates** - Dynamic content synchronization

## 🛠️ Tech Stack

### Frontend
- **Next.js** - React framework for production
- **Redux Toolkit** - State management solution
- **React** - UI library for building user interfaces

### Backend & API
- **REST API** - RESTful architecture
- **Axios** - HTTP client for API requests
- **bcrypt** - Password hashing and security

### Development & Testing
- **REST HTTP Client Tool** - API testing and development

### Deployment
- **Render** - Cloud platform for hosting and deployment

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/bagalsoham/connective.git
   cd connective
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   NEXTAUTH_SECRET=your_secret_key
   JWT_SECRET=your_jwt_secret
   DATABASE_URL=your_database_url
   CLOUDINARY_URL=your_cloudinary_url
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
connective/
├── components/          # Reusable UI components
├── pages/              # Next.js pages and API routes
├── store/              # Redux store configuration
├── utils/              # Utility functions and helpers
├── styles/             # CSS and styling files
├── public/             # Static assets
├── lib/                # Library configurations
└── types/              # TypeScript type definitions
```

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

## 🌟 Key Features Implementation

### Authentication Flow
- Secure user registration and login
- JWT token management
- Password encryption using bcrypt
- Session persistence

### File Management
- Drag-and-drop file uploads
- Multiple file format support
- Cloud storage integration
- File compression and optimization

### PDF Generation
- Dynamic PDF creation
- Custom templates
- Professional formatting
- Download and sharing capabilities

### State Management
- Redux Toolkit for efficient state updates
- Async thunks for API calls
- Normalized state structure
- Real-time data synchronization

## 🚀 Deployment

The application is deployed on **Render** with:
- Automatic deployments from GitHub
- Environment variable management
- SSL certificates
- CDN integration

**Live Demo:** [Your deployed app URL]

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔮 Future Enhancements

- [ ] Real-time messaging system
- [ ] Advanced search and filtering
- [ ] Mobile application
- [ ] Integration with third-party services
- [ ] Enhanced analytics dashboard
- [ ] Multi-language support

## 📞 Contact & Support

**Developed by:** Soham Bagal

[![GitHub](https://img.shields.io/badge/GitHub-bagalsoham-181717?style=for-the-badge&logo=github)](https://github.com/bagalsoham)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Soham%20Bagal-0077B5?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/soham-bagal-4343bb284/)
[![Email](https://img.shields.io/badge/Email-bagalsoham1717%40gmail.com-D14836?style=for-the-badge&logo=gmail)](mailto:bagalsoham1717@gmail.com)

---

⭐ **Star this repository if you found it helpful!**

**Project Status:** 🚀 Active Development

Built with ❤️ by [Soham Bagal](https://github.com/bagalsoham)