interface AppConfig {
  websocketUrl: string;
  apiUrl: string;
  environment: 'development' | 'production' | 'staging';
  reconnectAttempts: number;
  reconnectDelay: number;
}

const getEnvironment = (): 'development' | 'production' | 'staging' => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '') {
      return 'development';
    }
    if (hostname === 'staging.example.com') {
      return 'staging';
    }
    if (hostname === 'production.example.com') {
      return 'production';
    }
  }
  return 'development';
};

const getConfig = (): AppConfig => {
  const env = getEnvironment();
  
  switch (env) {
    case 'development':
      const devConfig: AppConfig = {
        websocketUrl: 'ws://localhost:8080',
        apiUrl: 'http://localhost:8080',
        environment: 'development',
        reconnectAttempts: 5,
        reconnectDelay: 2000
      };
      return devConfig;
    case 'staging':
      const stagingConfig: AppConfig = {
        websocketUrl: 'wss://staging.example.com',
        apiUrl: 'https://staging.example.com',
        environment: 'staging',
        reconnectAttempts: 3,
        reconnectDelay: 1000
      };
      return stagingConfig;
    case 'production':
      const prodConfig: AppConfig = {
        websocketUrl: 'wss://production.example.com',
        apiUrl: 'https://production.example.com',
        environment: 'production',
        reconnectAttempts: 3,
        reconnectDelay: 1000
      };
      return prodConfig;
    default:
      const defaultConfig: AppConfig = {
        websocketUrl: 'ws://localhost:8080',
        apiUrl: 'http://localhost:8080',
        environment: 'development',
        reconnectAttempts: 5,
        reconnectDelay: 2000
      };
      return defaultConfig;
  }
};

export const config = getConfig();
export type { AppConfig };
