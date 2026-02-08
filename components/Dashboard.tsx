import React, { useState, useEffect, useRef } from 'react';
import { Download, CheckCircle2, AlertCircle, Clock, Wifi, Zap, FileText, ArrowRight, TrendingUp, TrendingDown, DollarSign, Building, Users } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend, CartesianGrid } from 'recharts';
import { KPIS, RECENT_LOGS, DISTRIBUTION_DATA, EXPENSE_DATA, TAX_DATA, PARAFISCAL_DATA } from '../constants';
import { Status, AuditLogEntry, KPI } from '../types';

// Componente para animar los cambios en los valores
const AnimatedValue: React.FC<{ value: string | number }> = ({ value }) => {
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
      className={`text-2xl lg:text-3xl font-bold transition-all duration-500 transform origin-left flex items-center gap-1 ${
        highlight 
          ? 'scale-105 text-emerald-400 translate-x-1' 
          : 'scale-100 text-white translate-x-0'
      }`}
    >
      {value}
    </div>
  );
};

// Componente de Tarjeta Financiera (KPI)
const FinancialCard: React.FC<{ kpi: KPI }> = ({ kpi }) => {
  let Icon = DollarSign;
  let accentColor = 'text-emerald-500';
  let bgColor = 'bg-surface';
  
  // Custom logic based on ID for icons
  if (kpi.id === '2') Icon = Users; // Parafiscales -> Users
  if (kpi.id === '3') Icon = Building; // Gastos -> Building

  if (kpi.status === Status.REJECTED) {
    accentColor = 'text-red-400';
  } else if (kpi.status === Status.PENDING) {
    accentColor = 'text-yellow-400';
  }

  return (
    <div className={`relative ${bgColor} p-5 rounded-2xl border border-gray-800 overflow-hidden group hover:border-gray-700 transition-all duration-300`}>
      <div className="flex justify-between items-start mb-2">
        <div className={`p-2.5 rounded-xl bg-gray-900/50 border border-gray-800 ${accentColor}`}>
          <Icon size={22} />
        </div>
        {kpi.trend && (
          <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg ${kpi.trend === 'up' ? 'bg-emerald-500/10 text-emerald-400' : kpi.trend === 'down' ? 'bg-red-500/10 text-red-400' : 'bg-gray-700/30 text-gray-400'}`}>
            {kpi.trend === 'up' ? <TrendingUp size={12} /> : kpi.trend === 'down' ? <TrendingDown size={12} /> : null}
            {kpi.trendValue}
          </div>
        )}
      </div>
      
      <div className="mt-2">
        <h3 className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">{kpi.title}</h3>
        <AnimatedValue value={kpi.value} />
        {kpi.subtext && (
           <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
             <span className={`w-1.5 h-1.5 rounded-full ${kpi.status === Status.APPROVED ? 'bg-emerald-500' : 'bg-yellow-500'}`}></span>
             {kpi.subtext}
           </p>
        )}
      </div>

      {/* Background Graphic */}
      <div className="absolute -right-6 -bottom-6 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
        <Icon size={100} className={accentColor} />
      </div>
    </div>
  );
};

// Custom Tooltip for Charts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 border border-gray-700 p-3 rounded-lg shadow-xl text-xs">
        <p className="font-bold text-gray-200 mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 mb-1 last:mb-0">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
            <span className="text-gray-400 capitalize">{entry.name}:</span>
            <span className="text-white font-mono font-medium">
              {typeof entry.value === 'number' ? `$${entry.value.toLocaleString()}` : entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const Dashboard: React.FC = () => {
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
      // 1. Randomly update "Total Impuestos"
      setKpis(current => current.map(k => {
        if (k.id === '1') {
          const numericValue = parseInt(k.value.toString().replace('$', '').replace(',', ''));
          const newValue = numericValue + Math.floor(Math.random() * 50) - 10; 
          return { ...k, value: `$${newValue.toLocaleString()}` };
        }
        return k;
      }));

      // 2. Add log entry
      if (Math.random() > 0.85) {
        const now = new Date();
        const categories = ['Impuestos', 'Parafiscales', 'Nómina', 'Proveedores'];
        const newLog: AuditLogEntry = {
          id: `log-${Date.now()}`,
          title: `Pago #${Math.floor(Math.random() * 9000) + 1000}`,
          category: categories[Math.floor(Math.random() * categories.length)],
          amount: Math.floor(Math.random() * 2000) + 100,
          date: `Hoy, ${now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`,
          status: Math.random() > 0.4 ? Status.APPROVED : Status.PENDING
        };
        setLogs(prev => [newLog, ...prev].slice(0, 6)); 
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isLive]);

  return (
    <div className="flex-1 bg-background overflow-y-auto h-screen p-4 pb-20 lg:p-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
             <h1 className="text-2xl font-bold text-white tracking-tight">Tablero Financiero</h1>
             {isLive && (
               <span className="flex items-center gap-1.5 px-2 py-0.5 bg-red-500/10 border border-red-500/20 rounded-full">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                  </span>
                  <span className="text-[9px] font-bold text-red-400 uppercase tracking-wider">En Vivo</span>
               </span>
             )}
          </div>
          <p className="text-gray-400 text-xs mt-1">Visión consolidada de Impuestos, Parafiscales y Gastos.</p>
        </div>
        <div className="flex items-center gap-3">
             <div className="hidden md:flex flex-col items-end mr-2">
                <span className="text-xs text-gray-500">Última act.</span>
                <span className="text-xs text-white font-mono">{new Date().toLocaleTimeString()}</span>
             </div>
            <button 
              onClick={() => setIsLive(!isLive)}
              className={`p-2 rounded-lg transition-colors ${isLive ? 'bg-surface text-emerald-400 border border-emerald-500/30' : 'bg-surface text-gray-400 border border-gray-700'}`}
            >
              <Zap size={18} className={isLive ? 'fill-emerald-400' : ''} />
            </button>
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-medium px-4 py-2 rounded-lg transition-all text-sm shadow-lg shadow-blue-600/20 active:scale-95">
              <Download size={16} />
              <span>Reporte</span>
            </button>
        </div>
      </header>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {kpis.map((kpi) => (
          <FinancialCard key={kpi.id} kpi={kpi} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
        
        {/* Tax Composition (Donut) */}
        <div className="bg-surface rounded-2xl border border-gray-800 p-5 flex flex-col">
          <div className="mb-4">
            <h2 className="text-white font-semibold text-sm flex items-center gap-2">
              <span className="w-1 h-4 bg-blue-500 rounded-full"></span>
              Distribución de Impuestos
            </h2>
          </div>
          <div className="flex-1 relative min-h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={TAX_DATA}
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                  cornerRadius={4}
                >
                  {TAX_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  layout="vertical" 
                  verticalAlign="middle" 
                  align="right"
                  iconSize={8}
                  iconType="circle"
                  wrapperStyle={{ fontSize: '11px', color: '#9CA3AF' }}
                />
              </PieChart>
            </ResponsiveContainer>
             {/* Center Text */}
             <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none pr-24">
                <div className="text-center">
                  <span className="text-2xl font-bold text-white block">100%</span>
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider">Cumplimiento</span>
                </div>
             </div>
          </div>
        </div>

        {/* Parafiscales Trend (Stacked Bar) */}
        <div className="bg-surface rounded-2xl border border-gray-800 p-5 flex flex-col lg:col-span-1 xl:col-span-2">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-white font-semibold text-sm flex items-center gap-2">
              <span className="w-1 h-4 bg-purple-500 rounded-full"></span>
              Histórico Parafiscales (6 Meses)
            </h2>
            <div className="flex gap-2">
                <span className="flex items-center gap-1 text-[10px] text-gray-400">
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div> SSO
                </span>
                <span className="flex items-center gap-1 text-[10px] text-gray-400">
                    <div className="w-2 h-2 rounded-full bg-pink-500"></div> FAOV
                </span>
            </div>
          </div>
          <div className="flex-1 min-h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={PARAFISCAL_DATA} barSize={12} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#6B7280', fontSize: 10 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#6B7280', fontSize: 10 }} 
                />
                <Tooltip cursor={{fill: '#1F2937'}} content={<CustomTooltip />} />
                <Bar dataKey="sso" name="Seguro Social" stackId="a" fill="#8B5CF6" radius={[0, 0, 4, 4]} />
                <Bar dataKey="faov" name="Vivienda" stackId="a" fill="#EC4899" />
                <Bar dataKey="inces" name="INCES" stackId="a" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Expense Trends & Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Expense Area Chart */}
        <div className="bg-surface rounded-2xl border border-gray-800 p-5">
           <div className="mb-6 flex justify-between items-end">
            <div>
                <h2 className="text-white font-semibold text-sm flex items-center gap-2">
                <span className="w-1 h-4 bg-yellow-500 rounded-full"></span>
                Proyección de Gastos
                </h2>
                <p className="text-gray-500 text-xs mt-1">Real vs Presupuesto (Trimestre)</p>
            </div>
            <div className="text-right">
                <p className="text-white font-bold text-lg">$2,800</p>
                <p className="text-emerald-400 text-xs">-2.4% vs Mes Ant.</p>
            </div>
          </div>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={EXPENSE_DATA} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 10 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="projected" stroke="#F59E0B" strokeWidth={2} fillOpacity={1} fill="url(#colorProjected)" name="Presupuesto" />
                <Area type="monotone" dataKey="actual" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorActual)" name="Gasto Real" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Transaction Log */}
        <div className="bg-surface rounded-2xl border border-gray-800 p-5 flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold text-sm">Actividad Reciente</h2>
            <button className="text-[10px] text-blue-400 hover:text-blue-300 font-medium uppercase tracking-wider">Ver Todo</button>
          </div>
          <div className="space-y-2 flex-1 overflow-hidden">
            {logs.map((log, index) => {
              const style = getLogStatusStyle(log.status);
              const StatusIcon = style.icon;
              const isNew = index === 0 && log.date.includes('Hoy');

              return (
                <div 
                  key={log.id} 
                  className={`group relative bg-[#111827] border border-gray-800/50 p-3 rounded-lg flex items-center justify-between hover:border-gray-700 transition-all duration-300 ${isNew ? 'animate-slide-in bg-blue-900/10 border-blue-500/30' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${style.bg} ${style.text}`}>
                      <StatusIcon size={14} />
                    </div>
                    <div>
                      <h4 className="text-white font-medium text-xs truncate max-w-[120px] sm:max-w-[150px]">{log.title}</h4>
                      <p className="text-gray-500 text-[10px]">{log.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold text-xs">${log.amount.toLocaleString()}</div>
                    <div className="text-gray-600 text-[9px]">{log.date}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;