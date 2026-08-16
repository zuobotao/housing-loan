import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import type { PaymentRecord } from '../../types';
import { formatCurrency } from '../../lib/mortgage';

interface Props {
  records: PaymentRecord[];
}

export default function PaymentBreakdownChart({ records }: Props) {
  const data = records.map((r) => ({
    month: r.month,
    本金: Math.round(r.principal),
    利息: Math.round(r.interest),
    isER: r.isEarlyRepaymentMonth,
  }));

  const erMonths = data.filter((d) => d.isER).map((d) => d.month);

  return (
    <div className="apple-card p-5 animate-fade-in">
      <div className="mb-4">
        <h3 className="text-[15px] font-bold text-text-800">月供构成</h3>
        <p className="text-[12px] text-text-400 mt-0.5">本金与利息的逐月变化</p>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e5ea" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 10, fill: '#8e8e93' }}
            tickFormatter={(v) => `${v}`}
            interval={Math.max(Math.floor(data.length / 12), 1)}
            axisLine={{ stroke: '#e5e5ea' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: '#8e8e93' }}
            tickFormatter={(v) => `${(v / 10000).toFixed(0)}万`}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(value: number) => formatCurrency(value)}
            labelFormatter={(label) => `第 ${label} 期`}
          />
          <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
          <Bar dataKey="本金" stackId="a" fill="#007AFF" radius={[0, 0, 0, 0]} />
          <Bar dataKey="利息" stackId="a" fill="#FF9500" radius={[4, 4, 0, 0]} />
          {erMonths.map((m) => (
            <ReferenceLine
              key={m}
              x={m}
              stroke="#34C759"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              label={{ value: '提前还款', fontSize: 9, fill: '#34C759', position: 'top' }}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
