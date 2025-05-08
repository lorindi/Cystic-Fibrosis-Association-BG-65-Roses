'use client';

import { useAuth } from '@/lib/context/AuthContext';

interface LogoutButtonProps {
  className?: string;
}

const LogoutButton = ({ className = "text-teal-600 hover:text-teal-800" }: LogoutButtonProps) => {
  const { logout } = useAuth();

  const handleLogout = (event: React.MouseEvent<HTMLButtonElement>) => {
    console.log('Logout clicked');
    
    // First we stop standard behavior
    // and block the button to prevent multiple clicks
    const logoutButton = event.currentTarget;
    logoutButton.disabled = true;
    
    // Show indicator that logout is in progress
    logoutButton.innerText = 'Logging out...';
    
    // Call the logout function
    try {
      logout();
      console.log('Logout initiated');
    } catch (error: unknown) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <button 
      onClick={handleLogout}
      className={className}
    >
      Logout
    </button>
  );
};

export default LogoutButton; 