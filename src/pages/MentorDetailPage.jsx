import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';

function MentorDetailPage() {
  const { id } = useParams();
  const [mentor, setMentor] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

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
        mentor: mentor.user?.id || mentor.user,
        message: message
      });
      alert("Заявку успішно відправлено!");
      setMessage("");
    } catch (error) {
      console.error(error);
      alert("Помилка! Можливо, ви вже відправляли запит цьому ментору.");
    }
  };

  if (loading) return <div>Завантаження...</div>;
  if (!mentor) return <div>Ментор не знайдено</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px' }}>
      <Link to="/mentors">← Назад</Link>

      <div style={{ marginTop: '20px', border: '1px solid #ddd', borderRadius: '12px', padding: '30px', background: 'white' }}>
        <h1>{mentor.user?.username}</h1>
        <p><strong>Title:</strong> {mentor.title}</p>
        <p><strong>Bio:</strong> {mentor.bio}</p>
        <p><strong>Skills:</strong> {mentor.skills}</p>

        <hr style={{ margin: '20px 0' }} />

        <h3>Напиши повідомлення ментору</h3>
        <textarea
          placeholder="Напиши коротке повідомлення..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ width: '100%', height: '100px', padding: '10px', marginTop: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />

        <button
          onClick={sendRequest}
          style={{ marginTop: '15px', padding: '12px 24px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Відправити заявку
        </button>
      </div>
    </div>
  );
}

export default MentorDetailPage;