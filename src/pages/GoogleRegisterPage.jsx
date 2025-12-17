import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios';

function GoogleRegisterPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const { email, firstName, token } = location.state || {};

  const [role, setRole] = useState('student');
  const [username, setUsername] = useState(firstName || '');
  const [whatsapp, setWhatsapp] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) navigate('/login');
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!whatsapp.trim()) {
      alert('Please provide your WhatsApp username.');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('auth/google/register/', {
        token,
        role,
        username,
        whatsapp_username: whatsapp.trim()
      });

      localStorage.setItem('access_token', res.data.access);
      localStorage.setItem('refresh_token', res.data.refresh);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      window.dispatchEvent(new Event('authChanged'));
      navigate('/dashboard');

    } catch (err) {
      alert("Registration error. Maybe username is taken.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Complete registration</h2>
        <p style={{color: '#666', marginBottom: '20px'}}>
          Hello, <strong>{email}</strong>! <br/>
          Choose your role and enter WhatsApp username.
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>Username</label>
          <input style={styles.input} value={username} onChange={(e) => setUsername(e.target.value)} required />

          <label style={styles.label}>WhatsApp username</label>
          <input style={styles.input} value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} required placeholder="e.g. 380501234567 or username"/>

          <label style={styles.label}>Role</label>
          <div style={styles.radioGroup}>
            <label style={{...styles.radioLabel, background: role === 'student' ? '#ffe4e9' : 'transparent'}}>
              <input type="radio" value="student" checked={role === 'student'} onChange={() => setRole('student')} style={{marginRight: '8px'}} />
              Student
            </label>
            <label style={{...styles.radioLabel, background: role === 'mentor' ? '#dcfce7' : 'transparent'}}>
              <input type="radio" value="mentor" checked={role === 'mentor'} onChange={() => setRole('mentor')} style={{marginRight: '8px'}} />
              Mentor
            </label>
          </div>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Creating...' : 'Create account'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90vh', background: '#fffafc' },
  card: { padding: '40px', background: 'white', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', textAlign: 'center', width: '350px' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px', textAlign: 'left' },
  label: { fontWeight: 'bold', fontSize: '0.9rem', color: '#555', marginBottom: '-10px' },
  input: { padding: '12px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '1rem' },
  radioGroup: { display: 'flex', gap: '10px', marginTop: '10px' },
  radioLabel: { flex: 1, padding: '10px', border: '1px solid #eee', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.9rem' },
  button: { marginTop: '10px', padding: '12px', background: '#ff6b81', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }
};

export default GoogleRegisterPage;