import { Home, Percent, Calendar, Repeat, CalendarDays } from 'lucide-react';
import type { LoanParams, RepaymentMethod } from '../types';

interface Props {
  params: LoanParams;
  onChange: (params: LoanParams) => void;
}

const quickAmounts = [50, 100, 200, 300];
const quickRates = [3.0, 3.6, 4.0, 4.2, 4.5];
const quickTerms = [10, 15, 20, 25, 30];

export default function LoanInputPanel({ params, onChange }: Props) {
  const update = (patch: Partial<LoanParams>) => onChange({ ...params, ...patch });

  return (
    <div className="apple-card p-5 space-y-5 animate-slide-up animate-backwards">
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-[0.6rem] bg-brand-500/10 flex items-center justify-center">
          <Home className="w-4 h-4 text-brand-500" />
        </div>
        <div>
          <h2 className="text-[15px] font-bold text-text-800">贷款参数</h2>
          <p className="text-[11px] text-text-400">设置贷款基本信息</p>
        </div>
      </div>

      {/* Loan Amount */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[13px] font-medium text-text-700">贷款总额</label>
          <span className="text-[11px] text-text-400">万元</span>
        </div>
        <div className="apple-field">
          <input
            type="number"
            value={params.principal / 10000 || ''}
            onChange={(e) => update({ principal: parseFloat(e.target.value) * 10000 || 0 })}
            className="apple-input font-mono font-semibold text-[17px] tabular-nums"
            placeholder="100"
            step="5"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {quickAmounts.map((amt) => (
            <button
              key={amt}
              onClick={() => update({ principal: amt * 10000 })}
              className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition font-mono ${
                params.principal === amt * 10000
                  ? 'bg-brand-500 text-white shadow-apple-sm'
                  : 'bg-background-200 text-text-600 hover:bg-background-300'
              }`}
            >
              {amt}万
            </button>
          ))}
        </div>
      </div>

      {/* Annual Rate */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[13px] font-medium text-text-700 flex items-center gap-1.5">
            <Percent className="w-3.5 h-3.5 text-text-400" />
            年利率
          </label>
          <span className="text-[11px] text-text-400">%</span>
        </div>
        <div className="apple-field">
          <input
            type="number"
            value={params.annualRate || ''}
            onChange={(e) => update({ annualRate: parseFloat(e.target.value) || 0 })}
            className="apple-input font-mono font-semibold text-[17px] tabular-nums"
            placeholder="4.2"
            step="0.05"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {quickRates.map((rate) => (
            <button
              key={rate}
              onClick={() => update({ annualRate: rate })}
              className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition font-mono ${
                params.annualRate === rate
                  ? 'bg-brand-500 text-white shadow-apple-sm'
                  : 'bg-background-200 text-text-600 hover:bg-background-300'
              }`}
            >
              {rate}%
            </button>
          ))}
        </div>
      </div>

      {/* Loan Term */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[13px] font-medium text-text-700 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-text-400" />
            贷款期限
          </label>
          <span className="text-[11px] text-text-400">年</span>
        </div>
        <div className="apple-field">
          <input
            type="number"
            value={params.termYears || ''}
            onChange={(e) => update({ termYears: parseInt(e.target.value) || 0 })}
            className="apple-input font-mono font-semibold text-[17px] tabular-nums"
            placeholder="30"
            step="1"
            min="1"
            max="50"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {quickTerms.map((term) => (
            <button
              key={term}
              onClick={() => update({ termYears: term })}
              className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition font-mono ${
                params.termYears === term
                  ? 'bg-brand-500 text-white shadow-apple-sm'
                  : 'bg-background-200 text-text-600 hover:bg-background-300'
              }`}
            >
              {term}年
            </button>
          ))}
        </div>
      </div>

      {/* Start Date */}
      <div className="space-y-2">
        <label className="text-[13px] font-medium text-text-700 flex items-center gap-1.5">
          <CalendarDays className="w-3.5 h-3.5 text-text-400" />
          贷款起始日
        </label>
        <div className="apple-field">
          <input
            type="month"
            value={params.startDate || ''}
            onChange={(e) => update({ startDate: e.target.value })}
            className="apple-input font-mono font-medium text-[15px] flex-1"
          />
        </div>
      </div>

      {/* Repayment Method */}
      <div className="space-y-2">
        <label className="text-[13px] font-medium text-text-700 flex items-center gap-1.5">
          <Repeat className="w-3.5 h-3.5 text-text-400" />
          还款方式
        </label>
        <div className="apple-segmented">
          {(['equal_payment', 'equal_principal'] as RepaymentMethod[]).map((m) => (
            <button
              key={m}
              onClick={() => update({ method: m })}
              className={params.method === m ? 'active' : ''}
            >
              {m === 'equal_payment' ? '等额本息' : '等额本金'}
            </button>
          ))}
        </div>
        <p className="text-[12px] text-text-500 leading-relaxed">
          {params.method === 'equal_payment'
            ? '月供固定，适合收入稳定的家庭'
            : '本金固定，利息递减，前期还款压力较大'}
        </p>
      </div>
    </div>
  );
}
