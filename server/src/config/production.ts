export const productionConfig = {
  // Server Configuration
  port: process.env.PORT || 8080,
  host: process.env.HOST || '0.0.0.0',
  
  // CORS Configuration
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  },
  
  // WebSocket Configuration
  websocket: {
    path: '/ws',
    maxPayload: 1024 * 1024, // 1MB
    perMessageDeflate: false
  },
  
  // Deepgram Configuration
  deepgram: {
    apiKey: process.env.DEEPGRAM_API_KEY,
    model: process.env.DEEPGRAM_MODEL || 'nova-2',
    language: process.env.DEEPGRAM_LANGUAGE || 'en-US',
    encoding: process.env.DEEPGRAM_ENCODING || 'linear16',
    sampleRate: process.env.DEEPGRAM_SAMPLE_RATE || 16000,
    channels: process.env.DEEPGRAM_CHANNELS || 1
  },
  
  // Logging Configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.NODE_ENV === 'production' ? 'json' : 'dev'
  },
  
  // Security Configuration
  security: {
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: process.env.RATE_LIMIT_MAX || 100 // limit each IP to 100 requests per windowMs
    },
    helmet: true,
    compression: true
  }
};
