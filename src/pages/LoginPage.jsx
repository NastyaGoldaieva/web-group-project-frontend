import { useState } from 'react';
import api from '../api/axios';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Відправляю запит...", { email, password });

    try {
      const response = await api.post('token/', { email, password });
      console.log("Успіх!", response.data);
      alert("Вхід успішний!");
    } catch (error) {
      console.error("Помилка:", error);
      alert("Помилка входу (перевір консоль)");
    }
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      width: "100vw"
    }}>

      {}
      <div style={{
        width: "100%",
        maxWidth: "400px",
        padding: "20px",
        textAlign: "center"
      }}>
        <h2>Вхід у MentorMatch</h2>

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <input
            type="text"
            placeholder="Email або Username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              padding: "12px",
              fontSize: "16px",
              borderRadius: "5px",
              border: "1px solid #555",
              backgroundColor: "#242424",
              color: "white"
            }}
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              padding: "12px",
              fontSize: "16px",
              borderRadius: "5px",
              border: "1px solid #555",
              backgroundColor: "#242424",
              color: "white"
            }}
          />
          <button type="submit" style={{
            padding: "12px",
            background: "#646cff",
            color: "white",
            border: "none",
            cursor: "pointer",
            borderRadius: "5px",
            fontSize: "16px",
            fontWeight: "bold"
          }}>
            Увійти
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;