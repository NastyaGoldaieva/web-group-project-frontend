import { useEffect, useState } from 'react';
import api from '../api/axios';

function MyStudentsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await api.get('requests/');
        setRequests(response.data);
      } catch (err) {
        setError('Не вдалося завантажити студентів.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const handleAccept = async (requestId) => {
    try {
        await api.post(`requests/${requestId}/accept/`);
        setRequests(requests.map(req =>
            req.id === requestId ? { ...req, status: 'accepted' } : req
        ));
        alert("Запит прийнято! 🎉");
    } catch (err) {
        alert("Помилка.");
    }
  };

  const handleReject = async (requestId) => {
    if(!window.confirm("Відхилити запит?")) return;
    try {
        await api.post(`requests/${requestId}/reject/`);
        setRequests(requests.map(req =>
            req.id === requestId ? { ...req, status: 'rejected' } : req
        ));
    } catch (err) {
        alert("Помилка.");
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'accepted':
        return { style: styles.statusAccepted, text: 'Мій студент ' };
      case 'rejected':
        return { style: styles.statusRejected, text: 'Відхилено ' };
      default:
        return { style: styles.statusPending, text: 'Нова заявка ' };
    }
  };

  if (loading) return <div style={styles.centerText}>Завантаження...</div>;
  if (error) return <div style={styles.centerText}>{error}</div>;

  return (
    <div style={styles.container}>
      <div style={styles.contentWrapper}>
        <div style={styles.header}>
          <h2 style={styles.title}>Мої студенти та заявки 🎓</h2>
        </div>

        {requests.length === 0 ? (
          <div style={styles.emptyStateCard}>
            <p>У вас поки немає студентів або активних заявок.</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {requests.map((req) => {
              const statusConfig = getStatusConfig(req.status);
              return (
                <div key={req.id} style={styles.card}>
                  <div style={styles.cardHeader}>
                    <h3 style={styles.studentName}> {req.student_name}</h3>
                    <small style={styles.date}>{new Date(req.created_at).toLocaleDateString()}</small>
                  </div>

                  <div style={styles.messageLabel}>Повідомлення:</div>
                  <div style={styles.messageBox}>"{req.message}"</div>

                  <div style={styles.cardFooter}>
                    <div style={{ ...styles.statusBadge, ...statusConfig.style }}>
                      {statusConfig.text}
                    </div>

                    {req.status === 'pending' && (
                        <div style={styles.actionButtons}>
                            <button onClick={() => handleAccept(req.id)} style={styles.acceptBtn}>Прийняти</button>
                            <button onClick={() => handleReject(req.id)} style={styles.rejectBtn}>Відхилити</button>
                        </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '90vh', background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', fontFamily: "'Inter', sans-serif", padding: '40px 20px' },
  contentWrapper: { maxWidth: '800px', margin: '0 auto' },
  header: { marginBottom: '30px', textAlign: 'center' },
  title: { fontSize: '2rem', fontWeight: '800', color: '#166534', margin: 0 },
  centerText: { textAlign: 'center', marginTop: '50px', color: '#555', fontSize: '1.2rem' },
  emptyStateCard: { backgroundColor: 'white', padding: '40px', borderRadius: '20px', textAlign: 'center', boxShadow: "0 10px 30px rgba(0,0,0,0.05)" },
  grid: { display: 'flex', flexDirection: 'column', gap: '20px' },
  card: { backgroundColor: 'white', borderRadius: '20px', padding: '25px', boxShadow: "0 4px 15px rgba(0,0,0,0.05)", border: "1px solid #e5e7eb" },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' },
  studentName: { margin: 0, color: '#333', fontSize: '1.4rem' },
  date: { color: '#999', fontSize: '0.9rem' },
  messageLabel: { fontSize: '0.85rem', fontWeight: 'bold', color: '#777', marginBottom: '5px' },
  messageBox: { backgroundColor: '#f9fafb', padding: '15px', borderRadius: '10px', color: '#374151', fontStyle: 'italic', marginBottom: '20px', border: '1px solid #f3f4f6' },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  statusBadge: { padding: '8px 16px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.9rem' },
  statusAccepted: { backgroundColor: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0' },
  statusRejected: { backgroundColor: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca' },
  statusPending: { backgroundColor: '#fef9c3', color: '#854d0e', border: '1px solid #fde047' },
  actionButtons: { display: 'flex', gap: '10px' },
  acceptBtn: { padding: '8px 20px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' },
  rejectBtn: { padding: '8px 20px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' },
};

export default MyStudentsPage;