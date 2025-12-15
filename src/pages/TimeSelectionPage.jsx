import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

function toLocal(dtIso) {
  try {
    return new Date(dtIso).toLocaleString();
  } catch {
    return dtIso;
  }
}

export default function TimeSelectionPage() {
  const { id } = useParams();
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedKey, setSelectedKey] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const userId = localStorage.getItem('user_id');
  const role = localStorage.getItem('role');

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await api.get(`proposals/${id}/`);
        setProposal(res.data);
        if (res.data.chosen_slot) setSelectedKey(`${res.data.chosen_slot.start}|${res.data.chosen_slot.end}`);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const meIsStudent = proposal ? String(proposal.student) === String(userId) && role === 'student' : false;

  const handleSelect = async () => {
    if (!selectedKey) {
      alert('Оберіть слот');
      return;
    }
    setSubmitting(true);
    try {
      const [start, end] = selectedKey.split('|');
      const resp = await api.post(`proposals/${id}/select/`, { chosen_slot: { start, end } });
      setProposal(resp.data);
      alert('Слот обрано. Чекайте підтвердження від ментора.');
      navigate('/sessions');
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.detail || 'Помилка вибору');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="page-hero small"><div className="container center">Завантаження...</div></div>;
  if (!proposal) return <div className="page-hero small"><div className="container center">Пропозиція не знайдена</div></div>;

  return (
    <>
      <div className="page-hero small">
        <div className="container">
          <h1>Вибір часу — Пропозиція #{proposal.id}</h1>
          <p className="lead small-muted">Оберіть зручний час для зустрічі</p>
        </div>
      </div>

      <div className="page-content">
        <div className="container card">
          <div style={{marginBottom:12}}>
            <strong>Ментор:</strong> {proposal.mentor_username}<br/>
            <strong>Студент:</strong> {proposal.student_username}
          </div>

          <div style={{marginTop:12}}>
            <h3>Доступні слоти</h3>
            <div className="list-grid">
              {(proposal.slots || []).map((s, idx) => {
                const key = `${s.start}|${s.end}`;
                const isSelected = selectedKey === key;
                return (
                  <div key={idx} className="item" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <div>{toLocal(s.start)} — {toLocal(s.end)}</div>
                    <div>
                      {meIsStudent && proposal.status === 'pending' ? (
                        <button onClick={() => setSelectedKey(key)} className={`secondary-btn`} style={{background: isSelected ? '#6b21a8' : ''}}>
                          {isSelected ? 'Оберено' : 'Оберіть'}
                        </button>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{marginTop:16}}>
            {meIsStudent && proposal.status === 'pending' ? (
              <button onClick={handleSelect} disabled={!selectedKey || submitting} className="primary-btn">
                {submitting ? 'Обробка...' : 'Підтвердити вибір'}
              </button>
            ) : <div className="small-muted">Чекайте, поки ментор надасть слоти або підтвердить вибір.</div>}
          </div>
        </div>
      </div>
    </>
  );
}