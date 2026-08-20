import { useState, useMemo, useRef, useEffect } from 'react';
import { Calculator, Shield, Palette, ChevronDown, Cog, Skull, Swords, Crown, Flame, Gem, Sparkles, Atom, Zap, FlaskConical, BookOpen, Wand2 } from 'lucide-react';
import type { LoanParams } from './types';
import { calcMortgage } from './lib/mortgage';
import LoanInputPanel from './components/LoanInputPanel';
import ResultsSummary from './components/ResultsSummary';
import AmortizationTable from './components/AmortizationTable';
import AnnualSummary from './components/AnnualSummary';
import BalanceTrendChart from './components/charts/BalanceTrendChart';
import PrincipalInterestPie from './components/charts/PrincipalInterestPie';

export type Theme = 'apple' | 'warhammer' | 'wulin' | 'renmin' | 'daming' | 'rickmorty' | 'harrypotter';

const themeList: { id: Theme; name: string; desc: string; colors: [string, string] }[] = [
  { id: 'apple', name: 'Apple 风格', desc: '简洁现代', colors: ['#007AFF', '#f2f2f7'] },
  { id: 'warhammer', name: '战区纪元', desc: '血腥·魔幻·赛博·蒸汽', colors: ['#dc143c', '#050103'] },
  { id: 'wulin', name: '武林外传', desc: '同福客栈', colors: ['#a0322c', '#f5ecd9'] },
  { id: 'renmin', name: '人民的名义', desc: '冷峻纪实', colors: ['#c5221f', '#e8eaed'] },
  { id: 'daming', name: '大明王朝1566', desc: '凝重典雅', colors: ['#8b3a3a', '#d9d2c5'] },
  { id: 'rickmorty', name: '瑞克和莫蒂', desc: '迷幻卡通', colors: ['#2bd42b', '#1a1a2e'] },
  { id: 'harrypotter', name: '哈利波特', desc: '魔法·宿命·古咒', colors: ['#d4af37', '#0a0a0f'] },
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
      : theme === 'rickmorty'
      ? 'theme-rickmorty'
      : 'theme-harrypotter';

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
            {theme === 'warhammer' ? (
              <>
                <Skull className="w-5 h-5 shrink-0" style={{ color: '#cd7f32', filter: 'drop-shadow(0 0 6px rgba(205,127,50,0.5))' }} />
                <div className="wh-nameplate">
                  <div>
                    <div className="wh-nameplate-title">铁律殉道台</div>
                  <div className="wh-nameplate-sub">Martyr Platform</div>
                  </div>
                </div>
                <Cog className="w-4 h-4 shrink-0" style={{ color: '#b8860b', filter: 'drop-shadow(0 0 4px rgba(184,134,11,0.4))' }} />
              </>
            ) : theme === 'rickmorty' ? (
              <>
                <Atom className="w-5 h-5 shrink-0 rm-portal-swirl" style={{ color: 'var(--rm-green-bright)', filter: 'drop-shadow(0 0 6px rgba(43,212,43,0.5))' }} />
                <div className="rm-nameplate">
                  <div>
                    <div className="rm-nameplate-title">跨维锚定台</div>
                    <div className="rm-nameplate-sub">Rick's Dimension Anchor</div>
                  </div>
                </div>
                <FlaskConical className="w-4 h-4 shrink-0" style={{ color: 'var(--rm-blue)', filter: 'drop-shadow(0 0 4px rgba(0,191,255,0.4))' }} />
              </>
            ) : theme === 'harrypotter' ? (
              <>
                <BookOpen className="w-5 h-5 shrink-0" style={{ color: 'var(--hp-gold)', filter: 'drop-shadow(0 0 6px rgba(212,175,55,0.5))' }} />
                <div className="hp-nameplate">
                  <div>
                    <div className="hp-nameplate-title">永恒誓约祭坛</div>
                    <div className="hp-nameplate-sub">Eternal Pact Altar</div>
                  </div>
                </div>
                <Wand2 className="w-4 h-4 shrink-0" style={{ color: 'var(--hp-emerald)', filter: 'drop-shadow(0 0 4px rgba(80,200,120,0.4))' }} />
              </>
            ) : (
              <>
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
              </>
            )}
          </div>

          {/* Center slogan for Warhammer / Rick and Morty */}
          {theme === 'warhammer' && (
            <div className="hidden lg:block absolute left-1/2 -translate-x-1/2">
              <span className="wh-latin-slogan">
                SANGUIS PRO SANGUINE · FERRUM PRO FERRONE · DEBITUM EST BELLA SACRA
              </span>
            </div>
          )}
          {theme === 'rickmorty' && (
            <div className="hidden lg:block absolute left-1/2 -translate-x-1/2">
              <span className="rm-latin-slogan">
                WUBBA LUBBA DUB DUB · INFINITE LOOP · DIMENSIONAL CURSE
              </span>
            </div>
          )}
          {theme === 'harrypotter' && (
            <div className="hidden lg:block absolute left-1/2 -translate-x-1/2">
              <span className="hp-latin-slogan">
                DRACO DORMIENS NUNQUAM TITILLANDUS · FATE CYCLES FOREVER
              </span>
            </div>
          )}

          <div className="flex items-center gap-2">
            {theme === 'warhammer' ? (
              <>
                <div className="wh-circular-btn wh-circular-btn-wide" title="本地计算">
                  <Shield className="w-3.5 h-3.5" style={{ color: 'var(--wh-gold)' }} />
                  <span className="text-[11px] font-medium" style={{ fontFamily: 'Cinzel, serif', letterSpacing: '0.05em' }}>本地祷算</span>
                </div>
                {/* Theme Switcher Dropdown */}
                <div className="theme-switcher" ref={menuRef}>
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="wh-circular-btn wh-circular-btn-wide"
                    title="切换主题"
                  >
                    <Cog className="w-3.5 h-3.5" style={{ color: 'var(--wh-gold)' }} />
                    <span className="hidden sm:inline text-[11px]" style={{ fontFamily: 'Cinzel, serif', letterSpacing: '0.05em' }}>{currentThemeInfo.name}</span>
                    <ChevronDown className={`w-3 h-3 transition-transform ${menuOpen ? 'rotate-180' : ''}`} style={{ color: 'var(--wh-gold)' }} />
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
              </>
            ) : theme === 'rickmorty' ? (
              <>
                <div className="rm-circular-btn rm-circular-btn-wide" title="本地演算">
                  <Shield className="w-3.5 h-3.5" style={{ color: 'var(--rm-green-bright)' }} />
                  <span className="text-[11px]" style={{ fontFamily: 'Bangers, sans-serif', letterSpacing: '0.05em' }}>本地演算</span>
                </div>
                {/* Theme Switcher Dropdown */}
                <div className="theme-switcher" ref={menuRef}>
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="rm-circular-btn rm-circular-btn-wide"
                    title="切换主题"
                  >
                    <Atom className="w-3.5 h-3.5" style={{ color: 'var(--rm-green-bright)' }} />
                    <span className="hidden sm:inline text-[11px]" style={{ fontFamily: 'Bangers, sans-serif', letterSpacing: '0.05em' }}>{currentThemeInfo.name}</span>
                    <ChevronDown className={`w-3 h-3 transition-transform ${menuOpen ? 'rotate-180' : ''}`} style={{ color: 'var(--rm-green-bright)' }} />
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
              </>
            ) : theme === 'harrypotter' ? (
              <>
                <div className="hp-circular-btn hp-circular-btn-wide" title="本地魔理演算">
                  <Shield className="w-3.5 h-3.5" style={{ color: 'var(--hp-gold)' }} />
                  <span className="text-[11px] font-medium" style={{ fontFamily: 'Cinzel, serif', letterSpacing: '0.05em' }}>本地魔理演算</span>
                </div>
                {/* Theme Switcher Dropdown */}
                <div className="theme-switcher" ref={menuRef}>
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="hp-circular-btn hp-circular-btn-wide"
                    title="切换主题"
                  >
                    <BookOpen className="w-3.5 h-3.5" style={{ color: 'var(--hp-gold)' }} />
                    <span className="hidden sm:inline text-[11px]" style={{ fontFamily: 'Cinzel, serif', letterSpacing: '0.05em' }}>{currentThemeInfo.name}</span>
                    <ChevronDown className={`w-3 h-3 transition-transform ${menuOpen ? 'rotate-180' : ''}`} style={{ color: 'var(--hp-gold)' }} />
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
              </>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>

        {/* Warhammer theme header decoration */}
        {theme === 'warhammer' && (
          <div className="max-w-[1400px] mx-auto px-6 pb-2">
            <div className="wh-armor-divider mb-2" />
            <div className="text-center pb-1">
              <span className="wh-top-motto">× 以血立誓 · 以铁守律 · 劳役即是圣战 ×</span>
            </div>
          </div>
        )}
        {/* Rick and Morty theme header decoration */}
        {theme === 'rickmorty' && (
          <div className="max-w-[1400px] mx-auto px-6 pb-2">
            <div className="rm-armor-divider mb-2" />
            <div className="text-center pb-1">
              <span className="rm-top-motto">✦ 穿梭无尽位面 · 循环永不停歇 · 痛苦藏于疯狂之下 ✦</span>
            </div>
          </div>
        )}
        {/* Harry Potter theme header decoration */}
        {theme === 'harrypotter' && (
          <div className="max-w-[1400px] mx-auto px-6 pb-2">
            <div className="hp-armor-divider mb-2" />
            <div className="text-center pb-1">
              <span className="hp-top-motto">✦ 古咒永续生效 · 宿命不断轮回 · 枷锁束缚巫师血脉 ✦</span>
            </div>
          </div>
        )}
      </header>

      {/* Main Content - Vertical Flow */}
      <main className={`max-w-[1400px] mx-auto px-6 py-6 space-y-6 relative z-10 ${theme === 'warhammer' ? 'wh-etched-top wh-etched-bottom' : ''}`}>
        {/* Warhammer decorative - Emperor's Aquila with armor divider */}
        {theme === 'warhammer' && (
          <div className="flex items-center justify-center gap-3 wh-warp-rift">
            <div className="flex-1 wh-armor-divider" />
            <Cog className="w-3.5 h-3.5 text-[#cd7f32] shrink-0" style={{ filter: 'drop-shadow(0 0 4px rgba(205,127,50,0.4))' }} />
            <Crown className="w-4 h-4 text-[#ffd700] shrink-0" style={{ filter: 'drop-shadow(0 0 6px rgba(255,215,0,0.5))' }} />
            <Swords className="w-4 h-4 text-[#dc143c] shrink-0" style={{ filter: 'drop-shadow(0 0 4px rgba(220,20,60,0.4))' }} />
            <Skull className="w-5 h-5 text-[#ffd700] shrink-0" style={{ filter: 'drop-shadow(0 0 8px rgba(255,215,0,0.6))' }} />
            <Swords className="w-4 h-4 text-[#dc143c] shrink-0" style={{ filter: 'drop-shadow(0 0 4px rgba(220,20,60,0.4))', transform: 'scaleX(-1)' }} />
            <Crown className="w-4 h-4 text-[#ffd700] shrink-0" style={{ filter: 'drop-shadow(0 0 6px rgba(255,215,0,0.5))' }} />
            <Cog className="w-3.5 h-3.5 text-[#cd7f32] shrink-0" style={{ filter: 'drop-shadow(0 0 4px rgba(205,127,50,0.4))' }} />
            <div className="flex-1 wh-armor-divider" />
          </div>
        )}
        {/* Rick and Morty decorative - portal divider */}
        {theme === 'rickmorty' && (
          <div className="flex items-center justify-center gap-3">
            <div className="flex-1 rm-armor-divider" />
            <Atom className="w-4 h-4 shrink-0 rm-portal-swirl" style={{ color: 'var(--rm-green-bright)', filter: 'drop-shadow(0 0 4px rgba(43,212,43,0.4))' }} />
            <FlaskConical className="w-4 h-4 shrink-0" style={{ color: 'var(--rm-blue)', filter: 'drop-shadow(0 0 4px rgba(0,191,255,0.4))' }} />
            <Zap className="w-5 h-5 shrink-0" style={{ color: 'var(--rm-yellow)', filter: 'drop-shadow(0 0 6px rgba(255,215,0,0.5))' }} />
            <FlaskConical className="w-4 h-4 shrink-0" style={{ color: 'var(--rm-purple)', filter: 'drop-shadow(0 0 4px rgba(153,50,204,0.4))' }} />
            <Atom className="w-4 h-4 shrink-0 rm-portal-swirl" style={{ color: 'var(--rm-green)', filter: 'drop-shadow(0 0 4px rgba(43,212,43,0.4))' }} />
            <div className="flex-1 rm-armor-divider" />
          </div>
        )}
        {/* Harry Potter decorative - runic divider */}
        {theme === 'harrypotter' && (
          <div className="flex items-center justify-center gap-3">
            <div className="flex-1 hp-armor-divider" />
            <BookOpen className="w-4 h-4 shrink-0" style={{ color: 'var(--hp-gold)', filter: 'drop-shadow(0 0 4px rgba(212,175,55,0.4))' }} />
            <Sparkles className="w-4 h-4 shrink-0" style={{ color: 'var(--hp-emerald)', filter: 'drop-shadow(0 0 4px rgba(80,200,120,0.4))' }} />
            <Wand2 className="w-5 h-5 shrink-0" style={{ color: 'var(--hp-gold-bright)', filter: 'drop-shadow(0 0 6px rgba(240,208,80,0.5))' }} />
            <Sparkles className="w-4 h-4 shrink-0" style={{ color: 'var(--hp-emerald)', filter: 'drop-shadow(0 0 4px rgba(80,200,120,0.4))' }} />
            <BookOpen className="w-4 h-4 shrink-0" style={{ color: 'var(--hp-gold)', filter: 'drop-shadow(0 0 4px rgba(212,175,55,0.4))' }} />
            <div className="flex-1 hp-armor-divider" />
          </div>
        )}

        {/* Input Section - Top */}
        <section className="animate-slide-up animate-backwards">
          <LoanInputPanel params={params} onChange={setParams} theme={theme} />
        </section>

        {/* Warhammer banner light strip */}
        {theme === 'warhammer' && (
          <div className="wh-banner-strip">
            <Flame className="inline w-3.5 h-3.5 mr-2.5 align-middle" style={{ color: 'var(--wh-blood-bright)', filter: 'drop-shadow(0 0 6px rgba(220,20,60,0.6))' }} />
            <span className="wh-banner-text">血贡献祭 · 颅骨加冕 · 万机之神执掌钢铁誓约</span>
            <Flame className="inline w-3.5 h-3.5 ml-2.5 align-middle" style={{ color: 'var(--wh-blood-bright)', filter: 'drop-shadow(0 0 6px rgba(220,20,60,0.6))' }} />
          </div>
        )}
        {/* Rick and Morty banner strip */}
        {theme === 'rickmorty' && (
          <div className="rm-banner-strip">
            <Zap className="inline w-3.5 h-3.5 mr-2.5 align-middle" style={{ color: 'var(--rm-yellow)', filter: 'drop-shadow(0 0 6px rgba(255,215,0,0.6))' }} />
            <span className="rm-banner-text">Wubba Lubba Dub Dub！次元裂缝永不闭合 · 无休止的实验没有终点</span>
            <Zap className="inline w-3.5 h-3.5 ml-2.5 align-middle" style={{ color: 'var(--rm-yellow)', filter: 'drop-shadow(0 0 6px rgba(255,215,0,0.6))' }} />
          </div>
        )}
        {/* Harry Potter banner strip */}
        {theme === 'harrypotter' && (
          <div className="hp-banner-strip">
            <Sparkles className="inline w-3.5 h-3.5 mr-2.5 align-middle" style={{ color: 'var(--hp-emerald)', filter: 'drop-shadow(0 0 6px rgba(80,200,120,0.6))' }} />
            <span className="hp-banner-text">坩埚永沸，预言循环不止，祭坛承载一代又一代巫师的宿命枷锁</span>
            <Sparkles className="inline w-3.5 h-3.5 ml-2.5 align-middle" style={{ color: 'var(--hp-emerald)', filter: 'drop-shadow(0 0 6px rgba(80,200,120,0.6))' }} />
          </div>
        )}

        {/* Results Summary */}
        <section className="animate-slide-up animate-backwards animation-delay-1">
          <ResultsSummary result={result} theme={theme} />
        </section>

        {/* Warhammer - Cog & skull armor divider */}
        {theme === 'warhammer' && (
          <div className="flex items-center justify-center gap-3 wh-cog-pattern py-2">
            <div className="flex-1 wh-armor-divider" />
            <Cog className="w-4 h-4 text-[#cd7f32] shrink-0" style={{ filter: 'drop-shadow(0 0 4px rgba(205,127,50,0.4))' }} />
            <Gem className="w-3 h-3 text-[#ffd700] shrink-0" style={{ filter: 'drop-shadow(0 0 4px rgba(255,215,0,0.4))' }} />
            <Skull className="w-5 h-5 text-[#dc143c] shrink-0" style={{ filter: 'drop-shadow(0 0 6px rgba(220,20,60,0.5))' }} />
            <Gem className="w-3 h-3 text-[#ffd700] shrink-0" style={{ filter: 'drop-shadow(0 0 4px rgba(255,215,0,0.4))' }} />
            <Cog className="w-4 h-4 text-[#cd7f32] shrink-0" style={{ filter: 'drop-shadow(0 0 4px rgba(205,127,50,0.4))' }} />
            <div className="flex-1 wh-armor-divider" />
          </div>
        )}
        {/* Rick and Morty - portal divider */}
        {theme === 'rickmorty' && (
          <div className="flex items-center justify-center gap-3 py-2">
            <div className="flex-1 rm-armor-divider" />
            <Atom className="w-4 h-4 shrink-0 rm-portal-swirl" style={{ color: 'var(--rm-green-bright)', filter: 'drop-shadow(0 0 4px rgba(43,212,43,0.4))' }} />
            <Gem className="w-3 h-3 shrink-0" style={{ color: 'var(--rm-blue)', filter: 'drop-shadow(0 0 4px rgba(0,191,255,0.4))' }} />
            <Zap className="w-5 h-5 shrink-0" style={{ color: 'var(--rm-pink)', filter: 'drop-shadow(0 0 6px rgba(255,105,180,0.5))' }} />
            <Gem className="w-3 h-3 shrink-0" style={{ color: 'var(--rm-blue)', filter: 'drop-shadow(0 0 4px rgba(0,191,255,0.4))' }} />
            <Atom className="w-4 h-4 shrink-0 rm-portal-swirl" style={{ color: 'var(--rm-green-bright)', filter: 'drop-shadow(0 0 4px rgba(43,212,43,0.4))' }} />
            <div className="flex-1 rm-armor-divider" />
          </div>
        )}
        {/* Harry Potter - runic divider */}
        {theme === 'harrypotter' && (
          <div className="flex items-center justify-center gap-3 py-2">
            <div className="flex-1 hp-armor-divider" />
            <Gem className="w-3 h-3 shrink-0" style={{ color: 'var(--hp-gold)', filter: 'drop-shadow(0 0 4px rgba(212,175,55,0.4))' }} />
            <Sparkles className="w-4 h-4 shrink-0" style={{ color: 'var(--hp-emerald)', filter: 'drop-shadow(0 0 6px rgba(80,200,120,0.5))' }} />
            <Gem className="w-3 h-3 shrink-0" style={{ color: 'var(--hp-gold)', filter: 'drop-shadow(0 0 4px rgba(212,175,55,0.4))' }} />
            <div className="flex-1 hp-armor-divider" />
          </div>
        )}

        {/* Charts Row */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-slide-up animate-backwards animation-delay-2">
          <BalanceTrendChart records={result.records} theme={theme} />
          <PrincipalInterestPie result={result} theme={theme} />
        </section>

        {/* Warhammer - chaos gods decorative hint with warp rift */}
        {theme === 'warhammer' && (
          <div className="wh-liturgy opacity-60 text-center wh-warp-rift wh-warp-pulse">
            <Sparkles className="inline w-2.5 h-2.5 mr-1.5 text-[#8b00ff]" style={{ filter: 'drop-shadow(0 0 4px rgba(139,0,255,0.5))' }} />
            <span className="wh-warp-text">忠诚铸魂 · 钢铁卫疆 · 劳役涤罪孽 · 殉道得安息</span>
            <Sparkles className="inline w-2.5 h-2.5 ml-1.5 text-[#8b00ff]" style={{ filter: 'drop-shadow(0 0 4px rgba(139,0,255,0.5))' }} />
          </div>
        )}
        {/* Rick and Morty - chaos text */}
        {theme === 'rickmorty' && (
          <div className="rm-liturgy opacity-70 text-center">
            <Sparkles className="inline w-2.5 h-2.5 mr-1.5" style={{ color: 'var(--rm-purple)', filter: 'drop-shadow(0 0 4px rgba(153,50,204,0.5))' }} />
            <span className="rm-warp-text">Wubba Lubba Dub Dub，宇宙荒诞虚无，所有人都在独自承受痛苦</span>
            <Sparkles className="inline w-2.5 h-2.5 ml-1.5" style={{ color: 'var(--rm-purple)', filter: 'drop-shadow(0 0 4px rgba(153,50,204,0.5))' }} />
          </div>
        )}
        {/* Harry Potter - prophecy text */}
        {theme === 'harrypotter' && (
          <div className="hp-liturgy opacity-70 text-center">
            <Sparkles className="inline w-2.5 h-2.5 mr-1.5" style={{ color: 'var(--hp-emerald)', filter: 'drop-shadow(0 0 4px rgba(80,200,120,0.5))' }} />
            <span className="hp-prophecy-text">世界从来没有绝对的命运，挣脱枷锁需要付出巨大代价</span>
            <Sparkles className="inline w-2.5 h-2.5 ml-1.5" style={{ color: 'var(--hp-emerald)', filter: 'drop-shadow(0 0 4px rgba(80,200,120,0.5))' }} />
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
            theme={theme}
          />
        </section>

        {/* Warhammer bottom decoration - Horus Heresy with warp rift */}
        {theme === 'warhammer' && (
          <div className="flex flex-col items-center gap-2 opacity-60 wh-warp-rift">
            <div className="wh-horus-divider w-full" />
            <div className="flex items-center gap-3">
              <Skull className="w-3.5 h-3.5 text-[#dc143c]" style={{ filter: 'drop-shadow(0 0 4px rgba(220,20,60,0.4))' }} />
              <span className="wh-liturgy text-[8px] wh-liturgy-strong">
                为帝皇奉献直至血脉枯竭 · 唯有死亡可以终结劳役誓约
              </span>
              <Skull className="w-3.5 h-3.5 text-[#dc143c]" style={{ filter: 'drop-shadow(0 0 4px rgba(220,20,60,0.4))' }} />
            </div>
            <div className="wh-horus-divider w-full" />
          </div>
        )}
        {/* Rick and Morty bottom decoration */}
        {theme === 'rickmorty' && (
          <div className="flex flex-col items-center gap-2 opacity-70">
            <div className="rm-armor-divider w-full" />
            <div className="flex items-center gap-3">
              <Atom className="w-3.5 h-3.5 rm-portal-swirl" style={{ color: 'var(--rm-green-bright)', filter: 'drop-shadow(0 0 4px rgba(43,212,43,0.4))' }} />
              <span className="rm-liturgy text-[10px]">
                Wubba Lubba Dub Dub，没有哪一次充能，可以终结永恒循环
              </span>
              <Atom className="w-3.5 h-3.5 rm-portal-swirl" style={{ color: 'var(--rm-green-bright)', filter: 'drop-shadow(0 0 4px rgba(43,212,43,0.4))' }} />
            </div>
            <div className="rm-armor-divider w-full" />
          </div>
        )}
        {/* Harry Potter bottom decoration */}
        {theme === 'harrypotter' && (
          <div className="flex flex-col items-center gap-2 opacity-70">
            <div className="hp-armor-divider w-full" />
            <div className="flex items-center gap-3">
              <BookOpen className="w-3.5 h-3.5" style={{ color: 'var(--hp-gold)', filter: 'drop-shadow(0 0 4px rgba(212,175,55,0.4))' }} />
              <span className="hp-liturgy text-[10px]">
                勇气无法抹去宿命，但你永远拥有选择的权利
              </span>
              <BookOpen className="w-3.5 h-3.5" style={{ color: 'var(--hp-gold)', filter: 'drop-shadow(0 0 4px rgba(212,175,55,0.4))' }} />
            </div>
            <div className="hp-armor-divider w-full" />
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
              <p className="wh-motto wh-motto-omnissiah text-[10px] wh-warp-pulse">
                ☠ 帝皇端坐枯骨王座 · 万年干涸之血滋养星炬 ☠
              </p>
              <p className="text-[9px] text-[#5e4d38] mt-1 wh-cyber-text" style={{ fontSize: '8px' }}>
                The Emperor rots upon the Throne of Bones · His drying blood feeds the Astronomicon
              </p>
            </div>
          ) : theme === 'rickmorty' ? (
            <div className="text-center">
              <p className="rm-liturgy text-[10px]">
                ⚡ Wubba Lubba Dub Dub · 宇宙不过是一场荒诞实验 ⚡
              </p>
              <p className="text-[9px] mt-1" style={{ color: 'var(--rm-text-dim)', fontFamily: 'Bangers, sans-serif', letterSpacing: '0.1em' }}>
                Nobody exists on purpose · Nobody belongs anywhere · Everybody's gonna die
              </p>
            </div>
          ) : theme === 'harrypotter' ? (
            <div className="text-center">
              <p className="hp-liturgy text-[10px]">
                ✦ Draco Dormiens Nunquam Titillandus · 沉睡巨龙切勿惊扰 ✦
              </p>
              <p className="text-[9px] mt-1" style={{ color: 'var(--hp-text-dim)', fontFamily: 'Cinzel, serif', letterSpacing: '0.1em' }}>
                Magic is might · Ancient pacts bind all wizardkind
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
