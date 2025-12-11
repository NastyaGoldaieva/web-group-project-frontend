import { useEffect, useState } from 'react';
import api from '../api/axios';

function DashboardPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState(() => {
    const savedProfile = localStorage.getItem('userProfile');
    return savedProfile ? JSON.parse(savedProfile) : {
      bio: '',
      interests: '',
      contact: '',
      location: ''
    };
  });

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await api.get('requests/');
        setRequests(response.data);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          setError('Будь ласка, увійдіть у систему');
        } else {
          setError('Не вдалося завантажити дані');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleSave = () => {
    localStorage.setItem('userProfile', JSON.stringify(profile));
    setIsEditing(false);
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'accepted':
        return { style: styles.statusAccepted, text: 'Прийнято' };
      case 'rejected':
        return { style: styles.statusRejected, text: 'Відхилено' };
      default:
        return { style: styles.statusPending, text: 'Очікує відповіді' };
    }
  };

  if (loading) return <div style={styles.centerText}>Завантаження...</div>;
  if (error) return <div style={styles.container}><div style={styles.errorCard}>{error}</div></div>;

  return (
    <div style={styles.container}>
      <div style={styles.contentWrapper}>

        <div style={styles.sectionCard}>
            <div style={styles.cardHeader}>
                <h2 style={styles.sectionTitle}>Мій профіль</h2>
                {!isEditing && (
                    <button onClick={() => setIsEditing(true)} style={styles.editButton}>
                        Редагувати
                    </button>
                )}
            </div>

            {isEditing ? (
                <div style={styles.formGrid}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Про мене</label>
                        <textarea
                            style={styles.textarea}
                            value={profile.bio}
                            onChange={(e) => setProfile({...profile, bio: e.target.value})}
                            placeholder="Розкажіть про себе..."
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Інтереси та навички</label>
                        <input
                            style={styles.input}
                            value={profile.interests}
                            onChange={(e) => setProfile({...profile, interests: e.target.value})}
                        />
                    </div>
                    <div style={styles.row}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Контакти</label>
                            <input
                                style={styles.input}
                                value={profile.contact}
                                onChange={(e) => setProfile({...profile, contact: e.target.value})}
                            />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Локація</label>
                            <input
                                style={styles.input}
                                value={profile.location}
                                onChange={(e) => setProfile({...profile, location: e.target.value})}
                            />
                        </div>
                    </div>
                    <div style={styles.buttonGroup}>
                        <button onClick={handleSave} style={styles.saveButton}>Зберегти</button>
                        <button onClick={() => setIsEditing(false)} style={styles.cancelButton}>Скасувати</button>
                    </div>
                </div>
            ) : (
                <div style={styles.profileInfo}>
                    <div style={styles.infoRow}>
                        <span style={styles.infoLabel}>Bio:</span>
                        <span style={styles.infoValue}>{profile.bio || 'Не вказано'}</span>
                    </div>
                    <div style={styles.infoRow}>
                        <span style={styles.infoLabel}>Інтереси:</span>
                        <span style={styles.infoValue}>{profile.interests || 'Не вказано'}</span>
                    </div>
                    <div style={styles.infoRow}>
                        <span style={styles.infoLabel}>Контакти:</span>
                        <span style={styles.infoValue}>{profile.contact || 'Не вказано'}</span>
                    </div>
                    <div style={styles.infoRow}>
                        <span style={styles.infoLabel}>Локація:</span>
                        <span style={styles.infoValue}>{profile.location || 'Не вказано'}</span>
                    </div>
                </div>
            )}
        </div>

        <div style={styles.header}>
          <h2 style={styles.title}>Мої запити</h2>
        </div>

        {requests.length === 0 ? (
          <div style={styles.emptyStateCard}>
            <p>Ви ще не відправляли запитів менторам.</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {requests.map((req) => {
              const statusConfig = getStatusConfig(req.status);
              return (
                <div key={req.id} style={styles.card}>
                  <div style={styles.cardHeader}>
                    <h3 style={styles.mentorName}>Ментор: {req.mentor_name || req.mentor}</h3>
                    <small style={styles.date}>{new Date(req.created_at).toLocaleDateString()}</small>
                  </div>
                  <div style={styles.messageBox}>"{req.message}"</div>
                  <div style={styles.cardFooter}>
                    <div style={{ ...styles.statusBadge, ...statusConfig.style }}>
                      {statusConfig.text}
                    </div>
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
  container: {
    minHeight: '90vh',
    background: 'linear-gradient(135deg, #fffafc 0%, #ffe4e9 100%)',
    fontFamily: "'Inter', sans-serif",
    padding: '40px 20px',
  },
  contentWrapper: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  sectionCard: {
    backgroundColor: 'white',
    borderRadius: '30px',
    padding: '40px',
    boxShadow: "0 10px 40px rgba(255, 182, 193, 0.4)",
    marginBottom: '40px',
    border: "2px solid #fff0f3",
  },
  sectionTitle: {
    margin: 0,
    fontSize: '1.8rem',
    color: '#333',
    fontWeight: '800',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
  },
  editButton: {
    background: 'linear-gradient(45deg, #ff9a9e, #ff6b81)',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '20px',
    cursor: 'pointer',
    fontWeight: 'bold',
    boxShadow: '0 4px 10px rgba(255, 107, 129, 0.3)',
    transition: 'transform 0.2s',
  },
  formGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  row: {
    display: 'flex',
    gap: '20px',
  },
  label: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#7a6375',
    marginLeft: '5px',
  },
  input: {
    padding: '12px 15px',
    borderRadius: '15px',
    border: '2px solid #ffe4e9',
    fontSize: '1rem',
    backgroundColor: '#fffafc',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
  },
  textarea: {
    padding: '12px 15px',
    borderRadius: '15px',
    border: '2px solid #ffe4e9',
    fontSize: '1rem',
    backgroundColor: '#fffafc',
    minHeight: '100px',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  },
  buttonGroup: {
    display: 'flex',
    gap: '15px',
    marginTop: '10px',
  },
  saveButton: {
    background: '#4f46e5',
    color: 'white',
    border: 'none',
    padding: '12px 25px',
    borderRadius: '15px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '1rem',
  },
  cancelButton: {
    backgroundColor: '#fff',
    color: '#7a6375',
    border: '2px solid #ffe4e9',
    padding: '12px 25px',
    borderRadius: '15px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '1rem',
  },
  profileInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  infoRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  infoLabel: {
    fontWeight: 'bold',
    color: '#333',
    fontSize: '1rem',
  },
  infoValue: {
    color: '#666',
    fontSize: '1rem',
    lineHeight: '1.5',
    backgroundColor: '#fffafc',
    padding: '10px',
    borderRadius: '10px',
    border: '1px solid #fff0f3',
  },
  header: {
    marginBottom: '25px',
    paddingLeft: '10px',
  },
  title: {
    fontSize: '1.8rem',
    fontWeight: '800',
    color: '#333',
    margin: 0,
  },
  centerText: {
    textAlign: 'center',
    marginTop: '50px',
    color: '#7a6375',
    fontSize: '1.2rem'
  },
  errorCard: {
    backgroundColor: '#fff0f3',
    color: '#d32f2f',
    padding: '20px',
    borderRadius: '20px',
    textAlign: 'center',
    border: '2px solid #ffcdd2',
    maxWidth: '600px',
    margin: '50px auto'
  },
  emptyStateCard: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '30px',
    textAlign: 'center',
    boxShadow: "0 10px 40px rgba(255, 182, 193, 0.2)",
    color: '#7a6375',
    fontSize: '1.1rem',
    border: "2px solid #fff0f3"
  },
  grid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '25px',
    padding: '30px',
    boxShadow: "0 5px 25px rgba(255, 182, 193, 0.3)",
    border: "2px solid #fff5f7",
    transition: 'transform 0.2s'
  },
  mentorName: {
    margin: 0,
    color: '#333',
    fontSize: '1.2rem',
    fontWeight: '700',
  },
  date: {
    color: '#999',
    fontSize: '0.85rem'
  },
  messageBox: {
    backgroundColor: '#fffafc',
    padding: '15px',
    borderRadius: '15px',
    color: '#555',
    fontStyle: 'italic',
    marginBottom: '20px',
    border: '1px solid #ffe4e9',
    marginTop: '15px',
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  statusBadge: {
    padding: '8px 16px',
    borderRadius: '20px',
    fontWeight: 'bold',
    fontSize: '0.85rem',
    display: 'inline-block',
  },
  statusAccepted: {
    backgroundColor: '#dcfce7',
    color: '#166534',
    border: '1px solid #bbf7d0'
  },
  statusRejected: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    border: '1px solid #fecaca'
  },
  statusPending: {
    backgroundColor: '#fef9c3',
    color: '#854d0e',
    border: '1px solid #fde047'
  },
};

export default DashboardPage;