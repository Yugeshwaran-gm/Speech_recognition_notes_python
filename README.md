# Speech Recognition Notes App

A modern web application that enables users to create, manage, and organize notes using voice commands and speech-to-text technology. The app combines the power of automatic speech recognition with intuitive note management and real-time translation capabilities.

## 📋 Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Development](#development)

## ✨ Features

### Core Features
- **User Authentication**: Secure user registration and login with JWT-based authentication
- **Voice-to-Text Conversion**: Convert speech directly to text using advanced speech recognition
- **Note Management**: Create, read, update, and delete notes with full CRUD operations
- **Rich Text Editing**: Edit notes with formatting options including text alignment and highlighting
- **Voice Commands**: Control the app using voice commands for hands-free operation
- **Calendar Widget**: View and organize notes by date
- **Responsive Design**: Beautiful, fully responsive UI built with React and Tailwind CSS

### Advanced Features
- **Audio Processing**: Advanced audio file handling and processing
- **Search & Filter**: Find notes quickly with search functionality
- **Pagination**: Efficient note pagination for large note collections
- **Export to PDF**: Convert notes to PDF format for sharing and archiving
- **Session Management**: Secure session handling with automatic user logout

## 📁 Project Structure

```
speech_recognitation_notes/
├── backend/                    # FastAPI backend application
│   ├── app/
│   │   ├── routers/           # API route handlers
│   │   │   ├── auth.py        # Authentication endpoints
│   │   │   ├── notes.py       # Note CRUD endpoints
│   │   │   ├── speech.py      # Speech recognition endpoints
│   │   │   ├── translate.py   # Translation endpoints
│   │   │   └── audio.py       # Audio processing endpoints
│   │   ├── models/            # Database models
│   │   │   ├── user_model.py  # User data model
│   │   │   └── note_model.py  # Note data model
│   │   ├── services/          # Business logic services
│   │   │   └── transcription.py
│   │   ├── utils/             # Utility functions
│   │   │   └── stt_utils.py   # Speech-to-text utilities
│   │   ├── middleware/        # Custom middleware
│   │   │   └── logging.py     # Request/response logging
│   │   ├── main.py            # FastAPI application entry point
│   │   ├── database.py        # Database configuration
│   │   ├── config.py          # Application configuration
│   │   ├── schemas.py         # Pydantic data validation schemas
│   │   └── dependencies.py    # Dependency injection setup
│   ├── requirements.txt       # Python dependencies
│   ├── temp_audio/            # Temporary audio file storage
│   ├── uploads/               # User uploaded files
│   └── db/                    # Database files
├── frontend/                  # React frontend application
│   ├── src/
│   │   ├── components/        # Reusable React components
│   │   │   ├── Navbar.jsx     # Navigation bar
│   │   │   ├── Sidebar.jsx    # Sidebar navigation
│   │   │   ├── NoteCard.jsx   # Individual note component
│   │   │   ├── CalendarWidget.jsx  # Calendar display
│   │   │   ├── CommandPanel.jsx    # Voice command interface
│   │   │   ├── RightPanel.jsx      # Side panel for details
│   │   │   └── VoiceCommandsHelp.jsx
│   │   ├── pages/             # Page components
│   │   │   ├── Home.jsx       # Home/dashboard page
│   │   │   ├── Notes.jsx      # Notes management page
│   │   │   ├── Login.jsx      # Login page
│   │   │   ├── Register.jsx   # Registration page
│   │   │   └── ExportPDF.jsx  # PDF export functionality
│   │   ├── hooks/             # Custom React hooks
│   │   │   └── useSpeechRecognition.jsx
│   │   ├── context/           # React context for state management
│   │   │   └── authContext.jsx
│   │   ├── api/               # API communication
│   │   │   └── axios.jsx      # Axios instance configuration
│   │   ├── assets/            # Static assets
│   │   ├── App.jsx            # Main app component
│   │   ├── main.jsx           # React entry point
│   │   └── styles/            # CSS files
│   ├── package.json           # Frontend dependencies
│   ├── vite.config.js         # Vite configuration
│   ├── tailwind.config.js     # Tailwind CSS configuration
│   └── eslint.config.js       # ESLint configuration
└── README.md                  # This file
```

## 🛠 Tech Stack

### Backend
- **FastAPI**: Modern Python web framework for building APIs
- **SQLAlchemy**: SQL toolkit and Object-Relational Mapping (ORM)
- **Pydantic**: Data validation and settings management
- **JWT (Python-Jose)**: JSON Web Token authentication
- **Passlib & Bcrypt**: Password hashing and security
- **Google Translate**: Multi-language translation API
- **gTTS**: Google Text-to-Speech
- **PyDub**: Audio processing library
- **Database Support**: PostgreSQL

