import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Link, useNavigate } from 'react-router-dom';

function toLocal(dtIso) {
  try {
    return new Date(dtIso).toLocaleString();
  } catch {
    return dtIso;
  }
}

function ProposalsPage() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('proposals/');
        setProposals(res.data);
      } catch (err) {
        console.error(err);
        alert('Не вдалося завантажити пропозиції.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', marginTop: 50 }}>Завантаження...</div>;
  if (!proposals.length) return <div style={{ padding: 20 }}>Поки що немає пропозицій</div>;

  return (
    <div style={{ padding: 20, maxWidth: 1000, margin: '20px auto' }}>
      <h2>Пропозиції щодо зустрічей</h2>
      <div style={{ display: 'grid', gap: 12 }}>
        {proposals.map(p => (
          <div key={p.id} style={{ border: '1px solid #eee', padding: 14, borderRadius: 8, background: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <strong>#{p.id}</strong> — {p.student_username} ⇄ {p.mentor_username}
                <div style={{ marginTop: 8 }}>
                  Статус: <span style={{ fontWeight: 700 }}>{p.status}</span>
                </div>
              </div>
              <div>
                <Link to={`/proposals/${p.id}`} style={{ padding: '8px 12px', background: '#4f46e5', color: 'white', borderRadius: 8, textDecoration: 'none' }}>
                  Відкрити
                </Link>
              </div>
            </div>

            <div style={{ marginTop: 10 }}>
              <strong>Запропоновані слоти:</strong>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                { (p.slots || []).slice(0,5).map((s, idx) => (
                  <div key={idx} style={{ padding: '6px 8px', borderRadius: 6, background: '#f3f4f6', fontSize: 13 }}>
                    {toLocal(s.start)} — {toLocal(s.end)}
                  </div>
                )) }
                { (p.slots || []).length > 5 ? <div style={{ alignSelf: 'center' }}>... і ще { (p.slots || []).length - 5 }</div> : null }
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProposalsPage;