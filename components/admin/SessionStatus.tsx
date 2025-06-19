'use client';

import { useState, useEffect } from 'react';
import { useSessionTimeout } from '@/hooks/use-session-timeout';
import { Clock, AlertTriangle, Shield } from 'lucide-react';

interface SessionStatusProps {
  showWarning?: boolean;
  className?: string;
  showDetails?: boolean;
}

export default function SessionStatus({ 
  showWarning = true, 
  className = '',
  showDetails = false 
}: SessionStatusProps) {
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [isWarning, setIsWarning] = useState(false);
  const [isCritical, setIsCritical] = useState(false);
  const { getTimeUntilExpiry, getTimeUntilWarning } = useSessionTimeout();

  useEffect(() => {
    const updateTime = () => {
      const timeUntilExpiry = getTimeUntilExpiry();
      const timeUntilWarning = getTimeUntilWarning();
      
      // Check if we're in warning period
      if (timeUntilWarning <= 0 && timeUntilExpiry > 0) {
        setIsWarning(true);
        setIsCritical(timeUntilExpiry < 60000); // Less than 1 minute
      } else {
        setIsWarning(false);
        setIsCritical(false);
      }

      // Format remaining time
      const minutes = Math.floor(timeUntilExpiry / 60000);
      const seconds = Math.floor((timeUntilExpiry % 60000) / 1000);
      
      if (minutes > 0) {
        setTimeRemaining(`${minutes}m ${seconds}s`);
      } else {
        setTimeRemaining(`${seconds}s`);
      }
    };

    // Update immediately
    updateTime();

    // Update every second
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [getTimeUntilExpiry, getTimeUntilWarning]);

  if (!showWarning && !isWarning) {
    return null;
  }

  const getStatusColor = () => {
    if (isCritical) return 'text-red-600';
    if (isWarning) return 'text-orange-600';
    return 'text-gray-600';
  };

  const getStatusIcon = () => {
    if (isCritical) return <AlertTriangle className="h-4 w-4 text-red-500" />;
    if (isWarning) return <AlertTriangle className="h-4 w-4 text-orange-500" />;
    return <Shield className="h-4 w-4 text-green-500" />;
  };

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="flex items-center space-x-2 text-sm">
        <Clock className="h-4 w-4" />
        <span className={`font-medium ${getStatusColor()}`}>
          Session: {timeRemaining}
        </span>
        {getStatusIcon()}
      </div>
      
      {showDetails && (
        <div className="text-xs text-gray-500">
          {isCritical && <span className="text-red-500">Critical</span>}
          {isWarning && !isCritical && <span className="text-orange-500">Warning</span>}
          {!isWarning && !isCritical && <span className="text-green-500">Active</span>}
        </div>
      )}
    </div>
  );
} 