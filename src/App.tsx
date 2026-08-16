import { useState, useMemo } from 'react';
import { Calculator, Shield } from 'lucide-react';
import type { LoanParams } from './types';
import { calcMortgage } from './lib/mortgage';
import LoanInputPanel from './components/LoanInputPanel';
import EarlyRepaymentEditor from './components/EarlyRepaymentEditor';
import RateAdjustmentEditor from './components/RateAdjustmentEditor';
import ResultsSummary from './components/ResultsSummary';
import AmortizationTable from './components/AmortizationTable';
import AnnualSummary from './components/AnnualSummary';
import PaymentBreakdownChart from './components/charts/PaymentBreakdownChart';
import BalanceTrendChart from './components/charts/BalanceTrendChart';
import PrincipalInterestPie from './components/charts/PrincipalInterestPie';
import SavingsComparisonChart from './components/charts/SavingsComparisonChart';

export default function App() {
  const [params, setParams] = useState<LoanParams>({
    principal: 1000000,
    annualRate: 4.2,
    rateAdjustments: [],
    termYears: 30,
    method: 'equal_payment',
    earlyRepayments: [],
    startDate: '2026-01',
  });

  const result = useMemo(() => calcMortgage(params), [params]);

  return (
    <div className="min-h-screen bg-[#f7f7fa] text-text-800">
      {/* Navigation Bar - Apple style */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-background-300">
        <div className="max-w-[1400px] mx-auto px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[0.7rem] bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-apple-sm">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-[17px] font-bold text-text-800 tracking-tight">
                房贷计算器
              </h1>
              <p className="text-[11px] text-text-400 -mt-0.5">
                Mortgage Calculator
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f2f2f7] rounded-full">
              <Shield className="w-3.5 h-3.5 text-[#34C759]" />
              <span className="text-[11px] font-medium text-text-600">本地计算</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Inputs */}
          <aside className="lg:col-span-4 xl:col-span-3 space-y-5">
            <LoanInputPanel params={params} onChange={setParams} />
            <RateAdjustmentEditor
              rateAdjustments={params.rateAdjustments}
              onChange={(ra) => setParams({ ...params, rateAdjustments: ra })}
              maxMonth={params.termYears * 12}
              baseRate={params.annualRate}
              startDate={params.startDate}
            />
            <EarlyRepaymentEditor
              earlyRepayments={params.earlyRepayments}
              onChange={(er) => setParams({ ...params, earlyRepayments: er })}
              maxMonth={params.termYears * 12}
              startDate={params.startDate}
            />
          </aside>

          {/* Right Content - Results */}
          <section className="lg:col-span-8 xl:col-span-9 space-y-6">
            <ResultsSummary result={result} />

            {/* Charts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <PaymentBreakdownChart records={result.records} />
              <BalanceTrendChart records={result.records} />
              <PrincipalInterestPie result={result} />
              <SavingsComparisonChart result={result} />
            </div>

            <AnnualSummary records={result.records} startDate={params.startDate} />
            <AmortizationTable records={result.records} startDate={params.startDate} />
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-background-300 py-6 mt-8 bg-white/50">
        <div className="max-w-[1400px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[12px] text-text-400">
            计算结果仅供参考，实际还款金额以银行为准
          </p>
          <p className="text-[12px] text-text-500">
            所有计算在浏览器本地完成 · 数据不上传服务器
          </p>
        </div>
      </footer>
    </div>
  );
}
