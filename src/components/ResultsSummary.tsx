import { Wallet, TrendingDown, Calendar, PiggyBank, Clock, BarChart3, Skull, Cog, Flame, Crosshair, Atom, FlaskConical, Zap, BookOpen, Sparkles, Gem, Wand2 } from 'lucide-react';
import type { CalcResult } from '../types';
import { formatCurrency, formatMonths } from '../lib/mortgage';
import type { Theme } from '../App';

interface Props {
  result: CalcResult;
  theme?: Theme;
}

type Card = {
  label: string;
  value: string;
  icon: typeof Wallet;
  color?: string;
  bgColor?: string;
  colorClass?: string;
  delay: string;
};

export default function ResultsSummary({ result, theme = 'apple' }: Props) {
  const hasEarlyRepayment = result.interestSaved > 1;
  const isWh = theme === 'warhammer';
  const isRm = theme === 'rickmorty';
  const isHp = theme === 'harrypotter';
  const isThemed = isWh || isRm || isHp;
  const pfx = isWh ? 'wh' : isRm ? 'rm' : isHp ? 'hp' : '';

  const cards: Card[] = isWh
    ? [
        { label: '月度献祭', value: formatCurrency(result.monthlyPayment), icon: Skull, colorClass: 'wh-val-ice', delay: 'animation-delay-1' },
        { label: '累积贡赋', value: formatCurrency(result.totalInterest), icon: Flame, colorClass: 'wh-val-amber', delay: 'animation-delay-2' },
        { label: '全数献祭总量', value: formatCurrency(result.totalPayment), icon: Cog, colorClass: 'wh-val-purple', delay: 'animation-delay-3' },
        { label: '殉道纪年', value: formatMonths(result.actualTermMonths), icon: Crosshair, colorClass: 'wh-val-magenta', delay: 'animation-delay-4' },
      ]
    : isRm
    ? [
        { label: '月度能量供给', value: formatCurrency(result.monthlyPayment), icon: Atom, colorClass: 'rm-val-green', delay: 'animation-delay-1' },
        { label: '累计维度耗损', value: formatCurrency(result.totalInterest), icon: FlaskConical, colorClass: 'rm-val-yellow', delay: 'animation-delay-2' },
        { label: '全域能量总消耗', value: formatCurrency(result.totalPayment), icon: Zap, colorClass: 'rm-val-purple', delay: 'animation-delay-3' },
        { label: '实验持续周期', value: formatMonths(result.actualTermMonths), icon: Crosshair, colorClass: 'rm-val-pink', delay: 'animation-delay-4' },
      ]
    : isHp
    ? [
        { label: '月度魔力咏供', value: formatCurrency(result.monthlyPayment), icon: Wand2, colorClass: 'hp-val-gold', delay: 'animation-delay-1' },
        { label: '累积魔力流失', value: formatCurrency(result.totalInterest), icon: Sparkles, colorClass: 'hp-val-emerald', delay: 'animation-delay-2' },
        { label: '全域魔力总输出', value: formatCurrency(result.totalPayment), icon: BookOpen, colorClass: 'hp-val-purple', delay: 'animation-delay-3' },
        { label: '契约维系时长', value: formatMonths(result.actualTermMonths), icon: Gem, colorClass: 'hp-val-ruby', delay: 'animation-delay-4' },
      ]
    : [
        { label: '月供金额', value: formatCurrency(result.monthlyPayment), icon: Wallet, color: '#007AFF', bgColor: 'rgba(0, 122, 255, 0.1)', delay: 'animation-delay-1' },
        { label: '总利息', value: formatCurrency(result.totalInterest), icon: TrendingDown, color: '#FF9500', bgColor: 'rgba(255, 149, 0, 0.1)', delay: 'animation-delay-2' },
        { label: '总还款额', value: formatCurrency(result.totalPayment), icon: BarChart3, color: '#5856d6', bgColor: 'rgba(88, 86, 214, 0.1)', delay: 'animation-delay-3' },
        { label: '还款期限', value: formatMonths(result.actualTermMonths), icon: Calendar, color: '#AF52DE', bgColor: 'rgba(175, 82, 222, 0.1)', delay: 'animation-delay-4' },
      ];

  const cardCls = isWh ? 'wh-data-card' : isRm ? 'rm-data-card' : isHp ? 'hp-data-card' : 'apple-card';
  const labelCls = isWh ? 'wh-label-gold' : isRm ? 'rm-label-blue' : isHp ? 'hp-label-gold' : 'text-text-500';
  const iconColor = isWh ? 'var(--wh-gold)' : isRm ? 'var(--rm-green-bright)' : isHp ? 'var(--hp-gold)' : '';
  const iconFilter = isWh
    ? 'drop-shadow(0 0 4px rgba(184, 134, 11, 0.3))'
    : isRm
    ? 'drop-shadow(0 0 4px rgba(43, 212, 43, 0.3))'
    : isHp
    ? 'drop-shadow(0 0 4px rgba(212, 175, 55, 0.3))'
    : '';

  return (
    <div className="space-y-5">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className={`${cardCls} p-5 space-y-3 animate-slide-up animate-backwards ${card.delay}`}
          >
            {isThemed && (
              <>
                <span className={`${pfx}-rivet ${pfx}-rivet-tl`} />
                <span className={`${pfx}-rivet ${pfx}-rivet-tr`} />
                <span className={`${pfx}-rivet ${pfx}-rivet-bl`} />
                <span className={`${pfx}-rivet ${pfx}-rivet-br`} />
              </>
            )}
            <div className="flex items-center gap-2.5">
              <div
                className={`w-9 h-9 flex items-center justify-center ${isThemed ? '' : 'rounded-[0.7rem]'}`}
                style={!isThemed ? { backgroundColor: card.bgColor } : undefined}
              >
                <card.icon
                  className="w-4.5 h-4.5"
                  style={!isThemed ? { color: card.color } : { color: iconColor, filter: iconFilter }}
                />
              </div>
              <span className={`text-[12px] font-medium ${labelCls}`}>
                {card.label}
              </span>
            </div>
            <p
              className={`text-[22px] lg:text-[26px] font-bold font-mono tabular-nums tracking-tight ${isThemed ? card.colorClass : ''}`}
              style={!isThemed ? { color: card.color } : undefined}
            >
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Early Repayment Savings */}
      {hasEarlyRepayment && (
        <div className={`${cardCls} p-6 animate-slide-up animate-backwards animation-delay-5`}>
          {isThemed && (
            <>
              <span className={`${pfx}-rivet ${pfx}-rivet-tl`} />
              <span className={`${pfx}-rivet ${pfx}-rivet-tr`} />
              <span className={`${pfx}-rivet ${pfx}-rivet-bl`} />
              <span className={`${pfx}-rivet ${pfx}-rivet-br`} />
            </>
          )}
          <div className="flex items-center gap-3 mb-5">
            <div className={`w-10 h-10 flex items-center justify-center ${isThemed ? '' : 'rounded-[0.7rem] bg-[#34C759]/10'}`}>
              <PiggyBank className="w-5 h-5" style={{ color: isWh ? 'var(--wh-gold)' : isRm ? 'var(--rm-green-bright)' : isHp ? 'var(--hp-gold)' : '#34C759' }} />
            </div>
            <div>
              <h3 className={`text-[16px] font-bold ${isWh ? 'wh-label-gold' : isRm ? 'rm-label-blue' : isHp ? 'hp-label-gold' : 'text-text-800'}`}>
                {isWh ? '提前献祭节省' : isRm ? '超前充能节省' : isHp ? '超前咏供节省' : '提前还款节省'}
              </h3>
              <p className={`text-[12px] ${isWh ? 'wh-label-gold opacity-60' : isRm ? 'rm-label-blue opacity-70' : isHp ? 'hp-label-gold opacity-70' : 'text-text-400'}`}>
                {isWh ? '通过提前献祭，已减负' : isRm ? '通过超前充能，已节省' : isHp ? '通过超前咏供，已节省' : '通过提前还款，您已节省'}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="relative pl-5">
              <div className="absolute left-0 top-1 bottom-1 w-1 rounded-full bg-[#34C759]/30" />
              <div className={`flex items-center gap-1.5 text-[12px] mb-1.5 ${labelCls}`}>
                <TrendingDown className="w-3.5 h-3.5" />
                {isWh ? '节省贡赋' : isRm ? '节省耗损' : isHp ? '节省流失' : '节省利息'}
              </div>
              <p
                className={`text-[28px] font-bold font-mono tabular-nums tracking-tight ${isWh ? 'wh-val-ice' : isRm ? 'rm-val-green' : isHp ? 'hp-val-emerald' : 'text-[#34C759]'}`}
              >
                {formatCurrency(result.interestSaved)}
              </p>
            </div>
            <div className="relative pl-5">
              <div className="absolute left-0 top-1 bottom-1 w-1 rounded-full bg-[#34C759]/30" />
              <div className={`flex items-center gap-1.5 text-[12px] mb-1.5 ${labelCls}`}>
                <Clock className="w-3.5 h-3.5" />
                {isWh ? '节省时间' : isRm ? '节省周期' : isHp ? '节省星运' : '节省时间'}
              </div>
              <p
                className={`text-[28px] font-bold font-mono tabular-nums tracking-tight ${isWh ? 'wh-val-amber' : isRm ? 'rm-val-yellow' : isHp ? 'hp-val-gold' : 'text-[#34C759]'}`}
              >
                {formatMonths(result.monthsSaved)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
