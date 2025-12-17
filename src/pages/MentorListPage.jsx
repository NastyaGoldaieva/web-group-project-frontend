import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const animatedStyles = `
  @keyframes gradientAnimation {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  .animated-hero-bg {
    background: linear-gradient(-45deg, #ffdde1, #ee9ca7, #ffdde1, #f7bb97);
    background-size: 400% 400%;
    animation: gradientAnimation 12s ease infinite;
  }
`;

function MentorListPage() {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const response = await api.get('mentors/');
        setMentors(response.data.results || response.data);
      } catch (err) {
        console.error("Error:", err);
        setError("Не вдалося завантажити список менторів.");
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, []);

  const getPinkLineContent = (m) => {
    if (m.user && typeof m.user === 'object') {
      const firstName = m.user.first_name || '';
      const lastName = m.user.last_name || '';
      const fullName = `${firstName} ${lastName}`.trim();

      if (fullName) return fullName;
    }

    if (m.title) return m.title;

    return 'Досвідчений ментор';
  };

  const getUsername = (m) => {
    if (m.user && typeof m.user === 'object') return m.user.username;
    if (m.user && typeof m.user === 'string') return m.user;
    return 'Ментор';
  };

  if (loading) return <div className="page-hero small"><div className="container center">Завантаження менторів...</div></div>;
  if (error) return <div className="page-hero small"><div className="container center" style={{color:'red'}}>{error}</div></div>;

  return (
    <>
      <style>{animatedStyles}</style>
      <div className="page-hero small animated-hero-bg" style={{ color: '#333' }}>
        <div className="container">
          <h1 style={{ color: '#222' }}>Знайди свого ментора</h1>
          <p className="lead" style={{ opacity: 0.9, color: '#444' }}>Обери експерта, який допоможе тобі зрости професійно</p>
        </div>
      </div>

      <div className="page-content">
        <div className="container">
          {mentors.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', background: '#f8f9fa', borderRadius: '12px' }}>
              <h3>Поки що немає менторів</h3>
              <p>Завітайте пізніше!</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '25px'
            }}>
              {mentors.map((mentor) => (
                <div key={mentor.id} className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '25px' }}>

                  <div style={{ marginBottom: '15px' }}>
                      <h3 style={{ margin: '0 0 5px 0', fontSize: '1rem', color: '#555' }}>{getUsername(mentor)}</h3>

                      <div style={{ fontSize: '1.2rem', color: '#ec008c', fontWeight: 'bold' }}>
                        {getPinkLineContent(mentor)}
                      </div>
                  </div>

                  <div style={{ marginBottom: '15px', flexGrow: 1 }}>
                    <p style={{ color: '#555', fontSize: '0.95rem', lineHeight: '1.5', margin: '0 0 10px 0' }}>
                      {mentor.bio ? (mentor.bio.length > 100 ? mentor.bio.substring(0, 100) + '...' : mentor.bio) : 'Опис відсутній'}
                    </p>
                    <div style={{ fontSize: '0.85rem', color: '#888' }}>Локація: {mentor.location || 'Онлайн'}</div>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                    {mentor.skills ? mentor.skills.split(',').slice(0, 4).map((tag, idx) => (
                      <span key={idx} style={{ background: '#eef2ff', color: '#4f46e5', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '500' }}>
                        {tag.trim()}
                      </span>
                    )) : null}
                  </div>

                  <Link to={`/mentors/${mentor.id}`} className="primary-btn" style={{ textAlign: 'center', width: '100%', display: 'block', textDecoration: 'none' }}>
                    Переглянути профіль
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default MentorListPage;