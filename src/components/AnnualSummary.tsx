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
  total: number;
  principal: number;
  interest: number;
  remaining: number;
}

export default function AnnualSummary({ records, startDate, theme = 'apple' }: Props) {
  const [view, setView] = useState<'year' | 'month'>('year');
  const colors = getChartColors(theme);
  const isWh = theme === 'warhammer';
  const isRm = theme === 'rickmorty';
  const isHp = theme === 'harrypotter';

  const t = {
    title: isWh ? '献祭总览' : isRm ? '实验全域观测' : isHp ? '誓约全域观测' : '汇总分析',
    subtitle: isWh ? '纪年 / 月度献祭卷宗' : isRm ? '星历/单次充能记录' : isHp ? '星运/单次咏供卷宗' : '年度/月度还款明细',
    yearTab: isWh ? '纪年卷宗' : isRm ? '星历总览' : isHp ? '星运总览' : '年度统计',
    monthTab: isWh ? '月度献祭录' : isRm ? '单次充能档案' : isHp ? '单次咏供典籍' : '月度明细',
    periodHeader: isWh ? '纪年' : isRm ? '星历' : isHp ? '星运' : '年度',
    monthHeader: '月份',
    totalCol: isWh ? '年度献祭总额' : isRm ? '单星历总供能' : isHp ? '单星运总咏供' : '还款总额',
    principalCol: isWh ? '誓约本源' : isRm ? '本源锚点负荷' : isHp ? '本源誓约枷锁' : '本金',
    interestCol: isWh ? '嗜血贡赋' : isRm ? '维度耗损能量' : isHp ? '逸散魔力' : '利息',
    remainingCol: isWh ? '岁末残存负重' : isRm ? '星历终末剩余锚点负荷' : isHp ? '星运终末残存枷锁负荷' : '年末剩余本金',
    remainingColMonth: isWh ? '月末残存负重' : isRm ? '月末剩余锚点负荷' : isHp ? '月末残存枷锁负荷' : '月末剩余本金',
    principalKey: isWh ? '誓约本源' : isRm ? '本源锚点负荷' : isHp ? '本源誓约枷锁' : '本金',
    interestKey: isWh ? '嗜血贡赋' : isRm ? '维度耗损能量' : isHp ? '逸散魔力' : '利息',
    yearLabel: (y: number) => isWh ? `第${y}纪年` : isRm ? `第${y}星历` : isHp ? `第${y}星运` : `第${y}年`,
    monthLabel: (m: number) => isWh ? `第${m}次献祭` : isRm ? `第${m}次充能` : isHp ? `第${m}次咏供` : `第${m}期`,
  };

  const annualMap = new Map<number, AnnualData>();

  for (const r of records) {
    const year = Math.ceil(r.month / 12);
    if (!annualMap.has(year)) {
      annualMap.set(year, { year, total: 0, principal: 0, interest: 0, remaining: 0 });
    }
    const data = annualMap.get(year)!;
    data.total += r.payment;
    data.principal += r.principal + (r.earlyRepayment || 0);
    data.interest += r.interest;
    data.remaining = r.remainingBalance;
  }

  const annualData = Array.from(annualMap.values()).map((d) => ({
    ...d,
    total: Math.round(d.total),
    principal: Math.round(d.principal),
    interest: Math.round(d.interest),
    remaining: Math.round(d.remaining),
  }));

  const monthlyData = records.map((r) => ({
    month: r.month,
    label: monthToYearMonth(r.month, startDate),
    total: Math.round(r.payment),
    principal: Math.round(r.principal + (r.earlyRepayment || 0)),
    interest: Math.round(r.interest),
    remaining: Math.round(r.remainingBalance),
  }));

  const chartData =
    view === 'year'
      ? annualData.map((d) => ({ label: t.yearLabel(d.year), [t.principalKey]: d.principal, [t.interestKey]: d.interest }))
      : monthlyData.map((d) => ({ label: d.label, [t.principalKey]: d.principal, [t.interestKey]: d.interest }));

  return (
    <div className="apple-card overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-background-300">
        <div>
          <h3 className="text-[15px] font-bold text-text-800">{t.title}</h3>
          <p className="text-[12px] text-text-400 mt-0.5">{t.subtitle}</p>
        </div>
        <div className="apple-segmented">
          <button
            onClick={() => setView('year')}
            className={view === 'year' ? 'active' : ''}
          >
            {t.yearTab}
          </button>
          <button
            onClick={() => setView('month')}
            className={view === 'month' ? 'active' : ''}
          >
            {t.monthTab}
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
            <Bar dataKey={t.principalKey} stackId="a" fill={colors.primary} radius={[0, 0, 0, 0]} />
            <Bar dataKey={t.interestKey} stackId="a" fill={colors.secondary} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border-t border-background-300 max-h-[380px] overflow-auto">
        <table className="w-full text-sm table-row-hover">
          <thead className="sticky top-0 z-10">
            <tr className="bg-background-100/95 backdrop-blur-sm text-text-500 text-[11px]">
              <th className="px-4 py-2.5 text-left font-semibold whitespace-nowrap">
                {view === 'year' ? t.periodHeader : t.monthHeader}
              </th>
              <th className="px-4 py-2.5 text-right font-semibold whitespace-nowrap">{t.totalCol}</th>
              <th className="px-4 py-2.5 text-right font-semibold whitespace-nowrap">{t.principalCol}</th>
              <th className="px-4 py-2.5 text-right font-semibold whitespace-nowrap">{t.interestCol}</th>
              <th className="px-4 py-2.5 text-right font-semibold whitespace-nowrap">
                {view === 'year' ? t.remainingCol : t.remainingColMonth}
              </th>
            </tr>
          </thead>
          <tbody>
            {view === 'year'
              ? annualData.map((d) => (
                  <tr key={d.year} className="border-b border-background-200 transition-colors">
                    <td className="px-4 py-2.5 text-text-700 whitespace-nowrap font-medium text-[13px]">
                      {t.yearLabel(d.year)}
                    </td>
                    <td className="px-4 py-2.5 text-right text-text-800 tabular-nums whitespace-nowrap font-mono text-[12px] font-medium">
                      {formatCurrency(d.total)}
                    </td>
                    <td className="px-4 py-2.5 text-right text-brand-500 tabular-nums whitespace-nowrap font-mono text-[12px] font-medium">
                      {formatCurrency(d.principal)}
                    </td>
                    <td className="px-4 py-2.5 text-right text-[#FF9500] tabular-nums whitespace-nowrap font-mono text-[12px] font-medium">
                      {formatCurrency(d.interest)}
                    </td>
                    <td className="px-4 py-2.5 text-right text-text-800 tabular-nums font-semibold whitespace-nowrap font-mono text-[12px]">
                      {formatCurrency(d.remaining)}
                    </td>
                  </tr>
                ))
              : monthlyData.map((d) => (
                  <tr key={d.month} className="border-b border-background-200 transition-colors">
                    <td className="px-4 py-2 text-text-700 whitespace-nowrap text-[12px] font-medium">
                      <span className="text-text-400 mr-2 font-mono">{t.monthLabel(d.month)}</span>
                      {d.label}
                    </td>
                    <td className="px-4 py-2 text-right text-text-800 tabular-nums whitespace-nowrap font-mono text-[12px]">
                      {formatCurrency(d.total)}
                    </td>
                    <td className="px-4 py-2 text-right text-brand-500 tabular-nums whitespace-nowrap font-mono text-[12px]">
                      {formatCurrency(d.principal)}
                    </td>
                    <td className="px-4 py-2 text-right text-[#FF9500] tabular-nums whitespace-nowrap font-mono text-[12px]">
                      {formatCurrency(d.interest)}
                    </td>
                    <td className="px-4 py-2 text-right text-text-800 tabular-nums font-semibold whitespace-nowrap font-mono text-[12px]">
                      {formatCurrency(d.remaining)}
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
