import { useState, useRef, useCallback } from 'react';
import {
  Search,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  Zap,
  Percent,
  Edit2,
  Check,
  X,
} from 'lucide-react';
import type { PaymentRecord, EarlyRepayment, RateAdjustment, EarlyRepaymentStrategy } from '../types';
import { formatCurrency, monthToYearMonth } from '../lib/mortgage';

interface Props {
  records: PaymentRecord[];
  startDate?: string;
  earlyRepayments: EarlyRepayment[];
  rateAdjustments: RateAdjustment[];
  onEarlyRepaymentsChange: (repayments: EarlyRepayment[]) => void;
  onRateAdjustmentsChange: (adjustments: RateAdjustment[]) => void;
}

export default function AmortizationTable({
  records,
  startDate,
  earlyRepayments,
  rateAdjustments,
  onEarlyRepaymentsChange,
  onRateAdjustmentsChange,
}: Props) {
  const [searchMonth, setSearchMonth] = useState('');
  const [highlightMonth, setHighlightMonth] = useState<number | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const rowRefs = useRef<Map<number, HTMLTableRowElement>>(new Map());
  const inputRef = useRef<HTMLInputElement>(null);

  // Inline edit states
  const [editingER, setEditingER] = useState<number | null>(null);
  const [editingERAmount, setEditingERAmount] = useState('');
  const [editingERStrategy, setEditingERStrategy] = useState<EarlyRepaymentStrategy>('reduce_payment');

  const [editingRA, setEditingRA] = useState<number | null>(null);
  const [editingRARate, setEditingRARate] = useState('');

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

  // Find existing ER/RA for a given month
  const getERForMonth = (month: number) =>
    earlyRepayments.find((er) => er.month === month);

  const getRAForMonth = (month: number) =>
    rateAdjustments.find((ra) => ra.month === month);

  // Early repayment CRUD
  const startAddER = (month: number) => {
    setEditingER(month);
    setEditingERAmount('100000');
    setEditingERStrategy('reduce_payment');
  };

  const startEditER = (month: number) => {
    const er = getERForMonth(month);
    if (er) {
      setEditingER(month);
      setEditingERAmount(String(er.amount));
      setEditingERStrategy(er.strategy);
    }
  };

  const saveER = (month: number) => {
    const amount = parseFloat(editingERAmount);
    if (!amount || amount <= 0) {
      setEditingER(null);
      return;
    }
    const existing = getERForMonth(month);
    if (existing) {
      onEarlyRepaymentsChange(
        earlyRepayments.map((er) =>
          er.month === month ? { ...er, amount, strategy: editingERStrategy } : er
        )
      );
    } else {
      onEarlyRepaymentsChange([
        ...earlyRepayments,
        { id: crypto.randomUUID(), month, amount, strategy: editingERStrategy },
      ]);
    }
    setEditingER(null);
  };

  const deleteER = (month: number) => {
    onEarlyRepaymentsChange(earlyRepayments.filter((er) => er.month !== month));
    setEditingER(null);
  };

  // Rate adjustment CRUD
  const startAddRA = (month: number, currentRate: number) => {
    setEditingRA(month);
    setEditingRARate(currentRate.toFixed(2));
  };

  const startEditRA = (month: number) => {
    const ra = getRAForMonth(month);
    if (ra) {
      setEditingRA(month);
      setEditingRARate(ra.annualRate.toFixed(2));
    }
  };

  const saveRA = (month: number) => {
    const rate = parseFloat(editingRARate);
    if (isNaN(rate) || rate < 0) {
      setEditingRA(null);
      return;
    }
    const existing = getRAForMonth(month);
    if (existing) {
      onRateAdjustmentsChange(
        rateAdjustments.map((ra) => (ra.month === month ? { ...ra, annualRate: rate } : ra))
      );
    } else {
      onRateAdjustmentsChange([
        ...rateAdjustments,
        { id: crypto.randomUUID(), month, annualRate: rate },
      ]);
    }
    setEditingRA(null);
  };

  const deleteRA = (month: number) => {
    onRateAdjustmentsChange(rateAdjustments.filter((ra) => ra.month !== month));
    setEditingRA(null);
  };

  return (
    <div className="apple-card overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-background-300 flex-wrap gap-3">
        <div>
          <h3 className="text-[15px] font-bold text-text-800">还款明细表</h3>
          <p className="text-[12px] text-text-400 mt-0.5">
            月粒度 · {records.length}期 · 可直接在表格中添加提前还款和利率调整
          </p>
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

      {/* Legend */}
      <div className="px-5 py-2.5 bg-background-100/50 border-b border-background-300 flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#34C759]" />
          <span className="text-[11px] text-text-500">提前还款</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-brand-500" />
          <span className="text-[11px] text-text-500">利率调整</span>
        </div>
        <span className="text-[11px] text-text-400">
          点击行尾 <Plus className="w-3 h-3 inline" /> 按钮可在对应月份添加操作
        </span>
      </div>

      {/* Table */}
      <div className={`overflow-auto ${collapsed ? 'max-h-72' : 'max-h-[520px]'}`}>
        <table className="w-full text-sm table-row-hover">
          <thead className="sticky top-0 z-10">
            <tr className="bg-background-100/95 backdrop-blur-sm text-text-500 text-[11px] border-b border-background-300">
              <th className="px-3 py-2.5 text-left font-semibold whitespace-nowrap">期次</th>
              <th className="px-3 py-2.5 text-left font-semibold whitespace-nowrap">年月</th>
              <th className="px-3 py-2.5 text-right font-semibold whitespace-nowrap">月供</th>
              <th className="px-3 py-2.5 text-right font-semibold whitespace-nowrap">本金</th>
              <th className="px-3 py-2.5 text-right font-semibold whitespace-nowrap">利息</th>
              <th className="px-3 py-2.5 text-right font-semibold whitespace-nowrap">利率</th>
              <th className="px-3 py-2.5 text-right font-semibold whitespace-nowrap">提前还款</th>
              <th className="px-3 py-2.5 text-right font-semibold whitespace-nowrap">剩余本金</th>
              <th className="px-3 py-2.5 text-center font-semibold whitespace-nowrap sticky right-0 bg-background-100/95 backdrop-blur-sm">
                操作
              </th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => {
              const isHighlighted = highlightMonth === r.month;
              const er = getERForMonth(r.month);
              const ra = getRAForMonth(r.month);
              const isEREditing = editingER === r.month;
              const isRAEditing = editingRA === r.month;

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
                      : er
                      ? 'bg-[#34C759]/5'
                      : ra
                      ? 'bg-brand-500/5'
                      : ''
                  }`}
                >
                  <td className="px-3 py-2 text-text-500 tabular-nums whitespace-nowrap font-mono text-[12px]">
                    {r.month}
                  </td>
                  <td className="px-3 py-2 text-text-700 tabular-nums whitespace-nowrap text-[12px] font-medium">
                    {monthToYearMonth(r.month, startDate)}
                  </td>
                  <td className="px-3 py-2 text-right text-text-800 tabular-nums whitespace-nowrap font-mono text-[12px] font-medium">
                    {formatCurrency(r.scheduledPayment)}
                  </td>
                  <td className="px-3 py-2 text-right text-brand-500 tabular-nums whitespace-nowrap font-mono text-[12px] font-medium">
                    {formatCurrency(r.principal)}
                  </td>
                  <td className="px-3 py-2 text-right text-[#FF9500] tabular-nums whitespace-nowrap font-mono text-[12px] font-medium">
                    {formatCurrency(r.interest)}
                  </td>
                  <td className="px-3 py-2 text-right whitespace-nowrap">
                    {isRAEditing ? (
                      <div className="flex items-center gap-1 justify-end">
                        <input
                          type="number"
                          value={editingRARate}
                          onChange={(e) => setEditingRARate(e.target.value)}
                          step="0.05"
                          className="w-16 px-1.5 py-1 text-[11px] font-mono font-semibold text-right rounded-md border border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none tabular-nums bg-white"
                          autoFocus
                        />
                        <span className="text-[11px] text-text-400">%</span>
                        <button
                          onClick={() => saveRA(r.month)}
                          className="p-1 text-[#34C759] hover:bg-[#34C759]/10 rounded"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setEditingRA(null)}
                          className="p-1 text-[#FF3B30] hover:bg-[#FF3B30]/10 rounded"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <span
                        className={`tabular-nums font-mono text-[12px] font-medium ${
                          ra ? 'text-brand-500' : 'text-[#AF52DE]'
                        }`}
                      >
                        {r.annualRate.toFixed(2)}%
                        {ra && (
                          <button
                            onClick={() => startEditRA(r.month)}
                            className="ml-1 p-0.5 text-brand-400 hover:text-brand-600 hover:bg-brand-500/10 rounded inline-block"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        )}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-right whitespace-nowrap">
                    {isEREditing ? (
                      <div className="flex items-center gap-1 justify-end">
                        <input
                          type="number"
                          value={editingERAmount}
                          onChange={(e) => setEditingERAmount(e.target.value)}
                          step="10000"
                          className="w-20 px-1.5 py-1 text-[11px] font-mono font-semibold text-right rounded-md border border-[#34C759] focus:ring-2 focus:ring-[#34C759]/20 outline-none tabular-nums bg-white"
                          autoFocus
                        />
                        <button
                          onClick={() => saveER(r.month)}
                          className="p-1 text-[#34C759] hover:bg-[#34C759]/10 rounded"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setEditingER(null)}
                          className="p-1 text-[#FF3B30] hover:bg-[#FF3B30]/10 rounded"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : er ? (
                      <span className="text-[#34C759] tabular-nums font-mono text-[12px] font-medium">
                        {formatCurrency(er.amount)}
                        <button
                          onClick={() => startEditER(r.month)}
                          className="ml-1 p-0.5 text-[#34C759]/70 hover:text-[#34C759] hover:bg-[#34C759]/10 rounded inline-block"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                      </span>
                    ) : (
                      <span className="text-text-300 text-[12px]">—</span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-right text-text-800 tabular-nums font-semibold whitespace-nowrap font-mono text-[12px]">
                    {formatCurrency(r.remainingBalance)}
                  </td>
                  <td className="px-3 py-2 text-center whitespace-nowrap sticky right-0 bg-inherit">
                    <div className="flex items-center justify-center gap-0.5">
                      <button
                        onClick={() => startAddER(r.month)}
                        title="添加提前还款"
                        className="p-1 rounded hover:bg-[#34C759]/10 text-text-300 hover:text-[#34C759] transition"
                      >
                        <Zap className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => startAddRA(r.month, r.annualRate)}
                        title="添加利率调整"
                        className="p-1 rounded hover:bg-brand-500/10 text-text-300 hover:text-brand-500 transition"
                      >
                        <Percent className="w-3.5 h-3.5" />
                      </button>
                      {(er || ra) && (
                        <div className="flex items-center gap-0.5 ml-0.5 pl-0.5 border-l border-background-300">
                          {er && (
                            <button
                              onClick={() => deleteER(r.month)}
                              title="删除提前还款"
                              className="p-1 rounded hover:bg-[#FF3B30]/10 text-text-300 hover:text-[#FF3B30] transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {ra && r.month > 1 && (
                            <button
                              onClick={() => deleteRA(r.month)}
                              title="删除利率调整"
                              className="p-1 rounded hover:bg-[#FF3B30]/10 text-text-300 hover:text-[#FF3B30] transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
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
