import { AuditLogEntry, ExpenseDataPoint, KPI, Status, StatusDistribution } from './types';

export const KPIS: KPI[] = [
  {
    id: '1',
    title: 'Monto Aprobado',
    value: '$120',
    status: Status.APPROVED,
    badge: 'AUDITADO'
  },
  {
    id: '2',
    title: 'Pagos Rechazados',
    value: '0',
    subtext: 'Requieren corrección inmediata',
    status: Status.REJECTED
  },
  {
    id: '3',
    title: 'Pendientes de Revisión',
    value: '3',
    subtext: 'En cola del auditor',
    status: Status.PENDING
  }
];

export const RECENT_LOGS: AuditLogEntry[] = [
  {
    id: 'log-1',
    title: 'Tienda 089',
    category: 'Servicio Internet',
    amount: 120,
    date: '20/10/2023',
    status: Status.APPROVED
  },
  // Adding a few more to populate the list slightly, though image shows one
  {
    id: 'log-2',
    title: 'Sede Central',
    category: 'Mantenimiento AC',
    amount: 450,
    date: '19/10/2023',
    status: Status.PENDING
  },
  {
    id: 'log-3',
    title: 'Sucursal Norte',
    category: 'Impuestos Municipales',
    amount: 1200,
    date: '18/10/2023',
    status: Status.PENDING
  }
];

export const DISTRIBUTION_DATA: StatusDistribution[] = [
  { name: 'Aprobados', value: 1, color: '#10B981' }, // Green
  { name: 'Rechazados', value: 0, color: '#EF4444' }, // Red
  { name: 'Pendientes', value: 3, color: '#F59E0B' }, // Yellow
];

export const EXPENSE_DATA: ExpenseDataPoint[] = [
  { month: 'Feb', projected: 2000, actual: 2200 },
  { month: 'Mar', projected: 4500, actual: 2300 },
  { month: 'Abr', projected: 2500, actual: 2400 },
  { month: 'May', projected: 2800, actual: 2100 },
  { month: 'Jun', projected: 2600, actual: 2500 },
  { month: 'Jul', projected: 2700, actual: 2800 },
];
