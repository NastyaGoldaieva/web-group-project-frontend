import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import LoginPage from './pages/LoginPage';
import MentorListPage from './pages/MentorListPage';
import MentorDetailPage from './pages/MentorDetailPage';
import DashboardPage from './pages/DashboardPage';
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import ActivationPage from './pages/ActivationPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import MyStudentsPage from './pages/MyStudentsPage';
import ProposalsPage from './pages/ProposalsPage';
import MentorProposalPage from './pages/MentorProposalPage';
import { logout } from './api/auth';
import RequireAuth from './components/RequireAuth';
import api from './api/axios';
import { connect, disconnect } from './api/ws';

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const wsUserIdRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const res = await api.get('auth/me/');
          setUser(res.data);
          localStorage.setItem('role', res.data.role || '');
          localStorage.setItem('user_id', String(res.data.id));
        } catch (e) {
          setUser(null);
          localStorage.removeItem('user_id');
        }
      } else {
        setUser(null);
        localStorage.removeItem('user_id');
      }
    };
    init();
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    if (wsUserIdRef.current && wsUserIdRef.current === userId) return;
    disconnect();
    wsUserIdRef.current = null;
    if (userId) {
      connect(userId, (msg) => {
        window.dispatchEvent(new CustomEvent('dataUpdated', { detail: msg }));
      });
      wsUserIdRef.current = userId;
    }
    return () => {
      disconnect();
      wsUserIdRef.current = null;
    };
  }, [user]);

  useEffect(() => {
    const onAuthChanged = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const res = await api.get('auth/me/');
          setUser(res.data);
          localStorage.setItem('user_id', String(res.data.id));
        } catch {
          setUser(null);
          localStorage.removeItem('user_id');
        }
      } else {
        setUser(null);
        localStorage.removeItem('user_id');
      }
    };
    window.addEventListener('authChanged', onAuthChanged);
    return () => window.removeEventListener('authChanged', onAuthChanged);
  }, []);

  const handleLogout = async () => {
    await logout();
    setUser(null);
    localStorage.removeItem('role');
    localStorage.removeItem('user_id');
    navigate('/login');
  };

  return (
    <div>
      <nav style={styles.nav}>
        <div style={styles.logo}>MentorMatch</div>
        <div style={styles.menu}>
          <Link to="/" style={styles.link}>Головна</Link>
          {user?.role === 'mentor' ? (
             <Link to="/students" style={styles.link}>Студенти</Link>
          ) : (
             <Link to="/mentors" style={styles.link}>Ментори</Link>
          )}
          {user ? (
            <>
              <Link to="/dashboard" style={styles.accentLink}>Кабінет</Link>
              <button onClick={handleLogout} style={styles.logoutButton}>Вихід</button>
            </>
          ) : (
            <Link to="/login" style={styles.buttonLink}>Вхід</Link>
          )}
        </div>
      </nav>

      <div style={{ minHeight: '90vh', backgroundColor: '#fffafc' }}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/activate/:uid/:token" element={<ActivationPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:uid/:token" element={<ResetPasswordPage />} />
          <Route path="/mentors" element={<MentorListPage />} />
          <Route path="/mentors/:id" element={<MentorDetailPage />} />
          <Route path="/mentor/proposals/:id" element={<RequireAuth><MentorProposalPage /></RequireAuth>} />
          <Route path="/dashboard" element={<RequireAuth><DashboardPage /></RequireAuth>} />
          <Route path="/students" element={<RequireAuth><MyStudentsPage /></RequireAuth>} />
          <Route path="/proposals" element={<RequireAuth><ProposalsPage /></RequireAuth>} />
        </Routes>
      </div>
    </div>
  );
}

const styles = {
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 40px', background: 'rgba(255,255,255,0.9)', borderBottom: '1px solid #ffe4e9', position: 'sticky', top: 0, backdropFilter: 'blur(10px)', zIndex: 100 },
  logo: { fontWeight: '800', fontSize: '24px', color: '#ff6b81' },
  menu: { display: 'flex', alignItems: 'center', gap: '20px' },
  link: { color: '#555', textDecoration: 'none', fontWeight: '500' },
  accentLink: { color: '#ff6b81', textDecoration: 'none', fontWeight: 'bold' },
  buttonLink: { padding: '8px 20px', background: '#ff6b81', color: 'white', borderRadius: '20px', textDecoration: 'none', fontWeight: 'bold' },
  logoutButton: { padding: '6px 12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }
};

export default App;