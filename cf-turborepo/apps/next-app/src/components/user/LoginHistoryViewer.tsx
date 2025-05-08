'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { formatDistanceToNow, format } from 'date-fns';
import { bg } from 'date-fns/locale';

interface LoginHistory {
  id: string;
  ip: string;
  userAgent: string;
  status: string;
  loggedInAt: string;
}

interface LoginHistoryViewerProps {
  limit?: number;
}

const LoginHistoryViewer: React.FC<LoginHistoryViewerProps> = ({ limit = 10 }) => {
  const { getLoginHistory } = useAuth();
  const [history, setHistory] = useState<LoginHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const fetchLoginHistory = async () => {
    setLoading(true);
    try {
      const loginHistory = await getLoginHistory(limit);
      setHistory(loginHistory);
      setError('');
    } catch (err) {
      console.error('Failed to fetch login history:', err);
      setError('Failed to load login history');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchLoginHistory();
  }, [limit]);
  
  // Извлича информация за браузъра и устройството от user agent
  const parseUserAgent = (userAgent: string) => {
    // Опростена версия - може да се използва по-сложна библиотека
    const isMobile = /Mobile|Android|iPhone|iPad/i.test(userAgent);
    
    let browser = 'Unknown Browser';
    let device = isMobile ? 'Mobile Device' : 'Desktop';
    
    if (userAgent.includes('Chrome')) browser = 'Chrome';
    else if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Safari')) browser = 'Safari';
    else if (userAgent.includes('Edge')) browser = 'Edge';
    
    if (userAgent.includes('Windows')) device = 'Windows';
    else if (userAgent.includes('Mac')) device = 'Mac';
    else if (userAgent.includes('iPhone')) device = 'iPhone';
    else if (userAgent.includes('iPad')) device = 'iPad';
    else if (userAgent.includes('Android')) device = 'Android';
    
    return { browser, device };
  };
  
  if (loading) {
    return <div className="p-4 text-center">Loading login history...</div>;
  }
  
  if (error) {
    return (
      <div className="p-4 text-red-600 border border-red-300 rounded">
        {error}
        <button 
          onClick={fetchLoginHistory}
          className="ml-2 text-sm underline"
        >
          Try Again
        </button>
      </div>
    );
  }
  
  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-4">Login History</h2>
      
      {history.length === 0 ? (
        <p className="text-gray-500">No login history found</p>
      ) : (
        <div className="space-y-3">
          {history.map((entry) => {
            const { browser, device } = parseUserAgent(entry.userAgent);
            const isSuccess = entry.status === 'success';
            
            return (
              <div 
                key={entry.id}
                className={`border ${isSuccess ? 'border-green-200' : 'border-red-200'} rounded-lg p-4`}
              >
                <div className="flex justify-between">
                  <div className="font-medium">
                    {browser} on {device}
                  </div>
                  <div className={`text-sm ${isSuccess ? 'text-green-600' : 'text-red-600'} font-medium`}>
                    {isSuccess ? 'Success' : 'Failed'}
                  </div>
                </div>
                
                <div className="text-sm text-gray-600">
                  IP: {entry.ip}
                </div>
                
                <div className="text-sm text-gray-500">
                  {formatDistanceToNow(new Date(entry.loggedInAt), { addSuffix: true, locale: bg })}
                </div>
                
                <div className="text-xs text-gray-400">
                  {format(new Date(entry.loggedInAt), 'dd MMM yyyy, HH:mm:ss', { locale: bg })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LoginHistoryViewer; 