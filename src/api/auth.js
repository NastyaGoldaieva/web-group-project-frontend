import api from './axios';

export async function logout() {
  const refresh = localStorage.getItem('refresh_token');
  try {
    if (refresh) {
      await api.post('auth/logout/', { refresh });
    }
  } catch (err) {
    console.warn('Logout request failed:', err);
  } finally {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    localStorage.removeItem('user_id');
    localStorage.removeItem('role');
    window.dispatchEvent(new Event('authChanged'));
  }
}