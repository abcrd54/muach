import { useState } from 'react';
import AdminLogin from '../components/admin/AdminLogin';
import GuestList from '../components/admin/GuestList';
import ThemeSelector from '../components/admin/ThemeSelector';
import EventForm from '../components/admin/EventForm';

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('admin_token')
  );

  const handleLogin = (newToken: string) => {
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setToken(null);
  };

  if (!token) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-spotify-bg p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-spotify-green">Admin Panel</h1>
            <p className="text-spotify-text mt-1">Kelola undangan digital</p>
          </div>
          <button onClick={handleLogout} className="btn-outline text-sm">
            Logout
          </button>
        </div>
        <ThemeSelector token={token} />
        <EventForm token={token} />
        <GuestList token={token} onLogout={handleLogout} />
      </div>
    </div>
  );
}