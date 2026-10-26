import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { SidebarProvider } from './context/SidebarContext';
import { getHomePath } from './utils/roleRoutes';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import './motion.css';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Doctors from './pages/Doctors';
import Appointments from './pages/Appointments';
import MedicalRecords from './pages/MedicalRecords';
import Billing from './pages/Billing';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Unauthorized from './pages/Unauthorized';
import ComingSoon from './pages/ComingSoon';
import Users from './pages/Users';
import Profile from './pages/Profile';

// Visitors who are already logged in skip the login/register pages
const PublicOnly = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to={getHomePath(user.role)} replace /> : children;
};

// "/" and any unknown URL: send people where they belong
const HomeRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return <Navigate to={user ? getHomePath(user.role) : '/login'} replace />;
};

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <SidebarProvider>
          <AuthProvider>
            <Routes>
              {/* Public */}
              <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
              <Route path="/register" element={<PublicOnly><Register /></PublicOnly>} />
              <Route path="/unauthorized" element={<Unauthorized />} />

              {/* PATIENT only */}
              <Route element={<ProtectedRoute role="patient" />}>
                <Route path="/patient/dashboard" element={<Dashboard />} />
                <Route path="/patient/appointments" element={<Appointments />} />
                <Route path="/patient/records" element={<MedicalRecords />} />
                <Route path="/patient/profile" element={<Profile />} />
                <Route path="/patient/bills" element={<Billing />} />
              </Route>

              {/* DOCTOR only */}
              <Route element={<ProtectedRoute role="doctor" />}>
                <Route path="/doctor/dashboard" element={<Dashboard />} />
                <Route path="/doctor/patients" element={<Patients />} />
                <Route path="/doctor/appointments" element={<Appointments />} />
                <Route path="/doctor/records" element={<MedicalRecords />} />
                <Route path="/doctor/schedule" element={<ComingSoon title="My Schedule" />} />
                <Route path="/doctor/profile" element={<Profile />} />
              </Route>

              {/* ADMIN only */}
              <Route element={<ProtectedRoute role="admin" />}>
                <Route path="/admin/dashboard" element={<Dashboard />} />
                <Route path="/admin/users" element={<Users />} />
                <Route path="/admin/doctors" element={<Doctors />} />
                <Route path="/admin/patients" element={<Patients />} />
                <Route path="/admin/reports" element={<Reports />} />
                <Route path="/admin/settings" element={<Settings />} />
                <Route path="/admin/profile" element={<Profile />} />
              </Route>

              {/* Everything else */}
              <Route path="/" element={<HomeRedirect />} />
              <Route path="*" element={<HomeRedirect />} />
            </Routes>
          </AuthProvider>
        </SidebarProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;