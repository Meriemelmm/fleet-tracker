import { useState } from 'react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        
        setSuccess(true);
        setError('');
        
        // Redirection vers admin
        window.location.href = '/admin';
      } else {
        setError(data.message || 'Erreur de connexion');
      }
    } catch (error) {
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="flex max-w-4xl w-full rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Partie gauche - Branding */}
        <div className="w-1/2 p-10 flex flex-col justify-between bg-[#1A202C] text-white">
          <div>
            <h1 className="text-3xl font-bold tracking-wider mb-2">Fleet Tracker</h1>
            <p className="text-sm text-gray-400">Optimisez la gestion de votre flotte, du dépôt au client.</p>
          </div>
          
          <div className="flex justify-center items-center my-8">
            <svg viewBox="0 0 500 300" className="w-full h-auto text-white" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="50" y="50" width="400" height="200" rx="20" ry="20" className="opacity-10"></rect>
              <path d="M50 150 L450 150" strokeDasharray="10 5" className="stroke-orange-400"></path>
              <path d="M100 200 L100 100 L250 100 L250 200" strokeLinecap="round" strokeLinejoin="round"></path>
              <circle cx="100" cy="200" r="15" fill="currentColor"></circle>
              <circle cx="250" cy="200" r="15" fill="currentColor"></circle>
              <text x="300" y="150" fontSize="24" fill="currentColor">🚚</text>
              <text x="300" y="100" fontSize="24" fill="currentColor" className="text-orange-400">🌍</text>
            </svg>
          </div>

          <div className="text-center text-xs text-gray-300 space-x-2">
            <span className="text-orange-400">Visibilité en temps réel</span> • 
            <span className="text-orange-400">Maintenance proactive</span> • 
            <span className="text-orange-400">Suivi des coûts</span>
          </div>
        </div>

        {/* Partie droite - Formulaire */}
        <div className="w-1/2 p-12 bg-white flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Connexion</h2>
          <p className="text-sm text-gray-500 mb-8">Accédez à votre espace de travail</p>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              ✅ Connexion réussie ! Redirection...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Adresse Email
              </label>
              <input 
                id="email" 
                name="email" 
                type="email" 
                required 
                value={formData.email}
                onChange={handleChange}
                placeholder="votre.email@entreprise.com"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mot de Passe
              </label>
              <input 
                id="password" 
                name="password" 
                type="password" 
                required 
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              />
            </div>

            <div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg text-lg font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition duration-150 ease-in-out shadow-md shadow-orange-300 disabled:opacity-50"
              >
                {loading ? 'Connexion...' : 'Se Connecter'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;