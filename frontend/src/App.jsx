import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider as AsgardeoAuthProvider } from "@asgardeo/auth-react";
import { config } from "./config/asgardeo-config";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Events from './pages/Events';
import SmallGroups from './pages/SmallGroups';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import EventManagement from './pages/EventManagement';

function App() {
  return (
    <AsgardeoAuthProvider config={config}>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/events" element={<Events />} />
              <Route path="/small-groups" element={<SmallGroups />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/events/manage" element={
                <ProtectedRoute>
                  <EventManagement />
                </ProtectedRoute>
              } />
            </Routes>
            <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </AsgardeoAuthProvider>
  );
}

export default App;