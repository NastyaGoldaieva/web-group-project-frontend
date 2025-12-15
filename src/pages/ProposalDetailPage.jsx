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

function ProposalDetailPage() {
  const { id } = useParams();
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedKey, setSelectedKey] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const fetchProposal = async () => {
    try {
      setLoading(true);
      const res = await api.get(`proposals/${id}/`);
      setProposal(res.data);
      if (res.data.chosen_slot) {
        setSelectedKey(`${res.data.chosen_slot.start}|${res.data.chosen_slot.end}`);
      } else {
        setSelectedKey(null);
      }
    } catch (err) {
      console.error(err);
      alert('Не вдалося завантажити пропозицію.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProposal(); }, [id]);

  const role = localStorage.getItem('role');
  const userId = localStorage.getItem('user_id');
  const meIsStudent = proposal ? String(proposal.student) === String(userId) && role === 'student' : false;
  const meIsMentor = proposal ? String(proposal.mentor) === String(userId) && role === 'mentor' : false;

  const handleSelect = async () => {
    if (!selectedKey) {
      alert('Оберіть слот.');
      return;
    }
    setSubmitting(true);
    try {
      const [start, end] = selectedKey.split('|');
      const resp = await api.post(`proposals/${id}/select/`, { chosen_slot: { start, end } });
      setProposal(resp.data);
      alert('Слот обрано. Чекайте підтвердження від ментора.');
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.detail || 'Помилка вибору слоту.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirm = async () => {
    try {
      const res = await api.post(`proposals/${id}/confirm/`);
      alert('Зустріч підтверджено.');
      navigate('/proposals');
    } catch (err) {
      console.error(err);
      alert('Помилка підтвердження.');
    }
  };

  if (loading) return <div className="page-hero small"><div className="container center">Завантаження...</div></div>;
  if (!proposal) return <div className="page-hero small"><div className="container center">Пропозиція не знайдена</div></div>;

  return (
    <>
      <div className="page-hero small">
        <div className="container">
          <h1>Пропозиція #{proposal.id}</h1>
          <p className="lead small-muted">Керування слотами та статусом зустрічі</p>
        </div>
      </div>

      <div className="page-content">
        <div className="container card">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div>
              <div className="small-muted"><strong>Студент:</strong> {proposal.student_username}</div>
              <div className="small-muted"><strong>Ментор:</strong> {proposal.mentor_username}</div>
            </div>
            <div><strong>Статус:</strong> {proposal.status}</div>
          </div>

          <div style={{marginTop:18}}>
            <h3 style={{marginBottom:8}}>Слоти</h3>
            <div className="list-grid">
              { (proposal.slots || []).map((s, idx) => {
                const key = `${s.start}|${s.end}`;
                const isChosen = proposal.chosen_slot && proposal.chosen_slot.start === s.start && proposal.chosen_slot.end === s.end;
                const isSelectedLocal = selectedKey === key;
                return (
                  <div key={idx} className="item" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <div>{toLocal(s.start)} — {toLocal(s.end)}</div>
                    <div style={{display:'flex',gap:8,alignItems:'center'}}>
                      { proposal.status === 'pending' && meIsStudent ? (
                        <button type="button" onClick={() => setSelectedKey(key)} className="secondary-btn" disabled={submitting}>
                          {isSelectedLocal ? 'Обрано' : 'Обрати'}
                        </button>
                      ) : null }
                      { isChosen ? <span style={{ color: '#4f46e5', fontWeight: 700 }}>Обр.</span> : null }
                    </div>
                  </div>
                );
              }) }
            </div>
          </div>

          <div style={{marginTop:18}}>
            {proposal.status === 'pending' && meIsStudent ? (
              <div>
                <button onClick={handleSelect} disabled={submitting || !selectedKey} className="primary-btn">
                  {submitting ? 'Обробка...' : 'Обрати слот'}
                </button>
              </div>
            ) : null}

            {proposal.status === 'student_chosen' && meIsMentor ? (
              <div style={{display:'flex',gap:10,alignItems:'center'}}>
                <div><strong>Обраний слот:</strong> {proposal.chosen_slot ? `${toLocal(proposal.chosen_slot.start)} — ${toLocal(proposal.chosen_slot.end)}` : '—'}</div>
                <div><button onClick={handleConfirm} className="primary-btn">Підтвердити</button></div>
              </div>
            ) : null}

            {proposal.status === 'confirmed' ? (
              <div style={{ marginTop: 12 }}>
                <strong>Статус:</strong> Підтверджено. Подивіться Meetings.
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}

export default ProposalDetailPage;