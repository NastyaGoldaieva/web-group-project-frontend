import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';

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

  if (loading) return <div className="page-hero small"><div className="container center">Завантаження...</div></div>;
  if (!proposals.length) return <div className="page-hero small"><div className="container center">Поки що немає пропозицій</div></div>;

  return (
    <>
      <div className="page-hero small">
        <div className="container">
          <h1>Пропозиції щодо зустрічей</h1>
          <p className="lead small-muted">Переглядайте та керуйте вашими сесіями</p>
        </div>
      </div>

      <div className="page-content">
        <div className="container card">
          <div className="list-grid">
            {proposals.map(p => (
              <div key={p.id} className="item" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div>
                  <div style={{fontWeight:700}}>#{p.id} — {p.student_username} ⇄ {p.mentor_username}</div>
                  <div className="small-muted">Статус: <strong>{p.status}</strong></div>
                  <div style={{marginTop:8}}>
                    {(p.slots || []).slice(0,3).map((s, idx) => <div key={idx} className="small-muted">{toLocal(s.start)} — {toLocal(s.end)}</div>)}
                  </div>
                </div>
                <div>
                  <Link to={`/proposals/${p.id}`} className="primary-btn" style={{textDecoration:'none'}}>Відкрити</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default ProposalsPage;