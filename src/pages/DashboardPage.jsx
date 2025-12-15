import { useEffect, useState } from 'react';
import api from '../api/axios';

function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [username, setUsername] = useState('');

  const [profile, setProfile] = useState({
    bio: '', interests: '', skills: '', title: '', contact: '', location: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const userRes = await api.get('auth/me/');
        setUserRole(userRes.data.role);
        setUsername(userRes.data.username);
        const endpoint = userRes.data.role === 'mentor' ? 'mentors/me/' : 'students/me/';
        const profileRes = await api.get(endpoint);
        setProfile(profileRes.data);
      } catch (err) {
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

  if (loading) return <div className="page-hero small"><div className="container center">Завантаження...</div></div>;
  if (error) return <div className="page-hero small"><div className="container center">{error}</div></div>;

  return (
    <>
      <div className="page-hero small">
        <div className="container">
          <h1>Кабінет</h1>
          <p className="lead small-muted">Ваші профілі та налаштування</p>
        </div>
      </div>

      <div className="page-content">
        <div className="container card">
          <div style={{display:'flex',alignItems:'center',gap:20,marginBottom:10}}>
            <div>
              <h2 style={{margin:0}}>{username}</h2>
              <div className="small-muted">{userRole === 'mentor' ? 'Ментор' : 'Студент'}</div>
            </div>
            {!isEditing && <button onClick={() => setIsEditing(true)} style={{marginLeft:'auto'}} className="secondary-btn">Редагувати</button>}
          </div>

          {isEditing ? (
            <div>
              {userRole === 'mentor' ? (
                <>
                  <div className="form-group">
                    <label>Посада</label>
                    <input className="input" value={profile.title} onChange={e => setProfile({...profile, title: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Навички</label>
                    <input className="input" value={profile.skills} onChange={e => setProfile({...profile, skills: e.target.value})} />
                  </div>
                </>
              ) : (
                <div className="form-group">
                  <label>Інтереси</label>
                  <input className="input" value={profile.interests} onChange={e => setProfile({...profile, interests: e.target.value})} />
                </div>
              )}

              <div className="form-group">
                <label>Про мене</label>
                <textarea className="input" value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})} />
              </div>

              <div className="form-group">
                <label>Контакти</label>
                <input className="input" value={profile.contact} onChange={e => setProfile({...profile, contact: e.target.value})} />
              </div>

              <div style={{display:'flex',gap:10,marginTop:12}}>
                <button className="primary-btn" onClick={handleSave}>Зберегти</button>
                <button className="secondary-btn" onClick={() => setIsEditing(false)}>Скасувати</button>
              </div>
            </div>
          ) : (
            <div>
              {userRole === 'mentor' && (
                <>
                  <div style={{marginBottom:10}}><strong>Посада:</strong> {profile.title || '-'}</div>
                  <div style={{marginBottom:10}}><strong>Навички:</strong> {profile.skills || '-'}</div>
                </>
              )}
              {userRole === 'student' && (
                <div style={{marginBottom:10}}><strong>Інтереси:</strong> {profile.interests || '-'}</div>
              )}
              <div style={{marginTop:12}}>
                <strong>Про мене:</strong>
                <p className="small-muted">{profile.bio || 'Інформація відсутня'}</p>
              </div>
              <div style={{marginTop:8}}><strong>Контакти:</strong> {profile.contact || '-'}</div>
              <div style={{marginTop:8}}><strong>Локація:</strong> {profile.location || '-'}</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default DashboardPage;