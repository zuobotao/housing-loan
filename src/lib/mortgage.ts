import type {
  LoanParams,
  PaymentRecord,
  CalcResult,
  RepaymentMethod,
  EarlyRepayment,
  RateAdjustment,
} from '../types';

function calcMonthlyPaymentEqual(
  principal: number,
  monthlyRate: number,
  months: number,
): number {
  if (monthlyRate === 0) return principal / months;
  const factor = Math.pow(1 + monthlyRate, months);
  return (principal * monthlyRate * factor) / (factor - 1);
}

function calcRemainingMonthsEqual(
  remainingBalance: number,
  monthlyRate: number,
  monthlyPayment: number,
): number {
  if (monthlyRate === 0) return Math.ceil(remainingBalance / monthlyPayment);
  const x = 1 - (remainingBalance * monthlyRate) / monthlyPayment;
  if (x <= 0) return 9999;
  return Math.ceil(-Math.log(x) / Math.log(1 + monthlyRate));
}

function getMonthlyRate(
  month: number,
  baseRate: number,
  adjustments: RateAdjustment[],
): number {
  let rate = baseRate;
  for (const adj of adjustments) {
    if (adj.month <= month) rate = adj.annualRate;
  }
  return rate / 12 / 100;
}

function getAnnualRate(
  month: number,
  baseRate: number,
  adjustments: RateAdjustment[],
): number {
  let rate = baseRate;
  for (const adj of adjustments) {
    if (adj.month <= month) rate = adj.annualRate;
  }
  return rate;
}

function isRateAdjustmentMonth(
  month: number,
  adjustments: RateAdjustment[],
): boolean {
  return adjustments.some((adj) => adj.month === month);
}

interface BaselineResult {
  monthlyPayment: number;
  totalInterest: number;
  totalPayment: number;
  termMonths: number;
}

function calcBaseline(
  principal: number,
  baseRate: number,
  adjustments: RateAdjustment[],
  totalMonths: number,
  method: RepaymentMethod,
): BaselineResult {
  let remainingBalance = principal;
  let totalInterest = 0;
  let totalPayment = 0;

  if (method === 'equal_payment') {
    let monthlyPayment = calcMonthlyPaymentEqual(
      principal,
      getMonthlyRate(1, baseRate, adjustments),
      totalMonths,
    );

    for (let m = 1; m <= totalMonths; m++) {
      const monthlyRate = getMonthlyRate(m, baseRate, adjustments);
      if (isRateAdjustmentMonth(m, adjustments) && m > 1) {
        monthlyPayment = calcMonthlyPaymentEqual(
          remainingBalance,
          monthlyRate,
          totalMonths - m + 1,
        );
      }
      const interest = remainingBalance * monthlyRate;
      let principalPart = monthlyPayment - interest;
      if (m === totalMonths) principalPart = remainingBalance;
      remainingBalance -= principalPart;
      totalInterest += interest;
      totalPayment += principalPart + interest;
    }
    return {
      monthlyPayment,
      totalInterest,
      totalPayment,
      termMonths: totalMonths,
    };
  } else {
    const monthlyPrincipal = principal / totalMonths;
    const firstPayment =
      monthlyPrincipal + principal * getMonthlyRate(1, baseRate, adjustments);
    for (let m = 1; m <= totalMonths; m++) {
      const monthlyRate = getMonthlyRate(m, baseRate, adjustments);
      const interest = remainingBalance * monthlyRate;
      let principalPart = monthlyPrincipal;
      if (m === totalMonths) principalPart = remainingBalance;
      remainingBalance -= principalPart;
      totalInterest += interest;
      totalPayment += principalPart + interest;
    }
    return {
      monthlyPayment: firstPayment,
      totalInterest,
      totalPayment,
      termMonths: totalMonths,
    };
  }
}

