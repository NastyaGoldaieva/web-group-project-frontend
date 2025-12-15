import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

function toLocal(dtIso) {
  try {
    return new Date(dtIso).toLocaleString();
  } catch {
    return dtIso;
  }
}

export default function SessionsPage() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const role = localStorage.getItem('role');
  const userId = localStorage.getItem('user_id');

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await api.get('proposals/');
        setProposals(res.data);
      } catch (err) {
        console.error(err);
        setProposals([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', marginTop: 50 }}>Завантаження...</div>;
  if (!proposals.length) return <div style={{ padding: 20 }}>У вас поки немає активних сесій.</div>;

  return (
    <div style={{ padding: 20, maxWidth: 1000, margin: '0 auto' }}>
      <h2>Мої сесії</h2>
      <div style={{ display: 'grid', gap: 12 }}>
        {proposals.map(p => {
          const amMentor = role === 'mentor' && String(p.mentor) === String(userId);
          const amStudent = role === 'student' && String(p.student) === String(userId);
          return (
            <div key={p.id} style={{ border: '1px solid #eee', padding: 14, borderRadius: 8, background: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 700 }}>#{p.id} — {p.student_username} ⇄ {p.mentor_username}</div>
                <div style={{ marginTop: 6 }}>Статус: <span style={{ fontWeight: 700 }}>{p.status}</span></div>
                <div style={{ marginTop: 8 }}>
                  {p.chosen_slot ? (
                    <div>Обраний слот: {toLocal(p.chosen_slot.start)} — {toLocal(p.chosen_slot.end)}</div>
                  ) : null}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {amMentor ? (
                  <>
                    <Link to={`/mentor/proposals/${p.id}`} style={{ padding: '8px 12px', background: '#4f46e5', color: '#fff', borderRadius: 8, textDecoration: 'none' }}>Керувати</Link>
                    {p.status === 'student_chosen' ? (
                      <button onClick={() => navigate(`/proposals/${p.id}`)} style={{ padding: '8px 12px', background: '#10b981', color: '#fff', borderRadius: 8, border: 'none' }}>Підтвердити</button>
                    ) : null}
                  </>
                ) : null}
                {amStudent ? (
                  <>
                    <Link to={`/proposals/${p.id}`} style={{ padding: '8px 12px', background: '#4f46e5', color: '#fff', borderRadius: 8, textDecoration: 'none' }}>Відкрити</Link>
                    {p.status === 'pending' ? (
                      <Link to={`/sessions/${p.id}/select`} style={{ padding: '8px 12px', background: '#10b981', color: '#fff', borderRadius: 8, textDecoration: 'none' }}>Оберіть час</Link>
                    ) : null}
                  </>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}