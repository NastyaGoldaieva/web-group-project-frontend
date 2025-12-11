import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

function ActivationPage() {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('Активація акаунту...');

  useEffect(() => {
    api.post('auth/activate/', { uid, token })
      .then(() => {
        setStatus('Акаунт успішно активовано! Перенаправлення...');
        setTimeout(() => navigate('/login'), 2000);
      })
      .catch(() => setStatus('Помилка активації. Посилання недійсне або застаріло.'));
  }, [uid, token, navigate]);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px', fontSize: '1.2rem' }}>
      {status}
    </div>
  );
}

export default ActivationPage;