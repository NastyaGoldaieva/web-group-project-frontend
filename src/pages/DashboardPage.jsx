import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';

function DashboardPage() {
  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);

  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    bio: '',
    interests: '',
    contact: '',
    location: '',
    availability: []
  });

  useEffect(() => {
    fetchProfile();
    fetchRequests();
    // eslint-disable-next-line
  }, []);

  const fetchProfile = async () => {
    setLoadingProfile(true);
    try {
      const res = await api.get('students/me/');
      setProfile(res.data);
      setForm({
        bio: res.data.bio || '',
        interests: res.data.interests || '',
        contact: res.data.contact || '',
        location: res.data.location || '',
        availability: res.data.availability || []
      });
    } catch (err) {
      // fallback logic if students/me not available
      try {
        const me = await api.get('auth/me/');
        const username = me.data.username;
        const list = await api.get('students/');
        const profiles = list.data.results || list.data || [];
        const p = profiles.find(it => (it.username || (it.user && it.user.username)) === username);
        if (p) {
          setProfile(p);
          setForm({
            bio: p.bio || '',
            interests: p.interests || '',
            contact: p.contact || '',
            location: p.location || '',
            availability: p.availability || []
          });
        } else {
          setProfile(null);
        }
      } catch (e) {
        setProfile(null);
      }
    } finally {
      setLoadingProfile(false);
    }
  };

  const fetchRequests = async () => {
    setLoadingRequests(true);
    try {
      const response = await api.get('requests/');
      setRequests(response.data.results || response.data);
    } catch (err) {
      console.error(err);
      setRequests([]);
    } finally {
      setLoadingRequests(false);
    }
  };

  const saveProfile = async (e) => {
    e && e.preventDefault();
    try {
      if (profile && profile.id) {
        const res = await api.patch(`students/${profile.id}/`, {
          bio: form.bio,
          interests: form.interests,
          contact: form.contact,
          location: form.location,
          availability: form.availability
        });
        setProfile(res.data);
        alert('Профіль оновлено');
      } else {
        const res = await api.post(`students/`, {
          bio: form.bio,
          interests: form.interests,
          contact: form.contact,
          location: form.location,
          availability: form.availability
        });
        setProfile(res.data);
        alert('Профіль створено');
      }
      setEditing(false);
      fetchProfile();
      fetchRequests();
    } catch (err) {
      console.error('Save profile error', err);
      const msg = err.response?.data || err.message;
      alert('Помилка збереження профілю: ' + JSON.stringify(msg));
    }
  };

  if (loadingProfile && loadingRequests) return <div style={{textAlign: 'center', marginTop: '50px'}}>Завантаження...</div>;

  return (
    <div style={{ maxWidth: '900px', margin: '40px auto', padding: '20px' }}>
      <h1 style={{ marginBottom: '30px' }}>Мій кабінет</h1>

      <section style={{ marginBottom: 30 }}>
        <h2>Про мене</h2>
        {loadingProfile ? (
          <div>Завантаження профілю...</div>
        ) : (
          <div style={{ border: '1px solid #eee', padding: 16, borderRadius: 8, background: 'white' }}>
            {profile ? (
              <>
                <p><strong>Bio:</strong> {profile.bio || '—'}</p>
                <p><strong>Інтереси / Навички:</strong> {profile.interests || '—'}</p>
                <p><strong>Контакт:</strong> {profile.contact || '—'}</p>
                <p><strong>Локація:</strong> {profile.location || '—'}</p>
                <div style={{ marginTop: 12 }}>
                  <button onClick={() => setEditing(true)} style={{ padding: '8px 12px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: 8 }}>
                    Редагувати профіль
                  </button>
                </div>
              </>
            ) : (
              <>
                <p>Ви ще не заповнили інформацію про себе.</p>
                <button onClick={() => setEditing(true)} style={{ padding: '8px 12px', background: '#10b981', color: 'white', border: 'none', borderRadius: 8 }}>
                  Додати інформацію
                </button>
              </>
            )}
          </div>
        )}

        {editing && (
          <form onSubmit={saveProfile} style={{ marginTop: 14, border: '1px solid #f0f0f0', padding: 12, borderRadius: 8, background: '#fff' }}>
            <label style={{ display: 'block', marginBottom: 6 }}>Про себе</label>
            <textarea value={form.bio} onChange={(e) => setForm({...form, bio: e.target.value})} style={{ width: '100%', minHeight: 80, marginBottom: 8 }} />

            <label style={{ display: 'block', marginBottom: 6 }}>Інтереси / Навички (кома через пробіл чи кома)</label>
            <input value={form.interests} onChange={(e) => setForm({...form, interests: e.target.value})} style={{ width: '100%', marginBottom: 8 }} />

            <label style={{ display: 'block', marginBottom: 6 }}>Контакт (Telegram/Email)</label>
            <input value={form.contact} onChange={(e) => setForm({...form, contact: e.target.value})} style={{ width: '100%', marginBottom: 8 }} />

            <label style={{ display: 'block', marginBottom: 6 }}>Локація</label>
            <input value={form.location} onChange={(e) => setForm({...form, location: e.target.value})} style={{ width: '100%', marginBottom: 8 }} />

            <div style={{ display: 'flex', gap: 8 }}>
              <button type="submit" style={{ padding: '8px 12px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: 8 }}>Зберегти</button>
              <button type="button" onClick={() => { setEditing(false); fetchProfile(); }} style={{ padding: '8px 12px', background: '#e5e7eb', borderRadius: 8, border: 'none' }}>Скасувати</button>
            </div>
          </form>
        )}
      </section>

      <section>
        <h2>Мої запити</h2>
        {loadingRequests ? <div>Завантаження...</div> : (
          <>
            {requests.length === 0 ? (
              <p>Ви ще не маєте запитів.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {requests.map((req) => (
                  <div key={req.id} style={{
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '20px',
                    backgroundColor: 'white',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <h3 style={{ margin: '0 0 5px 0' }}>Ментор: {req.mentor_name || req.mentor}</h3>
                      <p style={{ margin: '0', color: '#666' }}>Повідомлення: "{req.message}"</p>
                      <small style={{ color: '#999' }}>Дата: {new Date(req.created_at).toLocaleDateString()}</small>
                    </div>

                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <div style={{
                        padding: '8px 15px',
                        borderRadius: '20px',
                        backgroundColor: req.status === 'accepted' ? '#dcfce7' : req.status === 'rejected' ? '#fee2e2' : '#fef9c3',
                        fontWeight: 'bold',
                        textTransform: 'capitalize'
                      }}>
                        {req.status}
                      </div>

                      {req.status === 'pending' && (
                        <button onClick={async () => {
                          if (!window.confirm('Підтвердити запит та згенерувати пропозицію слотів?')) return;
                          try {
                            await api.post(`requests/${req.id}/accept/`, { duration: 60, step: 30, limit: 20 });
                            alert('Пропозиція створена.');
                            fetchRequests();
                          } catch (err) {
                            console.error(err);
                            alert('Помилка при підтвердженні запиту.');
                          }
                        }} style={{ padding: '8px 12px', borderRadius: 8, background: '#4f46e5', color: 'white', border: 'none' }}>
                          Accept (mentor)
                        </button>
                      )}

                      <Link to="/proposals" style={{ padding: '8px 12px', borderRadius: 8, background: '#10b981', color: 'white', textDecoration: 'none' }}>
                        Переглянути пропозиції
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}

export default DashboardPage;