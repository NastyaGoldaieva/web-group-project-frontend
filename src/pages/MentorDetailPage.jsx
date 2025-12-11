import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';

function MentorDetailPage() {
  const { id } = useParams();
  const [mentor, setMentor] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const userRole = localStorage.getItem('role');

  useEffect(() => {
    api.get(`mentors/${id}/`)
       .then(res => setMentor(res.data))
       .catch(err => console.error(err))
       .finally(() => setLoading(false));
  }, [id]);

  const sendRequest = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      alert("Будь ласка, увійдіть у систему, щоб подати заявку!");
      return;
    }

    try {
      await api.post('requests/', {
        mentor: mentor.user_id,
        message: message
      });
      alert("Заявку успішно відправлено! ");
      setMessage("");
    } catch (error) {
      console.error(error);
      const reason = error.response?.data?.detail || "Помилка при відправці.";
      alert(reason);
    }
  };

  if (loading) return <div>Завантаження...</div>;
  if (!mentor) return <div>Ментор не знайдено</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px' }}>
      <Link to="/mentors" style={{ textDecoration: 'none', color: '#666', marginBottom: '20px', display: 'inline-block' }}>← Назад до списку</Link>

      <div style={{ marginTop: '20px', border: '1px solid #ddd', borderRadius: '12px', padding: '30px', background: 'white', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
        <h1 style={{ marginTop: 0 }}>{mentor.user?.username || mentor.username}</h1>
        <p style={{ color: '#555', fontSize: '1.1rem' }}><strong>{mentor.title}</strong></p>

        <div style={{ margin: '20px 0', lineHeight: '1.6' }}>
            <p><strong>Bio:</strong> {mentor.bio || 'Немає опису'}</p>
            <p><strong>Skills:</strong> {mentor.skills || 'Не вказано'}</p>
            <p><strong>Локація:</strong> {mentor.location || 'Не вказано'}</p>
        </div>

        <hr style={{ margin: '30px 0', border: '0', borderTop: '1px solid #eee' }} />

        {userRole === 'student' ? (
            <>
                <h3>Напиши повідомлення ментору</h3>
                <textarea
                  placeholder="Розкажи, чому ти хочеш вчитися саме у цього ментора..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  style={{ width: '100%', height: '100px', padding: '15px', marginTop: '10px', borderRadius: '10px', border: '1px solid #ccc', fontSize: '1rem', fontFamily: 'inherit' }}
                />

                <button
                  onClick={sendRequest}
                  style={{ marginTop: '20px', padding: '12px 30px', backgroundColor: '#ff6b81', color: 'white', border: 'none', borderRadius: '30px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', boxShadow: '0 4px 15px rgba(255, 107, 129, 0.4)' }}
                >
                  Відправити заявку
                </button>
            </>
        ) : (
            <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#fffafc', borderRadius: '15px', color: '#7a6375' }}>
                {userRole === 'mentor'
                    ? "Ментори не можуть відправляти запити іншим менторам. "
                    : "Увійдіть як студент, щоб відправити заявку."}
            </div>
        )}
      </div>
    </div>
  );
}

export default MentorDetailPage;