import { Routes, Route } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ProtectedRoute from './ProtectedRoute';
import Navbar from './Navbar';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';

// Import pages
import Home from '../pages/Home';
import Events from '../pages/Events';
import SmallGroups from '../pages/SmallGroups';
import About from '../pages/About';
import Contact from '../pages/Contact';
import Dashboard from '../pages/Dashboard';
import Admin from '../pages/Admin';
import Login from './Login';
import Signup from './Signup';

const AppRoutes = () => {
  const { loading } = useAuth();

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* Public view routes */}
          <Route path="/events" element={<Events />} />
          <Route path="/small-groups" element={<SmallGroups />} />

          {/* Protected routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute requiredRole="admin">
                <Admin />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default AppRoutes;