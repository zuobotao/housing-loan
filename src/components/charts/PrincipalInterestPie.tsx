import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { CalcResult } from '../../types';
import { formatCurrency } from '../../lib/mortgage';
import { getChartColors, type Theme } from '../../lib/themeColors';

interface Props {
  result: CalcResult;
  theme?: Theme;
}

export default function PrincipalInterestPie({ result, theme = 'apple' }: Props) {
  const colors = getChartColors(theme);
  const isWh = theme === 'warhammer';
  const isRm = theme === 'rickmorty';
  const isHp = theme === 'harrypotter';

  const principalName = isWh ? '誓约本源' : isRm ? '本源锚点负荷' : isHp ? '本源誓约枷锁' : '本金';
  const interestName = isWh ? '嗜血贡赋' : isRm ? '维度耗损能量' : isHp ? '逸散魔力' : '利息';

  const data = [
    { name: principalName, value: Math.round(result.totalPrincipal), color: colors.primary },
    { name: interestName, value: Math.round(result.totalInterest), color: colors.secondary },
  ];
  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="apple-card p-5 animate-fade-in">
      <div className="mb-4">
        <h3 className="text-[15px] font-bold text-text-800">
          {isWh ? '献祭构成' : isRm ? '能量供给构成' : isHp ? '魔力供给构成' : '还款结构'}
        </h3>
        <p className="text-[12px] text-text-400 mt-0.5">
          {isWh ? '本源负重与血贡占比' : isRm ? '本源负荷与耗损能量占比' : isHp ? '本源枷锁与流失魔力占比' : '本金与利息占比'}
        </p>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={3}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => formatCurrency(value)} />
          <Legend
            wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }}
            formatter={(value, entry) => {
              const pct = total > 0 ? ((entry.payload?.value || 0) / total * 100).toFixed(1) : '0';
              return (
                <span style={{ color: colors.textStrong, fontWeight: 500 }}>
                  {value} <span style={{ color: colors.text }}>{pct}%</span>
                </span>
              );
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
