import { useState, useMemo, useRef, useEffect } from 'react';
import { Calculator, Shield, Palette, ChevronDown, Cog, Skull } from 'lucide-react';
import type { LoanParams } from './types';
import { calcMortgage } from './lib/mortgage';
import LoanInputPanel from './components/LoanInputPanel';
import ResultsSummary from './components/ResultsSummary';
import AmortizationTable from './components/AmortizationTable';
import AnnualSummary from './components/AnnualSummary';
import BalanceTrendChart from './components/charts/BalanceTrendChart';
import PrincipalInterestPie from './components/charts/PrincipalInterestPie';

export type Theme = 'apple' | 'warhammer' | 'wulin' | 'renmin' | 'daming' | 'rickmorty';

const themeList: { id: Theme; name: string; desc: string; colors: [string, string] }[] = [
  { id: 'apple', name: 'Apple 风格', desc: '简洁现代', colors: ['#007AFF', '#f2f2f7'] },
  { id: 'warhammer', name: '战锤 40K', desc: '帝国哥特', colors: ['#d4a853', '#0a0806'] },
  { id: 'wulin', name: '武林外传', desc: '同福客栈', colors: ['#a0322c', '#f5ecd9'] },
  { id: 'renmin', name: '人民的名义', desc: '冷峻纪实', colors: ['#c5221f', '#e8eaed'] },
  { id: 'daming', name: '大明王朝1566', desc: '凝重典雅', colors: ['#8b3a3a', '#d9d2c5'] },
  { id: 'rickmorty', name: '瑞克和莫蒂', desc: '迷幻卡通', colors: ['#2bd42b', '#1a1a2e'] },
];

export default function App() {
  const [theme, setTheme] = useState<Theme>('apple');
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  // Close menu on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const themeClass =
    theme === 'apple'
      ? 'theme-apple'
      : theme === 'warhammer'
      ? 'theme-warhammer'
      : theme === 'wulin'
      ? 'theme-wulin'
      : theme === 'renmin'
      ? 'theme-renmin'
      : theme === 'daming'
      ? 'theme-daming'
      : 'theme-rickmorty';

  const currentThemeInfo = themeList.find((t) => t.id === theme)!;

  const selectTheme = (t: Theme) => {
    setTheme(t);
    setMenuOpen(false);
  };

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
            {/* Theme Switcher Dropdown */}
            <div className="theme-switcher" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="theme-toggle-btn"
                title="切换主题"
              >
                <Palette className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{currentThemeInfo.name}</span>
                <ChevronDown
                  className={`w-3 h-3 transition-transform ${menuOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {menuOpen && (
                <div className="theme-switcher-menu">
                  {themeList.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => selectTheme(t.id)}
                      className={theme === t.id ? 'active' : ''}
                    >
                      <div
                        className="theme-swatch"
                        style={{ '--c1': t.colors[0], '--c2': t.colors[1] } as React.CSSProperties}
                      >
                        <div className="theme-swatch-inner" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{t.name}</div>
                        <div className="text-[10px] opacity-60 mt-0.5">{t.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Warhammer theme header decoration - Omnissiah motto */}
        {theme === 'warhammer' && (
          <div className="wh-motto wh-motto-omnissiah pb-1.5 pt-0.5">
            ✦ 赞美万机之神 · 愿欧姆弥赛亚赐福于你的计算 · Praise the Omnissiah ✦
          </div>
        )}
      </header>

      {/* Main Content - Vertical Flow */}
      <main className="max-w-[1400px] mx-auto px-6 py-6 space-y-6 relative z-10">
        {/* Warhammer decorative divider */}
        {theme === 'warhammer' && (
          <div className="wh-gothic-divider opacity-40 animate-fade-in">
            <Skull className="w-4 h-4 text-[#d4a853]" />
          </div>
        )}

        {/* Input Section - Top */}
        <section className="animate-slide-up animate-backwards">
          <LoanInputPanel params={params} onChange={setParams} />
        </section>

        {/* Results Summary */}
        <section className="animate-slide-up animate-backwards animation-delay-1">
          <ResultsSummary result={result} />
        </section>

        {/* Charts Row */}
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

        {/* Warhammer bottom decoration */}
        {theme === 'warhammer' && (
          <div className="wh-gothic-divider opacity-30">
            <Cog className="w-4 h-4 text-[#d4a853]" />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-background-300 py-6 mt-8 bg-white/50">
        <div className="max-w-[1400px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[12px] text-text-400">
            计算结果仅供参考，实际还款金额以银行为准
          </p>
          {theme === 'warhammer' ? (
            <p className="wh-motto wh-motto-omnissiah">
              知识就是力量 · 钢铁就是意志 · Knowledge is Power, Guard it Well
            </p>
          ) : (
            <p className="text-[12px] text-text-500">
              所有计算在浏览器本地完成 · 数据不上传服务器
            </p>
          )}
        </div>
      </footer>
    </div>
  );
}
