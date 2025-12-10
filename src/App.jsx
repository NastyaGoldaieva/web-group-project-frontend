import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import MentorListPage from './pages/MentorListPage';
import MentorDetailPage from './pages/MentorDetailPage';
import DashboardPage from './pages/DashboardPage';
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import ProposalsPage from './pages/ProposalsPage';
import ProposalDetailPage from './pages/ProposalDetailPage';
import { logout } from './api/auth';
import RequireAuth from './components/RequireAuth';
import api from './api/axios';

function App() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  });
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setUser(null);
        return;
      }
      try {
        const stored = localStorage.getItem('user');
        if (stored) {
          setUser(JSON.parse(stored));
          return;
        }
        const res = await api.get('auth/me/');
        localStorage.setItem('user', JSON.stringify(res.data));
        localStorage.setItem('user_id', String(res.data.id));
        localStorage.setItem('role', res.data.role || '');
        setUser(res.data);
      } catch (err) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        localStorage.removeItem('user_id');
        localStorage.removeItem('role');
        setUser(null);
      }
    };
    init();
  }, []);

  useEffect(() => {
    const onStorage = () => {
      try {
        setUser(JSON.parse(localStorage.getItem('user')));
      } catch {
        setUser(null);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    const onAuthChanged = () => {
      try {
        setUser(JSON.parse(localStorage.getItem('user')));
      } catch {
        setUser(null);
      }
    };
    window.addEventListener('authChanged', onAuthChanged);
    return () => window.removeEventListener('authChanged', onAuthChanged);
  }, []);

  const handleLogout = async () => {
    await logout();
    setUser(null);
    navigate('/login', { replace: true });
  };

  return (
    <div>
      <nav style={styles.nav}>
        <div style={styles.logo}>MentorMatch</div>
        <div style={styles.menu}>
          <Link to="/" style={styles.link}>Головна</Link>
          <Link to="/mentors" style={styles.link}>Ментори</Link>

          {user ? (
            <>
              <Link to="/dashboard" style={styles.accentLink}>Кабінет {user.username}</Link>
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
          <Route path="/mentors" element={<MentorListPage />} />
          <Route path="/mentors/:id" element={<MentorDetailPage />} />

          <Route path="/dashboard" element={
            <RequireAuth>
              <DashboardPage />
            </RequireAuth>
          } />
          <Route path="/proposals" element={
            <RequireAuth>
              <ProposalsPage />
            </RequireAuth>
          } />
          <Route path="/proposals/:id" element={
            <RequireAuth>
              <ProposalDetailPage />
            </RequireAuth>
          } />
        </Routes>
      </div>
    </div>
  );
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 40px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderBottom: '1px solid #ffe4e9',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    backdropFilter: 'blur(10px)',
  },
  logo: { fontWeight: '800', fontSize: '24px' },
  menu: { display: 'flex', alignItems: 'center', gap: '18px' },
  link: { color: '#7a6375', textDecoration: 'none' },
  accentLink: { color: '#ff6b81', textDecoration: 'none', fontWeight: '600' },
  buttonLink: { padding: '8px 20px', backgroundColor: '#ff6b81', color: 'white', borderRadius: '20px', textDecoration: 'none' },
  logoutButton: { marginLeft: 8, padding: '6px 12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer' }
};
export default App;