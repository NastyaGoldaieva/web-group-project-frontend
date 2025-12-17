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

  if (loading) return <div style={{ textAlign: 'center', marginTop: 50 }}>Loading...</div>;
  if (!meeting) return <div style={{ padding: 20 }}>Meeting not found</div>;

  return (
    <div style={{ padding: 20, maxWidth: 700, margin: '0 auto' }}>
      <h2>Feedback for meeting #{meeting.id}</h2>
      <p><strong>Mentor:</strong> {meeting.mentor_username}</p>
      <p><strong>Student:</strong> {meeting.student_username}</p>

      <div style={{ marginTop: 16 }}>
        <div style={{ marginBottom: 12 }}>
          <div>Did the meeting happen?</div>
          <label><input type="radio" name="attended" checked={attended === true} onChange={() => setAttended(true)} /> Yes</label>
          <label style={{ marginLeft: 10 }}><input type="radio" name="attended" checked={attended === false} onChange={() => setAttended(false)} /> No</label>
        </div>

        <div style={{ marginBottom: 12 }}>
          <div>Did you like the meeting?</div>
          <label><input type="radio" name="liked" checked={liked === true} onChange={() => setLiked(true)} /> Yes</label>
          <label style={{ marginLeft: 10 }}><input type="radio" name="liked" checked={liked === false} onChange={() => setLiked(false)} /> No</label>
        </div>

        <div style={{ marginBottom: 12 }}>
          <div>Do you want to continue collaboration?</div>
          <label><input type="radio" name="cont" checked={cont === true} onChange={() => setCont(true)} /> Yes</label>
          <label style={{ marginLeft: 10 }}><input type="radio" name="cont" checked={cont === false} onChange={() => setCont(false)} /> No</label>
        </div>

        <div style={{ marginTop: 16 }}>
          <button onClick={handleSubmit} disabled={submitting} style={{ padding: '10px 14px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 8 }}>
            {submitting ? 'Sending...' : 'Submit feedback'}
          </button>
        </div>
      </div>
    </div>
  );
}