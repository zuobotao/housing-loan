import { Plus, Trash2, Percent, Info } from 'lucide-react';
import type { RateAdjustment } from '../types';
import { monthToYearMonth, yearMonthToMonth } from '../lib/mortgage';

interface Props {
  rateAdjustments: RateAdjustment[];
  onChange: (adjustments: RateAdjustment[]) => void;
  maxMonth: number;
  baseRate: number;
  startDate?: string;
}

const quickRates = [3.0, 3.6, 4.0, 4.2, 4.5];

export default function RateAdjustmentEditor({
  rateAdjustments,
  onChange,
  maxMonth,
  baseRate,
  startDate,
}: Props) {
  const add = () => {
    const defaultMonth = Math.min(13, maxMonth);
    onChange([
      ...rateAdjustments,
      { id: crypto.randomUUID(), month: defaultMonth, annualRate: baseRate },
    ]);
  };

  const remove = (id: string) =>
    onChange(rateAdjustments.filter((ra) => ra.id !== id));

  const update = (id: string, patch: Partial<RateAdjustment>) =>
    onChange(rateAdjustments.map((ra) => (ra.id === id ? { ...ra, ...patch } : ra)));

  const minYm = startDate ? monthToYearMonth(2, startDate) : undefined;
  const maxYm = startDate ? monthToYearMonth(maxMonth, startDate) : undefined;

  return (
    <div className="apple-card p-5 space-y-4 animate-slide-up animate-backwards animation-delay-1">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-[0.6rem] bg-brand-500/10 flex items-center justify-center">
            <Percent className="w-4 h-4 text-brand-500" />
          </div>
          <div>
            <h2 className="text-[15px] font-bold text-text-800">利率调整</h2>
            <p className="text-[11px] text-text-400">模拟LPR浮动利率</p>
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
      <div className="flex items-start gap-2 px-3 py-2.5 bg-brand-500/5 rounded-[0.7rem] border border-brand-500/10">
        <Info className="w-3.5 h-3.5 text-brand-500 mt-0.5 flex-shrink-0" />
        <p className="text-[12px] text-text-600 leading-relaxed">
          设置从某月起调整为新利率，等额本息会在利率变更时重新计算月供
        </p>
      </div>

      {/* Empty State */}
      {rateAdjustments.length === 0 ? (
        <div className="text-center py-6">
          <Percent className="w-10 h-10 mx-auto mb-2 text-text-300" />
          <p className="text-[13px] text-text-500 font-medium">暂无利率调整</p>
          <p className="text-[12px] mt-1 text-text-400">点击"添加"设置浮动利率</p>
        </div>
      ) : (
        <div className="space-y-3">
          {rateAdjustments.map((ra, idx) => {
            const ymValue = monthToYearMonth(ra.month, startDate);
            return (
              <div
                key={ra.id}
                className="border border-background-300 rounded-[0.9rem] p-4 space-y-3 bg-background-100/50 animate-scale-in animate-backwards"
              >
                {/* Item Header */}
                <div className="flex items-center justify-between">
                  <span className="apple-tag apple-tag-primary">
                    #{idx + 1} 利率调整
                  </span>
                  <button
                    onClick={() => remove(ra.id)}
                    className="p-1.5 rounded-lg hover:bg-[#FF3B30]/10 text-text-400 hover:text-[#FF3B30] transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Fields */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-medium text-text-600">生效年月</label>
                    <div className="apple-field h-10">
                      <input
                        type="month"
                        value={ymValue.includes('-') ? ymValue : ''}
                        min={minYm}
                        max={maxYm}
                        onChange={(e) => {
                          const m = yearMonthToMonth(e.target.value, startDate);
                          if (m >= 2 && m <= maxMonth) update(ra.id, { month: m });
                        }}
                        className="apple-input text-[14px] font-mono font-medium"
                      />
                    </div>
                    <span className="text-[11px] text-text-400 font-mono">第{ra.month}期</span>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-medium text-text-600">新利率 (%)</label>
                    <div className="apple-field h-10">
                      <input
                        type="number"
                        value={ra.annualRate || ''}
                        onChange={(e) =>
                          update(ra.id, { annualRate: parseFloat(e.target.value) || 0 })
                        }
                        min="0"
                        step="0.05"
                        className="apple-input text-[14px] font-mono font-semibold tabular-nums"
                      />
                    </div>
                  </div>
                </div>

                {/* Quick Rates */}
                <div className="flex gap-1.5 flex-wrap">
                  {quickRates.map((rate) => (
                    <button
                      key={rate}
                      onClick={() => update(ra.id, { annualRate: rate })}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition font-mono ${
                        ra.annualRate === rate
                          ? 'bg-brand-500 text-white shadow-apple-sm'
                          : 'bg-background-200 text-text-600 hover:bg-background-300'
                      }`}
                    >
                      {rate}%
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
