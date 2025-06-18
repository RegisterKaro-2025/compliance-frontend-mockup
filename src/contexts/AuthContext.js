import React, { createContext, useContext, useState, useEffect } from 'react';

// Create context
const AuthContext = createContext();

// Mock user data for demonstration
const mockUsers = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@registerkaro.com',
    password: 'admin123', // In a real app, passwords would be hashed and not stored in frontend
    role: 'admin',
    permissions: ['view_all', 'edit_all', 'approve_all']
  },
  {
    id: '2',
    name: 'Compliance Officer',
    email: 'officer@registerkaro.com',
    password: 'officer123',
    role: 'compliance_officer',
    permissions: ['view_all', 'edit_compliance', 'verify_documents']
  },
  {
    id: '3',
    name: 'Entity Manager',
    email: 'entity@registerkaro.com',
    password: 'entity123',
    role: 'entity_manager',
    permissions: ['view_entity', 'edit_entity_compliance']
  }
];

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check for saved auth data in localStorage
    const savedAuth = localStorage.getItem('registerkaro_auth');
    if (savedAuth) {
      try {
        const authData = JSON.parse(savedAuth);
        setCurrentUser(authData);
      } catch (e) {
        localStorage.removeItem('registerkaro_auth');
      }
    }
    setLoading(false);
  }, []);

  // Login function
  const login = (email, password) => {
    setError('');
    setLoading(true);
    
    // Simulate API request
    setTimeout(() => {
      const user = mockUsers.find(u => u.email === email && u.password === password);
      
      if (user) {
        // Create a user object without the password
        const authUser = { ...user };
        delete authUser.password;
        
        setCurrentUser(authUser);
        localStorage.setItem('registerkaro_auth', JSON.stringify(authUser));
      } else {
        setError('Invalid email or password');
      }
      setLoading(false);
    }, 1000);
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('registerkaro_auth');
  };

  // Check if user has a specific permission
  const hasPermission = (permission) => {
    if (!currentUser) return false;
    return currentUser.permissions.includes(permission);
  };

  // Check if user has a specific role
  const hasRole = (role) => {
    if (!currentUser) return false;
    return currentUser.role === role;
  };

  const value = {
    currentUser,
    loading,
    error,
    isAuthenticated: !!currentUser,
    login,
    logout,
    hasPermission,
    hasRole
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};