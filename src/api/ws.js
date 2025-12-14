let ws = null;
let reconnectTimer = null;
let reconnectDelay = 1000;

function buildUrl() {
  const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
  const host = window.location.hostname + (window.location.port ? `:${window.location.port}` : '');
  return `${protocol}://${host}/ws/notifications/`;
}

function connect(userId, onMessage) {
  if (!userId) return null;
  const url = buildUrl() + `?user_id=${userId}`;
  ws = new WebSocket(url);
  ws.onopen = () => {
    reconnectDelay = 1000;
  };
  ws.onmessage = (ev) => {
    try {
      const msg = JSON.parse(ev.data);
      onMessage && onMessage(msg);
    } catch (e) {}
  };
  ws.onclose = () => {
    if (reconnectTimer) clearTimeout(reconnectTimer);
    reconnectTimer = setTimeout(() => {
      reconnectDelay = Math.min(30000, reconnectDelay * 2);
      connect(userId, onMessage);
    }, reconnectDelay);
  };
  ws.onerror = () => {
    try { ws.close(); } catch (e) {}
  };
  return ws;
}

function disconnect() {
  if (reconnectTimer) clearTimeout(reconnectTimer);
  reconnectTimer = null;
  if (ws) {
    try { ws.close(); } catch (e) {}
    ws = null;
  }
}

export { connect, disconnect };