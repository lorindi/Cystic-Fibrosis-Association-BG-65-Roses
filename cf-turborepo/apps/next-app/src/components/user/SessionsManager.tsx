'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { formatDistanceToNow, format } from 'date-fns';
import { bg } from 'date-fns/locale';

interface UserSession {
  id: string;
  ip: string;
  userAgent: string;
  createdAt: string;
  expiresAt: string;
}

interface SessionsManagerProps {
  onSessionsChange?: () => void;
}

const SessionsManager: React.FC<SessionsManagerProps> = ({ onSessionsChange }) => {
  const { getUserSessions, invalidateCurrentSession, invalidateAllSessions } = useAuth();
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const fetchSessions = async () => {
    setLoading(true);
    try {
      const userSessions = await getUserSessions();
      setSessions(userSessions);
      setError('');
    } catch (err) {
      console.error('Failed to fetch sessions:', err);
      setError('Failed to load user sessions');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchSessions();
  }, []);
  
  const handleInvalidateSession = async (sessionId: string) => {
    try {
      const currentSession = sessions.find(s => s.id === sessionId);
      if (!currentSession) return;
      
      // За текущата сесия използваме специална функция
      const isCurrentSession = sessionId === sessions[0]?.id; // Предполагаме, че първата сесия е текущата
      if (isCurrentSession) {
        await invalidateCurrentSession();
      }
      
      // Опресняваме сесиите
      await fetchSessions();
      
      // Известяваме родителския компонент за промяната, ако е необходимо
      if (onSessionsChange) {
        onSessionsChange();
      }
    } catch (err) {
      console.error('Failed to invalidate session:', err);
      setError('Failed to terminate session');
    }
  };
  
  const handleInvalidateAllSessions = async () => {
    if (!confirm('Are you sure you want to terminate all your sessions? You will be logged out from all devices.')) {
      return;
    }
    
    try {
      await invalidateAllSessions();
      
      // Опресняваме сесиите
      await fetchSessions();
      
      // Известяваме родителския компонент за промяната, ако е необходимо
      if (onSessionsChange) {
        onSessionsChange();
      }
    } catch (err) {
      console.error('Failed to invalidate all sessions:', err);
      setError('Failed to terminate all sessions');
    }
  };
  
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
    return <div className="p-4 text-center">Loading sessions...</div>;
  }
  
  if (error) {
    return (
      <div className="p-4 text-red-600 border border-red-300 rounded">
        {error}
        <button 
          onClick={fetchSessions}
          className="ml-2 text-sm underline"
        >
          Try Again
        </button>
      </div>
    );
  }
  
  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-4">Active Sessions</h2>
      
      {sessions.length === 0 ? (
        <p className="text-gray-500">No active sessions found</p>
      ) : (
        <>
          <div className="space-y-3">
            {sessions.map((session) => {
              const { browser, device } = parseUserAgent(session.userAgent);
              const isCurrentSession = session.id === sessions[0]?.id; // Предполагаме, че първата сесия е текущата
              
              return (
                <div 
                  key={session.id}
                  className={`border ${isCurrentSession ? 'border-teal-300 bg-teal-50' : 'border-gray-200'} rounded-lg p-4 flex justify-between items-center`}
                >
                  <div>
                    <div className="font-medium">
                      {browser} on {device} {isCurrentSession && <span className="text-teal-600 text-sm">(Current)</span>}
                    </div>
                    <div className="text-sm text-gray-600">
                      IP: {session.ip}
                    </div>
                    <div className="text-sm text-gray-500">
                      Started {formatDistanceToNow(new Date(session.createdAt), { addSuffix: true, locale: bg })}
                    </div>
                    <div className="text-xs text-gray-400">
                      Expires on {format(new Date(session.expiresAt), 'dd MMM yyyy, HH:mm', { locale: bg })}
                    </div>
                  </div>
                  
                  {isCurrentSession ? (
                    <button
                      onClick={() => handleInvalidateSession(session.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Terminate
                    </button>
                  ) : (
                    <button
                      onClick={() => handleInvalidateSession(session.id)}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded text-sm"
                    >
                      Terminate
                    </button>
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="mt-6">
            <button
              onClick={handleInvalidateAllSessions}
              className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded text-sm font-medium"
            >
              Terminate All Sessions
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SessionsManager; 