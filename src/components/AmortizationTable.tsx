import { useState, useRef, useCallback } from 'react';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import type { PaymentRecord } from '../types';
import { formatCurrency, monthToYearMonth } from '../lib/mortgage';

interface Props {
  records: PaymentRecord[];
  startDate?: string;
}

export default function AmortizationTable({ records, startDate }: Props) {
  const [searchMonth, setSearchMonth] = useState('');
  const [highlightMonth, setHighlightMonth] = useState<number | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const rowRefs = useRef<Map<number, HTMLTableRowElement>>(new Map());
  const inputRef = useRef<HTMLInputElement>(null);

  const jumpToMonth = useCallback(() => {
    const raw = searchMonth || inputRef.current?.value || '';
    const n = parseInt(raw);
    if (n > 0 && n <= records.length) {
      setHighlightMonth(n);
      setTimeout(() => {
        const row = rowRefs.current.get(n);
        if (row) row.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 50);
    }
  }, [searchMonth, records.length]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      jumpToMonth();
    }
  };

  return (
    <div className="apple-card overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-background-300 flex-wrap gap-3">
        <div>
          <h3 className="text-[15px] font-bold text-text-800">还款明细表</h3>
          <p className="text-[12px] text-text-400 mt-0.5">月粒度 · {records.length}期</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-text-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                ref={inputRef}
                type="number"
                value={searchMonth}
                onChange={(e) => setSearchMonth(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="跳至期"
                min="1"
                max={records.length}
                className="w-20 pl-7 pr-2 py-1.5 text-[12px] rounded-lg bg-background-200 border border-background-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none tabular-nums text-text-800 font-mono font-medium transition"
              />
            </div>
            <button
              onClick={jumpToMonth}
              className="px-3 py-1.5 text-[12px] font-semibold text-white bg-brand-500 rounded-lg hover:bg-brand-600 transition"
            >
              跳转
            </button>
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-background-200 text-text-400 hover:text-text-600 transition"
          >
            {collapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className={`overflow-auto ${collapsed ? 'max-h-72' : 'max-h-[500px]'}`}>
        <table className="w-full text-sm table-row-hover">
          <thead className="sticky top-0 z-10">
            <tr className="bg-background-100/95 backdrop-blur-sm text-text-500 text-[11px] border-b border-background-300">
              <th className="px-4 py-2.5 text-left font-semibold whitespace-nowrap">期次</th>
              <th className="px-4 py-2.5 text-left font-semibold whitespace-nowrap">年月</th>
              <th className="px-4 py-2.5 text-right font-semibold whitespace-nowrap">月供</th>
              <th className="px-4 py-2.5 text-right font-semibold whitespace-nowrap">本金</th>
              <th className="px-4 py-2.5 text-right font-semibold whitespace-nowrap">利息</th>
              <th className="px-4 py-2.5 text-right font-semibold whitespace-nowrap">利率</th>
              <th className="px-4 py-2.5 text-right font-semibold whitespace-nowrap">提前还款</th>
              <th className="px-4 py-2.5 text-right font-semibold whitespace-nowrap">剩余本金</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => {
              const isHighlighted = highlightMonth === r.month;
              return (
                <tr
                  key={r.month}
                  ref={(el) => {
                    if (el) rowRefs.current.set(r.month, el);
                    else rowRefs.current.delete(r.month);
                  }}
                  className={`border-b border-background-200 transition-colors ${
                    isHighlighted
                      ? 'bg-[#FF9500]/10'
                      : r.isEarlyRepaymentMonth
                      ? 'bg-[#34C759]/5'
                      : r.isRateAdjustmentMonth
                      ? 'bg-brand-500/5'
                      : ''
                  }`}
                >
                  <td className="px-4 py-2 text-text-500 tabular-nums whitespace-nowrap font-mono text-[12px]">
                    {r.month}
                  </td>
                  <td className="px-4 py-2 text-text-700 tabular-nums whitespace-nowrap text-[12px] font-medium">
                    {monthToYearMonth(r.month, startDate)}
                    {r.isEarlyRepaymentMonth && (
                      <span className="ml-1.5 inline-block apple-tag apple-tag-success">
                        提前还款
                      </span>
                    )}
                    {r.isRateAdjustmentMonth && (
                      <span className="ml-1.5 inline-block apple-tag apple-tag-primary">
                        利率调整
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-right text-text-800 tabular-nums whitespace-nowrap font-mono text-[12px] font-medium">
                    {formatCurrency(r.scheduledPayment)}
                  </td>
                  <td className="px-4 py-2 text-right text-brand-500 tabular-nums whitespace-nowrap font-mono text-[12px] font-medium">
                    {formatCurrency(r.principal)}
                  </td>
                  <td className="px-4 py-2 text-right text-[#FF9500] tabular-nums whitespace-nowrap font-mono text-[12px] font-medium">
                    {formatCurrency(r.interest)}
                  </td>
                  <td className="px-4 py-2 text-right text-[#AF52DE] tabular-nums text-[12px] whitespace-nowrap font-mono font-medium">
                    {r.annualRate.toFixed(2)}%
                  </td>
                  <td className="px-4 py-2 text-right text-[#34C759] tabular-nums whitespace-nowrap font-mono text-[12px] font-medium">
                    {r.earlyRepayment ? formatCurrency(r.earlyRepayment) : '—'}
                  </td>
                  <td className="px-4 py-2 text-right text-text-800 tabular-nums font-semibold whitespace-nowrap font-mono text-[12px]">
                    {formatCurrency(r.remainingBalance)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      {highlightMonth && (
        <div className="px-5 py-2.5 border-t border-background-300 text-[12px] text-text-500 bg-background-100/50">
          已定位至第 {highlightMonth} 期（{monthToYearMonth(highlightMonth, startDate)}）
        </div>
      )}
    </div>
  );
}