### Frontend
- **React 19**: Modern JavaScript library for UI
- **Vite**: Next-generation frontend build tool
- **React Router**: Client-side routing
- **Axios**: HTTP client for API requests
- **Tailwind CSS**: Utility-first CSS framework
- **TipTap**: Rich text editor
- **Web Speech API**: Browser native speech recognition

### Additional Services
- **ReportLab**: PDF generation

## 📦 Installation

### Prerequisites
- **Python 3.9+** (for backend)
- **Node.js 16+** (for frontend)
- **npm or yarn** (frontend package manager)

### Backend Setup

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Create a Python virtual environment**:
   ```bash
   python -m venv venv
   ```

3. **Activate the virtual environment**:
   - On Windows:
     ```bash
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

4. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

### Frontend Setup

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install Node.js dependencies**:
   ```bash
   npm install
   ```

3. **Optional - Install globally for easier development**:
   ```bash
   npm install -g vite
   ```

## ⚙️ Configuration

### Backend Configuration

1. **Create a `.env` file in the backend directory** with the following variables:
   ```env
   # Database Configuration
   DATABASE_URL=postgresql://user:password@localhost:5432/speech_notes
   # Alternative for MySQL:
   # DATABASE_URL=mysql+mysqlconnector://user:password@localhost:3306/speech_notes
   
   # JWT Configuration
   SECRET_KEY=your-secret-key-here-change-in-production
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   
   # CORS Configuration
   ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
   
   # Google Services (Optional)
   GOOGLE_API_KEY=your-google-api-key
   
   # Audio Processing
   UPLOAD_FOLDER=uploads/
   TEMP_FOLDER=temp_audio/
   MAX_FILE_SIZE=50000000
   ```

2. **Database Setup**:
   - The application will automatically create tables on first startup
   - Ensure your database server is running and accessible

### Frontend Configuration

1. **Update API endpoint in `.env.local` (if needed)**:
   ```env
   VITE_API_URL=http://localhost:8000
   ```

2. **Tailwind CSS** is pre-configured and ready to use

## 🚀 Usage

### Starting the Application

#### Backend (Development)

1. **Navigate to backend directory** and ensure virtual environment is activated:
   ```bash
   cd backend
   ```

2. **Start the FastAPI server**:
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

3. **Access FastAPI Swagger UI** at:
   ```
   http://localhost:8000/docs
   ```

#### Frontend (Development)

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Access the application** at:
   ```
   http://localhost:5173
   ```

### Production Deployment

#### Backend
```bash
# Build and run with a production ASGI server
gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app
```

#### Frontend
```bash
# Build for production
npm run build

# Preview the production build
npm run preview
```

## 📚 API Documentation

Once the backend is running, visit the interactive API documentation:

- **Swagger UI**: `http://localhost:8000/docs`

### Main API Endpoints

#### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `POST /auth/refresh` - Refresh access token

#### Notes
- `GET /notes/` - List all user notes
- `GET /notes/paginated?page=1&limit=10` - Get paginated notes
- `POST /notes/` - Create new note
- `GET /notes/{id}` - Get specific note
- `PUT /notes/{id}` - Update note
- `DELETE /notes/{id}` - Delete note

#### Speech & Audio
- `POST /speech/transcribe` - Transcribe audio file
- `POST /speech/recognize` - Real-time speech recognition
- `GET /speech/commands` - Get available voice commands

## 🔧 Development

### Running Linters

**Frontend**:
```bash
cd frontend
npm run lint
```

### Project Configuration Files

- **Backend**: `app/config.py` - Application settings
- **Frontend**: `vite.config.js` - Build configuration
- **Frontend**: `tailwind.config.js` - Styling configuration
- **Frontend**: `eslint.config.js` - Code style rules

### Database

The application supports multiple database backends:
- PostgreSQL (recommended for production)
- MySQL
- SQLite (default for development)

Change the `DATABASE_URL` in your `.env` file to switch databases.



## 🔐 Security Notes

- Always use strong `SECRET_KEY` in production
- Set appropriate CORS origins for your domain
- Use HTTPS in production
- Implement rate limiting for API endpoints
- Keep dependencies updated regularly
- Store sensitive configuration in environment variables

## 📝 License

This project is provided as-is for educational and personal use.

## 🤝 Contributing

To contribute to this project:

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📧 Support

For issues, questions, or suggestions, please create an issue in the project repository.

---

**Happy note-taking with voice commands!** 🎤📝
