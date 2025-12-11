import { useEffect, useState } from 'react';
import api from '../api/axios';

function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [username, setUsername] = useState('');

  const [profile, setProfile] = useState({
    bio: '', interests: '', skills: '', title: '', contact: '', location: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const userRes = await api.get('auth/me/');
        setUserRole(userRes.data.role);
        setUsername(userRes.data.username);

        const endpoint = userRes.data.role === 'mentor' ? 'mentors/me/' : 'students/me/';
        const profileRes = await api.get(endpoint);
        setProfile(profileRes.data);

      } catch (err) {
        setError('Не вдалося завантажити дані');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    try {
        const endpoint = userRole === 'mentor' ? 'mentors/me/' : 'students/me/';
        const response = await api.patch(endpoint, profile);
        setProfile(response.data);
        setIsEditing(false);
    } catch (err) {
        alert("Помилка збереження");
    }
  };

  if (loading) return <div style={styles.center}>Завантаження...</div>;
  if (error) return <div style={styles.center}>{error}</div>;

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        <div style={styles.header}>
            <div>
                <h1 style={styles.name}>{username}</h1>
                <p style={styles.role}>{userRole === 'mentor' ? 'Ментор' : 'Студент'}</p>
            </div>
            {!isEditing && (
                <button onClick={() => setIsEditing(true)} style={styles.editBtn}>✏️</button>
            )}
        </div>

        <hr style={styles.divider} />

        {isEditing ? (
            <div style={styles.form}>
                {userRole === 'mentor' ? (
                    <>
                        <label style={styles.label}>Посада</label>
                        <input style={styles.input} value={profile.title} onChange={e => setProfile({...profile, title: e.target.value})} />

                        <label style={styles.label}>Навички</label>
                        <input style={styles.input} value={profile.skills} onChange={e => setProfile({...profile, skills: e.target.value})} />
                    </>
                ) : (
                    <>
                        <label style={styles.label}>Інтереси</label>
                        <input style={styles.input} value={profile.interests} onChange={e => setProfile({...profile, interests: e.target.value})} />
                    </>
                )}

                <label style={styles.label}>Про мене</label>
                <textarea style={styles.textarea} value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})} />

                <label style={styles.label}>Контакти</label>
                <input style={styles.input} value={profile.contact} onChange={e => setProfile({...profile, contact: e.target.value})} />

                <label style={styles.label}>Локація</label>
                <input style={styles.input} value={profile.location} onChange={e => setProfile({...profile, location: e.target.value})} />

                <div style={styles.buttons}>
                    <button onClick={handleSave} style={styles.saveBtn}>Зберегти</button>
                    <button onClick={() => setIsEditing(false)} style={styles.cancelBtn}>Скасувати</button>
                </div>
            </div>
        ) : (
            <div style={styles.info}>
                {userRole === 'mentor' && (
                    <>
                        <div style={styles.row}><strong>Посада:</strong> {profile.title || '-'}</div>
                        <div style={styles.row}><strong>Навички:</strong> {profile.skills || '-'}</div>
                    </>
                )}
                {userRole === 'student' && (
                    <div style={styles.row}><strong>Інтереси:</strong> {profile.interests || '-'}</div>
                )}

                <div style={styles.bioBlock}>
                    <strong>Про мене:</strong>
                    <p style={styles.bioText}>{profile.bio || 'Інформація відсутня'}</p>
                </div>

                <div style={styles.row}><strong>Контакти:</strong> {profile.contact || '-'}</div>
                <div style={styles.row}><strong>Локація:</strong> {profile.location || '-'}</div>
            </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '90vh',
    background: '#fffafc',
    padding: '40px 20px',
    fontFamily: 'Inter, sans-serif',
    display: 'flex',
    justifyContent: 'center',
  },
  card: {
    background: 'white',
    width: '100%',
    maxWidth: '600px',
    borderRadius: '20px',
    padding: '40px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
    height: 'fit-content',
    border: '1px solid #ffe4e9',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    marginBottom: '20px',
  },

  name: { margin: 0, fontSize: '1.8rem', color: '#333' },
  role: { margin: 0, color: '#ff6b81', fontWeight: 'bold' },
  editBtn: {
    marginLeft: 'auto',
    background: 'none',
    border: '1px solid #ddd',
    borderRadius: '10px',
    padding: '8px 12px',
    cursor: 'pointer',
    fontSize: '1.2rem',
  },
  divider: { border: '0', borderTop: '1px solid #eee', marginBottom: '30px' },

  info: { display: 'flex', flexDirection: 'column', gap: '15px', fontSize: '1.1rem', color: '#444' },
  row: { padding: '10px', background: '#fffafc', borderRadius: '10px' },
  bioBlock: { padding: '10px' },
  bioText: { marginTop: '5px', lineHeight: '1.5', color: '#666' },

  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  label: { fontSize: '0.9rem', fontWeight: 'bold', color: '#555', marginBottom: '-10px' },
  input: { padding: '12px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '1rem' },
  textarea: { padding: '12px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '1rem', minHeight: '100px', fontFamily: 'inherit' },

  buttons: { display: 'flex', gap: '10px', marginTop: '10px' },
  saveBtn: { flex: 1, padding: '12px', background: '#ff6b81', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' },
  cancelBtn: { flex: 1, padding: '12px', background: '#eee', color: '#333', border: 'none', borderRadius: '10px', cursor: 'pointer' },

  center: { textAlign: 'center', marginTop: '50px', color: '#888' },
};

export default DashboardPage;