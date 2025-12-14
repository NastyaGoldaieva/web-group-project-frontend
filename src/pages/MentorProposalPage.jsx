import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

function isoToDateTimeParts(iso) {
  try {
    const d = new Date(iso);
    const pad = (n) => String(n).padStart(2, '0');
    const year = d.getFullYear();
    const month = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    const hours = pad(d.getHours());
    const minutes = pad(d.getMinutes());
    return { date: `${year}-${month}-${day}`, start: `${hours}:${minutes}` };
  } catch {
    return { date: '', start: '' };
  }
}

function MentorProposalPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [slots, setSlots] = useState([{ date: '', start: '', end: '' }]);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [studentName, setStudentName] = useState('');

  useEffect(() => {
    const fetchProposal = async () => {
      try {
        setLoading(true);
        const res = await api.get(`proposals/${id}/`);
        setProposal(res.data);
        const existing = res.data.slots || [];
        if (existing.length) {
          const mapped = existing.map(s => {
            const startParts = isoToDateTimeParts(s.start);
            const endParts = isoToDateTimeParts(s.end);
            return { date: startParts.date || endParts.date, start: startParts.start, end: endParts.start };
          });
          setSlots(mapped);
        }
        if (res.data.student_username) {
          setStudentName(res.data.student_username);
        } else if (res.data.student && typeof res.data.student === 'object' && res.data.student.username) {
          setStudentName(res.data.student.username);
        } else if (res.data.student) {
          try {
            const st = await api.get(`students/${res.data.student}/`);
            if (st.data && st.data.user && st.data.user.username) {
              setStudentName(st.data.user.username);
            } else if (st.data && st.data.user) {
              setStudentName(String(st.data.user));
            } else {
              setStudentName(String(res.data.student));
            }
          } catch {
            setStudentName(String(res.data.student));
          }
        }
      } catch (err) {
        setError('Не вдалося завантажити пропозицію. Перевірте консоль або мережеві запити.');
      } finally {
        setLoading(false);
      }
    };
    fetchProposal();
  }, [id]);

  const updateSlot = (idx, field, value) => {
    const copy = slots.slice();
    copy[idx] = { ...copy[idx], [field]: value };
    setSlots(copy);
  };

  const addSlot = () => setSlots(s => [...s, { date: '', start: '', end: '' }]);
  const removeSlot = (idx) => setSlots(s => s.filter((_, i) => i !== idx));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const valid = slots
      .map(s => ({ date: s.date?.trim(), start: s.start?.trim(), end: s.end?.trim() }))
      .filter(s => s.date && s.start && s.end);
    if (!valid.length) {
      setError('Додайте щонайменше один повний слот (дата, початок і кінець).');
      return;
    }
    const toSend = [];
    for (const s of valid) {
      try {
        const startISO = new Date(`${s.date}T${s.start}`).toISOString();
        const endISO = new Date(`${s.date}T${s.end}`).toISOString();
        if (isNaN(new Date(startISO)) || isNaN(new Date(endISO)) || new Date(startISO) >= new Date(endISO)) {
          setError('Один або кілька слотів мають некоректні дати/часи або початок пізніше/дорівнює кінцю.');
          return;
        }
        toSend.push({ start: startISO, end: endISO });
      } catch {
        setError('Помилка при перетворенні дат. Використовуйте коректний формат.');
        return;
      }
    }
    setSubmitting(true);
    try {
      await api.post(`proposals/${id}/propose_slots/`, { slots: toSend });
      window.alert('Слоти надіслані студенту.');
      navigate('/proposals');
    } catch (err) {
      setError(err?.response?.data?.detail || 'Не вдалося надіслати слоти.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{ padding: 20 }}>Завантаження...</div>;
  if (error) return <div style={{ padding: 20, color: 'red' }}>{error}</div>;
  if (!proposal) return <div style={{ padding: 20 }}>Пропозиція не знайдена.</div>;

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: '0 auto' }}>
      <h2>Пропозиція #{proposal.id}</h2>
      <p><strong>Студент:</strong> {studentName || String(proposal.student)}</p>

      <form onSubmit={handleSubmit}>
        <h3>Вкажіть зручні для вас слоти</h3>
        <p>Вкажіть дату та час початку й кінця для кожного слоту.</p>
        {slots.map((s, idx) => (
          <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 120px 120px 80px', gap: 8, marginBottom: 8, alignItems: 'center' }}>
            <input
              type="date"
              value={s.date}
              onChange={(e) => updateSlot(idx, 'date', e.target.value)}
              style={{ padding: 8 }}
            />
            <input
              type="time"
              value={s.start}
              onChange={(e) => updateSlot(idx, 'start', e.target.value)}
              style={{ padding: 8 }}
            />
            <input
              type="time"
              value={s.end}
              onChange={(e) => updateSlot(idx, 'end', e.target.value)}
              style={{ padding: 8 }}
            />
            {slots.length > 1 ? (
              <button type="button" onClick={() => removeSlot(idx)} style={{ padding: '6px 10px' }}>
                Видалити
              </button>
            ) : (
              <div />
            )}
          </div>
        ))}

        <div style={{ marginTop: 10 }}>
          <button type="button" onClick={addSlot} style={{ marginRight: 8, padding: '8px 12px' }}>Додати слот</button>
          <button type="submit" disabled={submitting} style={{ padding: '8px 14px' }}>
            {submitting ? 'Відправляється...' : 'Надіслати слоти студенту'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default MentorProposalPage;