import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function MedicalCaseSheet() {
  const [showDialog, setShowDialog] = useState(false);
  const navigate = useNavigate();

  const selectSystem = (system: string) => {
    switch (system) {
      case 'respiratory':
        navigate('/medicine/respiratory');
        break;
      case 'cvs':
        alert('Cardiovascular System form is coming soon!');
        break;
      case 'cns':
        alert('Central Nervous System form is coming soon!');
        break;
      case 'abdomen':
        alert('Abdomen form is coming soon!');
        break;
    }
    setShowDialog(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-8 font-sans text-[#22223b] bg-gradient-to-br from-[#f8f9fa] to-[#e0e7ef] min-h-screen flex flex-col justify-center items-center">
      <header className="text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#22223b] mb-2 tracking-tight">Medical Case Sheet Writer</h1>
        <p className="text-base sm:text-lg text-[#4a4e69]/80">Select a subject to begin writing your case sheet</p>
      </header>
      <main className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
          <div
            className="bg-white rounded-2xl p-6 sm:p-8 text-center shadow-lg border-2 border-[#4a4e69] hover:-translate-y-1 hover:shadow-2xl transition cursor-pointer relative group"
            onClick={() => setShowDialog(true)}
          >
            <div className="text-4xl mb-3 text-[#4a4e69] group-hover:scale-110 transition-transform">👨‍⚕️</div>
            <h2 className="text-2xl font-semibold text-[#22223b] mb-2">General Medicine</h2>
            <p className="text-[#4a4e69]/80 mb-4 text-sm sm:text-base">
              Write case sheets for common medical conditions including respiratory, cardiovascular, neurological, and gastrointestinal cases.
            </p>
            <span className="inline-block w-2.5 h-2.5 bg-green-500 rounded-full mr-2"></span>
            <span className="text-xs text-green-700 font-medium">Available</span>
          </div>
          {[
            {
              icon: '👶',
              title: 'Paediatrics',
              description:
                'Create detailed case sheets for children including growth monitoring, developmental assessment, and common pediatric conditions.',
            },
            {
              icon: '🔪',
              title: 'Surgery',
              description:
                'Create detailed surgical case presentations including pre-op evaluation, operative findings, and post-op care.',
            },
            {
              icon: '👶',
              title: 'Obstetrics & Gynaecology',
              description:
                'Document obstetric cases, gynecological conditions, and antenatal care records.',
            },
            {
              icon: '👂',
              title: 'ENT',
              description:
                'Write case sheets for ear, nose, and throat conditions with specific examination findings.',
            },
            {
              icon: '👁️',
              title: 'Ophthalmology',
              description:
                'Document eye cases with detailed visual examination and ophthalmological findings.',
            },
          ].map((subject) => (
            <div
              key={subject.title}
              className="bg-white rounded-2xl p-6 sm:p-8 text-center shadow-md opacity-60 cursor-not-allowed relative"
            >
              <div className="text-4xl mb-3 text-[#4a4e69]">{subject.icon}</div>
              <h2 className="text-2xl font-semibold text-[#22223b] mb-2">{subject.title}</h2>
              <p className="text-[#4a4e69]/80 mb-4 text-sm sm:text-base">{subject.description}</p>
              <span className="absolute top-4 right-4 bg-[#e07a5f] text-white text-xs px-3 py-1 rounded-full font-bold">
                Coming Soon
              </span>
            </div>
          ))}
        </div>
      </main>
      {/* Dialog */}
      {showDialog && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={(e) => e.target === e.currentTarget && setShowDialog(false)}
        >
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl max-w-md w-full">
            <h3 className="text-center text-xl sm:text-2xl font-semibold text-[#22223b] mb-4">Select System</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <button
                className="p-3 sm:p-4 bg-[#f8f9fa] border border-[#dee2e6] rounded-lg hover:bg-[#4a4e69] hover:text-white transition"
                onClick={() => selectSystem('respiratory')}
              >
                Respiratory System
              </button>
              <button
                className="p-3 sm:p-4 bg-[#f8f9fa] border border-[#dee2e6] rounded-lg hover:bg-[#4a4e69] hover:text-white transition"
                onClick={() => selectSystem('cvs')}
              >
                Cardiovascular System
              </button>
              <button
                className="p-3 sm:p-4 bg-[#f8f9fa] border border-[#dee2e6] rounded-lg hover:bg-[#4a4e69] hover:text-white transition"
                onClick={() => selectSystem('cns')}
              >
                Central Nervous System
              </button>
              <button
                className="p-3 sm:p-4 bg-[#f8f9fa] border border-[#dee2e6] rounded-lg hover:bg-[#4a4e69] hover:text-white transition"
                onClick={() => selectSystem('abdomen')}
              >
                Abdomen
              </button>
            </div>
            <button
              className="block mx-auto px-5 py-2 bg-[#e07a5f] text-white rounded-lg hover:bg-[#b85c38] transition"
              onClick={() => setShowDialog(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
