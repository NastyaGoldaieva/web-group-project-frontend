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

  if (loading) return <div style={{ textAlign: 'center', marginTop: 50 }}>Завантаження...</div>;
  if (!proposal) return <div style={{ padding: 20 }}>Пропозиція не знайдена</div>;

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: '0 auto' }}>
      <h2>Вибір часу для зустрічі #{proposal.id}</h2>
      <p><strong>Ментор:</strong> {proposal.mentor_username}</p>
      <p><strong>Студент:</strong> {proposal.student_username}</p>
      <div style={{ marginTop: 12 }}>
        <h4>Доступні слоти</h4>
        <div style={{ display: 'grid', gap: 8 }}>
          {(proposal.slots || []).map((s, idx) => {
            const key = `${s.start}|${s.end}`;
            const isSelected = selectedKey === key;
            return (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12, borderRadius: 8, border: isSelected ? '2px solid #4f46e5' : '1px solid #eee', background: isSelected ? '#eef2ff' : 'white' }}>
                <div>{toLocal(s.start)} — {toLocal(s.end)}</div>
                <div>
                  {meIsStudent && proposal.status === 'pending' ? (
                    <button onClick={() => setSelectedKey(key)} style={{ padding: '8px 12px', borderRadius: 8, background: isSelected ? '#6b21a8' : '#4f46e5', color: '#fff', border: 'none' }}>
                      {isSelected ? 'Оберено' : 'Оберіть'}
                    </button>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ marginTop: 16 }}>
        {meIsStudent && proposal.status === 'pending' ? (
          <button onClick={handleSelect} disabled={!selectedKey || submitting} style={{ padding: '10px 14px', background: !selectedKey ? '#9ee0bf' : '#10b981', color: '#fff', border: 'none', borderRadius: 8 }}>
            {submitting ? 'Обробка...' : 'Підтвердити вибір'}
          </button>
        ) : (
          <div style={{ color: '#666' }}>Чекайте, поки ментор надасть слоти або підтвердить вибір.</div>
        )}
      </div>
    </div>
  );
}