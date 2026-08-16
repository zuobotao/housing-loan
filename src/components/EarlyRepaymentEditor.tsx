import { Plus, Trash2, Zap, TrendingDown, CalendarClock, Info } from 'lucide-react';
import type { EarlyRepayment, EarlyRepaymentStrategy } from '../types';
import { monthToYearMonth, yearMonthToMonth } from '../lib/mortgage';

interface Props {
  earlyRepayments: EarlyRepayment[];
  onChange: (repayments: EarlyRepayment[]) => void;
  maxMonth: number;
  startDate?: string;
}

export default function EarlyRepaymentEditor({
  earlyRepayments,
  onChange,
  maxMonth,
  startDate,
}: Props) {
  const add = () => {
    onChange([
      ...earlyRepayments,
      {
        id: crypto.randomUUID(),
        month: Math.min(12, maxMonth),
        amount: 100000,
        strategy: 'reduce_payment',
      },
    ]);
  };

  const remove = (id: string) =>
    onChange(earlyRepayments.filter((er) => er.id !== id));

  const update = (id: string, patch: Partial<EarlyRepayment>) =>
    onChange(earlyRepayments.map((er) => (er.id === id ? { ...er, ...patch } : er)));

  const minYm = startDate ? monthToYearMonth(1, startDate) : undefined;
  const maxYm = startDate ? monthToYearMonth(maxMonth, startDate) : undefined;

  return (
    <div className="apple-card p-5 space-y-4 animate-slide-up animate-backwards animation-delay-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-[0.6rem] bg-[#FF9500]/10 flex items-center justify-center">
            <Zap className="w-4 h-4 text-[#FF9500]" />
          </div>
          <div>
            <h2 className="text-[15px] font-bold text-text-800">提前还款</h2>
            <p className="text-[11px] text-text-400">设置提前还款计划</p>
          </div>
        </div>
        <button
          onClick={add}
          className="flex items-center gap-1 px-3 py-1.5 bg-brand-500 text-white rounded-full text-[12px] font-semibold hover:bg-brand-600 transition shadow-apple-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          添加
        </button>
      </div>

      {/* Info */}
      <div className="flex items-start gap-2 px-3 py-2.5 bg-[#FF9500]/5 rounded-[0.7rem] border border-[#FF9500]/10">
        <Info className="w-3.5 h-3.5 text-[#FF9500] mt-0.5 flex-shrink-0" />
        <p className="text-[12px] text-text-600 leading-relaxed">
          支持多次提前还款，可选减少月供或缩短期限
        </p>
      </div>

      {/* Empty State */}
      {earlyRepayments.length === 0 ? (
        <div className="text-center py-6">
          <CalendarClock className="w-10 h-10 mx-auto mb-2 text-text-300" />
          <p className="text-[13px] text-text-500 font-medium">暂无提前还款计划</p>
          <p className="text-[12px] mt-1 text-text-400">点击"添加"开始设置</p>
        </div>
      ) : (
        <div className="space-y-3">
          {earlyRepayments.map((er, idx) => {
            const ymValue = monthToYearMonth(er.month, startDate);
            return (
              <div
                key={er.id}
                className="border border-background-300 rounded-[0.9rem] p-4 space-y-3 bg-background-100/50 animate-scale-in animate-backwards"
              >
                {/* Item Header */}
                <div className="flex items-center justify-between">
                  <span className="apple-tag apple-tag-warning">
                    #{idx + 1} 提前还款
                  </span>
                  <button
                    onClick={() => remove(er.id)}
                    className="p-1.5 rounded-lg hover:bg-[#FF3B30]/10 text-text-400 hover:text-[#FF3B30] transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Fields */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-medium text-text-600">还款年月</label>
                    <div className="apple-field h-10">
                      <input
                        type="month"
                        value={ymValue.includes('-') ? ymValue : ''}
                        min={minYm}
                        max={maxYm}
                        onChange={(e) => {
                          const m = yearMonthToMonth(e.target.value, startDate);
                          if (m >= 1 && m <= maxMonth) update(er.id, { month: m });
                        }}
                        className="apple-input text-[14px] font-mono font-medium"
                      />
                    </div>
                    <span className="text-[11px] text-text-400 font-mono">第{er.month}期</span>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-medium text-text-600">还款金额</label>
                    <div className="apple-field h-10">
                      <input
                        type="number"
                        value={er.amount || ''}
                        onChange={(e) =>
                          update(er.id, { amount: parseFloat(e.target.value) || 0 })
                        }
                        min="0"
                        step="10000"
                        className="apple-input text-[14px] font-mono font-semibold tabular-nums"
                      />
                    </div>
                  </div>
                </div>

                {/* Strategy */}
                <div className="apple-segmented">
                  {(
                    [
                      { value: 'reduce_payment', label: '减少月供', icon: TrendingDown },
                      { value: 'reduce_term', label: '缩短期限', icon: CalendarClock },
                    ] as { value: EarlyRepaymentStrategy; label: string; icon: typeof TrendingDown }[]
                  ).map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => update(er.id, { strategy: value })}
                      className={er.strategy === value ? 'active' : ''}
                    >
                      <Icon className="w-3 h-3 inline mr-1 -mt-0.5" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
