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
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  const fetchProposal = async () => {
    try {
      const res = await api.get(`proposals/${id}/`);
      setProposal(res.data);
    } catch (err) {
      console.error(err);
      alert('Не вдалося завантажити пропозицію.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProposal(); }, [id]);

  const handleSelect = async () => {
    if (!selected) {
      alert('Оберіть слот.');
      return;
    }
    try {
      await api.post(`proposals/${id}/select/`, { chosen_slot: selected });
      alert('Слот обрано. Чекайте підтвердження від ментора.');
      fetchProposal();
    } catch (err) {
      console.error(err);
      alert('Помилка вибору слоту.');
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

  const meIsStudent = proposal.student === parseInt(localStorage.getItem('user_id')) || false;

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
            const isChosen = proposal.chosen_slot && proposal.chosen_slot.start === s.start;
            return (
              <div key={idx} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: 10, borderRadius: 8, border: isChosen ? '2px solid #4f46e5' : '1px solid #eee',
                background: isChosen ? '#eef2ff' : 'white'
              }}>
                <div>{toLocal(s.start)} — {toLocal(s.end)}</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  { proposal.status === 'pending' ? (
                    <button onClick={() => setSelected(s)} style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #ddd' }}>
                      Обрати
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
        {proposal.status === 'pending' ? (
          <div>
            <button onClick={handleSelect} style={{ padding: '10px 14px', background: '#10b981', color: 'white', borderRadius: 8, border: 'none' }}>
              Обрати слот
            </button>
          </div>
        ) : null}

        {proposal.status === 'student_chosen' ? (
          <div style={{ display: 'flex', gap: 8 }}>
            <div>
              <strong>Обраний слот:</strong> {proposal.chosen_slot ? `${toLocal(proposal.chosen_slot.start)} — ${toLocal(proposal.chosen_slot.end)}` : '—'}
            </div>
            <div>
              <button onClick={handleConfirm} style={{ padding: '10px 14px', background: '#4f46e5', color: 'white', borderRadius: 8, border: 'none' }}>
                Підтвердити (для ментора)
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