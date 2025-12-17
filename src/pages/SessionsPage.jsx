import React, { useEffect, useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useGoogleLogin } from '@react-oauth/google'
function toLocal(dtIso) {
  try {
    return new Date(dtIso).toLocaleString()
  } catch {
    return dtIso
  }
}
function toUTCStringForGoogle(iso) {
  const d = new Date(iso)
  const pad = (n) => String(n).padStart(2, '0')
  const y = d.getUTCFullYear()
  const m = pad(d.getUTCMonth() + 1)
  const day = pad(d.getUTCDate())
  const hh = pad(d.getUTCHours())
  const mm = pad(d.getUTCMinutes())
  const ss = pad(d.getUTCSeconds())
  return `${y}${m}${day}T${hh}${mm}${ss}Z`
}
export default function SessionsPage() {
  const [proposals, setProposals] = useState([])
  const [loading, setLoading] = useState(true)
  const [pendingProposal, setPendingProposal] = useState(null)
  const navigate = useNavigate()
  const role = localStorage.getItem('role')
  const userId = localStorage.getItem('user_id')
  const fetchProposals = useCallback(async () => {
    try {
      setLoading(true)
      const res = await api.get('proposals/')
      const data = res.data
      const items = data && data.results ? data.results : data
      setProposals(items || [])
    } catch (err) {
      console.error(err)
      setProposals([])
    } finally {
      setLoading(false)
    }
  }, [])
  useEffect(() => {
    fetchProposals()
  }, [fetchProposals])
  useEffect(() => {
    const handler = (e) => {
      try {
        const msg = e.detail || {}
        const ev = msg.event || (msg.data && msg.data.event) || null
        if (!ev) {
          fetchProposals()
          return
        }
        const interesting = [
          'proposal_confirmed',
          'mentor_proposed_slots',
          'student_chosen_slot',
          'chosen_cleared',
          'request_accepted_need_slots',
          'request_rejected',
          'new_request'
        ]
        if (interesting.includes(ev)) {
          fetchProposals()
        }
      } catch (err) {
        fetchProposals()
      }
    }
    window.addEventListener('dataUpdated', handler)
    return () => window.removeEventListener('dataUpdated', handler)
  }, [fetchProposals])
  const now = new Date()
  const createICS = (p) => {
    const pad = (n) => String(n).padStart(2, '0')
    const toUTC = (iso) => {
      const d = new Date(iso)
      const y = d.getUTCFullYear()
      const m = pad(d.getUTCMonth() + 1)
      const day = pad(d.getUTCDate())
      const hh = pad(d.getUTCHours())
      const mm = pad(d.getUTCMinutes())
      const ss = pad(d.getUTCSeconds())
      return `${y}${m}${day}T${hh}${mm}${ss}Z`
    }
    const dtstart = p.chosen_slot ? toUTC(p.chosen_slot.start) : ''
    const dtend = p.chosen_slot ? toUTC(p.chosen_slot.end) : ''
    const uid = `meeting-${p.id}@mentormatch`
    const title = `Meeting #${p.id}: ${p.student_username} ⇄ ${p.mentor_username}`
    const description = `Meet link: ${p.meet_link || ''}`
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//MentorMatch//EN',
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${toUTC(new Date().toISOString())}`,
      dtstart ? `DTSTART:${dtstart}` : '',
      dtend ? `DTEND:${dtend}` : '',
      `SUMMARY:${title}`,
      `DESCRIPTION:${description}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].filter(Boolean).join('\r\n')
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `meeting-${p.id}.ics`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const accessToken = tokenResponse.access_token
        if (!accessToken || !pendingProposal) {
          alert('Google access token not available')
          return
        }
        const p = pendingProposal
        const event = {
          summary: `Meeting #${p.id}: ${p.student_username} ⇄ ${p.mentor_username}`,
          location: p.meet_link || '',
          description: `Meet link: ${p.meet_link || ''}`,
          start: { dateTime: p.chosen_slot ? p.chosen_slot.start : new Date().toISOString(), timeZone: 'UTC' },
          end: { dateTime: p.chosen_slot ? p.chosen_slot.end : new Date().toISOString(), timeZone: 'UTC' }
        }
        const resp = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
          method: 'POST',
          headers: { Authorization: 'Bearer ' + accessToken, 'Content-Type': 'application/json' },
          body: JSON.stringify(event)
        })
        if (resp.ok) {
          alert('Подія додана у ваш Google Calendar')
          setPendingProposal(null)
        } else {
          const data = await resp.json()
          console.error('Google API error', data)
          alert('Не вдалося створити подію в Google. Завантажу .ics файл.')
          createICS(p)
          setPendingProposal(null)
        }
      } catch (e) {
        console.error(e)
        alert('Помилка при додаванні події. Буде завантажено .ics.')
        if (pendingProposal) createICS(pendingProposal)
        setPendingProposal(null)
      }
    },
    onError: () => {
      alert('Не вдалось авторизуватися в Google')
      if (pendingProposal) createICS(pendingProposal)
      setPendingProposal(null)
    },
    scope: 'https://www.googleapis.com/auth/calendar.events',
    flow: 'implicit'
  })
  const openGoogleCreate = (p) => {
    if (!p.chosen_slot) {
      alert('Час зустрічі не задано')
      return
    }
    const start = toUTCStringForGoogle(p.chosen_slot.start)
    const end = toUTCStringForGoogle(p.chosen_slot.end)
    const title = `Meeting #${p.id}: ${p.student_username} ⇄ ${p.mentor_username}`
    const description = `Meet link: ${p.meet_link || ''}`
    const location = p.meet_link || ''
    const params = new URLSearchParams()
    params.set('action', 'TEMPLATE')
    params.set('text', title)
    params.set('details', description)
    params.set('location', location)
    params.set('dates', `${start}/${end}`)
    const url = `https://calendar.google.com/calendar/render?${params.toString()}`
    window.open(url, '_blank')
  }
  const handleAddToCalendar = async (proposal) => {
    setPendingProposal(proposal)
    login()
  }
  if (loading) return <div style={{ textAlign: 'center', marginTop: 50 }}>Завантаження...</div>
  if (!proposals || proposals.length === 0) return <div style={{ padding: 20 }}>У вас поки немає активних сесій.</div>
  const meetBoxStyle = {
    marginTop: 12,
    padding: 12,
    borderRadius: 10,
    border: '1px solid #e8e8ef',
    background: '#fcfbff'
  }
  const meetLabelStyle = { fontWeight: 700, marginBottom: 6, color: '#333' }
  const meetLinkStyle = { color: '#4f46e5', wordBreak: 'break-all' }
  return (
    <div style={{ padding: 20, maxWidth: 1000, margin: '0 auto' }}>
      <h2>Мої сесії</h2>
      <div style={{ display: 'grid', gap: 12 }}>
        {proposals.map((p) => {
          const amMentor = role === 'mentor' && String(p.mentor) === String(userId)
          const amStudent = role === 'student' && String(p.student) === String(userId)
          const ended = p.chosen_slot && new Date(p.chosen_slot.end) < now
          const needsFeedback = ended && p.status === 'confirmed'
          const meetingId = p.meeting_id || (p.meeting && p.meeting.id)
          const meetLink = p.meet_link || (p.meeting && p.meeting.meet_link) || ''
          return (
            <div key={p.id} style={{ border: '1px solid #eee', padding: 14, borderRadius: 8, background: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700 }}>#{p.id} — {p.student_username} ⇄ {p.mentor_username}</div>
                <div style={{ marginTop: 6 }}>Статус: <span style={{ fontWeight: 700 }}>{p.status}</span></div>
                <div style={{ marginTop: 8 }}>
                  {p.chosen_slot ? <div>Обраний слот: {toLocal(p.chosen_slot.start)} — {toLocal(p.chosen_slot.end)}</div> : null}
                  {meetLink ? (
                    <div style={meetBoxStyle}>
                      <div style={meetLabelStyle}>Посилання на міт</div>
                      <div><a href={meetLink} target="_blank" rel="noreferrer" style={meetLinkStyle}>{meetLink}</a></div>
                      <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
                        <button onClick={() => window.open(meetLink, '_blank')} style={{ padding: '8px 12px', background: '#4f46e5', color: '#fff', borderRadius: 8, border: 'none' }}>Open</button>
                        <button onClick={() => handleAddToCalendar(p)} style={{ padding: '8px 12px', background: '#10b981', color: '#fff', borderRadius: 8, border: 'none' }}>Add to Google Calendar</button>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, marginLeft: 16 }}>
                {amMentor ? (
                  <>
                    <Link to={`/mentor/proposals/${p.id}`} style={{ padding: '8px 12px', background: '#4f46e5', color: '#fff', borderRadius: 8, textDecoration: 'none' }}>Manage</Link>
                    {p.status === 'student_chosen' ? <button onClick={() => navigate(`/proposals/${p.id}`)} style={{ padding: '8px 12px', background: '#10b981', color: '#fff', borderRadius: 8, border: 'none' }}>Confirm</button> : null}
                  </>
                ) : null}
                {amStudent ? (
                  <>
                    <Link to={`/proposals/${p.id}`} style={{ padding: '8px 12px', background: '#4f46e5', color: '#fff', borderRadius: 8, textDecoration: 'none' }}>Open</Link>
                    {p.status === 'pending' ? <Link to={`/sessions/${p.id}/select`} style={{ padding: '8px 12px', background: '#10b981', color: '#fff', borderRadius: 8, textDecoration: 'none' }}>Choose time</Link> : null}
                  </>
                ) : null}
                {needsFeedback && meetingId ? <Link to={`/meetings/${meetingId}/feedback`} style={{ padding: '8px 12px', background: '#f59e0b', color: '#fff', borderRadius: 8, textDecoration: 'none' }}>Give feedback</Link> : null}
                {p.whatsapp_shared ? <a href={role === 'mentor' ? p.student_whatsapp : p.mentor_whatsapp} target="_blank" rel="noreferrer" style={{ padding: '8px 12px', background: '#25D366', color: '#fff', borderRadius: 8, textDecoration: 'none' }}>WhatsApp</a> : null}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}