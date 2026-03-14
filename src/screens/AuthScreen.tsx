import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const AuthScreen: React.FC = () => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) { setError('Fill in all fields'); return; }
    if (mode === 'register' && !name) { setError('Enter your name'); return; }
    setError(''); setLoading(true);
    try {
      if (mode === 'login') await login(email, password);
      else await register(name, email, password);
    } catch (e: any) {
      setError(e.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#0F1117',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: '"Nunito", sans-serif', padding: 24,
    }}>
      <div style={{ width: '100%', maxWidth: 380 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            fontFamily: '"Fredoka One", cursive', fontSize: 36,
            background: 'linear-gradient(90deg, #5DCAA5, #378ADD)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            ⚔️ Codju Arena
          </div>
          <div style={{ color: '#8A8FA8', fontSize: 13, marginTop: 6 }}>
            Battle. Learn. Level up.
          </div>
        </div>

        {/* Card */}
        <div style={{
          background: '#1E2333', borderRadius: 20,
          border: '1px solid rgba(255,255,255,0.08)',
          padding: '28px 24px',
        }}>
          {/* Mode toggle */}
          <div style={{
            display: 'flex', background: 'rgba(255,255,255,0.05)',
            borderRadius: 10, padding: 3, marginBottom: 24,
          }}>
            {(['login', 'register'] as const).map(m => (
              <button key={m} onClick={() => { setMode(m); setError(''); }}
                style={{
                  flex: 1, padding: '8px 0', borderRadius: 8, border: 'none',
                  fontFamily: '"Nunito", sans-serif', fontSize: 13, fontWeight: 800,
                  cursor: 'pointer', transition: 'all 0.2s',
                  background: mode === m ? '#5DCAA5' : 'transparent',
                  color: mode === m ? '#0F1117' : '#8A8FA8',
                }}>
                {m === 'login' ? 'Log In' : 'Sign Up'}
              </button>
            ))}
          </div>

          {mode === 'register' && (
            <input
              style={inputStyle}
              placeholder="Your name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          )}
          <input
            style={inputStyle}
            placeholder="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            style={{ ...inputStyle, marginBottom: error ? 8 : 20 }}
            placeholder="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          />

          {error && (
            <div style={{
              fontSize: 12, color: '#E24B4A',
              background: 'rgba(226,75,74,0.1)', borderRadius: 8,
              padding: '8px 12px', marginBottom: 16,
            }}>
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: '100%', padding: 14, borderRadius: 12, border: 'none',
              background: '#1D9E75', color: '#fff',
              fontFamily: '"Nunito", sans-serif', fontSize: 15, fontWeight: 800,
              cursor: loading ? 'default' : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}>
            {loading ? 'Please wait...' : mode === 'login' ? 'Enter the Arena ⚔️' : 'Create Account 🚀'}
          </button>
        </div>
      </div>
    </div>
  );
};

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px 14px', marginBottom: 12,
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 10, outline: 'none',
  fontFamily: '"Nunito", sans-serif',
  fontSize: 14, color: '#F0EEE8',
  boxSizing: 'border-box',
};

export default AuthScreen;
