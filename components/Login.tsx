import React, { useState } from 'react';
import { Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulating API call latency
    setTimeout(() => {
      if (email === 'admin' && password === 'admin') {
        onLogin();
      } else {
        setError('Credenciales inválidas. Intente admin/admin');
        setLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0B1120] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface border border-gray-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl -ml-16 -mb-16 pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-lg transform rotate-3">
              <span className="text-3xl text-white font-bold">F</span>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white text-center mb-2">FiscalCtl Mobile</h2>
          <p className="text-gray-400 text-center text-sm mb-8">Acceso seguro para Junta Directiva</p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="group">
                <label className="block text-xs font-medium text-gray-400 uppercase mb-2 ml-1">Usuario / ID</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#0B1120] border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-600"
                    placeholder="Ingrese su usuario"
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-xs font-medium text-gray-400 uppercase mb-2 ml-1">Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#0B1120] border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-600"
                    placeholder="Ingrese su contraseña"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-xs text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-lg shadow-lg shadow-blue-900/20 transition-all transform active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Verificando...</span>
                </>
              ) : (
                <>
                  <span>Iniciar Sesión</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 flex items-center justify-center gap-2 text-gray-500 text-xs">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span>Conexión Encriptada TLS 1.3</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
