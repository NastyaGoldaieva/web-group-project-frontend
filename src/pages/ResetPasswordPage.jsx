import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

function ResetPasswordPage() {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('auth/password-reset/confirm/', { uid, token, new_password: password });
      setStatus('Пароль успішно змінено!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      setStatus('Помилка. Посилання недійсне.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Новий пароль</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="password"
            placeholder="Введіть новий пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
            minLength={8}
          />
          <button type="submit" style={styles.button}>Змінити пароль</button>
        </form>
        {status && <p style={{ marginTop: '15px' }}>{status}</p>}
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

export default ResetPasswordPage;