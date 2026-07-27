import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminPage from './pages/AdminPage';
import InvitationPage from './pages/InvitationPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/:coupleSlug/:guestSlug" element={<InvitationPage />} />
        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center bg-spotify-bg">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-spotify-green mb-4">404</h1>
              <p className="text-spotify-text text-xl">Halaman tidak ditemukan</p>
            </div>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}