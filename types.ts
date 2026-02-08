export enum Status {
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  PENDING = 'PENDING',
}

export interface KPI {
  id: string;
  title: string;
  value: string | number;
  subtext?: string;
  status: Status; // Used to determine color
  badge?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

export interface AuditLogEntry {
  id: string;
  title: string;
  category: string;
  amount: number;
  date: string;
  status: Status;
}

export interface ExpenseDataPoint {
  month: string;
  projected: number;
  actual: number;
}

export interface StatusDistribution {
  name: string;
  value: number;
  color: string;
}

export interface TaxCategory {
  name: string;
  value: number;
  color: string;
  code: string;
}

export interface ParafiscalMetric {
  month: string;
  sso: number; // Seguro Social
  faov: number; // Vivienda
  inces: number; // Capacitacion/Otros
}