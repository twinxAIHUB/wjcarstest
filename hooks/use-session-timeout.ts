import { useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getSessionConfig } from '@/lib/config/session';
import Cookies from 'js-cookie';

interface UseSessionTimeoutOptions {
  timeoutMinutes?: number;
  warningMinutes?: number;
  enableTabCloseDetection?: boolean;
  enableActivityTracking?: boolean;
}

export function useSessionTimeout(options: UseSessionTimeoutOptions = {}) {
  const config = getSessionConfig();
  
  const {
    timeoutMinutes = config.DEFAULT_TIMEOUT_MINUTES,
    warningMinutes = config.WARNING_MINUTES,
    enableTabCloseDetection = config.ENABLE_TAB_CLOSE_DETECTION,
    enableActivityTracking = config.ENABLE_ACTIVITY_TRACKING
  } = options;

  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  const timeoutMs = timeoutMinutes * 60 * 1000;
  const warningMs = warningMinutes * 60 * 1000;

  // Reset the session timeout
  const resetTimeout = useCallback(() => {
    // Clear existing timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (warningRef.current) {
      clearTimeout(warningRef.current);
    }

    // Update last activity
    lastActivityRef.current = Date.now();

    // Set warning timeout
    warningRef.current = setTimeout(() => {
      showWarningDialog();
    }, timeoutMs - warningMs);

    // Set logout timeout
    timeoutRef.current = setTimeout(() => {
      handleLogout();
    }, timeoutMs);
  }, [timeoutMs, warningMs]);

  // Show warning dialog
  const showWarningDialog = useCallback(() => {
    const warningMessage = `Your session will expire in ${warningMinutes} minutes due to inactivity. Click OK to extend your session.`;
    
    if (confirm(warningMessage)) {
      resetTimeout();
    } else {
      handleLogout();
    }
  }, [warningMinutes, resetTimeout]);

  // Handle logout
  const handleLogout = useCallback(async () => {
    try {
      // Clear all timeouts
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (warningRef.current) {
        clearTimeout(warningRef.current);
      }

      // Sign out from Firebase
      await signOut(auth);
      
      // Remove token cookie
      Cookies.remove('token');
      
      // Redirect to login page
      router.push('/admin/login');
      
      console.log('Session expired - user logged out due to inactivity');
    } catch (error) {
      console.error('Error during logout:', error);
      // Force redirect even if logout fails
      router.push('/admin/login');
    }
  }, [router]);

  // Handle tab/window close
  const handleBeforeUnload = useCallback((event: BeforeUnloadEvent) => {
    if (enableTabCloseDetection) {
      // Clear session data
      Cookies.remove('token');
      event.preventDefault();
      event.returnValue = '';
    }
  }, [enableTabCloseDetection]);

  // Track user activity
  const handleActivity = useCallback(() => {
    if (enableActivityTracking) {
      resetTimeout();
    }
  }, [enableActivityTracking, resetTimeout]);

  // Initialize session timeout
  useEffect(() => {
    // Start the timeout
    resetTimeout();

    // Add activity listeners
    if (enableActivityTracking) {
      config.ACTIVITY_EVENTS.forEach(event => {
        document.addEventListener(event, handleActivity, true);
      });

      return () => {
        config.ACTIVITY_EVENTS.forEach(event => {
          document.removeEventListener(event, handleActivity, true);
        });
      };
    }
  }, [resetTimeout, enableActivityTracking, handleActivity, config.ACTIVITY_EVENTS]);

  // Add tab close detection
  useEffect(() => {
    if (enableTabCloseDetection) {
      window.addEventListener('beforeunload', handleBeforeUnload);
      
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, [enableTabCloseDetection, handleBeforeUnload]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (warningRef.current) {
        clearTimeout(warningRef.current);
      }
    };
  }, []);

  return {
    resetTimeout,
    handleLogout,
    getTimeUntilExpiry: () => {
      const timeSinceActivity = Date.now() - lastActivityRef.current;
      return Math.max(0, timeoutMs - timeSinceActivity);
    },
    getTimeUntilWarning: () => {
      const timeSinceActivity = Date.now() - lastActivityRef.current;
      return Math.max(0, timeoutMs - warningMs - timeSinceActivity);
    }
  };
} 