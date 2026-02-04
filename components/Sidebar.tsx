import React from 'react';
import { 
  Bell, 
  Activity, 
  FileText, 
  Settings, 
  LogOut, 
  Moon,
  Building2
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar, onLogout }) => {
  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-background border-r border-gray-800 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 flex flex-col`}>
      {/* Logo Area */}
      <div className="h-16 flex items-center px-6 border-b border-gray-800">
        <div className="flex items-center gap-2 text-white font-bold text-xl">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-lg">F</span>
          </div>
          <span>FiscalCtl</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-4 space-y-2">
        <NavItem icon={<Bell size={20} />} label="Notificaciones" />
        <NavItem icon={<Activity size={20} />} label="Estado de Red" />
        <NavItem icon={<FileText size={20} />} label="Reportes" active />
        <NavItem icon={<Settings size={20} />} label="Configuración" />
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-gray-800 space-y-4">
        
        {/* Theme Toggle Simulator */}
        <button className="flex items-center gap-3 text-gray-400 hover:text-white w-full px-3 py-2 rounded-lg transition-colors hover:bg-gray-800/50">
          <Moon size={18} />
          <span className="text-sm font-medium">Tema: Oscuro</span>
        </button>

        {/* Role Selector */}
        <div className="space-y-1">
          <label className="text-xs text-gray-500 uppercase font-semibold ml-1">Rol Actual</label>
          <div className="relative">
            <button className="w-full bg-surface border border-gray-700 text-white text-sm rounded-lg px-3 py-2 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Building2 size={14} className="text-blue-400"/>
                Presidencia
              </span>
            </button>
          </div>
        </div>

        {/* Logout */}
        <button 
          onClick={onLogout}
          className="flex items-center gap-2 text-red-500 hover:text-red-400 w-full px-3 py-2 transition-colors rounded-lg hover:bg-red-500/10"
        >
          <LogOut size={18} />
          <span className="text-sm font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
};

const NavItem: React.FC<{ icon: React.ReactNode; label: string; active?: boolean }> = ({ icon, label, active }) => (
  <button 
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
      active 
        ? 'bg-blue-600/20 text-blue-400 border-l-4 border-blue-500' 
        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
    }`}
  >
    {icon}
    <span className="font-medium text-sm">{label}</span>
  </button>
);

export default Sidebar;
