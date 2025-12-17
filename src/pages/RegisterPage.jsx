import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!whatsapp.trim()) {
      alert('Please provide your WhatsApp username (without spaces).');
      return;
    }
    try {
      await api.post('auth/register/', {
        username,
        email,
        password,
        role,
        first_name: firstName,
        last_name: lastName,
        whatsapp_username: whatsapp.trim()
      });
      alert('Registration successful. Please log in.');
      navigate('/login');
    } catch (err) {
      console.error(err);
      const msg = err.response?.data || err.message;
      alert('Registration error. ' + JSON.stringify(msg));
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleRegister} style={styles.card}>
        <h2 style={{ marginBottom: 10 }}>Register</h2>

        <label style={styles.label}>Role</label>
        <select value={role} onChange={(e) => setRole(e.target.value)} style={styles.input}>
          <option value="student">Student</option>
          <option value="mentor">Mentor</option>
        </select>

        <label style={styles.label}>Username</label>
        <input value={username} onChange={(e) => setUsername(e.target.value)} style={styles.input} required />

        <label style={styles.label}>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={styles.input} required />

        <label style={styles.label}>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={styles.input} required minLength={8} />

        <label style={styles.label}>WhatsApp username</label>
        <input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} style={styles.input} required placeholder="e.g. 380501234567 or username"/>

        <label style={styles.label}>First name</label>
        <input value={firstName} onChange={(e) => setFirstName(e.target.value)} style={styles.input} />

        <label style={styles.label}>Last name</label>
        <input value={lastName} onChange={(e) => setLastName(e.target.value)} style={styles.input} />

        <button type="submit" style={styles.button}>Register</button>
      </form>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' },
  card: { width: 360, padding: 24, borderRadius: 12, background: 'white', boxShadow: '0 6px 18px rgba(0,0,0,0.06)' },
  label: { fontSize: 13, color: '#555', marginTop: 10, display: 'block' },
  input: { width: '100%', padding: '10px 12px', marginTop: 6, borderRadius: 8, border: '1px solid #eee' },
  button: { marginTop: 16, width: '100%', padding: 12, borderRadius: 10, background: '#ff6b81', color: 'white', border: 'none', fontWeight: '700' }
};

export default RegisterPage;