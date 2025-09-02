import React from 'react';
import { init } from '@telegram-apps/sdk-react';
import { initMockTelegramEnv } from './mockEnv';

interface TelegramProviderProps {
  children: React.ReactNode;
}

/**
 * Telegram Mini App provider component that initializes the SDK
 */
export const TelegramProvider: React.FC<TelegramProviderProps> = ({ children }) => {
  React.useEffect(() => {
    // Initialize mock environment for development
    initMockTelegramEnv();
    
    // Initialize the SDK
    try {
      init();
      console.log('Telegram SDK initialized');
    } catch (error) {
      console.warn('Failed to initialize Telegram SDK:', error);
    }
  }, []);

  return <>{children}</>;
};
