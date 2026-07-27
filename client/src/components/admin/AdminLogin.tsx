import { useState } from 'react';
import { api } from '../../utils/api';

interface AdminLoginProps {
  onLogin: (token: string) => void;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { token } = await api.login(password);
      localStorage.setItem('admin_token', token);
      onLogin(token);
    } catch {
      setError('Password salah');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-spotify-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🎵</div>
          <h1 className="text-3xl font-bold text-spotify-green mb-2">Admin Panel</h1>
          <p className="text-spotify-text">Undangan Digital Wedding</p>
        </div>
        <form onSubmit={handleSubmit} className="card-spotify">
          <label className="block text-sm font-medium text-spotify-text mb-2">
            Password Admin
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-spotify-bg border border-[#404040] rounded-lg px-4 py-3 text-spotify-white placeholder-spotify-text-secondary focus:outline-none focus:border-spotify-green transition-colors"
            placeholder="Masukkan password"
            autoFocus
          />
          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="btn-spotify w-full mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}