import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div style={styles.container}>
      <section style={styles.heroSection}>
        <h1 style={styles.title}>
          Знайди свого <span style={styles.highlight}>Ментора</span>
        </h1>
        <p style={styles.subtitle}>
          MentorMatch — це твій простір для розвитку. Знаходь натхненних наставників, отримуй підтримку та будуй кар'єру мрії.
        </p>
        <div style={styles.buttonGroup}>
          <Link to="/mentors" style={styles.primaryButton}>Знайти ментора</Link>
          <Link to="/login" style={styles.secondaryButton}>Увійти</Link>
        </div>
      </section>
    </div>
  );
}

const styles = {
  container: { fontFamily: "'Inter', sans-serif", paddingBottom: '50px', backgroundColor: '#fffafc' },
  heroSection: { textAlign: 'center', padding: '100px 20px', background: 'linear-gradient(180deg, #ffe4e9 0%, #fffafc 100%)', borderRadius: '0 0 50% 50% / 40px' },
  title: { fontSize: '3.5rem', fontWeight: '800', marginBottom: '25px', color: '#333' },
  highlight: { color: '#ff6b81' },
  subtitle: { fontSize: '1.3rem', color: '#7a6375', maxWidth: '600px', margin: '0 auto 40px auto' },
  buttonGroup: { display: 'flex', gap: '25px', justifyContent: 'center' },
  primaryButton: { padding: '15px 35px', background: '#ff6b81', color: 'white', textDecoration: 'none', borderRadius: '30px', fontWeight: 'bold' },
  secondaryButton: { padding: '15px 35px', background: 'white', color: '#ff6b81', border: '2px solid #ffc3d0', textDecoration: 'none', borderRadius: '30px', fontWeight: 'bold' }
};

export default LandingPage;