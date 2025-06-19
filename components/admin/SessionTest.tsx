'use client';

import { useState } from 'react';
import { useSessionTimeout } from '@/hooks/use-session-timeout';

export default function SessionTest() {
  const [showTestPanel, setShowTestPanel] = useState(false);
  const { resetTimeout, getTimeUntilExpiry, getTimeUntilWarning } = useSessionTimeout();

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Test Panel Toggle */}
      <button
        onClick={() => setShowTestPanel(!showTestPanel)}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
      >
        {showTestPanel ? 'Hide' : 'Show'} Session Test
      </button>

      {/* Test Panel */}
      {showTestPanel && (
        <div className="absolute bottom-12 right-0 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-80">
          <h3 className="font-semibold text-gray-900 mb-3">Session Timeout Test</h3>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Time until expiry:</span>
              <span className="font-mono">{formatTime(getTimeUntilExpiry())}</span>
            </div>
            
            <div className="flex justify-between">
              <span>Time until warning:</span>
              <span className="font-mono">{formatTime(getTimeUntilWarning())}</span>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <button
              onClick={resetTimeout}
              className="w-full bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
            >
              Reset Session Timer
            </button>
            
            <div className="text-xs text-gray-500">
              <p>• Move mouse or click to reset timer</p>
              <p>• Session expires after 30 minutes of inactivity</p>
              <p>• Warning shows 5 minutes before expiry</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 