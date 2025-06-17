// types/user.ts
export interface User {
  _id: string;
  name: string;
  email: string;
  department: string;
  role?: string;
  totalPoints: number;
  salary?: number;
  overhead?: number;
  monthlyHours?: number;
  effectiveHourlyCost?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CostSummary {
  totalUsers: number;
  totalMonthlyCost: number;
  avgHourlyCost: number;
  totalAnnualCost: number;
}

export interface UserFormData {
  name: string;
  email: string;
  department: string;
  role: string;
  salary: string;
  overhead: string;
  monthlyHours: string;
}

export interface FormErrors {
  name: string;
  email: string;
  salary: string;
  overhead: string;
  monthlyHours: string;
}