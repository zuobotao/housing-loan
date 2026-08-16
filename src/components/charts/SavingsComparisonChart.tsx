import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { CalcResult } from '../../types';
import { formatCurrency } from '../../lib/mortgage';

interface Props {
  result: CalcResult;
}

export default function SavingsComparisonChart({ result }: Props) {
  const data = [
    {
      name: '无提前还款',
      总利息: Math.round(result.baseline.totalInterest),
      总还款: Math.round(result.baseline.totalPayment),
    },
    {
      name: '有提前还款',
      总利息: Math.round(result.totalInterest),
      总还款: Math.round(result.totalPayment),
    },
  ];

  return (
    <div className="apple-card p-5 animate-fade-in">
      <div className="mb-4">
        <h3 className="text-[15px] font-bold text-text-800">提前还款效果对比</h3>
        <p className="text-[12px] text-text-400 mt-0.5">利息节省一目了然</p>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e5ea" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: '#6e6e73', fontWeight: 500 }}
            axisLine={{ stroke: '#e5e5ea' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: '#8e8e93' }}
            tickFormatter={(v) => `${(v / 10000).toFixed(0)}万`}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip formatter={(value: number) => formatCurrency(value)} />
          <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
          <Bar dataKey="总利息" radius={[6, 6, 0, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill="#FF9500" />
            ))}
          </Bar>
          <Bar dataKey="总还款" radius={[6, 6, 0, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={i === 0 ? '#c7c7cc' : '#34C759'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
