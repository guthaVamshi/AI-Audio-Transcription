interface AppConfig {
  websocketUrl: string;
  apiUrl: string;
  environment: 'development' | 'production' | 'staging';
  reconnectAttempts: number;
  reconnectDelay: number;
}

// Environment detection
const getEnvironment = (): 'development' | 'production' | 'staging' => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'development';
    }
    if (hostname.includes('staging') || hostname.includes('dev')) {
      return 'staging';
    }
    return 'production';
  }
  return 'development';
};

// Configuration based on environment
const getConfig = (): AppConfig => {
  const env = getEnvironment();
  
  switch (env) {
    case 'development':
      return {
        websocketUrl: 'ws://localhost:8080',
        apiUrl: 'http://localhost:8080',
        environment: 'development',
        reconnectAttempts: 5,
        reconnectDelay: 2000
      };
    
    case 'staging':
      return {
        websocketUrl: import.meta.env.VITE_WEBSOCKET_URL || 'wss://staging-api.yourdomain.com',
        apiUrl: import.meta.env.VITE_API_URL || 'https://staging-api.yourdomain.com',
        environment: 'staging',
        reconnectAttempts: 10,
        reconnectDelay: 3000
      };
    
    case 'production':
      return {
        websocketUrl: import.meta.env.VITE_WEBSOCKET_URL || 'wss://api.yourdomain.com',
        apiUrl: import.meta.env.VITE_API_URL || 'https://api.yourdomain.com',
        environment: 'production',
        reconnectAttempts: 15,
        reconnectDelay: 5000
      };
    
    default:
      return {
        websocketUrl: 'ws://localhost:8080',
        apiUrl: 'http://localhost:8080',
        environment: 'development',
        reconnectAttempts: 5,
        reconnectDelay: 2000
      };
  }
};

export const config = getConfig();
export type { AppConfig };
