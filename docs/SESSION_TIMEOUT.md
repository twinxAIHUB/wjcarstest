# Admin Session Timeout Security

This document describes the session timeout security features implemented for the admin panel.

## Overview

The admin panel now includes automatic session timeout functionality to enhance security by automatically logging out users after periods of inactivity or when the browser tab is closed.

## Features

### 1. Automatic Session Timeout
- **Default timeout**: 30 minutes of inactivity
- **Warning period**: 5 minutes before timeout
- **Configurable**: All timeouts can be adjusted via configuration

### 2. Activity Tracking
The system tracks the following user activities to reset the timeout:
- Mouse movements
- Mouse clicks
- Keyboard input
- Scrolling
- Touch events

### 3. Warning System
- Shows a warning dialog 5 minutes before session expiry
- Users can extend their session by clicking "OK"
- Visual indicators in the sidebar show session status

### 4. Tab/Window Close Detection
- Automatically clears session data when browser tab is closed
- Prevents session persistence across browser sessions

## Configuration

### Environment Variables
You can override default settings using environment variables:

```bash
# Set session timeout to 60 minutes
NEXT_PUBLIC_SESSION_TIMEOUT_MINUTES=60

# Set warning time to 10 minutes before timeout
NEXT_PUBLIC_SESSION_WARNING_MINUTES=10
```

### Configuration File
The main configuration is in `lib/config/session.ts`:

```typescript
export const SESSION_CONFIG = {
  DEFAULT_TIMEOUT_MINUTES: 30,
  WARNING_MINUTES: 5,
  ENABLE_TAB_CLOSE_DETECTION: true,
  ENABLE_ACTIVITY_TRACKING: true,
  // ... more settings
};
```

## Components

### useSessionTimeout Hook
Located in `hooks/use-session-timeout.ts`, this hook provides:
- Session timeout management
- Activity tracking
- Automatic logout functionality
- Tab close detection

### SessionStatus Component
Located in `components/admin/SessionStatus.tsx`, this component displays:
- Remaining session time
- Visual status indicators
- Warning states

## Usage

### Basic Implementation
```typescript
import { useSessionTimeout } from '@/hooks/use-session-timeout';

function AdminComponent() {
  useSessionTimeout({
    timeoutMinutes: 30,
    warningMinutes: 5,
    enableTabCloseDetection: true,
    enableActivityTracking: true
  });

  return <div>Admin content</div>;
}
```

### Custom Configuration
```typescript
useSessionTimeout({
  timeoutMinutes: 60, // 1 hour
  warningMinutes: 10, // 10 minutes warning
  enableTabCloseDetection: false, // Disable tab close detection
  enableActivityTracking: true
});
```

## Security Benefits

1. **Prevents Unauthorized Access**: Automatic logout reduces the risk of unauthorized access to admin functions
2. **Session Management**: Proper session cleanup when users close tabs or become inactive
3. **User Awareness**: Clear visual indicators and warnings keep users informed about session status
4. **Configurable Security**: Flexible configuration allows for different security requirements

## Best Practices

1. **Set Appropriate Timeouts**: Balance security with user experience
2. **Monitor Activity**: Use the session status component to keep users informed
3. **Test Scenarios**: Verify timeout behavior in different browsers and devices
4. **User Training**: Inform admin users about the timeout features

## Troubleshooting

### Session Expires Too Quickly
- Check the `DEFAULT_TIMEOUT_MINUTES` setting
- Verify activity tracking is enabled
- Ensure browser allows JavaScript execution

### Warning Not Showing
- Check the `WARNING_MINUTES` setting
- Verify the SessionStatus component is properly rendered
- Check browser console for errors

### Tab Close Detection Not Working
- Ensure `ENABLE_TAB_CLOSE_DETECTION` is true
- Some browsers may block beforeunload events
- Check browser security settings

## Technical Details

### Cookie Management
- Session tokens are stored in secure HTTP-only cookies
- Cookies are automatically cleared on logout or timeout
- Tab close detection removes cookies immediately

### Event Listeners
The system listens for these events to track activity:
- `mousedown`
- `mousemove`
- `keypress`
- `scroll`
- `touchstart`
- `click`

### Browser Compatibility
- Works in all modern browsers
- Graceful degradation for older browsers
- Mobile-friendly with touch event support 