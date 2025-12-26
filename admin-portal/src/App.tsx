import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './layouts/DashboardLayout';
import UsersPage from './pages/UsersPage';
import HousekeepersPage from './pages/HousekeepersPage';
import BookingsPage from './pages/BookingsPage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4F46E5',
    },
    secondary: {
      main: '#10B981',
    },
  },
});

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  userType: 'CLIENT' | 'HOUSEKEEPER' | 'ADMIN';
  status: string;
}

const useAuth = () => {
  const accessToken = localStorage.getItem('access_token');
  const userString = localStorage.getItem('user');
  let user: User | null = null;

  if (userString) {
    try {
      user = JSON.parse(userString);
    } catch (e) {
      console.error("Failed to parse user from localStorage", e);
    }
  }

  const isAuthenticated = !!accessToken && user?.userType === 'ADMIN';
  return { isAuthenticated, user };
};

const PrivateRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  const { isAuthenticated, user } = useAuth();

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    window.location.href = '/login'; // Redirect to login page
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <DashboardLayout onLogout={handleLogout} user={user} />
              </PrivateRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard/users" />} />
            <Route path="dashboard/users" element={<UsersPage />} />
            <Route path="dashboard/housekeepers" element={<HousekeepersPage />} />
            <Route path="dashboard/bookings" element={<BookingsPage />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;