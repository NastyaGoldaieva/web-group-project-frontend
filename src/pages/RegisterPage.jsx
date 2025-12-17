import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
      alert('Будь ласка, вкажіть ваш нікнейм у WhatsApp (це важливо для зв\'язку).');
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
      alert('Реєстрація успішна! Тепер увійдіть.');
      navigate('/login');
    } catch (err) {
      console.error(err);
      const msg = err.response?.data || err.message;
      alert('Помилка реєстрації: ' + JSON.stringify(msg));
    }
  };

  return (
    <div style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa', padding: '20px' }}>
      <div className="card" style={{ width: '100%', maxWidth: '450px', padding: '40px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '25px', color: '#333' }}>Створити акаунт</h1>

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

          <div className="form-group">
            <label style={{ fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '5px', display: 'block' }}>Я хочу зареєструватися як:</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} className="input" style={{ width: '100%', padding: '12px' }}>
              <option value="student">Студент (шукаю знання)</option>
              <option value="mentor">Ментор (ділюся досвідом)</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ fontSize: '0.85rem', color: '#666' }}>Ім'я</label>
              <input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="input" style={{ width: '100%' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', color: '#666' }}>Прізвище</label>
              <input value={lastName} onChange={(e) => setLastName(e.target.value)} className="input" style={{ width: '100%' }} />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', color: '#666' }}>Логін (Username) *</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} className="input" required style={{ width: '100%' }} />
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', color: '#666' }}>Email *</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" required style={{ width: '100%' }} />
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', color: '#666' }}>Пароль (мін. 8 символів) *</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input" required minLength={8} style={{ width: '100%' }} />
          </div>

          <div style={{ background: '#e0f2fe', padding: '15px', borderRadius: '8px', border: '1px solid #bae6fd' }}>
            <label style={{ fontWeight: 'bold', fontSize: '0.9rem', color: '#0369a1', marginBottom: '5px', display: 'block' }}>WhatsApp Username *</label>
            <div style={{ fontSize: '0.8rem', color: '#075985', marginBottom: '5px' }}>Щоб ментор/студент міг зв'язатися з вами.</div>
            <input
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="input"
              required
              placeholder="наприклад: 380501234567"
              style={{ width: '100%', borderColor: '#bae6fd' }}
            />
          </div>

          <button type="submit" className="primary-btn" style={{ marginTop: '10px', padding: '14px', fontSize: '1rem' }}>
            Зареєструватися
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem' }}>
          Вже маєте акаунт? <Link to="/login" style={{ color: '#646cff', fontWeight: 'bold' }}>Увійти</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;