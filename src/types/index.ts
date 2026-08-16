export type RepaymentMethod = 'equal_payment' | 'equal_principal';

export type EarlyRepaymentStrategy = 'reduce_payment' | 'reduce_term';

export interface EarlyRepayment {
  id: string;
  month: number;
  amount: number;
  strategy: EarlyRepaymentStrategy;
}

export interface RateAdjustment {
  id: string;
  month: number;
  annualRate: number;
}

export interface LoanParams {
  principal: number;
  annualRate: number;
  rateAdjustments: RateAdjustment[];
  termYears: number;
  method: RepaymentMethod;
  earlyRepayments: EarlyRepayment[];
  startDate: string;
}

export interface PaymentRecord {
  month: number;
  payment: number;
  scheduledPayment: number;
  principal: number;
  interest: number;
  earlyRepayment?: number;
  remainingBalance: number;
  isEarlyRepaymentMonth: boolean;
  annualRate: number;
  isRateAdjustmentMonth: boolean;
}

export interface CalcResult {
  records: PaymentRecord[];
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  totalPrincipal: number;
  actualTermMonths: number;
  baseline: {
    monthlyPayment: number;
    totalInterest: number;
    totalPayment: number;
    termMonths: number;
  };
  interestSaved: number;
  monthsSaved: number;
}
