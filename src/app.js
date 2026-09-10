require('dotenv').config();

const path = require('path');
const express = require('express');
const cors = require('cors');

const app = express();

// =======================
// CORS
// =======================

const DEFAULT_ORIGINS = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://worknest-softcenterci.vercel.app',
];

const allowedOrigins = [
  ...DEFAULT_ORIGINS,
  ...String(process.env.CLIENT_URL || '')
    .split(',')
    .map(origin => origin.trim().replace(/\/$/, ''))
    .filter(Boolean),
];

function isAllowedOrigin(origin) {
  if (!origin) return false;

  const normalized = String(origin)
    .trim()
    .replace(/\/$/, '');

  return allowedOrigins.includes(normalized);
}

const corsOptions = {
  origin(origin, callback) {
    if (!origin || isAllowedOrigin(origin)) {
      return callback(null, true);
    }

    return callback(null, false);
  },

  credentials: true,

  methods: [
    'GET',
    'HEAD',
    'POST',
    'PUT',
    'PATCH',
    'DELETE',
    'OPTIONS',
  ],

  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
  ],

  exposedHeaders: ['Content-Disposition'],

  optionsSuccessStatus: 204,

  maxAge: 86400,
};

// CORS middleware
app.use(cors(corsOptions));

// =======================
// Body Parser
// =======================

app.use(express.json());

// =======================
// Static Files
// =======================

app.use(
  '/uploads',
  express.static(path.join(process.cwd(), 'uploads'))
);

// =======================
// API Routes
// =======================

app.use('/api', require('./routes'));

// =======================
// Home Route
// =======================

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Auth API is running',
  });
});

// =======================
// 404 Handler
// =======================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// =======================
// Error Handler
// =======================

app.use(require('./middleware/error.middleware'));

module.exports = app;