// pages/index.js
export default function Home() {
  return (
    <div style={{ fontFamily: 'monospace', padding: '40px', background: '#0a0a0a', color: '#00ff88', minHeight: '100vh' }}>
      <h1>📊 MBS Alert System</h1>
      <p>UMBS 30YR 5.5% — Daily SMS Alerts</p>
      <ul>
        <li>⏰ 8:00 AM AKT</li>
        <li>⏰ 11:00 AM AKT</li>
        <li>⏰ 2:00 PM AKT</li>
      </ul>
      <p style={{ color: '#888', fontSize: '12px' }}>Active Mon–Fri | Powered by Huit.AI</p>
    </div>
  );
}
