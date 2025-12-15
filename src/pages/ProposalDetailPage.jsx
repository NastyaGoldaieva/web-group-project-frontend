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

  if (loading) return <div style={{ textAlign: 'center', marginTop: 50 }}>Завантаження...</div>;
  if (!proposal) return <div style={{ padding: 20 }}>Пропозиція не знайдена</div>;

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: '20px auto' }}>
      <h2>Пропозиція #{proposal.id}</h2>
      <p><strong>Студент:</strong> {proposal.student_username}</p>
      <p><strong>Ментор:</strong> {proposal.mentor_username}</p>
      <p><strong>Статус:</strong> {proposal.status}</p>

      <div style={{ marginTop: 16 }}>
        <h4>Слоти</h4>
        <div style={{ display: 'grid', gap: 8 }}>
          { (proposal.slots || []).map((s, idx) => {
            const key = `${s.start}|${s.end}`;
            const isChosen = proposal.chosen_slot && proposal.chosen_slot.start === s.start && proposal.chosen_slot.end === s.end;
            const isSelectedLocal = selectedKey === key;
            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 10,
                  borderRadius: 8,
                  border: isChosen || isSelectedLocal ? '2px solid #4f46e5' : '1px solid #eee',
                  background: isChosen || isSelectedLocal ? '#eef2ff' : 'white',
                  userSelect: 'none'
                }}
              >
                <div>{toLocal(s.start)} — {toLocal(s.end)}</div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  { proposal.status === 'pending' && meIsStudent ? (
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setSelectedKey(key); }}
                      style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #ddd', cursor: 'pointer' }}
                      disabled={submitting}
                    >
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

      <div style={{ marginTop: 18 }}>
        {proposal.status === 'pending' && meIsStudent ? (
          <div>
            <button onClick={handleSelect} disabled={submitting || !selectedKey} style={{ padding: '10px 14px', background: submitting || !selectedKey ? '#9ee0bf' : '#10b981', color: 'white', borderRadius: 8, border: 'none', cursor: submitting || !selectedKey ? 'not-allowed' : 'pointer' }}>
              {submitting ? 'Обробка...' : 'Обрати слот'}
            </button>
          </div>
        ) : null}

        {proposal.status === 'student_chosen' && meIsMentor ? (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div>
              <strong>Обраний слот:</strong> {proposal.chosen_slot ? `${toLocal(proposal.chosen_slot.start)} — ${toLocal(proposal.chosen_slot.end)}` : '—'}
            </div>
            <div>
              <button onClick={handleConfirm} style={{ padding: '10px 14px', background: '#4f46e5', color: 'white', borderRadius: 8, border: 'none', cursor: 'pointer' }}>
                Підтвердити
              </button>
            </div>
          </div>
        ) : null}

        {proposal.status === 'confirmed' ? (
          <div style={{ marginTop: 12 }}>
            <strong>Статус:</strong> Підтверджено. Подивіться Meetings.
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default ProposalDetailPage;
