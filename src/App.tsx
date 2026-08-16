import { useState, useMemo } from 'react';
import { Calculator, Shield, Sword } from 'lucide-react';
import type { LoanParams } from './types';
import { calcMortgage } from './lib/mortgage';
import LoanInputPanel from './components/LoanInputPanel';
import ResultsSummary from './components/ResultsSummary';
import AmortizationTable from './components/AmortizationTable';
import AnnualSummary from './components/AnnualSummary';
import BalanceTrendChart from './components/charts/BalanceTrendChart';
import PrincipalInterestPie from './components/charts/PrincipalInterestPie';

export type Theme = 'apple' | 'warhammer';

export default function App() {
  const [theme, setTheme] = useState<Theme>('apple');

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

  const toggleTheme = () => {
    setTheme(theme === 'apple' ? 'warhammer' : 'apple');
  };

  const themeClass = theme === 'warhammer' ? 'theme-warhammer' : 'theme-apple';

  return (
    <div className={`min-h-screen ${themeClass} transition-colors duration-300`}>
      {/* Navigation Bar */}
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
            <button
              onClick={toggleTheme}
              className="theme-toggle-btn"
              title={theme === 'apple' ? '切换至战锤风格' : '切换至苹果风格'}
            >
              <Sword className="w-3.5 h-3.5" />
              {theme === 'apple' ? '战锤' : '苹果'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content - Vertical Flow */}
      <main className="max-w-[1400px] mx-auto px-6 py-6 space-y-6">
        {/* Input Section - Top */}
        <section className="animate-slide-up animate-backwards">
          <LoanInputPanel params={params} onChange={setParams} />
        </section>

        {/* Results Summary */}
        <section className="animate-slide-up animate-backwards animation-delay-1">
          <ResultsSummary result={result} />
        </section>

        {/* Charts Row - Reduced to 2 */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-slide-up animate-backwards animation-delay-2">
          <BalanceTrendChart records={result.records} theme={theme} />
          <PrincipalInterestPie result={result} theme={theme} />
        </section>

        {/* Annual / Monthly Summary with Toggle */}
        <section className="animate-slide-up animate-backwards animation-delay-3">
          <AnnualSummary records={result.records} startDate={params.startDate} theme={theme} />
        </section>

        {/* Detail Table with inline editing */}
        <section className="animate-slide-up animate-backwards animation-delay-4">
          <AmortizationTable
            records={result.records}
            startDate={params.startDate}
            earlyRepayments={params.earlyRepayments}
            rateAdjustments={params.rateAdjustments}
            onEarlyRepaymentsChange={(er) => setParams({ ...params, earlyRepayments: er })}
            onRateAdjustmentsChange={(ra) => setParams({ ...params, rateAdjustments: ra })}
          />
        </section>
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
