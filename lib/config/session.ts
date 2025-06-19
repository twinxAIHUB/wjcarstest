// Session timeout configuration
export const SESSION_CONFIG = {
  // Default timeout in minutes
  DEFAULT_TIMEOUT_MINUTES: 30,
  
  // Warning time before timeout (in minutes)
  WARNING_MINUTES: 5,
  
  // Enable tab/window close detection
  ENABLE_TAB_CLOSE_DETECTION: true,
  
  // Enable activity tracking
  ENABLE_ACTIVITY_TRACKING: true,
  
  // Activity events to track
  ACTIVITY_EVENTS: [
    'mousedown',
    'mousemove', 
    'keypress',
    'scroll',
    'touchstart',
    'click'
  ] as const,
  
  // Cookie settings
  COOKIE_SETTINGS: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/'
  }
};

// Environment-specific overrides
export const getSessionConfig = () => {
  const config = { ...SESSION_CONFIG };
  
  // Allow environment variable overrides
  if (process.env.NEXT_PUBLIC_SESSION_TIMEOUT_MINUTES) {
    config.DEFAULT_TIMEOUT_MINUTES = parseInt(process.env.NEXT_PUBLIC_SESSION_TIMEOUT_MINUTES);
  }
  
  if (process.env.NEXT_PUBLIC_SESSION_WARNING_MINUTES) {
    config.WARNING_MINUTES = parseInt(process.env.NEXT_PUBLIC_SESSION_WARNING_MINUTES);
  }
  
  return config;
}; 