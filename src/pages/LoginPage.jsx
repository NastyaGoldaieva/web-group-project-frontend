import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post('token/', { username, password });

      console.log("Токени отримано:", response.data);

      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);

      alert("Вхід успішний!");

      navigate('/mentors');

    } catch (error) {
      console.error("Помилка:", error);
      alert("Невірний логін або пароль!");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", width: "100vw" }}>
      <div style={{ width: "100%", maxWidth: "400px", padding: "20px", textAlign: "center" }}>
        <h2>Вхід у MentorMatch</h2>
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <input
            type="text"
            placeholder="Username (Логін)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ padding: "12px", fontSize: "16px", borderRadius: "5px", border: "1px solid #555" }}
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: "12px", fontSize: "16px", borderRadius: "5px", border: "1px solid #555" }}
          />
          <button type="submit" style={{ padding: "12px", background: "#646cff", color: "white", border: "none", borderRadius: "5px", fontSize: "16px", fontWeight: "bold" }}>
            Увійти
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;