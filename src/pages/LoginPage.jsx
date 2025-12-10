import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import api from '../api/axios';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/mentors';

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('auth/token/', {
        username: username,
        password: password
      });
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      try {
        const me = await api.get('auth/me/');
        localStorage.setItem('user', JSON.stringify(me.data));
        localStorage.setItem('user_id', String(me.data.id));
        localStorage.setItem('role', me.data.role || '');
      } catch (meErr) {
        console.warn('Не змогли отримати /auth/me/:', meErr);
      }
      window.dispatchEvent(new Event('authChanged'));
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Помилка:", error);
      alert("Ой! Невірний логін або пароль ");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>Привіт!</h2>
          <p style={styles.subtitle}>Увійдіть, щоб продовжити</p>
        </div>

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Логін</label>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Пароль</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
            />
          </div>

          <button type="submit" style={styles.button}>
            Увійти
          </button>
        </form>

        <p style={{ marginTop: '20px', color: '#888', fontSize: '0.9rem' }}>
          Ще не маєш акаунту? <Link to="/register" style={{ color: '#ff6b81' }}>Зареєструйся</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: 'linear-gradient(135deg, #fffafc 0%, #ffe4e9 100%)',
    fontFamily: "'Inter', sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: "400px",
    padding: "40px",
    backgroundColor: "white",
    borderRadius: "30px",
    textAlign: "center",
    boxShadow: "0 10px 40px rgba(255, 182, 193, 0.4)",
    border: "2px solid #fff0f3",
  },
  header: {
    marginBottom: "30px",
  },
  title: {
    margin: "10px 0 5px 0",
    color: "#333",
    fontSize: "2rem",
    fontWeight: "800",
  },
  subtitle: {
    color: "#7a6375",
    fontSize: "1rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  inputGroup: {
    textAlign: "left",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    color: "#555",
    fontWeight: "600",
    fontSize: "0.9rem",
    marginLeft: "10px",
  },
  input: {
    width: "100%",
    padding: "15px",
    fontSize: "16px",
    borderRadius: "20px",
    border: "2px solid #ffe4e9",
    backgroundColor: "#fffafc",
    color: "#333",
    outline: "none",
    transition: "border-color 0.3s",
    boxSizing: "border-box",
  },
  button: {
    padding: "15px",
    background: 'linear-gradient(45deg, #ff9a9e, #ff6b81)',
    color: "white",
    border: "none",
    borderRadius: "30px",
    fontSize: "1.1rem",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "transform 0.2s, box-shadow 0.2s",
    marginTop: "10px",
    boxShadow: "0 5px 15px rgba(255, 107, 129, 0.4)",
  }
};

export default LoginPage;