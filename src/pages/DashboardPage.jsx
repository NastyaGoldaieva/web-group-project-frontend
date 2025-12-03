import { useEffect, useState } from 'react';
import api from '../api/axios';

function DashboardPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await api.get('requests/');
        setRequests(response.data);
      } catch (err) {
        console.error(err);
        setError('Не вдалося завантажити ваші запити.');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted': return '#dcfce7';
      case 'rejected': return '#fee2e2';
      default: return '#fef9c3';
    }
  };

  if (loading) return <div style={{textAlign: 'center', marginTop: '50px'}}>Завантаження...</div>;
  if (error) return <div style={{color: 'red', textAlign: 'center', marginTop: '50px'}}>{error}</div>;

  return (
    <div style={{ maxWidth: '900px', margin: '40px auto', padding: '20px' }}>
      <h1 style={{ marginBottom: '30px' }}>Мої запити</h1>

      {requests.length === 0 ? (
        <p>Ви ще не відправляли запитів.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {requests.map((req) => (
            <div key={req.id} style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '20px',
              backgroundColor: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h3 style={{ margin: '0 0 5px 0' }}>Ментор: {req.mentor_name || req.mentor}</h3>
                <p style={{ margin: '0', color: '#666' }}>Повідомлення: "{req.message}"</p>
                <small style={{ color: '#999' }}>Дата: {new Date(req.created_at).toLocaleDateString()}</small>
              </div>

              <div style={{
                padding: '8px 15px',
                borderRadius: '20px',
                backgroundColor: getStatusColor(req.status),
                fontWeight: 'bold',
                textTransform: 'capitalize'
              }}>
                {req.status}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DashboardPage;