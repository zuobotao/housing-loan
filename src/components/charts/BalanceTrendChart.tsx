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
  const isWh = theme === 'warhammer';
  const isRm = theme === 'rickmorty';
  const isHp = theme === 'harrypotter';

  const data = records.map((r) => ({
    month: r.month,
    balance: Math.round(r.remainingBalance),
    isER: r.isEarlyRepaymentMonth,
  }));

  const erPoints = data.filter((d) => d.isER);

  const t = {
    title: isWh ? '残存誓约负重趋势' : isRm ? '剩余锚点负荷曲线' : isHp ? '残存誓约枷锁曲线' : '剩余本金趋势',
    sub: isWh ? '负重随献祭逐月消弭' : isRm ? '锚点负荷随能量供给逐步衰减' : isHp ? '枷锁负荷随魔力咏供逐步衰减' : '贷款余额逐月递减',
    tipLabel: isWh ? '残存负重' : isRm ? '剩余负荷' : isHp ? '残存枷锁负荷' : '余额',
    periodLabel: (m: number) => isWh ? `第 ${m} 次献祭` : isRm ? `第 ${m} 次能量充能` : isHp ? `第 ${m} 次魔力咏供` : `第 ${m} 期`,
  };

  return (
    <div className="apple-card p-5 animate-fade-in">
      <div className="mb-4">
        <h3 className="text-[15px] font-bold text-text-800">{t.title}</h3>
        <p className="text-[12px] text-text-400 mt-0.5">{t.sub}</p>
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
            formatter={(value: number) => [formatCurrency(value), t.tipLabel]}
            labelFormatter={(label) => t.periodLabel(label as number)}
          />
          <Area
            type="monotone"
            dataKey="balance"
            name={t.tipLabel}
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
