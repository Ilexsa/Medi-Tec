import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboardIcon,
  StethoscopeIcon,
  UsersIcon,
  UserCheckIcon,
  AwardIcon,
  CalendarIcon,
  BookOpenIcon,
  PillIcon,
  FlaskConicalIcon,
  ReceiptIcon,
  CreditCardIcon,
  FileTextIcon,
  ClockIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  HeartPulseIcon,
  ChevronDownIcon,
  ChevronUpIcon } from
'lucide-react';
interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}
interface NavSection {
  title: string;
  items: NavItem[];
}
const navSections: NavSection[] = [
{
  title: 'PRINCIPAL',
  items: [
  {
    label: 'Dashboard',
    path: '/',
    icon: <LayoutDashboardIcon size={18} />
  },
  {
    label: 'Consultas del Día',
    path: '/medical-consult',
    icon: <StethoscopeIcon size={18} />
  }]

},
{
  title: 'GESTIÓN CLÍNICA',
  items: [
  {
    label: 'Pacientes',
    path: '/patients',
    icon: <UsersIcon size={18} />
  },
  {
    label: 'Médicos',
    path: '/doctors',
    icon: <UserCheckIcon size={18} />
  },
  {
    label: 'Especialidades',
    path: '/specialties',
    icon: <AwardIcon size={18} />
  }]

},
{
  title: 'TURNOS',
  items: [
  {
    label: 'Crear Horarios',
    path: '/schedules',
    icon: <CalendarIcon size={18} />
  },
  {
    label: 'Reservar Turno',
    path: '/book-appointment',
    icon: <BookOpenIcon size={18} />
  }]

},
{
  title: 'CATÁLOGOS',
  items: [
  {
    label: 'Medicamentos',
    path: '/medications',
    icon: <PillIcon size={18} />
  },
  {
    label: 'Tipos de Exámenes',
    path: '/exam-types',
    icon: <FlaskConicalIcon size={18} />
  },
  {
    label: 'Items Facturables',
    path: '/billable-items',
    icon: <ReceiptIcon size={18} />
  }]

},
{
  title: 'FACTURACIÓN',
  items: [
  {
    label: 'Facturación',
    path: '/billing',
    icon: <CreditCardIcon size={18} />
  }]

},
{
  title: 'REPORTES',
  items: [
  {
    label: 'Reportería',
    path: '/reports',
    icon: <FileTextIcon size={18} />
  },
  {
    label: 'Historial',
    path: '/history',
    icon: <ClockIcon size={18} />
  }]

}];

interface SidebarProps {
  onLogout: () => void;
}
export function Sidebar({ onLogout }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };
  return (
    <aside
      className="flex flex-col h-screen sticky top-0 transition-all duration-300 ease-in-out"
      style={{
        width: collapsed ? 64 : 240,
        backgroundColor: '#1e3a5f',
        minWidth: collapsed ? 64 : 240
      }}>

      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-white/10">
        {!collapsed &&
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
              <HeartPulseIcon size={18} className="text-white" />
            </div>
            <span className="text-white font-bold text-base tracking-tight">
              MediSys
            </span>
          </div>
        }
        {collapsed &&
        <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center mx-auto">
            <HeartPulseIcon size={18} className="text-white" />
          </div>
        }
        {!collapsed &&
        <button
          onClick={() => setCollapsed(true)}
          className="text-white/50 hover:text-white transition-colors p-1 rounded">

            <ChevronLeftIcon size={16} />
          </button>
        }
      </div>

      {collapsed &&
      <button
        onClick={() => setCollapsed(false)}
        className="flex items-center justify-center py-3 text-white/50 hover:text-white transition-colors border-b border-white/10">

          <ChevronRightIcon size={16} />
        </button>
      }

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin">
        {navSections.map((section) =>
        <div key={section.title} className="mb-4">
            {!collapsed &&
          <p className="px-4 mb-1 text-[10px] font-semibold tracking-widest text-white/30 uppercase">
                {section.title}
              </p>
          }
            {collapsed &&
          <div className="mx-3 my-1 border-t border-white/10" />
          }
            {section.items.map((item) =>
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all duration-150 relative
                  ${isActive(item.path) ? 'bg-blue-700/40 text-white font-medium' : 'text-white/60 hover:text-white hover:bg-white/5'}`}>

                {isActive(item.path) &&
            <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-blue-400 rounded-r" />
            }
                <span
              className={`flex-shrink-0 ${isActive(item.path) ? 'text-blue-300' : ''}`}>

                  {item.icon}
                </span>
                {!collapsed && <span className="truncate">{item.label}</span>}
              </button>
          )}
          </div>
        )}
      </nav>

      {/* Logout */}
      {!collapsed &&
      <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
              AD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-medium truncate">Admin</p>
              <p className="text-white/40 text-xs truncate">
                admin@medisys.com
              </p>
            </div>
          </div>
          <button
          onClick={onLogout}
          className="w-full text-xs text-white/50 hover:text-white transition-colors text-left px-2 py-1 rounded hover:bg-white/5">

            Cerrar sesión
          </button>
        </div>
      }
    </aside>);

}