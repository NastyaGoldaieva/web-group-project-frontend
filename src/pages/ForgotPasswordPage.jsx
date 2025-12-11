import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('auth/password-reset/', { email });
      setMessage('Якщо така пошта існує, ми надіслали вам інструкцію.');
    } catch (error) {
      setMessage('Помилка відправки.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Відновлення пароля</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            placeholder="Введіть вашу пошту"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button}>Надіслати лист</button>
        </form>
        {message && <p style={{ marginTop: '15px', color: '#555' }}>{message}</p>}
        <Link to="/login" style={{ marginTop: '15px', display: 'block', color: '#666' }}>Назад</Link>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', background: '#fffafc' },
  card: { padding: '40px', background: 'white', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', textAlign: 'center', width: '300px' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' },
  input: { padding: '12px', borderRadius: '8px', border: '1px solid #ddd' },
  button: { padding: '12px', background: '#ff6b81', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }
};

export default ForgotPasswordPage;