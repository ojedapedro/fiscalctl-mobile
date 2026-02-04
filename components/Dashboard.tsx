import React, { useState, useEffect, useRef } from 'react';
import { Download, CheckCircle2, AlertCircle, Clock, Wifi, Zap, FileText, ArrowRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { KPIS, RECENT_LOGS, DISTRIBUTION_DATA, EXPENSE_DATA } from '../constants';
import { Status, AuditLogEntry, KPI } from '../types';

// Componente para animar los cambios en los valores
const AnimatedValue: React.FC<{ value: string | number; prefix?: string }> = ({ value, prefix = '' }) => {
  const [highlight, setHighlight] = useState(false);
  const prevValue = useRef(value);

  useEffect(() => {
    if (prevValue.current !== value) {
      setHighlight(true);
      const timer = setTimeout(() => setHighlight(false), 600);
      prevValue.current = value;
      return () => clearTimeout(timer);
    }
  }, [value]);

  return (
    <div 
      className={`text-3xl font-bold transition-all duration-500 transform origin-left flex items-center gap-1 ${
        highlight 
          ? 'scale-105 text-emerald-400 translate-x-1' 
          : 'scale-100 text-white translate-x-0'
      }`}
    >
      {value}
    </div>
  );
};

// Componente de Tarjeta KPI Refactorizado
const KPICard: React.FC<{ kpi: KPI }> = ({ kpi }) => {
  let Icon = CheckCircle2;
  let accentColor = 'text-emerald-500';
  let borderColor = 'border-transparent';
  let glowColor = 'shadow-emerald-900/20';
  
  if (kpi.status === Status.REJECTED) {
    Icon = AlertCircle;
    accentColor = 'text-red-500';
    borderColor = 'border-red-500/20';
    glowColor = 'shadow-red-900/20';
  } else if (kpi.status === Status.PENDING) {
    Icon = Clock;
    accentColor = 'text-yellow-500';
    borderColor = 'border-yellow-500/20';
    glowColor = 'shadow-yellow-900/20';
  }

  return (
    <div className={`bg-surface p-6 rounded-xl border border-gray-800 ${borderColor} relative overflow-hidden group transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-xl ${glowColor}`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2 rounded-full bg-opacity-10 ${accentColor.replace('text-', 'bg-')} transition-transform duration-300 group-hover:scale-110`}>
          <Icon size={24} className={accentColor} />
        </div>
        {kpi.badge && (
          <span className="bg-emerald-500/10 text-emerald-400 text-xs font-bold px-2 py-1 rounded border border-emerald-500/20 uppercase tracking-wider animate-pulse">
            {kpi.badge}
          </span>
        )}
      </div>
      <h3 className="text-gray-400 text-sm font-medium mb-1">{kpi.title}</h3>
      <AnimatedValue value={kpi.value} />
      {kpi.subtext && (
        <p className={`text-xs mt-2 transition-colors duration-300 ${kpi.status === Status.REJECTED ? 'text-red-400' : 'text-yellow-400'}`}>
          {kpi.subtext}
        </p>
      )}
      
      {/* Decorative gradient blob for hover effect */}
      <div className={`absolute -right-10 -bottom-10 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 ${accentColor.replace('text-', 'bg-')}`} />
    </div>
  );
};

const Dashboard: React.FC = () => {
  // State for Real-time Data
  const [kpis, setKpis] = useState<KPI[]>(KPIS);
  const [logs, setLogs] = useState<AuditLogEntry[]>(RECENT_LOGS);
  const [isLive, setIsLive] = useState(true);

  // Helper for status styles in Logs
  const getLogStatusStyle = (status: Status) => {
    switch (status) {
      case Status.APPROVED:
        return { bg: 'bg-emerald-500/10', text: 'text-emerald-500', icon: CheckCircle2 };
      case Status.REJECTED:
        return { bg: 'bg-red-500/10', text: 'text-red-500', icon: AlertCircle };
      case Status.PENDING:
        return { bg: 'bg-yellow-500/10', text: 'text-yellow-500', icon: Clock };
      default:
        return { bg: 'bg-gray-500/10', text: 'text-gray-500', icon: Clock };
    }
  };

  // Simulate WebSocket Real-time Updates
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      // 1. Randomly update "Monto Aprobado" to simulate cash flow
      setKpis(current => current.map(k => {
        if (k.id === '1') {
          const numericValue = parseInt(k.value.toString().replace('$', ''));
          const newValue = numericValue + Math.floor(Math.random() * 20) - 5; // Fluctuate
          return { ...k, value: `$${newValue}` };
        }
        return k;
      }));

      // 2. Occasionally add a new log entry (20% chance per tick)
      if (Math.random() > 0.80) {
        const now = new Date();
        const newLog: AuditLogEntry = {
          id: `log-${Date.now()}`,
          title: `Pago #${Math.floor(Math.random() * 1000)}`,
          category: Math.random() > 0.5 ? 'Impuestos' : 'Servicios',
          amount: Math.floor(Math.random() * 500) + 50,
          date: `Hoy, ${now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`,
          status: Math.random() > 0.3 ? Status.APPROVED : Status.PENDING
        };
        
        setLogs(prev => [newLog, ...prev].slice(0, 7)); // Keep recent 7
      }

    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, [isLive]);

  return (
    <div className="flex-1 bg-background overflow-y-auto h-screen p-4 lg:p-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
             <h1 className="text-2xl font-bold text-white">Panel de Presidencia</h1>
             {isLive && (
               <span className="flex items-center gap-1.5 px-2 py-1 bg-red-500/10 border border-red-500/20 rounded-full">
                 <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                  <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider">En Vivo</span>
               </span>
             )}
          </div>
          <p className="text-gray-400 text-sm mt-1 flex items-center gap-2">
             <Wifi size={14} className="text-emerald-500"/>
             Sincronizado con FiscalCtl Server
          </p>
        </div>
        <div className="flex gap-2">
            <button 
              onClick={() => setIsLive(!isLive)}
              className={`p-2 rounded-lg transition-colors ${isLive ? 'bg-surface text-emerald-400 border border-emerald-500/30' : 'bg-surface text-gray-400 border border-gray-700'}`}
              title="Alternar Transmisión en Vivo"
            >
              <Zap size={20} className={isLive ? 'fill-emerald-400' : ''} />
            </button>
            <button className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-4 py-2 rounded-lg transition-colors text-sm shadow-lg shadow-yellow-500/20">
              <Download size={16} />
              <span className="hidden md:inline">Exportar Reporte</span>
            </button>
        </div>
      </header>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {kpis.map((kpi) => (
          <KPICard key={kpi.id} kpi={kpi} />
        ))}
      </div>

      {/* Middle Row: Logs & Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Recent Audit Log */}
        <div className="lg:col-span-2 bg-surface rounded-xl border border-gray-800 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white font-semibold flex items-center gap-2">
              Bitácora en Tiempo Real
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </h2>
            <button className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors">
              Ver Historial Completo <ArrowRight size={12} />
            </button>
          </div>
          <div className="space-y-3 flex-1 overflow-hidden">
            {logs.map((log, index) => {
              const style = getLogStatusStyle(log.status);
              const StatusIcon = style.icon;
              const isNew = index === 0 && log.date.includes('Hoy');

              return (
                <div 
                  key={log.id} 
                  className={`group bg-[#111827] border border-gray-800/50 p-4 rounded-xl flex items-center justify-between hover:border-gray-700 hover:bg-[#162032] transition-all duration-300 ${isNew ? 'animate-slide-in border-l-2 border-l-blue-500' : ''}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2.5 rounded-full ${style.bg} ${style.text} group-hover:scale-110 transition-transform duration-300 ring-1 ring-inset ring-white/5`}>
                      <StatusIcon size={18} />
                    </div>
                    <div>
                      <h4 className="text-white font-medium text-sm flex items-center gap-2">
                        {log.title}
                        {isNew && (
                          <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded uppercase tracking-wider font-bold animate-pulse">
                            Nuevo
                          </span>
                        )}
                      </h4>
                      <p className="text-gray-500 text-xs mt-0.5 flex items-center gap-1.5">
                        <FileText size={10} className="opacity-70"/>
                        {log.category}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold text-sm tracking-wide">
                      ${log.amount.toLocaleString()}
                    </div>
                    <div className="text-gray-500 text-xs mt-1 font-mono opacity-60">
                      {log.date}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status Distribution Chart */}
        <div className="bg-surface rounded-xl border border-gray-800 p-6 flex flex-col">
          <h2 className="text-white font-semibold mb-6">Distribución de Estatus</h2>
          <div className="flex-1 min-h-[200px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={DISTRIBUTION_DATA}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {DISTRIBUTION_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <span className="text-2xl font-bold text-white block">4</span>
                  <span className="text-xs text-gray-500 uppercase">Total</span>
                </div>
             </div>
          </div>
          <div className="flex justify-center gap-4 mt-4">
             {DISTRIBUTION_DATA.map(item => (
               <div key={item.name} className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                 <span className="text-xs text-gray-400">{item.name} ({item.value})</span>
               </div>
             ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: Expense Projection */}
      <div className="bg-surface rounded-xl border border-gray-800 p-6">
        <div className="mb-6">
          <h2 className="text-white font-semibold">Proyección Anual de Gasto</h2>
          <p className="text-gray-500 text-xs">Basado en históricos y presupuesto</p>
        </div>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={EXPENSE_DATA} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#6B7280', fontSize: 12 }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#6B7280', fontSize: 12 }} 
              />
              <Tooltip 
                 contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', borderRadius: '8px' }}
                 itemStyle={{ color: '#fff' }}
              />
              <Area 
                type="monotone" 
                dataKey="projected" 
                stroke="#F59E0B" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorProjected)" 
              />
              <Area 
                type="monotone" 
                dataKey="actual" 
                stroke="#3B82F6" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorActual)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;