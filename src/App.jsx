import { Routes, Route, Link } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import MentorListPage from './pages/MentorListPage';
import MentorDetailPage from './pages/MentorDetailPage';
import DashboardPage from './pages/DashboardPage';
import LandingPage from './pages/LandingPage';

function App() {
  return (
    <div>
      <nav style={styles.nav}>
        <div style={styles.logo}>MentorMatch</div>
        <div style={styles.menu}>
          <Link to="/" style={styles.link}>Головна</Link>
          <Link to="/mentors" style={styles.link}>Ментори</Link>
          <Link to="/dashboard" style={styles.accentLink}>Кабінет</Link>
          <Link to="/login" style={styles.buttonLink}>Вхід</Link>
        </div>
      </nav>

      <div style={{ minHeight: '90vh', backgroundColor: '#fffafc' }}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/mentors" element={<MentorListPage />} />
          <Route path="/mentors/:id" element={<MentorDetailPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
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
  logo: {
    fontWeight: '800',
    fontSize: '24px',
    background: 'linear-gradient(45deg, #ff9a9e, #ff6b81)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '-0.5px',
  },
  menu: {
    display: 'flex',
    alignItems: 'center',
    gap: '25px',
  },
  link: {
    color: '#7a6375',
    textDecoration: 'none',
    fontWeight: '500',
    fontSize: '16px',
    transition: 'color 0.2s',
  },
  accentLink: {
    color: '#ff6b81',
    textDecoration: 'none',
    fontWeight: '600',
  },
  buttonLink: {
    padding: '8px 20px',
    backgroundColor: '#ff6b81',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '20px',
    fontWeight: 'bold',
    fontSize: '15px',
    transition: 'background 0.3s',
    boxShadow: '0 4px 10px rgba(255, 107, 129, 0.2)',
  }
};
export default App;