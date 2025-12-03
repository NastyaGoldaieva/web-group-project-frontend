import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div style={styles.container}>

      <section style={styles.heroSection}>
        <h1 style={styles.title}>
          Знайди свого <span style={styles.highlight}>Ментора</span>
        </h1>
        <p style={styles.subtitle}>
          MentorMatch — це твій простір для розвитку. Знаходь натхненних наставників, отримуй підтримку та будуй кар'єру мрії в затишній атмосфері.
        </p>
        <div style={styles.buttonGroup}>
          <Link to="/mentors" style={styles.primaryButton}>Знайти ментора </Link>
          <Link to="/login" style={styles.secondaryButton}>Увійти</Link>
        </div>
      </section>

      <section style={styles.featuresSection}>
        <div style={styles.card}>
          <div style={styles.icon}>🎀</div>
          <h3>Легкий старт</h3>
          <p>Реєструйся за хвилину і одразу переглядай профілі чарівних менторів.</p>
        </div>
        <div style={styles.card}>
          <div style={styles.icon}>💌</div>
          <h3>Спілкування</h3>
          <p>Відправляй заявки та спілкуйся в дружній атмосфері.</p>
        </div>
        <div style={styles.card}>
          <div style={styles.icon}>✨</div>
          <h3>Твій ріст</h3>
          <p>Отримуй знання та натхнення від реальних експертів.</p>
        </div>
      </section>

    </div>
  );
}

const styles = {
  container: {
    fontFamily: "'Inter', sans-serif",
    color: '#4a4a4a',
    paddingBottom: '50px',
    backgroundColor: '#fffafc',
  },
  heroSection: {
    textAlign: 'center',
    padding: '100px 20px',
    background: 'linear-gradient(180deg, #ffe4e9 0%, #fffafc 100%)',
    marginBottom: '40px',
    borderRadius: '0 0 50% 50% / 40px',
  },
  title: {
    fontSize: '3.5rem',
    fontWeight: '800',
    marginBottom: '25px',
    lineHeight: '1.2',
    color: '#333',
  },
  highlight: {
    background: 'linear-gradient(45deg, #ff9a9e, #fad0c4)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    fontSize: '1.3rem',
    color: '#7a6375',
    maxWidth: '600px',
    margin: '0 auto 40px auto',
    lineHeight: '1.6',
  },
  buttonGroup: {
    display: 'flex',
    gap: '25px',
    justifyContent: 'center',
  },
  primaryButton: {
    padding: '15px 35px',
    background: 'linear-gradient(45deg, #ff9a9e, #ff6b81)',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '30px',
    fontWeight: 'bold',
    fontSize: '1.1rem',
    transition: 'transform 0.3s, box-shadow 0.3s',
    boxShadow: '0 10px 20px -10px rgba(255, 107, 129, 0.5)',
    border: 'none',
  },
  secondaryButton: {
    padding: '15px 35px',
    backgroundColor: 'white',
    color: '#ff6b81',
    border: '2px solid #ffc3d0',
    textDecoration: 'none',
    borderRadius: '30px',
    fontWeight: 'bold',
    fontSize: '1.1rem',
    transition: '0.3s',
  },
  featuresSection: {
    display: 'flex',
    justifyContent: 'center',
    gap: '40px',
    padding: '0 20px',
    flexWrap: 'wrap',
  },
  card: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '25px',
    boxShadow: '0 10px 30px rgba(255, 182, 193, 0.3)',
    width: '320px',
    textAlign: 'center',
    border: '3px solid #fff0f3',
    transition: 'transform 0.3s',
  },
  icon: {
    fontSize: '3.5rem',
    marginBottom: '20px',
  }
};

export default LandingPage;