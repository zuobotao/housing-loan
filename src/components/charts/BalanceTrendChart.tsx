import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
} from 'recharts';
import type { PaymentRecord } from '../../types';
import { formatCurrency } from '../../lib/mortgage';
import { getChartColors, type Theme } from '../../lib/themeColors';

interface Props {
  records: PaymentRecord[];
  theme?: Theme;
}

export default function BalanceTrendChart({ records, theme = 'apple' }: Props) {
  const colors = getChartColors(theme);

  const data = records.map((r) => ({
    month: r.month,
    balance: Math.round(r.remainingBalance),
    isER: r.isEarlyRepaymentMonth,
  }));

  const erPoints = data.filter((d) => d.isER);

  return (
    <div className="apple-card p-5 animate-fade-in">
      <div className="mb-4">
        <h3 className="text-[15px] font-bold text-text-800">剩余本金趋势</h3>
        <p className="text-[12px] text-text-400 mt-0.5">贷款余额逐月递减</p>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colors.primary} stopOpacity={0.25} />
              <stop offset="100%" stopColor={colors.primary} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 10, fill: colors.text }}
            interval={Math.max(Math.floor(data.length / 12), 1)}
            axisLine={{ stroke: colors.grid }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: colors.text }}
            tickFormatter={(v) => `${(v / 10000).toFixed(0)}万`}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(value: number) => formatCurrency(value)}
            labelFormatter={(label) => `第 ${label} 期`}
          />
          <Area
            type="monotone"
            dataKey="balance"
            stroke={colors.primary}
            strokeWidth={2}
            fill="url(#balanceGradient)"
            dot={false}
          />
          {erPoints.map((p, i) => (
            <ReferenceDot
              key={i}
              x={p.month}
              y={p.balance}
              r={5}
              fill={colors.success}
              stroke="#ffffff"
              strokeWidth={2}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
