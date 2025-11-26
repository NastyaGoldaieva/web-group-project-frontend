import { Routes, Route, Link } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import MentorListPage from './pages/MentorListPage';
import MentorDetailPage from './pages/MentorDetailPage';

function App() {
  return (
    <div>
      <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 30px', backgroundColor: '#1f2937', color: 'white' }}>
        <div style={{ fontWeight: 'bold', fontSize: '20px' }}>MentorMatch</div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Головна</Link>
          <Link to="/mentors" style={{ color: 'white', textDecoration: 'none' }}>Ментори</Link>
          <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Вхід</Link>
        </div>
      </nav>

      <div style={{ minHeight: '90vh', backgroundColor: '#f9fafb' }}>
        <Routes>
          <Route path="/" element={<h1 style={{textAlign: 'center'}}>Вітаємо в MentorMatch! 🚀</h1>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/mentors" element={<MentorListPage />} />

          <Route path="/mentors/:id" element={<MentorDetailPage />} />

        </Routes>
      </div>
    </div>
  );
}

export default App;