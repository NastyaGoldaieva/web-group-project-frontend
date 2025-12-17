import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';

function toLocal(dtIso) {
  try {
    return new Date(dtIso).toLocaleString('uk-UA', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
  } catch {
    return dtIso;
  }
}

function ProposalsPage() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div className="page-hero small"><div className="container center">Завантаження пропозицій...</div></div>;

  return (
    <>
      <div className="page-hero small">
        <div className="container">
          <h1>Пропозиції зустрічей</h1>
          <p className="lead small-muted">Узгодження часу та сесій</p>
        </div>
      </div>

      <div className="page-content">
        <div className="container">
          {!proposals.length ? (
             <div className="card" style={{ textAlign: 'center', padding: '40px' }}>Поки що немає активних пропозицій.</div>
          ) : (
            <div style={{ display: 'grid', gap: '20px' }}>
              {proposals.map(p => (
                <div key={p.id} className="card" style={{ borderLeft: '5px solid #646cff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                  <div>
                    <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '5px' }}>Пропозиція #{p.id}</div>
                    <h3 style={{ margin: '0 0 10px 0' }}>
                      {p.student_username} <span style={{ color: '#aaa', margin: '0 5px' }}>-</span> {p.mentor_username}
                    </h3>

                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <span style={{ background: '#eee', padding: '4px 8px', borderRadius: '4px', fontSize: '0.9rem' }}>
                        Статус: <strong>{p.status}</strong>
                      </span>
                      {p.slots && p.slots.length > 0 && (
                        <span style={{ fontSize: '0.9rem', color: '#555' }}>
                          (Слотів запропоновано: {p.slots.length})
                        </span>
                      )}
                    </div>
                  </div>

                  <Link to={`/proposals/${p.id}`} className="primary-btn" style={{ textDecoration: 'none', padding: '10px 25px' }}>
                    Відкрити деталі
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ProposalsPage;