function calcWithEarlyRepayments(
  principal: number,
  baseRate: number,
  adjustments: RateAdjustment[],
  totalMonths: number,
  method: RepaymentMethod,
  earlyRepayments: EarlyRepayment[],
): PaymentRecord[] {
  const records: PaymentRecord[] = [];
  let remainingBalance = principal;
  let remainingMonths = totalMonths;

  let currentMonthlyPayment = 0;
  let currentMonthlyPrincipal = 0;

  if (method === 'equal_payment') {
    currentMonthlyPayment = calcMonthlyPaymentEqual(
      principal,
      getMonthlyRate(1, baseRate, adjustments),
      totalMonths,
    );
  } else {
    currentMonthlyPrincipal = principal / totalMonths;
  }

  const erByMonth = new Map<number, EarlyRepayment[]>();
  for (const er of earlyRepayments) {
    if (!erByMonth.has(er.month)) erByMonth.set(er.month, []);
    erByMonth.get(er.month)!.push(er);
  }

  let currentMonth = 1;

  while (remainingBalance > 0.01) {
    const monthlyRate = getMonthlyRate(currentMonth, baseRate, adjustments);
    const annualRate = getAnnualRate(currentMonth, baseRate, adjustments);
    const rateAdjusted = isRateAdjustmentMonth(currentMonth, adjustments);

    if (method === 'equal_payment' && rateAdjusted && currentMonth > 1) {
      currentMonthlyPayment = calcMonthlyPaymentEqual(
        remainingBalance,
        monthlyRate,
        remainingMonths,
      );
    }

    const interest = remainingBalance * monthlyRate;
    let principalPart: number;
    let scheduledPayment: number;

    if (method === 'equal_payment') {
      principalPart = Math.min(currentMonthlyPayment - interest, remainingBalance);
      scheduledPayment = principalPart + interest;
    } else {
      principalPart = Math.min(currentMonthlyPrincipal, remainingBalance);
      scheduledPayment = principalPart + interest;
    }

    remainingBalance -= principalPart;
    remainingMonths--;

    const erEvents = erByMonth.get(currentMonth) || [];
    let earlyRepaymentTotal = 0;
    let isERMonth = false;

    for (const er of erEvents) {
      if (remainingBalance <= 0.01) break;
      const erAmount = Math.min(er.amount, remainingBalance);
      remainingBalance -= erAmount;
      earlyRepaymentTotal += erAmount;
      isERMonth = true;

      if (remainingBalance > 0.01 && remainingMonths > 0) {
        if (er.strategy === 'reduce_payment') {
          if (method === 'equal_payment') {
            currentMonthlyPayment = calcMonthlyPaymentEqual(
              remainingBalance,
              monthlyRate,
              remainingMonths,
            );
          } else {
            currentMonthlyPrincipal = remainingBalance / remainingMonths;
          }
        } else {
          if (method === 'equal_payment') {
            remainingMonths = calcRemainingMonthsEqual(
              remainingBalance,
              monthlyRate,
              currentMonthlyPayment,
            );
          } else {
            remainingMonths = Math.ceil(remainingBalance / currentMonthlyPrincipal);
          }
        }
      }
    }

    records.push({
      month: currentMonth,
      payment: scheduledPayment + earlyRepaymentTotal,
      scheduledPayment,
      principal: principalPart,
      interest,
      earlyRepayment: earlyRepaymentTotal > 0 ? earlyRepaymentTotal : undefined,
      remainingBalance: Math.max(0, remainingBalance),
      isEarlyRepaymentMonth: isERMonth,
      annualRate,
      isRateAdjustmentMonth: rateAdjusted,
    });

    if (remainingBalance <= 0.01) break;
    currentMonth++;

    if (currentMonth > totalMonths * 3) break;
  }

  return records;
}

export function calcMortgage(params: LoanParams): CalcResult {
  const { principal, annualRate, rateAdjustments, termYears, method, earlyRepayments } = params;
  const totalMonths = termYears * 12;

  const sortedAdjustments = [...rateAdjustments]
    .filter((ra) => ra.month >= 1 && ra.month <= totalMonths && ra.annualRate > 0)
    .sort((a, b) => a.month - b.month);

  const baseline = calcBaseline(
    principal,
    annualRate,
    sortedAdjustments,
    totalMonths,
    method,
  );

  const sortedER = [...earlyRepayments]
    .filter((er) => er.month >= 1 && er.month <= totalMonths && er.amount > 0)
    .sort((a, b) => a.month - b.month);

  const records = calcWithEarlyRepayments(
    principal,
    annualRate,
    sortedAdjustments,
    totalMonths,
    method,
    sortedER,
  );

  const totalInterest = records.reduce((sum, r) => sum + r.interest, 0);
  const totalPayment = records.reduce((sum, r) => sum + r.payment, 0);
  const actualTermMonths = records.length;

  return {
    records,
    monthlyPayment: records[0]?.scheduledPayment ?? 0,
    totalPayment,
    totalInterest,
    totalPrincipal: principal,
    actualTermMonths,
    baseline,
    interestSaved: baseline.totalInterest - totalInterest,
    monthsSaved: baseline.termMonths - actualTermMonths,
  };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatMonths(months: number): string {
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  if (years === 0) return `${remainingMonths}个月`;
  if (remainingMonths === 0) return `${years}年`;
  return `${years}年${remainingMonths}个月`;
}

export function monthToYearMonth(month: number, startDate?: string): string {
  if (!startDate) return `第${month}期`;
  const start = new Date(startDate);
  if (isNaN(start.getTime())) return `第${month}期`;
  const year = start.getFullYear() + Math.floor((start.getMonth() + month - 1) / 12);
  const mon = ((start.getMonth() + month - 1) % 12) + 1;
  return `${year}-${String(mon).padStart(2, '0')}`;
}

export function yearMonthToMonth(ym: string, startDate?: string): number {
  if (!startDate) return 1;
  const start = new Date(startDate);
  if (isNaN(start.getTime())) return 1;
  const parts = ym.split('-');
  if (parts.length !== 2) return 1;
  const targetYear = parseInt(parts[0]);
  const targetMon = parseInt(parts[1]);
  if (isNaN(targetYear) || isNaN(targetMon)) return 1;
  const diffMonths = (targetYear - start.getFullYear()) * 12 + (targetMon - 1 - start.getMonth());
  return diffMonths + 1;
}
