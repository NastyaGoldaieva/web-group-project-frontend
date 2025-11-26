import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

function MentorListPage() {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const response = await api.get('students/');
        console.log("Отримані дані:", response.data);
        setMentors(response.data);
      } catch (err) {
        console.error("Помилка:", err);
        setError('Не вдалося завантажити список. Перевір, чи запущено Django!');
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, []);

  if (loading) return <div style={{textAlign: 'center', marginTop: '50px'}}>Завантаження...</div>;
  if (error) return <div style={{color: 'red', textAlign: 'center', marginTop: '50px'}}>{error}</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Знайди свого ментора</h2>

      {mentors.length === 0 ? (
        <p style={{ textAlign: 'center' }}>Поки що немає менторів.</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px'
        }}>
          {mentors.map((student) => (
            <div key={student.id} style={{
              border: '1px solid #ddd',
              borderRadius: '12px',
              padding: '20px',
              backgroundColor: '#fff',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>{student.username}</h3>

              <div style={{ marginBottom: '10px', fontSize: '14px', color: '#555' }}>
                <p>📍 <strong>Локація:</strong> {student.location || 'Не вказано'}</p>
                <p>🎓 <strong>Курс:</strong> {student.study_year}</p>
              </div>

              <p style={{ fontStyle: 'italic', color: '#666', marginBottom: '15px' }}>
                "{student.bio || 'Без опису'}"
              </p>

              {}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                {student.interests ? (
                  student.interests.split(',').map((tag, idx) => (
                    <span key={idx} style={{
                      background: '#e0e7ff', color: '#3730a3',
                      padding: '4px 8px', borderRadius: '4px', fontSize: '12px'
                    }}>
                      {tag.trim()}
                    </span>
                  ))
                ) : null}
              </div>

              {}
              <Link
                to={`/mentors/${student.id}`}
                style={{
                  display: 'block',
                  textAlign: 'center',
                  width: '100%',
                  padding: '10px 0',
                  backgroundColor: '#4f46e5',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  boxSizing: 'border-box'
                }}
              >
                Детальніше
              </Link>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MentorListPage;