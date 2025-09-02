import { mockTelegramEnv, retrieveLaunchParams } from '@telegram-apps/sdk-react';

/**
 * Mocks Telegram environment for development purposes.
 * This should only be used in development mode.
 */
export function initMockTelegramEnv(): void {
  if (import.meta.env.DEV) {
    try {
      mockTelegramEnv();
      console.log('⚠️ Mock Telegram environment initialized for development');
    } catch (error) {
      console.warn('Failed to initialize mock Telegram environment:', error);
    }
  }
}

/**
 * Retrieves launch parameters in a safe way
 */
export function getLaunchParams() {
  try {
    return retrieveLaunchParams();
  } catch (error) {
    console.warn('Failed to retrieve launch params:', error);
    return null;
  }
}
