import { AuditLogEntry, ExpenseDataPoint, KPI, ParafiscalMetric, Status, StatusDistribution, TaxCategory } from './types';

export const KPIS: KPI[] = [
  {
    id: '1',
    title: 'Total Impuestos (Mes)',
    value: '$12,450',
    status: Status.APPROVED,
    badge: 'AL DÍA',
    trend: 'up',
    trendValue: '+2.5%'
  },
  {
    id: '2',
    title: 'Carga Parafiscal',
    value: '$4,200',
    subtext: 'Nómina: 150 Empleados',
    status: Status.PENDING,
    trend: 'neutral',
    trendValue: '0%'
  },
  {
    id: '3',
    title: 'Gastos Operativos',
    value: '$8,120',
    subtext: 'vs Presupuesto $8k',
    status: Status.REJECTED,
    trend: 'down',
    trendValue: '+1.5%'
  }
];

export const RECENT_LOGS: AuditLogEntry[] = [
  {
    id: 'log-1',
    title: 'SENIAT - Declaración IVA',
    category: 'Impuestos Nacionales',
    amount: 2450,
    date: '20/10/2023',
    status: Status.APPROVED
  },
  {
    id: 'log-2',
    title: 'IVSS - Aportes Patronales',
    category: 'Parafiscales',
    amount: 1850,
    date: '19/10/2023',
    status: Status.PENDING
  },
  {
    id: 'log-3',
    title: 'Alcaldía - Patente Industria',
    category: 'Impuestos Municipales',
    amount: 1200,
    date: '18/10/2023',
    status: Status.PENDING
  },
  {
    id: 'log-4',
    title: 'Servidor AWS',
    category: 'Infraestructura',
    amount: 450,
    date: '18/10/2023',
    status: Status.APPROVED
  }
];

export const DISTRIBUTION_DATA: StatusDistribution[] = [
  { name: 'Aprobados', value: 65, color: '#10B981' }, 
  { name: 'Rechazados', value: 10, color: '#EF4444' }, 
  { name: 'Pendientes', value: 25, color: '#F59E0B' }, 
];

export const EXPENSE_DATA: ExpenseDataPoint[] = [
  { month: 'May', projected: 2800, actual: 2100 },
  { month: 'Jun', projected: 2600, actual: 2500 },
  { month: 'Jul', projected: 2700, actual: 2800 },
  { month: 'Ago', projected: 3000, actual: 2950 },
  { month: 'Sep', projected: 3100, actual: 3300 },
  { month: 'Oct', projected: 2900, actual: 2800 },
];

export const TAX_DATA: TaxCategory[] = [
  { name: 'IVA (Débito Fiscal)', value: 45, color: '#3B82F6', code: 'IVA' }, // Blue
  { name: 'ISLR (Retenciones)', value: 30, color: '#8B5CF6', code: 'ISLR' }, // Purple
  { name: 'IGTF (Grandes Trans.)', value: 15, color: '#EC4899', code: 'IGTF' }, // Pink
  { name: 'Municipales', value: 10, color: '#10B981', code: 'MUN' }, // Emerald
];

export const PARAFISCAL_DATA: ParafiscalMetric[] = [
  { month: 'May', sso: 1200, faov: 400, inces: 200 },
  { month: 'Jun', sso: 1250, faov: 410, inces: 210 },
  { month: 'Jul', sso: 1220, faov: 405, inces: 205 },
  { month: 'Ago', sso: 1300, faov: 450, inces: 250 },
  { month: 'Sep', sso: 1400, faov: 500, inces: 300 },
  { month: 'Oct', sso: 1350, faov: 480, inces: 280 },
];