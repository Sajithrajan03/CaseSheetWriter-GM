import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#f8f9fa] to-[#e0e7ef] p-4">
      <h1 className="text-6xl font-extrabold text-[#e07a5f] mb-4">404</h1>
      <p className="text-2xl text-[#22223b] mb-6">This page doesn't exist.</p>
      <button
        className="px-6 py-2 bg-[#4a4e69] text-white rounded-lg text-lg hover:bg-[#22223b] transition"
        onClick={() => navigate('/')}
      >
        Go Home
      </button>
    </div>
  );
} 