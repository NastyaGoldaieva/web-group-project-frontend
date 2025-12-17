import { useEffect, useState } from 'react';
import api from '../api/axios';

function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [requests, setRequests] = useState([]);

  const [profile, setProfile] = useState({
    bio: '', interests: '', skills: '', title: '', contact: '', location: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const userRes = await api.get('auth/me/');
        const { role, username, first_name, last_name } = userRes.data;

        setUserRole(role);

        if (first_name && last_name) {
          setDisplayName(`${first_name} ${last_name}`);
        } else if (first_name) {
          setDisplayName(first_name);
        } else {
          setDisplayName(username);
        }

        const endpoint = role === 'mentor' ? 'mentors/me/' : 'students/me/';
        const profileRes = await api.get(endpoint);
        setProfile(profileRes.data);

        const requestsRes = await api.get('requests/');
        setRequests(requestsRes.data);

      } catch (err) {
        console.error(err);
        setError('Не вдалося завантажити дані');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    try {
        const endpoint = userRole === 'mentor' ? 'mentors/me/' : 'students/me/';
        const response = await api.patch(endpoint, profile);
        setProfile(response.data);
        setIsEditing(false);
    } catch (err) {
        alert("Помилка збереження");
    }
  };

  const handleRequestAction = async (id, action) => {
    try {
      await api.post(`requests/${id}/${action}/`);
      setRequests(prev => prev.map(req => {
        if (req.id === id) {
          return { ...req, status: action === 'accept' ? 'accepted' : 'rejected' };
        }
        return req;
      }));
    } catch (err) {
      alert(`Помилка при спробі ${action === 'accept' ? 'прийняти' : 'відхилити'}`);
    }
  };

  const renderStatusBadge = (status) => {
    const styles = {
      padding: '4px 10px',
      borderRadius: '12px',
      fontSize: '0.85rem',
      fontWeight: 'bold',
      display: 'inline-block',
    };

    switch (status) {
      case 'pending':
        return <span style={{ ...styles, background: '#fff3cd', color: '#856404', border: '1px solid #ffeeba' }}>Очікує підтвердження</span>;
      case 'accepted':
        return <span style={{ ...styles, background: '#d4edda', color: '#155724', border: '1px solid #c3e6cb' }}>Прийнято</span>;
      case 'rejected':
        return <span style={{ ...styles, background: '#f8d7da', color: '#721c24', border: '1px solid #f5c6cb' }}>Відхилено</span>;
      default:
        return <span style={{ ...styles, background: '#e2e3e5', color: '#383d41' }}>{status}</span>;
    }
  };

  if (loading) return <div className="page-hero small"><div className="container center">Завантаження вашого кабінету...</div></div>;
  if (error) return <div className="page-hero small"><div className="container center" style={{color: 'red'}}>{error}</div></div>;

  return (
    <>
      <div className="page-hero small" style={{ background: '#f8f9fa', borderBottom: '1px solid #e9ecef' }}>
        <div className="container">
          <h1>Особистий кабінет</h1>
          <p className="lead small-muted">Керування профілем та заявками</p>
        </div>
      </div>

      <div className="page-content">
        <div className="container">

          <div className="card" style={{ marginBottom: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '15px' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.5rem' }}>{displayName}</h2>
                <div style={{ color: '#666', fontSize: '0.9rem' }}>
                  {userRole === 'mentor' ? 'Ментор' : 'Студент'}
                </div>
              </div>
              {!isEditing && (
                <button onClick={() => setIsEditing(true)} className="secondary-btn" style={{ fontSize: '0.9rem' }}>
                  Редагувати профіль
                </button>
              )}
            </div>

            {isEditing ? (
              <div style={{ background: '#fdfdfd', padding: '15px', borderRadius: '8px', border: '1px solid #eee' }}>
                {userRole === 'mentor' ? (
                  <>
                    <div className="form-group">
                      <label>Посада / Спеціалізація</label>
                      <input className="input" placeholder="Напр. Senior Python Dev" value={profile.title} onChange={e => setProfile({...profile, title: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label>Навички</label>
                      <input className="input" placeholder="Python, Django, Docker..." value={profile.skills} onChange={e => setProfile({...profile, skills: e.target.value})} />
                    </div>
                  </>
                ) : (
                  <div className="form-group">
                    <label>Мої інтереси</label>
                    <input className="input" placeholder="Веб-розробка, Кібербезпека..." value={profile.interests} onChange={e => setProfile({...profile, interests: e.target.value})} />
                  </div>
                )}

                <div className="form-group">
                  <label>Про мене</label>
                  <textarea className="input" rows="4" placeholder="Розкажіть трохи про себе..." value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})} />
                </div>

                <div className="form-group">
                  <label>Контакти (Telegram/Email)</label>
                  <input className="input" value={profile.contact} onChange={e => setProfile({...profile, contact: e.target.value})} />
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                  <button className="primary-btn" onClick={handleSave}>Зберегти зміни</button>
                  <button className="secondary-btn" onClick={() => setIsEditing(false)}>Скасувати</button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  {userRole === 'mentor' && (
                    <>
                      <div style={{ marginBottom: '10px' }}><strong style={{color:'#555'}}>Посада:</strong> <br/> {profile.title || <span style={{color:'#999'}}>- не вказано -</span>}</div>
                      <div style={{ marginBottom: '10px' }}><strong style={{color:'#555'}}>Навички:</strong> <br/> {profile.skills || <span style={{color:'#999'}}>- не вказано -</span>}</div>
                    </>
                  )}
                  {userRole === 'student' && (
                    <div style={{ marginBottom: '10px' }}><strong style={{color:'#555'}}>Інтереси:</strong> <br/> {profile.interests || <span style={{color:'#999'}}>- не вказано -</span>}</div>
                  )}
                  <div style={{ marginBottom: '10px' }}><strong style={{color:'#555'}}>Контакти:</strong> <br/> {profile.contact || <span style={{color:'#999'}}>- не вказано -</span>}</div>
                  <div style={{ marginBottom: '10px' }}><strong style={{color:'#555'}}>Локація:</strong> <br/> {profile.location || <span style={{color:'#999'}}>- не вказано -</span>}</div>
                </div>
                <div>
                  <strong style={{color:'#555'}}>Про мене:</strong>
                  <p style={{ marginTop: '5px', color: '#333', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                    {profile.bio || <span style={{color:'#999', fontStyle:'italic'}}>Користувач ще не додав інформацію про себе.</span>}
                  </p>
                </div>
              </div>
            )}
          </div>

          <h2 style={{ borderBottom: '2px solid #646cff', display: 'inline-block', paddingBottom: '5px', marginBottom: '20px' }}>
             {userRole === 'mentor' ? 'Вхідні заявки' : 'Мої надіслані заявки'}
          </h2>

          {requests.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '40px', color: '#777', background: '#f9f9f9', borderStyle: 'dashed' }}>
              <h3>Тут поки що порожньо</h3>
              <p>{userRole === 'mentor' ? 'Чекайте, поки студенти надішлють вам запит.' : 'Знайдіть ментора та надішліть йому заявку!'}</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {requests.map(req => (
                <div key={req.id} className="card" style={{
                  borderLeft: `5px solid ${req.status === 'pending' ? '#ffc107' : req.status === 'accepted' ? '#28a745' : '#dc3545'}`,
                  transition: 'transform 0.2s',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                        {renderStatusBadge(req.status)}
                        <span style={{ fontSize: '0.85rem', color: '#888' }}>ID заявки: #{req.id}</span>
                      </div>

                      <h3 style={{ margin: '0 0 10px 0', fontSize: '1.2rem' }}>
                        {userRole === 'mentor'
                          ? <span>Студент: <strong>{req.student_name || 'Невідомий'}</strong></span>
                          : <span>Ментор: <strong>{req.mentor_name || 'Невідомий'}</strong></span>
                        }
                      </h3>

                      <div style={{ background: '#f8f9fa', padding: '10px', borderRadius: '6px', border: '1px solid #eee' }}>
                        <strong style={{ fontSize: '0.9rem', color: '#555' }}>Повідомлення:</strong>
                        <p style={{ margin: '5px 0 0 0', fontStyle: 'italic', color: '#333' }}>"{req.message}"</p>
                      </div>
                    </div>

                    {userRole === 'mentor' && req.status === 'pending' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '150px' }}>
                        <button
                          className="primary-btn"
                          style={{ background: '#28a745', borderColor: '#28a745', width: '100%', display: 'flex', justifyContent: 'center', gap: '5px' }}
                          onClick={() => handleRequestAction(req.id, 'accept')}
                        >
                          Прийняти
                        </button>
                        <button
                          className="secondary-btn"
                          style={{ color: '#dc3545', borderColor: '#dc3545', width: '100%', display: 'flex', justifyContent: 'center', gap: '5px' }}
                          onClick={() => handleRequestAction(req.id, 'reject')}
                        >
                          Відхилити
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </>
  );
}

export default DashboardPage;