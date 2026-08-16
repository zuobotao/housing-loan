import { Wallet, TrendingDown, Calendar, PiggyBank, Clock, BarChart3 } from 'lucide-react';
import type { CalcResult } from '../types';
import { formatCurrency, formatMonths } from '../lib/mortgage';

interface Props {
  result: CalcResult;
}

export default function ResultsSummary({ result }: Props) {
  const hasEarlyRepayment = result.interestSaved > 1;

  const cards = [
    {
      label: '月供金额',
      value: formatCurrency(result.monthlyPayment),
      icon: Wallet,
      color: '#007AFF',
      bgColor: 'rgba(0, 122, 255, 0.1)',
      delay: 'animation-delay-1',
    },
    {
      label: '总利息',
      value: formatCurrency(result.totalInterest),
      icon: TrendingDown,
      color: '#FF9500',
      bgColor: 'rgba(255, 149, 0, 0.1)',
      delay: 'animation-delay-2',
    },
    {
      label: '总还款额',
      value: formatCurrency(result.totalPayment),
      icon: BarChart3,
      color: '#5856d6',
      bgColor: 'rgba(88, 86, 214, 0.1)',
      delay: 'animation-delay-3',
    },
    {
      label: '还款期限',
      value: formatMonths(result.actualTermMonths),
      icon: Calendar,
      color: '#AF52DE',
      bgColor: 'rgba(175, 82, 222, 0.1)',
      delay: 'animation-delay-4',
    },
  ];

  return (
    <div className="space-y-5">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className={`apple-card p-5 space-y-3 animate-slide-up animate-backwards ${card.delay}`}
          >
            <div className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-[0.7rem] flex items-center justify-center"
                style={{ backgroundColor: card.bgColor }}
              >
                <card.icon className="w-4.5 h-4.5" style={{ color: card.color }} />
              </div>
              <span className="text-[12px] font-medium text-text-500">{card.label}</span>
            </div>
            <p
              className="text-[22px] lg:text-[26px] font-bold font-mono tabular-nums tracking-tight"
              style={{ color: card.color }}
            >
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Early Repayment Savings */}
      {hasEarlyRepayment && (
        <div className="apple-card p-6 animate-slide-up animate-backwards animation-delay-5">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-[0.7rem] bg-[#34C759]/10 flex items-center justify-center">
              <PiggyBank className="w-5 h-5 text-[#34C759]" />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-text-800">提前还款节省</h3>
              <p className="text-[12px] text-text-400">通过提前还款，您已节省</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="relative pl-5">
              <div className="absolute left-0 top-1 bottom-1 w-1 rounded-full bg-[#34C759]/30" />
              <div className="flex items-center gap-1.5 text-[12px] text-text-500 mb-1.5">
                <TrendingDown className="w-3.5 h-3.5" />
                节省利息
              </div>
              <p className="text-[28px] font-bold font-mono text-[#34C759] tabular-nums tracking-tight">
                {formatCurrency(result.interestSaved)}
              </p>
            </div>
            <div className="relative pl-5">
              <div className="absolute left-0 top-1 bottom-1 w-1 rounded-full bg-[#34C759]/30" />
              <div className="flex items-center gap-1.5 text-[12px] text-text-500 mb-1.5">
                <Clock className="w-3.5 h-3.5" />
                节省时间
              </div>
              <p className="text-[28px] font-bold font-mono text-[#34C759] tabular-nums tracking-tight">
                {formatMonths(result.monthsSaved)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
