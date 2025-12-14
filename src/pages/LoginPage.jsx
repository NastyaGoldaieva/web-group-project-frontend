import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { GoogleLogin } from '@react-oauth/google';

function LoginPage() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('auth/token/', formData);
      handleAuthSuccess(res.data);
    } catch (err) {
      setError('Невірний логін або пароль');
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await api.post('auth/google/', {
        token: credentialResponse.credential
      });

      if (res.data.status === 'need_registration') {
        navigate('/google-register', {
            state: {
                token: res.data.google_token,
                email: res.data.email,
                firstName: res.data.first_name
            }
        });
      } else if (res.data.status === 'login_success') {
        handleAuthSuccess(res.data);
      }

    } catch (err) {
      console.error("Google Login Error:", err);
      setError('Помилка входу через Google');
    }
  };

  const handleAuthSuccess = (data) => {
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      localStorage.setItem('user', JSON.stringify(data.user));

      window.dispatchEvent(new Event('authChanged'));

      navigate('/dashboard');
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={{color: '#333'}}>Вхід</h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            placeholder="Логін"
            onChange={e => setFormData({...formData, username: e.target.value})}
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Пароль"
            onChange={e => setFormData({...formData, password: e.target.value})}
            style={styles.input}
          />
          <button type="submit" style={styles.button}>Увійти</button>
        </form>

        <div style={{marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center'}}>
            <p style={{color: '#888', fontSize: '0.9rem'}}>— або —</p>

            <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError('Google Login Failed')}
                shape="pill"
            />
        </div>

        {error && <p style={{color: 'red', marginTop: '10px'}}>{error}</p>}

        <div style={{marginTop: '15px'}}>
            <Link to="/forgot-password" style={styles.link}>Забули пароль?</Link>
            <br/>
            <Link to="/register" style={styles.link}>Створити акаунт</Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', background: '#fffafc' },
  card: { padding: '40px', background: 'white', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', textAlign: 'center', width: '320px' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' },
  input: { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' },
  button: { padding: '12px', background: '#ff6b81', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  link: { color: '#7a6375', textDecoration: 'none', fontSize: '0.9rem', display: 'inline-block', marginTop: '5px' }
};

export default LoginPage;