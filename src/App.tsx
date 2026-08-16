import { useState, useMemo, useRef, useEffect } from 'react';
import { Calculator, Shield, Palette, ChevronDown, Cog, Skull, Swords, Crown, Flame, Gem, Sparkles } from 'lucide-react';
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

        {/* Warhammer theme header decoration */}
        {theme === 'warhammer' && (
          <div className="wh-motto pb-1.5 pt-0.5">
            <span className="wh-liturgy-strong">✦ 帝皇庇护 · 禁军守护 · 万机之神赐福 ✦</span>
            <br />
            <span className="text-[9px] opacity-60 mt-1 inline-block">
              Imperator Protectet · Custodes Custodiant · Omnissiah Benedicat
            </span>
          </div>
        )}
      </header>

      {/* Main Content - Vertical Flow */}
      <main className="max-w-[1400px] mx-auto px-6 py-6 space-y-6 relative z-10">
        {/* Warhammer decorative - Emperor's Aquila */}
        {theme === 'warhammer' && (
          <div className="flex items-center justify-center gap-4 opacity-50">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#8b6914] to-transparent" />
            <Crown className="w-4 h-4 text-[#f0d070]" style={{ filter: 'drop-shadow(0 0 6px rgba(240,208,112,0.5))' }} />
            <Swords className="w-4 h-4 text-[#d4a853]" />
            <Skull className="w-5 h-5 text-[#f0d070]" style={{ filter: 'drop-shadow(0 0 6px rgba(240,208,112,0.5))' }} />
            <Swords className="w-4 h-4 text-[#d4a853]" style={{ transform: 'scaleX(-1)' }} />
            <Crown className="w-4 h-4 text-[#f0d070]" style={{ filter: 'drop-shadow(0 0 6px rgba(240,208,112,0.5))' }} />
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#8b6914] to-transparent" />
          </div>
        )}

        {/* Input Section - Top */}
        <section className="animate-slide-up animate-backwards">
          <LoanInputPanel params={params} onChange={setParams} />
        </section>

        {/* Warhammer liturgy divider */}
        {theme === 'warhammer' && (
          <div className="wh-liturgy">
            <Flame className="inline w-3 h-3 mr-2 text-[#c41e3a]" style={{ filter: 'drop-shadow(0 0 4px rgba(196,30,58,0.5))' }} />
            知识就是力量 · 钢铁就是意志 · 唯有帝皇是人类的救赎
            <Flame className="inline w-3 h-3 ml-2 text-[#c41e3a]" style={{ filter: 'drop-shadow(0 0 4px rgba(196,30,58,0.5))' }} />
          </div>
        )}

        {/* Results Summary */}
        <section className="animate-slide-up animate-backwards animation-delay-1">
          <ResultsSummary result={result} />
        </section>

        {/* Warhammer - Cog & skull divider */}
        {theme === 'warhammer' && (
          <div className="flex items-center justify-center gap-3 opacity-40">
            <Cog className="w-3.5 h-3.5 text-[#d4a853]" />
            <Gem className="w-3 h-3 text-[#f0d070]" />
            <Skull className="w-4 h-4 text-[#d4a853]" />
            <Gem className="w-3 h-3 text-[#f0d070]" />
            <Cog className="w-3.5 h-3.5 text-[#d4a853]" />
          </div>
        )}

        {/* Charts Row */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-slide-up animate-backwards animation-delay-2">
          <BalanceTrendChart records={result.records} theme={theme} />
          <PrincipalInterestPie result={result} theme={theme} />
        </section>

        {/* Warhammer - chaos gods decorative hint */}
        {theme === 'warhammer' && (
          <div className="wh-liturgy opacity-40 text-center">
            <Sparkles className="inline w-2.5 h-2.5 mr-1.5 text-[#daa520]" />
            恐惧是心灵杀手 · 变化是唯一永恒 · 腐朽亦是生命 · 完美在于求索
            <Sparkles className="inline w-2.5 h-2.5 ml-1.5 text-[#daa520]" />
          </div>
        )}

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

        {/* Warhammer bottom decoration - Horus Heresy style */}
        {theme === 'warhammer' && (
          <div className="flex flex-col items-center gap-2 opacity-50">
            <div className="wh-horus-divider w-full" />
            <div className="flex items-center gap-3">
              <Skull className="w-3.5 h-3.5 text-[#8b6914]" />
              <span className="wh-liturgy text-[8px]">
                为帝皇而死胜于为自己而生 · It is better to die for the Emperor than to live for yourself
              </span>
              <Skull className="w-3.5 h-3.5 text-[#8b6914]" />
            </div>
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
            <div className="text-center">
              <p className="wh-motto wh-motto-omnissiah text-[10px]">
                ☩ 帝皇端坐金王座之上 · 守护人类万年 ☩
              </p>
              <p className="text-[9px] text-[#5e4d38] mt-1">
                The Emperor sits upon the Golden Throne, guarding mankind for ten thousand years
              </p>
            </div>
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
