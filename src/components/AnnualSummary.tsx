import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { PaymentRecord } from '../types';
import { formatCurrency, monthToYearMonth } from '../lib/mortgage';
import { getChartColors, type Theme } from '../lib/themeColors';

interface Props {
  records: PaymentRecord[];
  startDate?: string;
  theme?: Theme;
}

interface AnnualData {
  year: number;
  还款总额: number;
  本金: number;
  利息: number;
  年末剩余本金: number;
}

export default function AnnualSummary({ records, startDate, theme = 'apple' }: Props) {
  const [view, setView] = useState<'year' | 'month'>('year');
  const colors = getChartColors(theme);

  const annualMap = new Map<number, AnnualData>();

  for (const r of records) {
    const year = Math.ceil(r.month / 12);
    if (!annualMap.has(year)) {
      annualMap.set(year, { year, 还款总额: 0, 本金: 0, 利息: 0, 年末剩余本金: 0 });
    }
    const data = annualMap.get(year)!;
    data.还款总额 += r.payment;
    data.本金 += r.principal + (r.earlyRepayment || 0);
    data.利息 += r.interest;
    data.年末剩余本金 = r.remainingBalance;
  }

  const annualData = Array.from(annualMap.values()).map((d) => ({
    ...d,
    还款总额: Math.round(d.还款总额),
    本金: Math.round(d.本金),
    利息: Math.round(d.利息),
    年末剩余本金: Math.round(d.年末剩余本金),
  }));

  const monthlyData = records.map((r) => ({
    month: r.month,
    label: monthToYearMonth(r.month, startDate),
    还款总额: Math.round(r.payment),
    本金: Math.round(r.principal + (r.earlyRepayment || 0)),
    利息: Math.round(r.interest),
    年末剩余本金: Math.round(r.remainingBalance),
  }));

  const chartData =
    view === 'year'
      ? annualData.map((d) => ({ label: `第${d.year}年`, 本金: d.本金, 利息: d.利息 }))
      : monthlyData.map((d) => ({ label: d.label, 本金: d.本金, 利息: d.利息 }));

  return (
    <div className="apple-card overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-background-300">
        <div>
          <h3 className="text-[15px] font-bold text-text-800">汇总分析</h3>
          <p className="text-[12px] text-text-400 mt-0.5">年度/月度还款明细</p>
        </div>
        <div className="apple-segmented">
          <button
            onClick={() => setView('year')}
            className={view === 'year' ? 'active' : ''}
          >
            年度统计
          </button>
          <button
            onClick={() => setView('month')}
            className={view === 'month' ? 'active' : ''}
          >
            月度明细
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="px-5 pt-5 pb-2">
        <ResponsiveContainer width="100%" height={view === 'year' ? 240 : 280}>
          <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: colors.text }}
              interval={view === 'month' ? Math.max(Math.floor(chartData.length / 12), 1) : 0}
              angle={view === 'month' ? -45 : 0}
              textAnchor={view === 'month' ? 'end' : 'middle'}
              height={view === 'month' ? 60 : 30}
              axisLine={{ stroke: colors.grid }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: colors.text }}
              tickFormatter={(v) => `${(v / 10000).toFixed(0)}万`}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Bar dataKey="本金" stackId="a" fill={colors.primary} radius={[0, 0, 0, 0]} />
            <Bar dataKey="利息" stackId="a" fill={colors.secondary} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border-t border-background-300 max-h-[380px] overflow-auto">
        <table className="w-full text-sm table-row-hover">
          <thead className="sticky top-0 z-10">
            <tr className="bg-background-100/95 backdrop-blur-sm text-text-500 text-[11px]">
              <th className="px-4 py-2.5 text-left font-semibold whitespace-nowrap">
                {view === 'year' ? '年度' : '月份'}
              </th>
              <th className="px-4 py-2.5 text-right font-semibold whitespace-nowrap">还款总额</th>
              <th className="px-4 py-2.5 text-right font-semibold whitespace-nowrap">本金</th>
              <th className="px-4 py-2.5 text-right font-semibold whitespace-nowrap">利息</th>
              <th className="px-4 py-2.5 text-right font-semibold whitespace-nowrap">
                {view === 'year' ? '年末剩余本金' : '月末剩余本金'}
              </th>
            </tr>
          </thead>
          <tbody>
            {view === 'year'
              ? annualData.map((d) => (
                  <tr key={d.year} className="border-b border-background-200 transition-colors">
                    <td className="px-4 py-2.5 text-text-700 whitespace-nowrap font-medium text-[13px]">
                      第 {d.year} 年
                    </td>
                    <td className="px-4 py-2.5 text-right text-text-800 tabular-nums whitespace-nowrap font-mono text-[12px] font-medium">
                      {formatCurrency(d.还款总额)}
                    </td>
                    <td className="px-4 py-2.5 text-right text-brand-500 tabular-nums whitespace-nowrap font-mono text-[12px] font-medium">
                      {formatCurrency(d.本金)}
                    </td>
                    <td className="px-4 py-2.5 text-right text-[#FF9500] tabular-nums whitespace-nowrap font-mono text-[12px] font-medium">
                      {formatCurrency(d.利息)}
                    </td>
                    <td className="px-4 py-2.5 text-right text-text-800 tabular-nums font-semibold whitespace-nowrap font-mono text-[12px]">
                      {formatCurrency(d.年末剩余本金)}
                    </td>
                  </tr>
                ))
              : monthlyData.map((d) => (
                  <tr key={d.month} className="border-b border-background-200 transition-colors">
                    <td className="px-4 py-2 text-text-700 whitespace-nowrap text-[12px] font-medium">
                      <span className="text-text-400 mr-2 font-mono">第{d.month}期</span>
                      {d.label}
                    </td>
                    <td className="px-4 py-2 text-right text-text-800 tabular-nums whitespace-nowrap font-mono text-[12px]">
                      {formatCurrency(d.还款总额)}
                    </td>
                    <td className="px-4 py-2 text-right text-brand-500 tabular-nums whitespace-nowrap font-mono text-[12px]">
                      {formatCurrency(d.本金)}
                    </td>
                    <td className="px-4 py-2 text-right text-[#FF9500] tabular-nums whitespace-nowrap font-mono text-[12px]">
                      {formatCurrency(d.利息)}
                    </td>
                    <td className="px-4 py-2 text-right text-text-800 tabular-nums font-semibold whitespace-nowrap font-mono text-[12px]">
                      {formatCurrency(d.年末剩余本金)}
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
