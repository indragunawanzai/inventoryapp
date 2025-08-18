import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import StockPage from './pages/StockPage';
import IncomingPage from './pages/IncomingPage';
import OutgoingPage from './pages/OutgoingPage';
import { useContext } from 'react';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './components/layout/DashboardLayout';
import DashboardPage from './pages/DashboardPage';
import { AuthContext, AuthProvider } from './context/AuthContext';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 600,
    },
  },
});

function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  )
}

function MainApp() {
  const { authToken } = useContext(AuthContext);
  const isAuthenticated = !!authToken;

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/" replace />
              ) : (
                <LoginPage />
              )
            }
          />

          <Route
            path="/"
            element={
              isAuthenticated ? (
                <DashboardLayout />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="stock" element={<StockPage />} />
            <Route path="incoming" element={<IncomingPage />} />
            <Route path="outgoing" element={<OutgoingPage />} />
          </Route>

          <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}
export default App;