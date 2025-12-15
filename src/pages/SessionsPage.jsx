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

  if (loading) return <div className="page-hero small"><div className="container center">Завантаження...</div></div>;
  if (!proposals.length) return <div className="page-hero small"><div className="container center">У вас поки немає активних сесій.</div></div>;

  return (
    <>
      <div className="page-hero small">
        <div className="container">
          <h1>Мої сесії</h1>
          <p className="lead small-muted">Усі ваші пропозиції та зустрічі в одному місці</p>
        </div>
      </div>

      <div className="page-content">
        <div className="container card">
          <div className="list-grid">
            {proposals.map(p => {
              const amMentor = role === 'mentor' && String(p.mentor) === String(userId);
              const amStudent = role === 'student' && String(p.student) === String(userId);
              const ended = p.chosen_slot && new Date(p.chosen_slot.end) < new Date();
              const needsFeedback = ended && p.status === 'confirmed';
              return (
                <div key={p.id} className="item" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div>
                    <div style={{fontWeight:700}}>#{p.id} — {p.student_username} ⇄ {p.mentor_username}</div>
                    <div className="small-muted">Статус: <strong>{p.status}</strong></div>
                    {p.chosen_slot ? <div className="small-muted" style={{marginTop:8}}>Обраний слот: {toLocal(p.chosen_slot.start)} — {toLocal(p.chosen_slot.end)}</div> : null}
                  </div>
                  <div style={{display:'flex',gap:8,alignItems:'center'}}>
                    {amMentor ? <Link to={`/mentor/proposals/${p.id}`} className="primary-btn" style={{textDecoration:'none'}}>Змінити</Link> : null}
                    {amStudent ? <Link to={`/proposals/${p.id}`} className="primary-btn" style={{textDecoration:'none'}}>Відкрити</Link> : null}
                    {needsFeedback ? <Link to={`/meetings/${p.id}/feedback`} className="secondary-btn" style={{textDecoration:'none'}}>Give feedback</Link> : null}
                    {p.whatsapp_shared ? (
                      <a href={role === 'mentor' ? p.student_whatsapp : p.mentor_whatsapp} target="_blank" rel="noreferrer" className="primary-btn" style={{background:'#25D366',textDecoration:'none'}}>WhatsApp</a>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}