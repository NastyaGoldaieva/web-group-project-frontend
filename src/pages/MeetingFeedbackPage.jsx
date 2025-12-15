import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function MeetingFeedbackPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [attended, setAttended] = useState(null);
  const [liked, setLiked] = useState(null);
  const [cont, setCont] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await api.get(`meetings/${id}/`);
        setMeeting(res.data);
      } catch (err) {
        console.error(err);
        alert('Cannot load meeting');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleSubmit = async () => {
    if (attended === null || liked === null || cont === null) {
      alert('Please answer all questions');
      return;
    }
    setSubmitting(true);
    try {
      const resp = await api.post(`meetings/${id}/feedback/`, {
        attended, liked, continue: cont
      });
      if (resp.data.result === 'shared_whatsapp') {
        alert('Both agreed — WhatsApp links are available on your Sessions page');
        navigate('/sessions');
      } else if (resp.data.result === 'collaboration_ended') {
        alert('Both decided to stop collaboration. The student has been unpaired.');
        navigate('/sessions');
      } else {
        alert('Feedback saved');
        navigate('/sessions');
      }
    } catch (err) {
      console.error(err);
      alert('Error sending feedback');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="page-hero small"><div className="container center">Loading...</div></div>;
  if (!meeting) return <div className="page-hero small"><div className="container center">Meeting not found</div></div>;

  return (
    <>
      <div className="page-hero small">
        <div className="container">
          <h1>Опитування після зустрічі</h1>
          <p className="lead small-muted">Розкажіть, як пройшла сесія</p>
        </div>
      </div>

      <div className="page-content">
        <div className="container card">
          <div><strong>Meeting #{meeting.id}</strong></div>
          <div style={{marginTop:10}}><strong>Mentor:</strong> {meeting.mentor_username}</div>
          <div style={{marginTop:6}}><strong>Student:</strong> {meeting.student_username}</div>

          <div style={{marginTop:16}}>
            <div style={{marginBottom:12}}>
              <div>Чи відбулась зустріч?</div>
              <label style={{marginRight:10}}><input type="radio" name="attended" checked={attended === true} onChange={() => setAttended(true)} /> Так</label>
              <label><input type="radio" name="attended" checked={attended === false} onChange={() => setAttended(false)} /> Ні</label>
            </div>

            <div style={{marginBottom:12}}>
              <div>Чи сподобалась зустріч?</div>
              <label style={{marginRight:10}}><input type="radio" name="liked" checked={liked === true} onChange={() => setLiked(true)} /> Так</label>
              <label><input type="radio" name="liked" checked={liked === false} onChange={() => setLiked(false)} /> Ні</label>
            </div>

            <div style={{marginBottom:12}}>
              <div>Хочете продовжити співпрацю?</div>
              <label style={{marginRight:10}}><input type="radio" name="cont" checked={cont === true} onChange={() => setCont(true)} /> Так</label>
              <label><input type="radio" name="cont" checked={cont === false} onChange={() => setCont(false)} /> Ні</label>
            </div>

            <div style={{marginTop:16}}>
              <button onClick={handleSubmit} disabled={submitting} className="primary-btn">
                {submitting ? 'Надсилаю...' : 'Надіслати опитування'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}