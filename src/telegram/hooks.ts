import { 
  useRawInitData,
  useSignal,
  themeParams,
  viewport,
  mainButton,
  backButton,
  hapticFeedback,
  cloudStorage
} from '@telegram-apps/sdk-react';

/**
 * Custom hooks for Telegram Mini App functionality
 */

export const useTelegramUser = () => {
  try {
    const initData = useRawInitData();
    return initData || null;
  } catch (error) {
    console.warn('Failed to get Telegram user data:', error);
    return null;
  }
};

export const useTelegramTheme = () => {
  return useSignal(themeParams.state);
};

export const useTelegramViewport = () => {
  return useSignal(viewport.state);
};

export const useTelegramMainButton = () => {
  return mainButton;
};

export const useTelegramBackButton = () => {
  return backButton;
};

export const useTelegramHaptics = () => {
  return hapticFeedback;
};

export const useTelegramStorage = () => {
  return cloudStorage;
};
